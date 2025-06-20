import { NextResponse } from 'next/server';
import { checkAdminAuth } from "@/utils/auth-compat";
import { list } from '@vercel/blob';
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

export async function POST(request: Request) {
  try {
    // Verify admin authentication
    const authResult = await checkAdminAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'fix-all-inconsistencies') {
      console.log('🔧 Starting comprehensive consistency fix...');
      
      const client = await getDbClient();
      
      // Step 1: Get all images from database
      const dbResult = await client.query('SELECT id, url, title FROM images ORDER BY id');
      const dbImages = new Map(dbResult.rows.map(row => [row.url, { id: row.id, title: row.title }]));
      
      console.log(`📊 Found ${dbImages.size} images in database`);
      
      // Step 2: Get all blobs from storage
      const { blobs } = await list({ prefix: 'images/' });
      const blobUrls = new Set(blobs.map(blob => blob.url));
      
      console.log(`📊 Found ${blobUrls.size} blobs in storage`);
      
      // Step 3: Find inconsistencies
      const missingInDb = Array.from(blobUrls).filter(url => !dbImages.has(url));
      const missingInBlob: Array<{ id: number; url: string; title: string }> = [];
      
      for (const [url, data] of dbImages) {
        if (!blobUrls.has(url)) {
          missingInBlob.push({ id: data.id, url, title: data.title });
        }
      }
      
      console.log(`🔍 Found ${missingInDb.length} files missing in database`);
      console.log(`🔍 Found ${missingInBlob.length} files missing in blob storage`);
      
      let fixedCount = 0;
      
      // Step 4: Add missing files to database
      for (const blobUrl of missingInDb) {
        try {
          // Extract filename and metadata from URL
          const urlParts = blobUrl.split('/');
          const filename = urlParts[urlParts.length - 1];
          const folderPath = urlParts.slice(-2, -1)[0] || 'general';
          
          // Generate SEO-friendly metadata
          const title = filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          const seoName = `fais-${filename.replace(/\.[^/.]+$/, '').toLowerCase()}`;
          const altTag = `${title} | Fantastic AI Studio`;
          const format = filename.split('.').pop()?.toLowerCase() || 'unknown';
          
          // Try to get file size from blob
          let size = 0;
          try {
            const response = await fetch(blobUrl, { method: 'HEAD' });
            const contentLength = response.headers.get('content-length');
            if (contentLength) {
              size = parseInt(contentLength, 10);
            }          } catch {
            console.warn(`Could not get size for ${blobUrl}`);
          }
          
          await client.query(`
            INSERT INTO images (
              url, title, "alt-tag", seo_name, width, height, format, size, folder, uploaded_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
          `, [
            blobUrl,
            title,
            altTag,
            seoName,
            1024, // Default width
            1024, // Default height
            format,
            size,
            folderPath
          ]);
          
          fixedCount++;
          console.log(`✅ Added to database: ${filename}`);
          
        } catch (error) {
          console.error(`❌ Failed to add ${blobUrl} to database:`, error);
        }
      }
      
      // Step 5: Remove broken database entries
      for (const brokenEntry of missingInBlob) {
        try {
          await client.query('DELETE FROM images WHERE id = $1', [brokenEntry.id]);
          fixedCount++;
          console.log(`✅ Removed broken entry: ${brokenEntry.title} (ID: ${brokenEntry.id})`);
        } catch (error) {
          console.error(`❌ Failed to remove broken entry ${brokenEntry.id}:`, error);
        }
      }
      
      await client.end();
      
      console.log(`🎉 Fixed ${fixedCount} inconsistencies`);
      
      return NextResponse.json({
        success: true,
        message: `Fixed ${fixedCount} inconsistencies`,
        details: {
          addedToDatabase: missingInDb.length,
          removedFromDatabase: missingInBlob.length,
          totalFixed: fixedCount
        }
      });
      
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
  } catch (error) {
    console.error('❌ Error fixing inconsistencies:', error);
    return NextResponse.json({ 
      error: 'Failed to fix inconsistencies',
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
