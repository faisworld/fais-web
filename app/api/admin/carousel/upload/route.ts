import { NextResponse } from 'next/server';
import { put, list, del } from '@vercel/blob';
import { checkAdminAuth } from '@/utils/admin-auth';

export async function POST(request: Request) {
  try {
    // Verify admin authentication
    const authResult = await checkAdminAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const slideName = formData.get('slideName') as string;
    const mediaType = formData.get('mediaType') as string || 
                     (file.type.startsWith('video/') ? 'video' : 'image');
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!slideName) {
      return NextResponse.json({ error: 'Slide name is required' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      return NextResponse.json({ 
        error: 'Only image or video files are allowed for carousel slides' 
      }, { status: 400 });
    }

    // Check file size
    const maxSize = file.type.startsWith('video/') ? 100 * 1024 * 1024 : 10 * 1024 * 1024; // 100MB for video, 10MB for images
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `File too large. Maximum size is ${file.type.startsWith('video/') ? '100MB' : '10MB'}` 
      }, { status: 400 });
    }

    // Prepare file path for this carousel slide
    const fileExtension = file.name.split('.').pop() || (file.type.startsWith('video/') ? 'mp4' : 'jpg');
    const mediaTypePrefix = mediaType === 'video' ? 'video' : 'image';
    const fileName = `carousel-${mediaTypePrefix}-${slideName.toLowerCase().replace(/\s+/g, '-')}.${fileExtension}`;
    const filePath = `carousel/${fileName}`;

    // Delete any existing file for this slide
    try {
      const { blobs } = await list({ prefix: `carousel/carousel-` });
      const existingFiles = blobs.filter(blob => 
        blob.pathname.includes(`-${slideName.toLowerCase().replace(/\s+/g, '-')}.`)
      );
      
      for (const existingFile of existingFiles) {
        await del(existingFile.url);
      }
    } catch (error) {
      console.warn("Error checking for existing carousel media:", error);
      // Continue with upload even if this fails
    }

    // Upload new file
    const { url } = await put(filePath, file, {
      access: 'public',
      contentType: file.type,
    });

    return NextResponse.json({ 
      success: true,
      url,
      slideName,
      mediaType
    });

  } catch (error) {
    console.error('Carousel upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload carousel media',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
