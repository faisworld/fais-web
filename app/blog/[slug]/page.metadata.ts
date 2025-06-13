import { Metadata } from 'next';
import { BlogPost } from '../blog-data';

// This is a dynamic metadata generation function for individual blog posts
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  // In a real implementation, you would fetch the post data based on the slug
  // For demonstration, we're showing the structure
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | Fantastic AI Studio Blog',
      description: 'The requested blog post could not be found.',
    };
  }
  
  return {
    title: `${post.title} | Fantastic AI Studio Blog`,
    description: post.excerpt,
    keywords: post.category === 'ai' 
      ? ['artificial intelligence', 'AI', 'machine learning', post.title.toLowerCase()] 
      : ['blockchain', 'web3', 'cryptocurrency', post.title.toLowerCase()],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `https://fais.world/blog/${post.slug}`,
      images: [
        {
          url: post.coverImage 
            ? `https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/${post.coverImage}.png`
            : 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/blog-og-image-fais-1200x630.png',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],      publishedTime: post.date,
      authors: [post.author || 'Fantastic AI'],
      section: post.category === 'ai' ? 'Artificial Intelligence' : 'Blockchain',
      tags: [post.category, 'technology', 'innovation'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [
        post.coverImage 
          ? `https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/${post.coverImage}.png`
          : 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/blog-twitter-card-fais.png'
      ],
    },
    alternates: {
      canonical: `https://fais.world/blog/${post.slug}`,
    },
  };
}

// Placeholder function to fetch post data by slug
// In a real implementation, this would fetch from a database or API
async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  // This would be replaced with actual data fetching logic
  // For now, return a dummy post
  return {
    id: "1",
    slug,
    title: "Example Blog Post",
    excerpt: "This is an example blog post description.",
    date: "May 8, 2025",
    readTime: "8 min read",    category: "ai",
    coverImage: "blog-ai-llm",
    author: "Fantastic AI",
    authorImage: "author-fantastic"
  };
}
