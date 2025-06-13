import { NextRequest, NextResponse } from 'next/server';
import { copy, del } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const { imageUrls } = await request.json();
    
    if (!imageUrls || !Array.isArray(imageUrls)) {
      return NextResponse.json({ error: 'Invalid image URLs provided' }, { status: 400 });
    }

    const results = [];
    
    for (const url of imageUrls) {
      try {
        // Parse blob path and preserve folder structure
        const blobUrlObj = new URL(url);
        const blobPath = blobUrlObj.pathname.startsWith('/')
          ? blobUrlObj.pathname.slice(1)
          : blobUrlObj.pathname;
        // Determine target path: if already under article-images, keep it; otherwise prefix article-images
        let newPath: string;
        if (blobPath.startsWith('images/article-images/')) {
          newPath = blobPath;
        } else if (blobPath.startsWith('images/')) {
          const rest = blobPath.slice('images/'.length);
          newPath = `images/article-images/${rest}`;
        } else {
          newPath = `images/article-images/${blobPath}`;
        }
         
        // Copy the image to the new blob location
        const copyResult = await copy(url, newPath, { access: 'public' });
        
        // Delete the original image if path changed
        if (newPath !== blobPath) {
          await del(url);
        }
         
        results.push({
          originalUrl: url,
          newUrl: copyResult.url,
          oldPath: blobPath,
          newPath,
           status: 'success'
         });
        
      } catch (error) {
        console.error(`Error moving image ${url}:`, error);
        results.push({
          originalUrl: url,
          error: error instanceof Error ? error.message : 'Unknown error',
          status: 'error'
        });
      }
    }
    
    return NextResponse.json({ 
      message: 'Image move operation completed',
      results 
    });
    
  } catch (error) {
    console.error('Error in move-article-images API:', error);
    return NextResponse.json(
      { error: 'Failed to move article images' },
      { status: 500 }
    );
  }
}
