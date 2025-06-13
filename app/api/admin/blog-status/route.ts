import { NextResponse } from 'next/server';
import { blogPosts } from '@/app/blog/blog-data';

export async function GET() {
  try {
    // Get the most recent post
    const sortedPosts = [...blogPosts].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Check for articles without proper images
    const articlesWithPlaceholders = blogPosts.filter(post => 
      post.coverImage.includes('blog-placeholder-ai-generated') || 
      post.coverImage === '/placeholder.svg'
    );

    // Calculate next cron runs (5 AM and 5 PM UTC)
    const now = new Date();
    const nextRuns = [];    
    for (const hour of [5, 17]) {
      const nextRun = new Date();
      nextRun.setUTCHours(hour, 0, 0, 0);
      
      if (nextRun <= now) {
        nextRun.setUTCDate(nextRun.getUTCDate() + 1);
      }
      
      nextRuns.push({
        time: nextRun.toISOString(),
        timeUTC: `${hour}:00 UTC`,
        hoursFromNow: Math.round((nextRun.getTime() - now.getTime()) / (1000 * 60 * 60))
      });
    }

    const status = {
      timestamp: new Date().toISOString(),
      system: {
        status: "operational",
        cronSchedule: "0 5,17 * * *", // 5 AM and 5 PM UTC daily
        nextRuns: nextRuns.sort((a, b) => a.hoursFromNow - b.hoursFromNow)
      },
      articles: {
        total: blogPosts.length,
        withPlaceholderImages: articlesWithPlaceholders.length,
        categories: {
          ai: blogPosts.filter(p => p.category === 'ai').length,
          blockchain: blogPosts.filter(p => p.category === 'blockchain').length,
          technology: blogPosts.filter(p => p.category === 'technology').length,
          business: blogPosts.filter(p => p.category === 'business').length
        }
      },
      lastArticle: sortedPosts[0] || null,
      imageIssues: articlesWithPlaceholders.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        currentImage: post.coverImage
      }))
    };

    return NextResponse.json(status, { status: 200 });
  } catch (error) {
    console.error('Blog status check failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get blog status',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}
