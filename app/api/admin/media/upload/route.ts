import { NextResponse } from 'next/server';
import { checkAdminAuth } from "@/utils/auth-compat";
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';

// List of allowed file types
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
  'video/quicktime', // .mov
];

// Maximum file size: 100MB for videos, 10MB for images
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
  try {
    // Check authentication
    const authResult = await checkAdminAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the form data
    const formData = await request.formData();
    const file = formData.get('media') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: `File type not allowed. Supported types: ${ALLOWED_FILE_TYPES.join(', ')}` 
      }, { status: 400 });
    }

    // Validate file size
    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    
    if (file.size > maxSize) {
      const sizeInMB = Math.round(maxSize / (1024 * 1024));
      return NextResponse.json({ 
        error: `File too large. Maximum size for ${isVideo ? 'videos' : 'images'} is ${sizeInMB}MB` 
      }, { status: 400 });
    }

    // Generate a unique filename
    const fileExtension = file.name.split('.').pop() || '';
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const filePath = `uploads/${isVideo ? 'videos' : 'images'}/${uniqueFilename}`;

    // Upload file to storage
    const { url } = await put(filePath, file, {
      access: 'public',
      contentType: file.type,
    });

    return NextResponse.json({ 
      url, 
      name: file.name, 
      type: isVideo ? 'video' : 'image',
      success: true 
    });
  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload media',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
