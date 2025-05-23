// app/api/admin/media/thumbnail/route.ts
import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/utils/admin-auth';
import { put } from '@vercel/blob';
import sharp from 'sharp';
import fetch from 'node-fetch';
import { isVideo } from '@/utils/media-utils';

export async function POST(request: Request) {
  // Check admin auth
  const { isAuthenticated } = await checkAdminAuth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { url, type, width = 300, height = 169 } = body;
      // Enhanced video detection
    const isVideoContent = type === 'video' || isVideo(url);
    
    if (!isVideoContent) {
      // Image processing
      // Download and process the image
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      
      // Resize with sharp
      const resizedBuffer = await sharp(Buffer.from(buffer))
        .resize(width, height, { fit: 'cover' })
        .toBuffer();
      
      // Create a unique thumbnail filename
      const originalFilename = url.split('/').pop() || 'image';
      const thumbnailFilename = `thumb-${width}x${height}-${originalFilename}`;
      
      // Upload to Blob storage
      const { url: thumbnailUrl } = await put(thumbnailFilename, resizedBuffer, {
        contentType: 'image/jpeg',
        access: 'public',
      });
      
      return NextResponse.json({ thumbnailUrl });
    }    // Enhanced video thumbnail handling
    if (isVideoContent) {
      try {
        // For videos, we'll use the video URL itself as thumbnail
        // This allows the browser to show the first frame
        const thumbnailUrl = url;
        
        return NextResponse.json({ 
          thumbnailUrl,
          message: 'Using video URL as thumbnail for browser preview',
          isVideo: true
        });
      } catch (thumbError) {
        console.error('Error processing video thumbnail:', thumbError);
        return NextResponse.json({ 
          thumbnailUrl: url,
          message: 'Fallback: using video URL directly',
          isVideo: true
        });
      }
    }
    
    return NextResponse.json({ error: 'Invalid media type' }, { status: 400 });
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return NextResponse.json({ error: 'Thumbnail generation failed' }, { status: 500 });
  }
}