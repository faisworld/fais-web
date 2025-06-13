import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

function isValidCronRequest(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const internalApiKey = process.env.INTERNAL_API_KEY
  
  if (!internalApiKey) {
    console.error('INTERNAL_API_KEY environment variable is not set')
    return false
  }
  
  return authHeader === `Bearer ${internalApiKey}`
}

export async function POST(request: NextRequest) {
  try {
    // Validate cron request
    if (!isValidCronRequest(request)) {
      console.error('❌ Unauthorized article generation request')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🚀 Starting enhanced automated article generation via cron...');
    console.log('📅 Execution time:', new Date().toISOString());
    console.log('🌐 Environment:', process.env.NODE_ENV || 'development');

    // Get the project root directory
    const projectRoot = process.cwd();
    const scriptPath = path.join(projectRoot, 'scripts', 'automated-article-generation.mjs');
      // Set up environment variables for the script
    const env = {
      ...process.env,
      NODE_ENV: 'production' as const, // Force production mode for automated generation
      INTERNAL_API_KEY: process.env.INTERNAL_API_KEY || 'fallback-key-for-development',
      VERCEL_ENV: 'production' // Ensure production API URLs are used
    };

    console.log('📁 Script path:', scriptPath);
    console.log('🔑 Using internal API key:', env.INTERNAL_API_KEY ? 'Yes' : 'No');

    // Execute the enhanced automated article generation script
    const { stdout, stderr } = await execAsync(`node "${scriptPath}"`, {
      cwd: projectRoot,
      env: env,
      timeout: 600000 // 10 minute timeout for news crawling and generation
    });

    console.log('✅ Article generation completed');
    console.log('📝 Output:', stdout);
    
    if (stderr) {
      console.error('⚠️  Stderr output:', stderr);
    }

    // Parse output to extract useful information
    const outputLines = stdout.split('\n');
    const successfulGenerations = outputLines
      .filter(line => line.includes('Successfully generated article'))
      .length;
    
    const crawledNews = outputLines
      .find(line => line.includes('Found') && line.includes('relevant news articles'));
    
    const duplicatesSkipped = outputLines
      .filter(line => line.includes('Skipping duplicate'))
      .length;

    return NextResponse.json({
      success: true,
      message: 'Enhanced automated article generation completed successfully',
      statistics: {
        articlesGenerated: successfulGenerations,
        duplicatesSkipped: duplicatesSkipped,
        newsCrawled: crawledNews ? crawledNews.match(/\d+/)?.[0] || '0' : '0'
      },
      output: stdout,
      timestamp: new Date().toISOString(),
      environment: 'production'
    });

  } catch (error) {
    console.error('❌ Error in automated article generation cron:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
