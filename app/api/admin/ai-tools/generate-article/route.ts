import { NextResponse } from 'next/server';
import { checkAdminAuth } from "@/utils/auth-compat";
import { streamText, CoreMessage } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { generateArticleImageTool } from '@/utils/o3-assistant-tools/generateArticleImageTool';
import slugify from 'slugify';

// Create OpenAI provider instance
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Use GPT-4o for article generation
const openaiChatModel = openai.chat('gpt-4o');

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
        Start with a title in # format, followed by well-structured content with appropriate subheadings.`
      }
    ];

    console.log("Admin: Generating article about:", topic);
    
    const result = await streamText({
      model: openaiChatModel,
      messages,
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
        const imageResult = await generateArticleImageTool.execute({
          prompt: `High quality featured image for article about: ${topic}`,
          aspectRatio: '16:9',
          modelIdentifier: "minimax/image-01:w4agaakfhnrme0cnbhgtyfmstc"
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
