import { tool } from 'ai';
import { z, ZodType } from 'zod';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface BlogPost {
  title: string;
  date: string;
  author: string;
  content: string;
  slug: string;
  source: 'internal_blog' | 'internal_blog_raw_content';
  error?: string;
}

export const ReadInternalBlogPostParameters = z.object({
  slug: z.string().describe('The slug (filename without extension) of the blog post to read from app/blog/content/.'),
});

async function readInternalBlogPostLogic(slug: string): Promise<BlogPost> {
  // console.log(`Reading internal blog post with slug: ${slug}`);
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
    const { data, content } = matter(fileContent);
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
      content: fileContent,
      slug: slug,
      source: 'internal_blog_raw_content',
      error: `Error parsing frontmatter for ${slug}: ${message}`
    };
  }
}

export const readInternalBlogPostTool = tool({
  description: 'Reads a specific blog post from the local project (app/blog/content/) by its slug. Parses frontmatter for title, date, and author.',
  parameters: ReadInternalBlogPostParameters as ZodType<z.infer<typeof ReadInternalBlogPostParameters>>,
  execute: async ({ slug }: z.infer<typeof ReadInternalBlogPostParameters>) => readInternalBlogPostLogic(slug),
});
