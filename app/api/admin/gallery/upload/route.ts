import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';
import { checkAdminAuth } from '@/utils/admin-auth';

// Configure allowed file types
const ALLOWED_TYPES = [
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  // Videos
  'video/mp4',
  'video/webm',
  'video/quicktime', // .mov
];

// Set size limits
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export async function POST(request: Request) {
  try {
    // Verify admin authentication
    const authResult = await checkAdminAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string || 'Untitled';
    const folder = formData.get('folder') as string || '';
    const description = formData.get('description') as string || '';
    const altText = formData.get('alt') as string || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: `File type '${file.type}' not allowed.` 
      }, { status: 400 });
    }

    // Validate file size
    const maxSize = file.type.startsWith('video/') ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
      const sizeMB = Math.round(maxSize / 1024 / 1024);
      return NextResponse.json({ 
        error: `File too large. Maximum size for ${file.type.startsWith('video/') ? 'videos' : 'images'} is ${sizeMB}MB`
      }, { status: 400 });
    }

    // Generate a unique filename
    const ext = file.name.split('.').pop() || '';
    const uniqueFilename = `${uuidv4()}.${ext}`;
    
    // Determine folder path based on file type
    const fileType = file.type.startsWith('video/') ? 'videos' : 'images';
    const folderPath = folder ? `${fileType}/${folder}` : fileType;
    const filePath = `${folderPath}/${uniqueFilename}`;

    // Upload to Blobstore
    const { url, pathname } = await put(filePath, file, {
      access: 'public',
      contentType: file.type,
      addRandomSuffix: false,
    });

    // Save metadata to your database
    // This is just an example - implement based on your actual database
    const mediaEntry = {
      url,
      title,
      folder: folderPath,
      description,
      altTag: altText,
      format: ext,
      size: file.size,
      // Add other metadata you might want to track
      uploaded_at: new Date().toISOString(),
    };
    
    // Insert into your database here
    // await db.insert('gallery_media', mediaEntry);

    return NextResponse.json({ 
      success: true, 
      url, 
      filename: uniqueFilename,
      ...mediaEntry
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload file',
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
