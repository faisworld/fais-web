import { NextResponse } from 'next/server';
import { checkAdminAuth } from "@/utils/auth-compat";
import { uploadMediaWithMetadata } from '@/utils/media-database-sync';

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
    const authResult = await checkAdminAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string || 'Untitled';
    const folder = formData.get('folder') as string || 'general';
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
    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    
    if (file.size > maxSize) {
      const sizeMB = Math.round(maxSize / 1024 / 1024);
      return NextResponse.json({ 
        error: `File too large. Maximum size for ${isVideo ? 'videos' : 'images'} is ${sizeMB}MB`
      }, { status: 400 });
    }

    // Determine folder path based on file type
    const fileType = isVideo ? 'videos' : (folder === 'general' ? 'gallery' : folder);
    
    // Use standardized upload function
    const result = await uploadMediaWithMetadata(file, {
      filename: file.name,
      folder: fileType,
      category: isVideo ? 'video' : 'image',
      altText: altText || title,
      title: title,
    });

    // Handle carousel uploads
    if (fileType.includes('carousel')) {
      try {
        const slideName = fileType.split('/').pop() || '';
        const key = slideName.toLowerCase().replace(/\s+/g, '-');
        
        // Update carousel metadata
        const response = await fetch(new URL('/api/admin/carousel/update', request.url).toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ key, url: result.url }),
        });
        
        if (!response.ok) {
          console.error(`Failed to update carousel metadata: ${response.statusText}`);
        } else {
          console.log(`✅ Updated carousel metadata for key: ${key}`);
        }
      } catch (error) {
        console.error('Error updating carousel metadata:', error);
      }
    }

    return NextResponse.json({ 
      success: true, 
      url: result.url,
      databaseId: result.databaseId,
      filename: file.name,
      title,
      folder: fileType,
      description,
      altTag: altText || title,
      format: file.name.split('.').pop() || '',
      size: file.size,
      uploaded_at: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload file',
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
