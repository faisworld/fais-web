import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/utils/admin-auth';
import { list } from '@vercel/blob';

export async function GET(request: Request) {
  try {
    // Check admin authentication
    const authResult = await checkAdminAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the list of all files from the Vercel Blob storage
    const { blobs } = await list();
    
    // Process the blob data to extract relevant information
    const mediaItems = blobs.map((blob) => {
      const isVideo = blob.pathname.includes('videos/') || 
                     blob.contentType.startsWith('video/');

      return {
        id: blob.url.split('/').pop() || blob.url,
        url: blob.url,
        name: blob.pathname.split('/').pop() || 'Untitled',
        type: isVideo ? 'video' : 'image',
        contentType: blob.contentType,
        size: blob.size,
        createdAt: blob.uploadedAt
      };
    });

    return NextResponse.json({ 
      items: mediaItems,
      count: mediaItems.length
    });
  } catch (error) {
    console.error('Error listing media:', error);
    return NextResponse.json({ 
      error: 'Failed to list media',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
