import { O3Model, streamText, tool } from 'ai';
import { OpenAI } from 'openai';
import { z, ZodType } from 'zod'; // For schema validation

// Import refactored tools
import { crawlWebsiteTool } from '../../../utils/o3-assistant-tools/crawlWebsiteTool';
import { readInternalBlogPostTool } from '../../../utils/o3-assistant-tools/readInternalBlogPostTool';
import { generateArticleImageTool } from '../../../utils/o3-assistant-tools/generateArticleImageTool';
import { saveBlogPostTool } from '../../../utils/o3-assistant-tools/saveBlogPostTool';

const openai = new OpenAI(); // Uses OPENAI_API_KEY from environment variables

export const dynamic = 'force-dynamic'; // Ensure the route is always dynamic

// Placeholder Zod schemas for LinkedIn tools (implement actual logic later)
const PostToLinkedInParameters = z.object({
  content: z.string().min(1).max(1300).describe('The content to post on LinkedIn.'),
});

const CommentOnLinkedInParameters = z.object({
  postId: z.string().describe('The ID of the LinkedIn post to comment on.'),
  comment: z.string().min(1).describe('The comment text.'),
});

const CreateLinkedInArticleParameters = z.object({
  title: z.string().min(1).describe('The title of the article.'),
  articleContent: z.string().min(1).describe('The main content of the article (can be HTML or Markdown, depending on LinkedIn API specifics).'),
  visibility: z.enum(['connections', 'public']).default('public').optional().describe('Visibility of the article on LinkedIn.'),
});

// Placeholder functions for LinkedIn tools
async function postToLinkedIn(content: string): Promise<string> {
  console.log("Posting to LinkedIn:", content);
  return "Successfully posted to LinkedIn (simulated). LinkedIn API integration needed.";
}

async function commentOnLinkedIn(postId: string, comment: string): Promise<string> {
  console.log(`Commenting on LinkedIn post ${postId}:`, comment);
  return `Successfully commented on LinkedIn post ${postId} (simulated). LinkedIn API integration needed.`;
}

async function createLinkedInArticle(title: string, articleContent: string, visibility: 'connections' | 'public' = 'public'): Promise<string> {
  console.log(`Creating LinkedIn article: \"${title}\" with visibility: ${visibility}`);
  return `Successfully created LinkedIn article \"${title}\" (simulated). LinkedIn API integration needed.`;
}

export async function POST(req: Request) {
  try {
    const { messages, tool_choice } = await req.json();

    const result = await streamText({
      model: new O3Model({ openai }), 
      messages,
      tool_choice, 
      tools: {
        crawlWebsite: crawlWebsiteTool,
        readInternalBlogPost: readInternalBlogPostTool,
        generateArticleImage: generateArticleImageTool,
        saveBlogPost: saveBlogPostTool,
        postToLinkedIn: tool({
          description: 'Posts a message to LinkedIn.',
          parameters: PostToLinkedInParameters as ZodType<z.infer<typeof PostToLinkedInParameters>>,
          execute: async ({ content }: z.infer<typeof PostToLinkedInParameters>) => postToLinkedIn(content),
        }),
        commentOnLinkedIn: tool({
          description: 'Comments on a specific LinkedIn post.',
          parameters: CommentOnLinkedInParameters as ZodType<z.infer<typeof CommentOnLinkedInParameters>>,
          execute: async ({ postId, comment }: z.infer<typeof CommentOnLinkedInParameters>) => commentOnLinkedIn(postId, comment),
        }),
        createLinkedInArticle: tool({
          description: 'Creates and publishes a new article on LinkedIn.',
          parameters: CreateLinkedInArticleParameters as ZodType<z.infer<typeof CreateLinkedInArticleParameters>>,
          execute: async ({ title, articleContent, visibility }: z.infer<typeof CreateLinkedInArticleParameters>) => 
            createLinkedInArticle(title, articleContent, visibility),
        }),
      },
    });
    return result.toAIStreamResponse();
  } catch (error: unknown) {
    console.error("[O3 Assistant API Error]", error);
    let errorMessage = "An unexpected error occurred.";
    let errorStack = undefined;
    if (error instanceof Error) {
      errorMessage = error.message;
      errorStack = error.stack;
    }
    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: errorStack,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
