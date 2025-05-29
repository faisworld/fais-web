export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: "ai" | "blockchain" | "technology" | "business"
  coverImage: string
  featured?: boolean
  author?: string
  authorImage?: string
}

/**
 * Blog posts array - currently empty
 * To generate new articles, use the admin article generation tool at:
 * /admin/ai-tools/article-generation
 * 
 * This will create articles with proper AI-generated images that are relevant
 * to the content and automatically upload them to the blob storage.
 */
export const blogPosts: BlogPost[] = [];