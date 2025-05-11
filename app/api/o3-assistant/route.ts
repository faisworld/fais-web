import { O3Model, streamText, tool } from 'ai/o3';
import { OpenAI } from 'openai';
import { z, ZodType } from 'zod'; // For schema validation
import * as cheerio from 'cheerio'; // Import cheerio
import fs from 'fs'; // Import fs for file system operations
import path from 'path'; // Import path for path manipulation
import matter from 'gray-matter'; // Import gray-matter for frontmatter parsing

const openai = new OpenAI(); // Uses OPENAI_API_KEY from environment variables

export const dynamic = 'force-dynamic'; // Ensure the route is always dynamic

interface BlogPost {
  title: string;
  date: string; // Or Date object, be consistent
  author: string;
  content: string;
  slug: string;
  source: 'internal_blog' | 'internal_blog_raw_content';
  error?: string; // Optional error message
}

async function crawlWebsite(url: string, query?: string): Promise<string> {
  console.log(`Crawling ${url} for query: "${query || 'general content'}"`);
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'O3AssistantCrawler/1.0' } });
    if (!response.ok) {
      return `Error fetching ${url}: ${response.status} ${response.statusText}`;
    }
    const htmlContent = await response.text();
    const $ = cheerio.load(htmlContent);

    // Remove script and style tags to clean up content
    $('script, style, nav, footer, aside, form').remove();

    // Extract text from common content-holding elements
    let extractedText = $('article, main, body').text(); // Start with broader containers if they exist

    if (!extractedText.trim()) { // If article/main/body is empty or not useful, try specific tags
        $('p, h1, h2, h3, h4, h5, h6, li, a, span, div').each((i, elem) => {
            // Heuristic: try to get text from elements that are likely to contain content
            // Avoid overly nested or very short texts if possible, or elements with too many children (like a complex div)
            const elementText = $(elem).text().trim();
            if (elementText.length > 20) { // Arbitrary length to prefer more substantial text blocks
                 extractedText += elementText + '\n';
            }
        });
    }
    
    // Normalize whitespace (replace multiple spaces/newlines with a single space/newline)
    extractedText = extractedText.replace(/\s\s+/g, ' ').trim();
    extractedText = extractedText.replace(/\n\s*\n/g, '\n').trim();

    if (query) {
      const queryLower = query.toLowerCase();
      const sentences = extractedText.split(/[.\n]/); // Split by sentences or newlines
      let relevantText = sentences.filter(sentence => sentence.toLowerCase().includes(queryLower)).join('. ');
      if (!relevantText) {
        relevantText = "Query not found in the main content. ";
      }
      // Return a snippet of relevant text or the beginning if query not found
      return `Content from ${url} (related to "${query}"): ${relevantText.substring(0, 2000)}...`;
    }

    return `Content from ${url}: ${extractedText.substring(0, 4000)}...`; // Increased snippet length
  } catch (error: unknown) {
    if (error instanceof Error) {
      return `Failed to crawl ${url}: ${error.message}`;
    }
    return `Failed to crawl ${url}: An unknown error occurred`;
  }
}

async function readInternalBlogPost(slug: string): Promise<BlogPost> {
  console.log(`Reading internal blog post with slug: ${slug}`);
  const postsDirectory = path.join(process.cwd(), 'app', 'blog', 'content');
  const potentialFilePaths = [
    path.join(postsDirectory, `${slug}.md`),
    path.join(postsDirectory, `${slug}.mdx`)
  ];

  let filePath: string | undefined;
  let fileContent: string | undefined;

  for (const pPath of potentialFilePaths) {
    if (fs.existsSync(pPath)) {
      filePath = pPath;
      try {
        fileContent = fs.readFileSync(filePath, 'utf8');
        break;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        return {
            title: slug,
            date: '',
            author: '',
            content: '',
            slug: slug,
            source: 'internal_blog',
            error: `Failed to read blog post ${slug}: ${message}`
        };
      }
    }
  }

  if (!fileContent || !filePath) {
    return {
        title: slug,
        date: '',
        author: '',
        content: '',
        slug: slug,
        source: 'internal_blog',
        error: `Blog post with slug '${slug}' not found. Looked for .md and .mdx in app/blog/content/`
    };
  }

  try {
    const { data, content } = matter(fileContent); // Use gray-matter to parse frontmatter
    return {
      title: data.title || slug,
      date: data.date ? (data.date instanceof Date ? data.date.toISOString() : String(data.date)) : 'Date not specified',
      author: data.author || 'Author not specified',
      content: content,
      slug: slug,
      source: 'internal_blog'
    };
  } catch (error: unknown) {
    console.error(`Error parsing frontmatter for ${slug}:`, error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred during parsing';
    return {
      title: slug,
      date: 'Could not parse date',
      author: 'Could not parse author',
      content: fileContent, // Return raw content if parsing fails
      slug: slug,
      source: 'internal_blog_raw_content',
      error: `Error parsing frontmatter for ${slug}: ${message}`
    };
  }
}

async function generateArticleImage(prompt: string, aspectRatio: string = '16:9'): Promise<{ imageUrl: string; imageAlt: string }> {
  console.log(`Generating image with prompt: \"${prompt}\", Aspect Ratio: ${aspectRatio}`);
  const mockImageUrl = "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/blog-placeholder-ai-generated-LSpH7hJk2vXbDcYqRzWnPfG3tS8aFm.png";
  return {
    imageUrl: mockImageUrl,
    imageAlt: `AI-generated image for: ${prompt.substring(0, 100)}`,
  };
}

async function saveBlogPost(
  title: string,
  content: string,
  author: string,
  slug: string,
  imageUrl: string,
  imageAlt: string,
  category: 'Educational AI' | 'Medical AI' | 'Financial AI' | 'General AI' | 'Other',
  tags: string[],
  summary?: string
): Promise<{ success: boolean; message: string; filePath?: string }> {
  console.log(`Saving blog post with slug: ${slug}`);
  const postsDirectory = path.join(process.cwd(), 'app', 'blog', 'content');
  const filePath = path.join(postsDirectory, `${slug}.md`);

  try {
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true });
    }

    const today = new Date();
    const frontmatter = {
      title,
      date: today.toISOString(),
      author,
      image: imageUrl,
      imageAlt,
      category,
      tags,
      slug,
      summary: summary || content.substring(0, 150) + "...",
      published: true,
    };

    const fileContent = matter.stringify(content, frontmatter);
    fs.writeFileSync(filePath, fileContent, 'utf8');

    return {
      success: true,
      message: `Blog post '${title}' saved successfully.`,
      filePath: filePath,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`Failed to save blog post ${slug}:`, message);
    return {
      success: false,
      message: `Failed to save blog post ${slug}: ${message}`,
    };
  }
}

async function postToLinkedIn(content: string): Promise<string> {
  console.log("Posting to LinkedIn:", content);
  return "Successfully posted to LinkedIn (simulated). LinkedIn API integration needed.";
}

async function commentOnLinkedIn(postId: string, comment: string): Promise<string> {
  console.log(`Commenting on LinkedIn post ${postId}:`, comment);
  return `Successfully commented on LinkedIn post ${postId} (simulated). LinkedIn API integration needed.`;
}

async function createLinkedInArticle(title: string, articleContent: string, visibility: 'connections' | 'public' = 'public'): Promise<string> {
  console.log(`Creating LinkedIn article: "${title}" with visibility: ${visibility}`);
  return `Successfully created LinkedIn article "${title}" (simulated). LinkedIn API integration needed.`;
}

const CrawlWebsiteParameters = z.object({
  url: z.string().url().describe('The URL of the website page to crawl.'),
  query: z.string().optional().describe('Optional query to search for specific information on the page.'),
});

const ReadInternalBlogPostParameters = z.object({
  slug: z.string().describe('The slug (filename without extension) of the blog post to read from app/blog/content/.'),
});

const GenerateArticleImageParameters = z.object({
  prompt: z.string().min(5).describe('A detailed prompt for the image generation model.'),
  aspectRatio: z.enum(['1:1', '16:9', '4:3', '3:2', '9:16']).default('16:9').optional()
    .describe('Desired aspect ratio for the generated image.'),
});

const SaveBlogPostParameters = z.object({
  title: z.string().min(5).describe('The title of the blog post.'),
  content: z.string().min(100).describe('The main content of the blog post in Markdown format.'),
  author: z.string().default('O3 Assistant').describe('The author of the blog post.'),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).describe('A URL-friendly slug for the blog post (e.g., my-awesome-post).'),
  imageUrl: z.string().url().describe('The URL of the generated or selected hero image for the blog post.'),
  imageAlt: z.string().min(5).describe('Descriptive alt text for the hero image.'),
  category: z.enum(['Educational AI', 'Medical AI', 'Financial AI', 'General AI', 'Other'])
    .describe('The primary category for the blog post.'),
  tags: z.array(z.string()).min(1).describe('An array of relevant tags for the blog post.'),
  summary: z.string().optional().describe('A short summary of the blog post (1-2 sentences). If not provided, one will be auto-generated from the content.'),
});

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

export async function POST(req: Request) {
  try {
    const { messages, tool_choice } = await req.json();

    const result = await streamText({
      model: new O3Model({ openai }),
      messages,
      tool_choice,
      tools: {
        crawlWebsite: tool({
          description: 'Crawls a specific URL of the website to get information. Can optionally take a query to search for specific content within that page.',
          parameters: CrawlWebsiteParameters as ZodType<z.infer<typeof CrawlWebsiteParameters>>,
          execute: async ({ url, query }: z.infer<typeof CrawlWebsiteParameters>) => crawlWebsite(url, query),
        }),
        readInternalBlogPost: tool({
          description: 'Reads a specific blog post from the local project (app/blog/content/) by its slug. Parses frontmatter for title, date, and author.',
          parameters: ReadInternalBlogPostParameters as ZodType<z.infer<typeof ReadInternalBlogPostParameters>>,
          execute: async ({ slug }: z.infer<typeof ReadInternalBlogPostParameters>) => readInternalBlogPost(slug),
        }),
        generateArticleImage: tool({
          description: 'Generates an image based on a prompt, suitable for a blog post hero image. Returns the image URL and alt text.',
          parameters: GenerateArticleImageParameters as ZodType<z.infer<typeof GenerateArticleImageParameters>>,
          execute: async ({ prompt, aspectRatio }: z.infer<typeof GenerateArticleImageParameters>) => generateArticleImage(prompt, aspectRatio),
        }),
        saveBlogPost: tool({
          description: 'Saves a new blog post (title, content, author, image, category, tags, summary) as a Markdown file in the app/blog/content/ directory.',
          parameters: SaveBlogPostParameters as ZodType<z.infer<typeof SaveBlogPostParameters>>,
          execute: async (params: z.infer<typeof SaveBlogPostParameters>) => saveBlogPost(
            params.title,
            params.content,
            params.author,
            params.slug,
            params.imageUrl,
            params.imageAlt,
            params.category,
            params.tags,
            params.summary
          ),
        }),
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
