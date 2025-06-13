import { NextRequest, NextResponse } from 'next/server';
import { list } from "@vercel/blob";
import { verifyAdminRequest } from '@/utils/admin-auth';
import probe from 'probe-image-size';

interface MediaItem {
  id: number;
  url: string;
  title: string;
  altTag: string;
  folder?: string;
  size?: number;
  mediaType: 'image' | 'video';
  uploaded_at: string;
  width?: number;
  height?: number;
  format?: string;
}

export async function GET(req: NextRequest) {
  // Verify the request is from localhost
  const authResult = await verifyAdminRequest(req);
  
  if (!authResult.success) {
    return NextResponse.json({ error: authResult.message }, { status: 403 });
  }
  
  try {
    console.log("Admin: Fetching media from Vercel Blob storage...")
    
    // List all blobs (both images and videos)
    const { blobs } = await list({
      limit: 1000,
    })    // Extract media info from each blob
    const images: MediaItem[] = await Promise.all(
      blobs
        .filter(blob => {
          // Filter out empty placeholder files
          return blob.pathname !== 'uploaded-image' && !blob.pathname.endsWith('/');
        })
        .map(async (blob) => {
          // Extract filename from pathname
          const pathParts = blob.pathname.split('/');
          const filename = pathParts[pathParts.length - 1];
          
          // Get file extension and determine media type
          const extension = filename.includes('.') ? filename.split('.').pop()?.toLowerCase() : '';
          const videoExtensions = ['mp4', 'webm', 'mov', 'avi'];
          
          // Determine if it's a video based on extension instead of contentType
          const isVideo = videoExtensions.includes(extension || '') || 
                        blob.pathname.toLowerCase().includes('/videos/');
                        
          // Generate numeric ID from URL
          const id = hashString(blob.url);
          
          // Extract folder path
          let folderPath = '';
          if (pathParts.length > 1) {
            folderPath = pathParts.slice(0, -1).join('/');
          }
          
          // Format title from filename (remove extension)
          const title = filename.includes('.') ? filename.split('.').slice(0, -1).join('.') : filename;
          
          // Create properly typed mediaType
          const mediaType: 'image' | 'video' = isVideo ? 'video' : 'image';
          
          // Try to get image dimensions for images only
          const dimensions = mediaType === 'image' ? await getImageDimensions(blob.url) : {};
          
          return {
            id,
            url: blob.url,
            title: title || 'Untitled',
            altTag: title || 'Untitled',
            folder: folderPath || undefined,
            size: blob.size,
            mediaType,
            uploaded_at: blob.uploadedAt.toISOString(),
            format: extension || undefined,          width: dimensions.width,
            height: dimensions.height
          };        })
    );    // Sort the results after Promise.all resolves
    const sortedImages = images.sort((a, b) => {
        // Sort by date, newest first
        const dateA = new Date(a.uploaded_at).getTime();
        const dateB = new Date(b.uploaded_at).getTime();
        return dateB - dateA;
      });
      
    console.log(`Found ${sortedImages.length} media items in Blob storage`)
    
    // Extract unique folders from the media items
    const uniqueFolders = Array.from(
      new Set(
        sortedImages
          .filter(item => item.folder)
          .map(item => item.folder)
      )
    ) as string[];
      // Add default folders if they don't exist in the list
    const defaultFolders = ['images', 'images/article-images', 'carousel', 'videos'];
    for (const folder of defaultFolders) {
      if (!uniqueFolders.includes(folder)) {
        uniqueFolders.push(folder);
      }
    }
      return NextResponse.json({
      images: sortedImages,
      folders: uniqueFolders.sort()
    });
  } catch (error) {
    console.error("Error fetching media:", 
      error instanceof Error ? error.message : String(error)
    );
    
    return NextResponse.json(
      { error: "Failed to retrieve media" },
      { status: 500 }
    );
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

// Function to get image dimensions from URL
async function getImageDimensions(url: string): Promise<{ width?: number; height?: number }> {
  try {
    // Only try to get dimensions for images, not videos
    if (!url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      return {};
    }

    // Fetch the image data
    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });

    if (!response.ok) {
      return {};
    }

    // Get array buffer and use probe-image-size
    const buffer = await response.arrayBuffer();
    const result = probe.sync(Buffer.from(buffer));

    if (result) {
      return {
        width: result.width,
        height: result.height
      };
    }

    return {};
  } catch {
    // Silently handle errors and return empty dimensions
    // This prevents console spam but still provides fallback
    return {};
  }
}
