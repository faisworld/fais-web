import { NextResponse } from 'next/server';+
    'Ensure the slug you generate for the saveBlogPost tool starts with the date in YYYY-MM-DD format. ' +
    'The frontmatter for the blog post (handled by the saveBlogPost tool) must include title, date (YYYY-MM-DD), description/summary (1-2 sentences), and image (the URL from generateArticleImage).';

export async function GET() {
  // DISABLED: This old cron job system was creating problematic files
  // Use scripts/automated-article-generation.mjs instead for proper article generation
  console.log('Old cron job system disabled. Use scripts/automated-article-generation.mjs instead.');
  
  return NextResponse.json({
    message: 'This cron job system has been disabled. Use the new automated article generation script instead.',
    redirectTo: 'scripts/automated-article-generation.mjs'
  }, { status: 410 }); // 410 Gone - resource no longer available
}

export const config = {
  runtime: 'edge',
};
