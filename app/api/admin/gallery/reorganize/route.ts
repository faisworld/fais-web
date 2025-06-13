import { NextResponse } from 'next/server';
import { list, del, put } from '@vercel/blob';
import { checkAdminAuth } from '@/utils/auth-compat';

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

interface BlogPost {
  coverImage: string;
  slug: string;
  title: string;
}

// Get list of article images from blog data
async function getArticleImages(): Promise<string[]> {
  try {
    // Import blog data
    const blogDataModule = await import('@/app/blog/blog-data');
    const blogPosts: BlogPost[] = blogDataModule.blogPosts;
    
    return blogPosts.map(post => post.coverImage).filter(url => 
      url.includes('mzcje1drftvqhdku.public.blob.vercel-storage.com')
    );
  } catch (error) {
    console.error('Error loading blog data:', error);
    return [];
  }
}

// Extract filename from URL
function extractFilename(url: string): string {
  const pathname = new URL(url).pathname;
  return pathname.split('/').pop() || pathname;
}

// Check if image is an article image
function isArticleImage(url: string, articleUrls: string[]): boolean {
  return articleUrls.some(articleUrl => {
    const articleFilename = extractFilename(articleUrl);
    const currentFilename = extractFilename(url);
    return articleFilename === currentFilename;
  });
}

// Reorganize blob storage
export async function POST(request: Request) {
  const authResult = await checkAdminAuth();
  if (!authResult.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const { dryRun = true } = body;

    console.log(`Starting blob storage reorganization (dryRun: ${dryRun})`);

    // Get list of all blobs
    const { blobs } = await list();
    console.log(`Found ${blobs.length} blobs to analyze`);

    // Get article images
    const articleImageUrls = await getArticleImages();
    console.log(`Found ${articleImageUrls.length} article images in blog data`);

    const operations = [];
    const issues = [];

    for (const blob of blobs) {
      const { pathname, url } = blob;
      let needsMove = false;
      let newPath = '';
      let reason = '';

      // Skip placeholder files
      if (pathname === 'uploaded-image' || pathname.endsWith('/')) {
        continue;
      }

      // Check for problematic paths
      if (pathname.includes('/images/images/')) {
        needsMove = true;
        // Remove the extra /images/ part
        newPath = pathname.replace('/images/images/', '/images/');
        reason = 'Remove nested /images/images/ folder';
      } else if (pathname.includes('/images/images/images/')) {
        needsMove = true;
        // Remove the extra /images/images/ parts
        newPath = pathname.replace('/images/images/images/', '/images/');
        reason = 'Remove triple nested /images/images/images/ folder';
      } else if (!pathname.startsWith('images/') && !pathname.startsWith('videos/') && !pathname.startsWith('carousel/') && !pathname.startsWith('instant-id/')) {        // Image is in root - needs to be moved
        needsMove = true;
        
        if (isArticleImage(url, articleImageUrls)) {
          newPath = `images/article-images/${pathname}`;
          reason = 'Move article image to /images/article-images/';
        } else {
          newPath = `images/${pathname}`;
          reason = 'Move to /images/ folder';
        }
      } else if (pathname.startsWith('images/') && !pathname.startsWith('images/article-images/') && isArticleImage(url, articleImageUrls)) {
        // Article image not in article-images folder
        needsMove = true;
        const filename = pathname.replace('images/', '');
        newPath = `images/article-images/${filename}`;
        reason = 'Move article image to /images/article-images/';
      }

      if (needsMove) {
        operations.push({
          originalPath: pathname,
          originalUrl: url,
          newPath,
          reason,
          isArticleImage: isArticleImage(url, articleImageUrls)
        });
      }
    }

    console.log(`Found ${operations.length} files that need reorganization`);

    // If this is not a dry run, perform the operations
    if (!dryRun) {
      let successCount = 0;
      let errorCount = 0;

      for (const operation of operations) {
        try {
          console.log(`Moving ${operation.originalPath} to ${operation.newPath}`);
          
          // Download the original file
          const response = await fetch(operation.originalUrl);
          if (!response.ok) {
            throw new Error(`Failed to download file: ${response.statusText}`);
          }
          
          const fileBuffer = await response.arrayBuffer();
          const contentType = response.headers.get('content-type') || 'application/octet-stream';
          
          // Upload to new location
          await put(operation.newPath, fileBuffer, {
            access: 'public',
            contentType
          });
          
          // Delete original file
          await del(operation.originalUrl);
          
          successCount++;
          console.log(`Successfully moved ${operation.originalPath}`);
        } catch (error) {
          errorCount++;
          console.error(`Failed to move ${operation.originalPath}:`, error);
          issues.push({
            path: operation.originalPath,
            error: error instanceof Error ? error.message : String(error)
          });
        }
      }

      return NextResponse.json({
        success: true,
        message: `Reorganization completed. ${successCount} files moved, ${errorCount} errors.`,
        summary: {
          totalAnalyzed: blobs.length,
          operationsPlanned: operations.length,
          operationsCompleted: successCount,
          errors: errorCount
        },
        operations: operations.slice(0, 20), // Limit response size
        issues
      }, { headers: corsHeaders });
    } else {
      // Dry run - just return the plan
      return NextResponse.json({
        success: true,
        message: `Dry run completed. Found ${operations.length} files that need reorganization.`,
        summary: {
          totalAnalyzed: blobs.length,
          operationsPlanned: operations.length,
          articleImages: articleImageUrls.length
        },
        operations: operations.slice(0, 50), // Show first 50 operations
        dryRun: true
      }, { headers: corsHeaders });
    }

  } catch (error) {
    console.error('Error in reorganization:', error);
    return NextResponse.json({
      error: 'Failed to reorganize blob storage',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500, headers: corsHeaders });
  }
}

// Get reorganization status/preview
export async function GET(request: Request) {
  const authResult = await checkAdminAuth();
  if (!authResult.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }

  try {
    // This is essentially a dry run
    const dryRunResponse = await POST(new Request(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify({ dryRun: true })
    }));

    return dryRunResponse;
  } catch (error) {
    console.error('Error getting reorganization preview:', error);
    return NextResponse.json({
      error: 'Failed to get reorganization preview',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500, headers: corsHeaders });
  }
}
