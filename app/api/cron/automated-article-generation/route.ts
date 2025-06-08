import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const { searchParams } = new URL(request.url);
    const cronSecret = searchParams.get('cron_secret');
    const expectedSecret = process.env.CRON_SECRET || 'aQ7zL9kR3!xW1mP8*oN5bC2jH4fG0eD6uT9yI';
    
    if (cronSecret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
