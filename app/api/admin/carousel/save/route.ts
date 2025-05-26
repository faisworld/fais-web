import { NextResponse } from 'next/server';
import { checkAdminAuth } from "@/utils/auth-compat";
import { Client } from '@neondatabase/serverless';

// Save carousel metadata and update links to Blobstore media
export async function POST(request: Request) {
  try {
    const authResult = await checkAdminAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    // Expect array of { key, url, keywords, link, mediaType, originalSlideName }
    const { updatedMedia } = body;

    if (!Array.isArray(updatedMedia)) {
      return NextResponse.json({ error: 'Invalid payload: updatedMedia should be an array' }, { status: 400 });
    }

    const client = new Client(process.env.DATABASE_URL);
    await client.connect();

    // For each updated media, insert or update record in DB
    for (const media of updatedMedia) {
      const { key, url, mediaType, originalSlideName } = media;
      const keywords = media.keywords || '';
      const link = media.link || '';

      // Validate essential fields for each media item
      if (!key || !url || !mediaType || !originalSlideName) {
        console.warn('Skipping media item due to missing fields:', media);
        continue; // Skip this item and proceed with the next
      }

      // Upsert logic: update if exists, else insert
      await client.query(`
        INSERT INTO carousel_media (key, url, keywords, link, media_type, original_slide_name, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        ON CONFLICT (key) DO UPDATE SET
          url = EXCLUDED.url,
          keywords = EXCLUDED.keywords,
          link = EXCLUDED.link,
          media_type = EXCLUDED.media_type,
          original_slide_name = EXCLUDED.original_slide_name,
          updated_at = NOW()
      `, [key, url, keywords, link, mediaType, originalSlideName]);
    }

    await client.end();

    return NextResponse.json({ success: true, message: 'Carousel updated successfully' });
  } catch (error) {
    console.error('Error saving carousel metadata:', error);
    // Check if the error is a database-related error and provide more specific feedback
    let detailMessage = 'Unknown error';
    if (error instanceof Error) {
      detailMessage = error.message;
      // Potentially check for Neon DB specific error codes or messages if available
    }
    return NextResponse.json({ 
      error: 'Failed to save carousel metadata',
      details: detailMessage
    }, { status: 500 });
  }
}
