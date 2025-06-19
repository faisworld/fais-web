import { NextResponse } from 'next/server';
import { checkAdminAuth } from "@/utils/auth-compat";
import { streamText, CoreMessage } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { generateArticleImageTool } from '@/utils/o3-assistant-tools/generateArticleImageTool';
import slugify from 'slugify';
import { getArticleGenerationConfig, getProviderOptions } from '@/lib/ai-config';
import pg from 'pg';

const { Client } = pg;

// Create OpenAI provider instance
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  // Check admin authentication
  const authResult = await checkAdminAuth(request);
  if (!authResult.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { topic, keywords = [], tone = 'informative', wordCount = 800, includeImage = true } = body;

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // Generate article with GPT-4o
    const keywordsText = keywords.length > 0 ? `including these keywords: ${keywords.join(', ')}` : '';
    const lengthText = `approximately ${wordCount} words`;

    const systemMessage = `You are an expert content writer specializing in creating high-quality, engaging articles. 
    Write in a ${tone} tone and style. Include a compelling title, introduction, well-structured body with headers, 
    and a conclusion. The content should be original, informative, and valuable to readers.`;

    const messages: CoreMessage[] = [
      {
        role: 'system',
        content: systemMessage,
      },
      {
        role: 'user',
        content: `Write a comprehensive article about "${topic}" ${keywordsText}. 
        The article should be ${lengthText} long. Use markdown formatting for headers and structure.
        Do NOT include a title at the beginning - start directly with the introduction. 
        Use ## for main sections and ### for subsections. Focus on creating engaging, well-structured content.`
      }
    ];

    console.log("Admin: Generating article about:", topic);
    
    // Get AI model configuration for article generation
    const aiConfig = getArticleGenerationConfig();
    const providerOptions = getProviderOptions(aiConfig);
    
    const result = await streamText({
      model: openai(aiConfig.model),
      messages,
      // Use high reasoning effort for better article quality
      ...(providerOptions && { providerOptions })
    });

    let articleContent = '';
    for await (const chunk of result.textStream) {
      articleContent += chunk;
    }

    const titleMatch = articleContent.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : topic;
    
    // Create a slug from the title
    const slug = slugify(title, { lower: true, strict: true });

    // If requested, generate an image for the article
    let imageUrl = undefined;
    if (includeImage) {
      try {
        // Create a detailed, professional prompt for better image quality
        const enhancedPrompt = `Professional, high-quality blog featured image about ${topic}. Modern, clean, visually appealing design. Corporate style, professional photography aesthetic. Relevant icons, graphics, or abstract representation. Bright, vibrant colors. No text overlays. Suitable for a technology blog header.`;
        
        const imageResult = await generateArticleImageTool.execute({
          prompt: enhancedPrompt,
          aspectRatio: '16:9',
          modelIdentifier: "google/imagen-4" // Use Google Imagen 4 for best quality
        }, {
          toolCallId: "admin-article-image-" + Date.now(),
          messages: []
        });
        
        imageUrl = imageResult.imageUrl;
      } catch (imageError) {
        console.error("Error generating article image:", imageError);
        // Continue without an image if generation fails
      }
    }

    // Save to database
    try {
      const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });
      
      await client.connect();
      
      const articleId = Date.now().toString();
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Insert article into database
      await client.query(`
        INSERT INTO blog_articles (
          id, slug, title, content, date, read_time, category, 
          cover_image_url, featured, author, author_image,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      `, [
        articleId,
        slug,
        title,
        articleContent,
        currentDate,
        `${Math.ceil(articleContent.split(' ').length / 200)} min read`,
        'ai', // default category
        imageUrl || null,
        false,
        'AI Assistant',
        'author-ai'
      ]);
      
      // Log image generation if successful
      if (imageUrl) {
        await client.query(`
          INSERT INTO image_generation_log (
            article_id, model_used, prompt, image_url, success, created_at
          ) VALUES ($1, $2, $3, $4, $5, NOW())
        `, [
          articleId,
          'google/imagen-4',
          `Professional article image for: ${title}`,
          imageUrl,
          true
        ]);
      }
      
      await client.end();
      console.log('✅ Article saved to database');
      
    } catch (dbError) {
      console.error('❌ Database save error:', dbError);
      // Continue without failing the entire request
    }

    return NextResponse.json({
      title,
      content: articleContent,
      imageUrl,
      slug
    });

  } catch (error: unknown) {
    console.error('Error in /api/admin/ai-tools/generate-article:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: 'Internal Server Error', message: errorMessage }, { status: 500 });
  }
}
