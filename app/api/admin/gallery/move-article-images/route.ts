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
        // Extract filename from URL
        const urlParts = url.split('/');
        const filename = urlParts[urlParts.length - 1];
          // Determine the new path in article-images folder
        const newPath = `images/article-images/${filename}`;
        
        // Copy the image to the new location
        const copyResult = await copy(url, newPath, {
          access: 'public',
        });
        
        // Delete the original image
        await del(url);
        
        results.push({
          originalUrl: url,
          newUrl: copyResult.url,
          filename,
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
