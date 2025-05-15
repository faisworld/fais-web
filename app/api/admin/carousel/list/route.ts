import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';
import { checkAdminAuth } from '@/utils/admin-auth';

export async function GET(request: Request) {
  try {
    // Verify admin authentication
    const authResult = await checkAdminAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // List all carousel media from Vercel Blob
    const { blobs } = await list({ prefix: 'carousel/' });
    
    // Format the results
    const mediaItems = blobs
      .filter(blob => blob.pathname.startsWith('carousel/carousel-'))
      .map(blob => {
        // Extract slide name and media type from filename
        const isVideo = blob.pathname.includes('carousel-video-');
        
        // Parse the slide name from the file path
        let slideName = '';
        if (isVideo) {
          // Format: carousel/carousel-video-slide-name.mp4
          slideName = blob.pathname
            .replace('carousel/carousel-video-', '')
            .replace(/\.[^/.]+$/, ''); // Remove file extension
        } else {
          // Format: carousel/carousel-image-slide-name.jpg
          slideName = blob.pathname
            .replace('carousel/carousel-image-', '')
            .replace(/\.[^/.]+$/, ''); // Remove file extension
        }
        
        // Convert kebab-case to Title Case
        slideName = slideName
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        return {
          url: blob.url,
          slideName,
          mediaType: isVideo ? 'video' : 'image',
          uploadedAt: blob.uploadedAt
        };
      });

    return NextResponse.json({ mediaItems });
  } catch (error) {
    console.error('Error listing carousel media:', error);
    return NextResponse.json({ 
      error: 'Failed to list carousel media',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
