import { NextResponse } from 'next/server';
import { blogPosts } from '@/app/blog/blog-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  
  if (!slug) {
    return NextResponse.json({ error: 'Slug parameter required' }, { status: 400 });
  }
  
  const post = blogPosts.find(p => p.slug === slug);
  
  if (!post) {
    return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
  }
  
  const socialMetadata = {
    title: post.title,
    description: post.excerpt,
    url: `https://fais.world/blog/${post.slug}`,
    image: post.coverImage,
    type: 'article',
    publishedTime: post.date,
    author: post.author || "Fantastic AI Studio",
    
    // Open Graph metadata
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `https://fais.world/blog/${post.slug}`,
      publishedTime: post.date,
      authors: [post.author || "Fantastic AI Studio"],
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ],
      siteName: "Fantastic AI Studio"
    },
    
    // Twitter metadata  
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      creator: "@FantasticAI",
      site: "@FantasticAI"
    },
    
    // LinkedIn metadata (uses Open Graph)
    linkedin: {
      title: post.title,
      description: post.excerpt,
      image: post.coverImage,
      url: `https://fais.world/blog/${post.slug}`
    },
    
    // Facebook metadata (uses Open Graph)
    facebook: {
      title: post.title,
      description: post.excerpt,
      image: post.coverImage,
      url: `https://fais.world/blog/${post.slug}`,
      type: "article"
    }
  };
  
  return NextResponse.json(socialMetadata, { 
    headers: {
      'Content-Type': 'application/json',
    }
  });
}
