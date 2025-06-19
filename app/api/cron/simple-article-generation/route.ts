import { NextRequest, NextResponse } from 'next/server';

/**
 * SIMPLIFIED CRON ENDPOINT
 * 
 * This replaces the complex cron endpoint with a simple, reliable approach.
 * No complex script execution, no chaining, just direct API calls.
 */

function isValidCronRequest(request: NextRequest): boolean {
  // Check cron secret from URL params
  const url = new URL(request.url);
  const cronSecret = url.searchParams.get('cron_secret');
  const expectedSecret = 'aQ7zL9kR3!xW1mP8*oN5bC2jH4fG0eD6uT9yI';
  
  if (cronSecret !== expectedSecret) {
    console.error('❌ Invalid cron secret');
    return false;
  }
  
  return true;
}

async function generateArticleViAPI() {
  // Use the existing API endpoint instead of importing the script
  const apiUrl = process.env.NODE_ENV === 'production' 
    ? 'https://fais.world' 
    : 'http://localhost:3000';
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  // Add internal API key for authentication
  if (process.env.INTERNAL_API_KEY) {
    headers['Authorization'] = `Bearer ${process.env.INTERNAL_API_KEY}`;
  }
  
  const topics = [
    "Latest trends in artificial intelligence",
    "Blockchain technology applications", 
    "Web development best practices",
    "Machine learning for businesses",
    "Digital transformation strategies"
  ];
  
  const topic = topics[Math.floor(Math.random() * topics.length)];
  
  const response = await fetch(`${apiUrl}/api/admin/ai-tools/generate-article`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      topic,
      keywords: ['technology', 'innovation', 'digital'],
      tone: 'informative', 
      wordCount: 800,
      includeImage: true
    })
  });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Article generation failed');
  }
  
  // Save the article
  if (result.title && result.content) {
    const saveResponse = await fetch(`${apiUrl}/api/admin/ai-tools/save-article`, {
      method: 'POST',
      headers,
      body: JSON.stringify(result)
    });
    
    if (!saveResponse.ok) {
      console.warn('Failed to save article, but generation was successful');
    }
  }
  
  return result;
}

export async function GET(request: NextRequest) {
  try {
    // Validate cron request
    if (!isValidCronRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🕐 Starting scheduled article generation...');
    const startTime = Date.now();    // Generate article using the simplified API call
    const result = await generateArticleViAPI();

    const duration = Date.now() - startTime;
    
    console.log('✅ Scheduled article generation complete!');
    
    return NextResponse.json({
      success: true,
      message: 'Article generated successfully',
      title: result.title,
      slug: result.slug,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Scheduled article generation failed:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Also support POST for manual triggering
export async function POST(request: NextRequest) {
  return GET(request);
}
