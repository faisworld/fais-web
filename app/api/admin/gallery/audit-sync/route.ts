import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';
import { Client } from '@neondatabase/serverless';

export async function GET() {
  try {
    console.log('🔍 Starting comprehensive blob storage vs database audit...\n');

    // Step 1: Get all blobs from Vercel storage
    console.log('📁 Fetching all blobs from Vercel storage...');
    let blobs = [];
    try {
      const result = await list();
      blobs = result.blobs;
      console.log(`✅ Found ${blobs.length} blobs in storage`);    } catch (error) {
      console.error('❌ Error fetching blobs:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch blobs', 
        details: error instanceof Error ? error.message : String(error) 
      }, { status: 500 });
    }

    // Step 2: Get all images from database
    console.log('🗄️ Fetching all images from Neon database...');
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });

    let dbImages = [];
    try {
      await client.connect();
      const result = await client.query('SELECT id, url, title, "alt-tag", seo_name FROM images ORDER BY id');
      dbImages = result.rows;
      console.log(`✅ Found ${dbImages.length} images in database`);    } catch (error) {
      console.error('❌ Error fetching database images:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch database images', 
        details: error instanceof Error ? error.message : String(error) 
      }, { status: 500 });
    } finally {
      await client.end();
    }

    // Step 3: Find blobs not in database
    console.log('🔎 Finding blobs that exist in storage but NOT in database...');
    const blobUrls = new Set(blobs.map(b => b.url));
    const dbUrls = new Set(dbImages.map(img => img.url));
    
    const missingInDb = blobs.filter(blob => !dbUrls.has(blob.url));
    
    // Step 4: Find database entries not in blob storage
    console.log('🔎 Finding database entries that exist but NOT in blob storage...');
    const missingInStorage = dbImages.filter(img => !blobUrls.has(img.url));
    
    // Step 5: Check for the specific image from screenshot
    console.log('🎯 Looking for specific image from screenshot (5eed24c6-545c-46ec-bd6a-d6ab9a329a87)...');
    const targetImage = blobs.find(b => b.url.includes('5eed24c6-545c-46ec-bd6a-d6ab9a329a87'));

    // Return comprehensive results
    return NextResponse.json({
      summary: {
        totalBlobs: blobs.length,
        totalDbImages: dbImages.length,
        missingInDbCount: missingInDb.length,
        missingInStorageCount: missingInStorage.length,
        syncStatus: (missingInDb.length === 0 && missingInStorage.length === 0) ? 'SYNCED' : 'OUT_OF_SYNC'
      },
      missingInDatabase: missingInDb.map(blob => ({
        pathname: blob.pathname,
        url: blob.url,
        size: blob.size,
        uploadedAt: blob.uploadedAt
      })),
      missingInStorage: missingInStorage.map(img => ({
        id: img.id,
        title: img.title,
        url: img.url,
        seo_name: img.seo_name
      })),
      targetImageFromScreenshot: targetImage ? {
        pathname: targetImage.pathname,
        url: targetImage.url,
        size: targetImage.size,
        uploadedAt: targetImage.uploadedAt
      } : null
    });
  } catch (error) {
    console.error('Audit error:', error);
    return NextResponse.json({ 
      error: 'Audit failed', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
