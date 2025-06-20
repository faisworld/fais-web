/**
 * Centralized Media Database Synchronization Utility
 * This utility ensures consistent behavior across all admin tools for media file management.
 * 
 * ALL media operations (upload, move, delete, etc.) MUST use these functions
 * to maintain consistency between Vercel blob storage and Neon database.
 */

import { put, del, list } from '@vercel/blob';
import pg from 'pg';

const { Client } = pg;

// Database connection helper
async function getDbClient() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  return client;
}

// Generate SEO-friendly filename
function generateSeoFilename(originalName: string, prefix?: string): string {
  const timestamp = Date.now();
  const baseName = originalName.replace(/\.[^/.]+$/, "").toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  const extension = originalName.split('.').pop()?.toLowerCase() || '';
  
  if (prefix) {
    return `${prefix}-${baseName}-${timestamp}.${extension}`;
  }
  return `${baseName}-${timestamp}.${extension}`;
}

// Generate SEO alt text
function generateSeoAltText(filename: string, category?: string, customAlt?: string): string {
  if (customAlt) return customAlt;
  
  const baseName = filename.replace(/\.[^/.]+$/, "")
    .replace(/[-_]/g, ' ')
    .replace(/\d{13}/g, '') // Remove timestamps
    .trim();
  
  const categoryText = category ? ` - ${category}` : '';
  return `${baseName}${categoryText} | Fantastic AI Studio`;
}

// Get image dimensions
async function getImageDimensions(blob: Blob): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(url);
    };
    
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  });
}

/**
 * Upload media file to blob storage and save metadata to database
 * This is the STANDARD way to upload any media file
 */
export async function uploadMediaWithMetadata(
  file: File | Blob,
  options: {
    filename?: string;
    folder?: string;
    category?: string;
    altText?: string;
    title?: string;
    seoName?: string;
  } = {}
): Promise<{ url: string; databaseId: number }> {
  try {
    const { filename, folder = 'general', category = 'image', altText, title, seoName } = options;
    
    // Generate filename if not provided
    const finalFilename = filename || (file instanceof File ? file.name : `upload-${Date.now()}.jpg`);
    const seoFilename = generateSeoFilename(finalFilename, 'fais');
    
    // Upload to blob storage
    const blobPath = folder ? `images/${folder}/${seoFilename}` : `images/${seoFilename}`;
    const blob = await put(blobPath, file, {
      access: 'public',
    });

    // Get file metadata
    const size = file.size;
    const format = finalFilename.split('.').pop()?.toLowerCase() || 'unknown';
    
    // Get dimensions for images
    let width = 0, height = 0;
    if (file.type.startsWith('image/')) {
      const dims = await getImageDimensions(file);
      width = dims.width;
      height = dims.height;
    }

    // Generate metadata
    const finalTitle = title || seoFilename;
    const finalAltText = generateSeoAltText(finalFilename, category, altText);
    const finalSeoName = seoName || seoFilename.replace(/\.[^/.]+$/, '');

    // Save to database
    const client = await getDbClient();
    
    const result = await client.query(`
      INSERT INTO images (
        url, title, size, width, height, folder, format, seo_name, "alt-tag", uploaded_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING id
    `, [
      blob.url,
      finalTitle,
      size,
      width,
      height,
      folder,
      format,
      finalSeoName,
      finalAltText
    ]);

    await client.end();
    
    console.log(`✅ Media uploaded successfully: ${blob.url} (DB ID: ${result.rows[0].id})`);
    
    return {
      url: blob.url,
      databaseId: result.rows[0].id
    };

  } catch (error) {
    console.error('❌ Error uploading media with metadata:', error);
    throw error;
  }
}

/**
 * Delete media file from both blob storage and database
 * This is the STANDARD way to delete any media file
 */
export async function deleteMediaWithMetadata(imageId: number): Promise<void> {
  try {
    const client = await getDbClient();
    
    // Get the image URL from database
    const result = await client.query(
      'SELECT url FROM images WHERE id = $1',
      [imageId]
    );
    
    if (result.rows.length === 0) {
      throw new Error(`Image with ID ${imageId} not found in database`);
    }
    
    const imageUrl = result.rows[0].url;
    
    // Delete from blob storage
    try {
      await del(imageUrl);
      console.log(`✅ Deleted from blob storage: ${imageUrl}`);
    } catch (blobError) {
      console.warn(`⚠️ Failed to delete from blob storage: ${imageUrl}`, blobError);
    }
    
    // Delete from database
    await client.query('DELETE FROM images WHERE id = $1', [imageId]);
    
    await client.end();
    
    console.log(`✅ Media deleted successfully: ${imageUrl} (DB ID: ${imageId})`);
    
  } catch (error) {
    console.error('❌ Error deleting media with metadata:', error);
    throw error;
  }
}

/**
 * Move/rename media file in blob storage and update database
 * This is the STANDARD way to move any media file
 */
export async function moveMediaWithMetadata(
  imageId: number,
  newFolder: string,
  newFilename?: string
): Promise<{ url: string }> {
  try {
    const client = await getDbClient();
    
    // Get current image data
    const result = await client.query(
      'SELECT url, title, size, width, height, format, seo_name, "alt-tag" FROM images WHERE id = $1',
      [imageId]
    );
    
    if (result.rows.length === 0) {
      throw new Error(`Image with ID ${imageId} not found in database`);
    }
    
    const currentImage = result.rows[0];
    const currentUrl = currentImage.url;
    
    // Generate new filename
    const currentFilename = currentUrl.split('/').pop() || 'unknown';
    const finalNewFilename = newFilename || currentFilename;
    const seoFilename = generateSeoFilename(finalNewFilename, 'fais');
    
    // Download current file
    const response = await fetch(currentUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch current image: ${response.statusText}`);
    }
    const blob = await response.blob();
    
    // Upload to new location
    const newBlobPath = `images/${newFolder}/${seoFilename}`;
    const newBlob = await put(newBlobPath, blob, {
      access: 'public',
    });
    
    // Update database
    const newSeoName = seoFilename.replace(/\.[^/.]+$/, '');
    await client.query(`
      UPDATE images 
      SET url = $1, folder = $2, seo_name = $3, title = $4
      WHERE id = $5
    `, [
      newBlob.url,
      newFolder,
      newSeoName,
      seoFilename,
      imageId
    ]);
    
    // Delete old file
    try {
      await del(currentUrl);
      console.log(`✅ Deleted old file: ${currentUrl}`);
    } catch (deleteError) {
      console.warn(`⚠️ Failed to delete old file: ${currentUrl}`, deleteError);
    }
    
    await client.end();
    
    console.log(`✅ Media moved successfully: ${currentUrl} -> ${newBlob.url}`);
    
    return { url: newBlob.url };
    
  } catch (error) {
    console.error('❌ Error moving media with metadata:', error);
    throw error;
  }
}

/**
 * Update media metadata in database
 * This is the STANDARD way to update media metadata
 */
export async function updateMediaMetadata(
  imageId: number,
  updates: {
    title?: string;
    altText?: string;
    seoName?: string;
    folder?: string;
  }
): Promise<void> {
  try {
    const client = await getDbClient();
    
    const setParts: string[] = [];
    const values: (string | number)[] = [];
    let paramIndex = 1;
    
    if (updates.title !== undefined) {
      setParts.push(`title = $${paramIndex++}`);
      values.push(updates.title);
    }
    
    if (updates.altText !== undefined) {
      setParts.push(`"alt-tag" = $${paramIndex++}`);
      values.push(updates.altText);
    }
    
    if (updates.seoName !== undefined) {
      setParts.push(`seo_name = $${paramIndex++}`);
      values.push(updates.seoName);
    }
    
    if (updates.folder !== undefined) {
      setParts.push(`folder = $${paramIndex++}`);
      values.push(updates.folder);
    }
    
    if (setParts.length === 0) {
      return; // Nothing to update
    }
    
    values.push(imageId);
    
    await client.query(
      `UPDATE images SET ${setParts.join(', ')} WHERE id = $${paramIndex}`,
      values
    );
    
    await client.end();
    
    console.log(`✅ Media metadata updated successfully (DB ID: ${imageId})`);
    
  } catch (error) {
    console.error('❌ Error updating media metadata:', error);
    throw error;
  }
}

/**
 * Sync database with blob storage
 * This checks for inconsistencies and fixes them
 */
export async function syncDatabaseWithBlobStorage(): Promise<{
  missingInDb: string[];
  missingInBlob: number[];
  fixed: boolean;
}> {
  try {
    const client = await getDbClient();
    
    // Get all images from database
    const dbResult = await client.query('SELECT id, url FROM images');
    const dbImages = new Map(dbResult.rows.map(row => [row.url, row.id]));
    
    // Get all blobs from storage
    const { blobs } = await list({ prefix: 'images/' });
    const blobUrls = new Set(blobs.map(blob => blob.url));
    
    // Find missing in database
    const missingInDb = Array.from(blobUrls).filter(url => !dbImages.has(url));
    
    // Find missing in blob storage
    const missingInBlob: number[] = [];
    for (const [url, id] of dbImages) {
      if (!blobUrls.has(url)) {
        missingInBlob.push(id);
      }
    }
    
    console.log(`🔍 Sync Results: ${missingInDb.length} missing in DB, ${missingInBlob.length} missing in blob`);
    
    await client.end();
    
    return {
      missingInDb,
      missingInBlob,
      fixed: missingInDb.length === 0 && missingInBlob.length === 0
    };
    
  } catch (error) {
    console.error('❌ Error syncing database with blob storage:', error);
    throw error;
  }
}

/**
 * Get all media files with metadata
 * This is the STANDARD way to list media files
 */
export async function getAllMediaWithMetadata(folder?: string): Promise<Array<{
  id: number;
  url: string;
  title: string;
  size: number;
  width: number;
  height: number;
  folder: string;
  format: string;
  seoName: string;
  altTag: string;
  uploadedAt: Date;
}>> {
  try {
    const client = await getDbClient();
    
    let query = `
      SELECT 
        id, url, title, size, width, height, folder, format, 
        seo_name as "seoName", "alt-tag" as "altTag", uploaded_at as "uploadedAt"
      FROM images
    `;
    
    const params: string[] = [];
    
    if (folder) {
      query += ' WHERE folder = $1';
      params.push(folder);
    }
    
    query += ' ORDER BY uploaded_at DESC';
    
    const result = await client.query(query, params);
    await client.end();
    
    return result.rows;
    
  } catch (error) {
    console.error('❌ Error getting media with metadata:', error);
    throw error;
  }
}
