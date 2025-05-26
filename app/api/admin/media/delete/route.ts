import { NextResponse } from 'next/server';
import { checkAdminAuth } from "@/utils/auth-compat";
import { del } from '@vercel/blob';

export async function DELETE(request: Request) {
  try {
    // Check authentication
    const authResult = await checkAdminAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the file URL from the query string
    const url = new URL(request.url);
    const fileUrl = url.searchParams.get('url');
    const fileId = url.searchParams.get('id');
    
    if (!fileUrl && !fileId) {
      return NextResponse.json({ error: 'No file URL or ID provided' }, { status: 400 });
    }
    
    // Determine if this is a video or image from URL if possible
    const isVideo = fileUrl ? 
      fileUrl.toLowerCase().includes('/videos/') || 
      fileUrl.toLowerCase().endsWith('.mp4') ||
      fileUrl.toLowerCase().endsWith('.webm') ||
      fileUrl.toLowerCase().endsWith('.mov') : false;
      
    const mediaType = isVideo ? 'video' : 'media';
    
    // Delete the file from storage
    if (fileUrl) {
      // Delete by full URL
      await del(fileUrl);
    } else if (fileId) {
      // Get list and find the file by ID
      const { blobs } = await import('@vercel/blob').then(mod => mod.list());
      const fileToDelete = blobs.find(blob => 
        blob.url.includes(fileId) || blob.pathname.includes(fileId)
      );
      
      if (fileToDelete) {
        await del(fileToDelete.url);
      } else {
        return NextResponse.json({ error: `${mediaType} not found` }, { status: 404 });
      }
    }

    return NextResponse.json({ 
      success: true,
      mediaType,
      message: `${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} deleted successfully`
    });
  } catch (error) {
    console.error('Media delete error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete media',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
