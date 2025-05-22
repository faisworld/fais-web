// app/api/admin/media/thumbnail/route.ts
import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/utils/admin-auth';
import { put } from '@vercel/blob';
import sharp from 'sharp';
import fetch from 'node-fetch';

export async function POST(request: Request) {
  // Check admin auth
  const { isAuthenticated } = await checkAdminAuth(request);
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { url, type, width = 300, height = 169 } = body;
    
    if (type === 'image') {
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
    }
      // For videos, we would ideally extract a frame using FFmpeg
    // Since that may not be available, we'll create a consistent naming convention for video thumbnails
    if (type === 'video') {
      try {
        // Create a predictable thumbnail URL for the video
        const videoFilename = url.split('/').pop() || 'video.mp4';
        const filenameWithoutExt = videoFilename.split('.').slice(0, -1).join('.');
        const thumbnailFilename = `${filenameWithoutExt}.jpg`;
        
        // Check if thumbnail with this name already exists
        // If not in production, we'll use a placeholder
        
        // In production, you would use something like:
        // const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
        // const ffmpeg = require('fluent-ffmpeg');
        // ffmpeg.setFfmpegPath(ffmpegPath);
        
        // Get the first frame or thumbnail using FFmpeg (placeholder implementation)
        const thumbnailUrl = url.replace(/\.[^.]+$/, '.jpg');
        
        return NextResponse.json({ 
          thumbnailUrl,
          message: 'Auto-generated thumbnail URL (placeholder)' 
        });
      } catch (thumbError) {
        console.error('Error generating video thumbnail:', thumbError);
        // Fallback to using the video URL directly
        return NextResponse.json({ 
          thumbnailUrl: url,
          message: 'Using video URL as thumbnail (fallback)' 
        });
      }
    }
    
    return NextResponse.json({ error: 'Invalid media type' }, { status: 400 });
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return NextResponse.json({ error: 'Thumbnail generation failed' }, { status: 500 });
  }
}