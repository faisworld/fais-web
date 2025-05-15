import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/utils/admin-auth';
import { Client } from '@neondatabase/serverless';

// Save carousel metadata and update links to Blobstore media
export async function POST(request: Request) {
  try {
    const authResult = await checkAdminAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { updatedMedia } = body; // Expect array of { key, url, keywords, link }

    if (!Array.isArray(updatedMedia)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const client = new Client(process.env.DATABASE_URL);
    await client.connect();

    // For each updated media, insert or update record in DB
    for (const media of updatedMedia) {
      const { key, url, keywords, link } = media;

      // Upsert logic: update if exists, else insert
      await client.query(`
        INSERT INTO carousel_media (key, url, keywords, link, updated_at)
        VALUES ($1, $2, $3, $4, NOW())
        ON CONFLICT (key) DO UPDATE SET
          url = EXCLUDED.url,
          keywords = EXCLUDED.keywords,
          link = EXCLUDED.link,
          updated_at = NOW()
      `, [key, url, keywords, link]);
    }

    await client.end();

    return NextResponse.json({ success: true, message: 'Carousel updated successfully' });
  } catch (error) {
    console.error('Error saving carousel metadata:', error);
    return NextResponse.json({ error: 'Failed to save carousel metadata' }, { status: 500 });
  }
}
