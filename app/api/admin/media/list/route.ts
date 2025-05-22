import { NextResponse } from 'next/server';
import { Client } from '@neondatabase/serverless';

export async function GET() {
  const client = new Client(process.env.DATABASE_URL);
  await client.connect();

  // Fetch only image records from carousel_media
  const { rows } = await client.query(`
    SELECT 
      id,
      url,
      original_slide_name      AS name,
      media_type              AS type,
      uploaded_at             AS createdAt,
      width,
      height
    FROM carousel_media
    WHERE media_type = 'image'
    ORDER BY uploaded_at DESC
  `);

  await client.end();

  return NextResponse.json({ items: rows });
}
