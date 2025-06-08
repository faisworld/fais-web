import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

export interface MarkdownPost {
  title: string;
  date: string;
  author: string;
  category: string;
  excerpt: string;
  coverImage: string;
  keywords: string[];
  content: string;
  htmlContent: string;
}

export async function getMarkdownPost(slug: string): Promise<MarkdownPost | null> {
  try {
    const contentDir = path.join(process.cwd(), 'app', 'blog', 'content');
    const filePath = path.join(contentDir, `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // Convert markdown to HTML
    const processedContent = await remark()
      .use(remarkHtml, { sanitize: false })
      .process(content);
    const htmlContent = processedContent.toString();
      return {
      title: data.title || '',
      date: data.date || '',
      author: data.author || 'Fantastic AI',
      category: data.category || 'ai',
      excerpt: data.excerpt || '',
      coverImage: data.image || data.coverImage || '',
      keywords: data.keywords || [],
      content,
      htmlContent
    };
  } catch (error) {
    console.error('Error reading markdown file:', error);
    return null;
  }
}
