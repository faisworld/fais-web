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

    console.log('Starting automated article generation via cron...');

    // Get the project root directory
    const projectRoot = process.cwd();
    const scriptPath = path.join(projectRoot, 'scripts', 'automated-article-generation.mjs');    // Set up environment variables for the script
    const env = {
      ...process.env,
      NODE_ENV: 'production' as const,
      INTERNAL_API_KEY: process.env.INTERNAL_API_KEY || 'fallback-key-for-development'
    };

    // Execute the automated article generation script
    const { stdout, stderr } = await execAsync(`node "${scriptPath}"`, {
      cwd: projectRoot,
      env: env,
      timeout: 300000 // 5 minute timeout
    });

    console.log('Article generation output:', stdout);
    if (stderr) {
      console.error('Article generation errors:', stderr);
    }

    return NextResponse.json({
      success: true,
      message: 'Automated article generation completed successfully',
      output: stdout,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in automated article generation cron:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
