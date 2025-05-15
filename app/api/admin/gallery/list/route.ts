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

    const url = new URL(request.url);
    const folder = url.searchParams.get('folder') || '';

    // List all blobs from Vercel Blob Storage
    const { blobs } = await list({
      prefix: folder ? folder + '/' : undefined,
    });
    
    // Convert blob data to gallery format and sort by uploadedAt (newest first)
    const images = blobs
      .filter(blob => {
        // Filter out directories and empty placeholder files
        return blob.pathname !== 'uploaded-image' && !blob.pathname.endsWith('/');
      })
      .map((blob) => {
        // Extract filename from pathname
        const pathParts = blob.pathname.split('/');
        const filename = pathParts[pathParts.length - 1];
        
        // Get file extension
        const extension = filename.includes('.') ? filename.split('.').pop()?.toLowerCase() : '';
        
        // Determine if it's a video based on extension or content type
        const videoExtensions = ['mp4', 'webm', 'mov', 'avi'];
        const isVideo = blob.contentType?.startsWith('video/') || 
                      (extension && videoExtensions.includes(extension));

        // Generate numeric ID from URL
        const id = hashString(blob.url);
        
        // Extract folder path
        let folderPath = '';
        if (pathParts.length > 1) {
          folderPath = pathParts.slice(0, -1).join('/');
        }
        
        // Format title from filename (remove extension)
        const title = filename.includes('.') ? filename.split('.').slice(0, -1).join('.') : filename;
        
        return {
          id,
          url: blob.url,
          title: title || 'Untitled',
          altTag: title || 'Untitled',
          "alt-tag": title || 'Untitled',
          folder: folderPath,
          description: '',
          format: extension || '',
          size: blob.size,
          mediaType: isVideo ? 'video' : 'image',
          uploaded_at: blob.uploadedAt
        };
      })
      .sort((a, b) => {
        // Sort by date, newest first
        const dateA = new Date(a.uploaded_at).getTime();
        const dateB = new Date(b.uploaded_at).getTime();
        return dateB - dateA;
      });

    // Get unique folders for the folder selector
    const allFolders = new Set<string>();
    blobs.forEach(blob => {
      const pathParts = blob.pathname.split('/');
      if (pathParts.length > 1) {
        // Add each level of the folder path
        for (let i = 0; i < pathParts.length - 1; i++) {
          const path = pathParts.slice(0, i + 1).join('/');
          if (path) allFolders.add(path);
        }
      }
    });

    return NextResponse.json({ 
      images,
      folders: Array.from(allFolders),
      count: images.length
    });
  } catch (error) {
    console.error('Error listing gallery media:', error);
    return NextResponse.json({ 
      error: 'Failed to list media files',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Simple hash function to generate numeric IDs
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}
