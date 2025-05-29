import { NextResponse } from 'next/server';
import { checkAdminAuth } from "@/utils/auth-compat";
import fs from 'fs';
import path from 'path';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: "ai" | "blockchain" | "technology" | "business";
  coverImage: string;
  featured?: boolean;
  author?: string;
  authorImage?: string;
}

export async function POST(request: Request) {
  // Check admin authentication
  const authResult = await checkAdminAuth();
  if (!authResult.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, content, imageUrl, slug, category = 'ai', keywords } = body;

    if (!title || !content || !slug) {
      return NextResponse.json({ 
        error: "Missing required fields: title, content, and slug are required" 
      }, { status: 400 });
    }

    // Generate a unique ID for the blog post
    const uniqueId = Math.random().toString(36).substr(2, 8);
    
    // Calculate read time (approximate 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readTimeMinutes = Math.ceil(wordCount / 200);
    const readTime = `${readTimeMinutes} min read`;

    // Create excerpt from content (first 150 characters)
    const excerpt = content.replace(/\n/g, ' ').substring(0, 150) + "...";

    // Create blog post object
    const blogPost: BlogPost = {
      id: uniqueId,
      slug: slug,
      title: title,
      excerpt: excerpt,
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      readTime: readTime,
      category: category as "ai" | "blockchain" | "technology" | "business",
      coverImage: imageUrl || "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/blog-placeholder-ai-generated-LSpH7hJk2vXbDcYqRzWnPfG3tS8aFm.png",
      featured: false,
      author: "Fantastic AI",
      authorImage: "author-fantastic"
    };

    // Read the current blog-data.ts file
    const blogDataPath = path.join(process.cwd(), 'app', 'blog', 'blog-data.ts');
    const blogDataContent = fs.readFileSync(blogDataPath, 'utf8');

    // Find the blogPosts array
    const blogPostsArrayMatch = blogDataContent.match(/export const blogPosts: BlogPost\[\] = \[([\s\S]*?)\];/);
    
    if (!blogPostsArrayMatch) {
      return NextResponse.json({ 
        error: "Could not find blogPosts array in blog-data.ts" 
      }, { status: 500 });
    }

    // Convert the blog post to a string representation
    const blogPostString = `{
    id: "${blogPost.id}",
    slug: "${blogPost.slug}",
    title: "${blogPost.title.replace(/"/g, '\\"')}",
    excerpt: "${blogPost.excerpt.replace(/"/g, '\\"')}",
    date: "${blogPost.date}",
    readTime: "${blogPost.readTime}",
    category: "${blogPost.category}",
    coverImage: "${blogPost.coverImage}",
    featured: ${blogPost.featured},
    author: "${blogPost.author}",
    authorImage: "${blogPost.authorImage}"
  }`;

    // Replace the array content
    const currentArray = blogPostsArrayMatch[1].trim();
    const newArray = currentArray ? blogPostString + ',' + currentArray : blogPostString;
    const updatedBlogData = blogDataContent.replace(
      /export const blogPosts: BlogPost\[\] = \[([\s\S]*?)\];/, 
      `export const blogPosts: BlogPost[] = [${newArray}];`
    );

    // Write the updated content back to the file
    fs.writeFileSync(blogDataPath, updatedBlogData, 'utf8');

    // Also save the full content to a markdown file for the blog
    const contentDir = path.join(process.cwd(), 'app', 'blog', 'content');
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
    }

    const contentFilePath = path.join(contentDir, `${blogPost.slug}.md`);
    const markdownContent = `---
title: "${blogPost.title}"
date: "${new Date().toISOString().split('T')[0]}"
author: "${blogPost.author}"
category: "${blogPost.category}"
excerpt: "${blogPost.excerpt}"
coverImage: "${blogPost.coverImage}"
keywords: [${keywords?.map((k: string) => `"${k}"`).join(', ') || ''}]
---

${content}`;

    fs.writeFileSync(contentFilePath, markdownContent, 'utf8');

    return NextResponse.json({
      success: true,
      message: "Article saved to blog successfully",
      blogPost: blogPost,
      contentFile: contentFilePath
    });

  } catch (error: unknown) {
    console.error('Error in /api/admin/ai-tools/save-article:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      message: errorMessage 
    }, { status: 500 });
  }
}
