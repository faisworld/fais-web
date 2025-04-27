import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';


// Use require for probe-image-size as it might be a CJS module
const probe = require('probe-image-size');

// Define the structure for image objects
interface ImageInfo {
    key: string;
    id: string;
    url: string;
    title: string;
    folder: string;
    alt: string;
    width: number | null;
    height: number | null;
    size: number;
    uploaded_at: Date;
}

export async function GET() {
  // List all blobs in the store
  const { blobs } = await list();

  const foldersSet = new Set<string>();
  foldersSet.add(''); // Always include root

  // Filter out .keep files and prepare promises for dimension probing
  const imagePromises = blobs
    .filter(blob => !blob.pathname.endsWith('/.keep')) // Filter out .keep files
    .map(async (blob, idx) => {
      let folder = '';
      let title = blob.pathname.split('/').pop() || `Image ${idx + 1}`;
      let pathParts = blob.pathname.split('/').filter(Boolean);

      if (pathParts.length > 1) {
        folder = pathParts.slice(0, -1).join('/');
        foldersSet.add(folder);
      } else if (pathParts.length === 1) {
        folder = ''; // Assign to root
      } else {
        return null; // Skip empty pathnames
      }

      // Probe image dimensions
      let dimensions: { width: number | null; height: number | null } = { width: null, height: null };
      try {
        // Ensure probe is treated as a function
        const probeFn = typeof probe === 'function' ? probe : probe.default;
        if (typeof probeFn !== 'function') {
          throw new Error('probe-image-size could not be loaded as a function.');
        }
        const result = await probeFn(blob.url);
        dimensions = { width: result.width, height: result.height };
      } catch (error) {
        console.error(`Failed to probe image dimensions for ${blob.url}:`, error);
        // Keep width/height as null if probing fails
      }

      return {
        key: blob.pathname,
        id: blob.pathname,
        url: blob.url,
        title: title,
        folder: folder,
        alt: title,
        width: dimensions.width, // Use probed width
        height: dimensions.height, // Use probed height
        size: blob.size,
        uploaded_at: blob.uploadedAt,
      };
    });

  // Wait for all promises to resolve and filter out nulls
  const images = (await Promise.all(imagePromises)).filter(img => img !== null) as ImageInfo[];

  const folders = Array.from(foldersSet).sort();

  return NextResponse.json({ images, folders });
}
