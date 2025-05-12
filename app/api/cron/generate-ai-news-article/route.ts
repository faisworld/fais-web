import {NextRequest, NextResponse} from 'next/server';
import { streamText, CoreMessage } from 'ai'; 
import { createOpenAI } from '@ai-sdk/openai'; // Corrected: Use createOpenAI to make a provider instance

import { crawlWebsiteTool } from '@/utils/o3-assistant-tools/crawlWebsiteTool'; 
import { generateArticleImageTool } from '@/utils/o3-assistant-tools/generateArticleImageTool'; 
import { saveBlogPostTool } from '@/utils/o3-assistant-tools/saveBlogPostTool'; 
import { format } from 'date-fns';

// 1. Create an OpenAI provider instance, configured with the API key
const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
    // Other global settings for this provider can be added here
    // e.g., organization: process.env.OPENAI_ORG_ID,
});

// 2. Use this provider instance to get a specific chat model
const openaiChatModel = openai.chat('gpt-4o-2024-05-13');

const systemMessage = 
    'You are an expert AI content creator specializing in AI news. Your task is to generate an engaging, informative, and well-structured blog post. ' +
    'You will be given a theme. You must search the web for the latest news and developments related to this theme using the crawlWebsite tool. ' +
    'Crawl 2-3 relevant articles to gather in-depth information. ' +
    'Synthesize this information to identify the most significant updates or trends. ' +
    'Then, write a blog post of approximately 500-700 words. ' +
    'The blog post should have a clear title, an introduction, several body paragraphs discussing the key findings, and a conclusion. ' +
    'It should be written in an accessible yet professional tone. ' +
    'After writing the content, you must generate a relevant image for the article using the generateArticleImage tool. ' +
    'Finally, you must save the blog post using the saveBlogPost tool. ' +
    'The saveBlogPost tool requires you to provide: title, content (Markdown), author (use "O3 AI Assistant"), slug (e.g., YYYY-MM-DD-a-very-interesting-ai-topic), imageUrl, imageAlt, category, tags, summary, and date (YYYY-MM-DD). ' +
    'The filename will be automatically handled by the tool based on the slug. ' +
    'Ensure the slug you generate for the saveBlogPost tool starts with the date in YYYY-MM-DD format. ' +
    'The frontmatter for the blog post (handled by the saveBlogPost tool) must include title, date (YYYY-MM-DD), description/summary (1-2 sentences), and image (the URL from generateArticleImage).';

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get('authorization');
  const urlSecret = req.nextUrl.searchParams.get('cron_secret');

  if (cronSecret) {
    if (!((authHeader && authHeader === `Bearer ${cronSecret}`) || (urlSecret && urlSecret === cronSecret))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const themes = [
      'AI in Education: Latest Innovations and Impact',
      'AI in Healthcare: Breakthroughs and Challenges',
      'AI in Finance: Transforming Services and Operations',
    ];
    const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
    const currentDate = format(new Date(), 'yyyy-MM-dd');

    const messages: CoreMessage[] = [
        {
          role: 'system',
          content: systemMessage,
        },
        {
          role: 'user',
          content: `Please generate a new blog post about the theme: "${selectedTheme}". Today's date is ${currentDate}. Remember to perform all steps: web search (crawlWebsite), crawl relevant articles, synthesize information, write the post, generate an image (generateArticleImage), and then save the complete blog post (saveBlogPost) with all necessary parameters including a date-prefixed slug and the current date for the 'date' field.`,
        },
      ];

    const result = await streamText({
      model: openaiChatModel, // Use the chat model obtained from the configured provider
      messages: messages,
      tools: {
        crawlWebsite: crawlWebsiteTool,
        generateArticleImage: generateArticleImageTool,
        saveBlogPost: saveBlogPostTool,
      }
    });

    let fullResponse = '';
    for await (const textPart of result.textStream) {
      fullResponse += textPart;
    }
    
    // Optional: To observe tool calls and results if needed:
    // const { toolCalls, toolResults } = await result.experimental_streamTools();
    // if (toolCalls && toolResults) { // Check if the properties exist
    //   for await (const toolCall of toolCalls) { console.log('Tool call:', toolCall); }
    //   for await (const toolResult of toolResults) { console.log('Tool result:', toolResult); }
    // }

    console.log('O3 Assistant Cron Job completed. Assistant task for theme [' + selectedTheme + '] finished. Final text output:', fullResponse);

    return NextResponse.json({
      message: 'AI news article generation process initiated successfully.',
      theme: selectedTheme,
    });

  } catch (error) {
    console.error('Error in AI news article generation cron job:', error);
    return NextResponse.json(
      {error: 'Failed to generate AI news article.', details: error instanceof Error ? error.message : String(error)},
      {status: 500}
    );
  }
}

export const config = {
  runtime: 'edge',
};
