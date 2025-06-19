import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from "@/utils/auth-compat";
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

/**
 * Manual Article Generation Endpoint for Admin Use
 * This endpoint is for manual article generation on localhost
 * It provides more control and immediate feedback for testing
 */
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication for manual generation
    const authResult = await checkAdminAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
    }

    console.log('🔧 Starting manual article generation...');
    console.log('👤 Admin user authenticated');
    console.log('🌐 Environment:', process.env.NODE_ENV || 'development');

    const body = await request.json();
    const { 
      topic, 
      keywords = [], 
      tone = 'informative', 
      wordCount = 800,
      includeImage = true,
      useNewsData = false
    } = body;

    // Get the project root directory
    const projectRoot = process.cwd();
    
    if (topic) {
      // Manual topic generation
      console.log(`📝 Generating manual article for topic: "${topic}"`);
        // Set up environment for local generation
      const env = {
        ...process.env,
        NODE_ENV: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test'
      };

      // Create a temporary script to generate single article
      const tempScript = `
        import { generateArticle } from './article-generator.mjs';
        
        const topic = "${topic.replace(/"/g, '\\"')}";
        const keywords = ${JSON.stringify(keywords)};
        const tone = "${tone}";
        const wordCount = ${wordCount};
        const includeImage = ${includeImage};
        
        console.log('Manual generation parameters:', { topic, keywords, tone, wordCount, includeImage });
        
        try {
          const result = await generateArticle(topic, keywords, tone, wordCount, includeImage);
          console.log('Manual generation completed successfully');
          console.log('Result:', JSON.stringify(result, null, 2));
        } catch (error) {
          console.error('Manual generation failed:', error);
          process.exit(1);
        }
      `;
      
      const tempScriptPath = path.join(projectRoot, 'scripts', 'temp-manual-generation.mjs');
      fs.writeFileSync(tempScriptPath, tempScript);
      
      try {
        const { stdout, stderr } = await execAsync(`node "${tempScriptPath}"`, {
          cwd: projectRoot,
          env: env,
          timeout: 300000 // 5 minute timeout
        });

        // Clean up temp script
        fs.unlinkSync(tempScriptPath);

        console.log('✅ Manual article generation completed');
        console.log('Output:', stdout);
        
        if (stderr) {
          console.warn('⚠️  Stderr:', stderr);
        }

        return NextResponse.json({
          success: true,
          message: 'Manual article generation completed successfully',
          topic,
          output: stdout,
          timestamp: new Date().toISOString(),
          mode: 'manual'
        });

      } catch (error) {
        // Clean up temp script on error
        try {
          fs.unlinkSync(tempScriptPath);
        } catch {}
        throw error;
      }

    } else if (useNewsData) {
      // Automated generation with news data for testing
      console.log('🔍 Testing automated generation with news crawling...');
      
      const scriptPath = path.join(projectRoot, 'scripts', 'automated-article-generation.mjs');
        const env = {
        ...process.env,
        NODE_ENV: 'development' as const // Keep as development for testing
      };

      const { stdout, stderr } = await execAsync(`node "${scriptPath}"`, {
        cwd: projectRoot,
        env: env,
        timeout: 600000 // 10 minute timeout for news crawling
      });

      console.log('✅ Automated generation test completed');
      console.log('Output:', stdout);
      
      if (stderr) {
        console.warn('⚠️  Stderr:', stderr);
      }

      return NextResponse.json({
        success: true,
        message: 'Automated article generation test completed successfully',
        output: stdout,
        timestamp: new Date().toISOString(),
        mode: 'automated-test'
      });

    } else {
      return NextResponse.json({ 
        error: "Please provide either 'topic' for manual generation or set 'useNewsData: true' for automated test" 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Error in manual article generation:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      mode: 'manual'
    }, { status: 500 });
  }
}

/**
 * GET endpoint to provide information about manual generation
 */
export async function GET(request: NextRequest) {
  const authResult = await checkAdminAuth(request);
  if (!authResult.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    endpoint: '/api/admin/manual-article-generation',
    description: 'Manual article generation for admin testing and development',
    environment: process.env.NODE_ENV || 'development',
    usage: {
      manual_generation: {
        method: 'POST',
        body: {
          topic: 'Your article topic',
          keywords: ['keyword1', 'keyword2'],
          tone: 'informative|casual|professional',
          wordCount: 800,
          includeImage: true
        }
      },
      automated_test: {
        method: 'POST',
        body: {
          useNewsData: true
        }
      }
    },
    timestamp: new Date().toISOString()
  });
}
