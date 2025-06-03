import { tool } from 'ai';
import { z, ZodType } from 'zod';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const SaveBlogPostParameters = z.object({
  title: z.string().min(5).describe('The title of the blog post.'),
  content: z.string().min(100).describe('The main content of the blog post in Markdown format.'),
  author: z.string().default('O3 Assistant').describe('The author of the blog post.'),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).describe('A URL-friendly slug for the blog post (e.g., YYYY-MM-DD-my-awesome-post). It should include the date.'),
  imageUrl: z.string().url().describe('The URL of the generated or selected hero image for the blog post.'),
  imageAlt: z.string().min(5).describe('Descriptive alt text for the hero image.'),
  category: z.enum(['Educational AI', 'Medical AI', 'Financial AI', 'General AI', 'Other'])
    .describe('The primary category for the blog post.'),
  tags: z.array(z.string()).min(1).describe('An array of relevant tags for the blog post.'),
  summary: z.string().optional().describe('A short summary of the blog post (1-2 sentences). If not provided, one will be auto-generated from the content.'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('The publication date of the blog post in YYYY-MM-DD format.'),
});

async function saveBlogPostLogic(
  params: z.infer<typeof SaveBlogPostParameters>
): Promise<{ success: boolean; message: string; filePath?: string }> {
  // console.log(`Saving blog post with slug: ${params.slug}`);
  const postsDirectory = path.join(process.cwd(), 'app', 'blog', 'content');
  const filePath = path.join(postsDirectory, `${params.slug}.md`);

  try {
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true });
    }

    const frontmatter = {
      title: params.title,
      date: params.date, // Use the date provided by the assistant
      author: params.author,
      image: params.imageUrl,
      imageAlt: params.imageAlt,
      category: params.category,
      tags: params.tags,
      slug: params.slug,
      summary: params.summary || params.content.substring(0, 150) + "...",
      published: true,
    };

    const fileContent = matter.stringify(params.content, frontmatter);
    fs.writeFileSync(filePath, fileContent, 'utf8');

    return {
      success: true,
      message: `Blog post '${params.title}' saved successfully.`,
      filePath: filePath,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    // console.error(`Failed to save blog post ${params.slug}:`, message);
    return {
      success: false,
      message: `Failed to save blog post ${params.slug}: ${message}`,
    };
  }
}

export const saveBlogPostTool = tool({
  description: 'Saves a new blog post (title, content, author, image, category, tags, summary, date, slug) as a Markdown file in the app/blog/content/ directory. The slug must be unique and include the date, e.g., YYYY-MM-DD-title-of-post.',
  parameters: SaveBlogPostParameters as ZodType<z.infer<typeof SaveBlogPostParameters>>,
  execute: async (params: z.infer<typeof SaveBlogPostParameters>) => saveBlogPostLogic(params),
});
