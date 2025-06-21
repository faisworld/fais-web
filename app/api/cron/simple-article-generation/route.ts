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
  // Always use production API endpoint for cron jobs
  const apiUrl = 'https://fais.world';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  // Add internal API key for authentication
  if (process.env.INTERNAL_API_KEY) {
    headers['Authorization'] = `Bearer ${process.env.INTERNAL_API_KEY}`;
  }
  
  const topics = [
    "Latest trends in artificial intelligence and machine learning",
    "Blockchain technology applications in business", 
    "Web development best practices and frameworks",
    "Machine learning algorithms for enterprise solutions",
    "Digital transformation strategies for modern businesses",
    "Cryptocurrency and DeFi market developments",
    "AI automation tools for productivity",
    "Smart contract implementation strategies",
    "Edge computing and IoT applications",
    "Cybersecurity trends and threat prevention"
  ];
  
  const topic = topics[Math.floor(Math.random() * topics.length)];
  
  const response = await fetch(`${apiUrl}/api/admin/ai-tools/generate-article`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      topic,
      keywords: ['technology', 'innovation', 'digital', 'AI', 'blockchain'],
      tone: 'informative', 
      wordCount: 800,
      includeImage: true
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  const result = await response.json();
  
  // The article generation API already saves to database, so we don't need a separate save call
  // Just return the result
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
