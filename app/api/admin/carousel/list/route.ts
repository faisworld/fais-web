import { NextResponse } from 'next/server';
import { Client } from '@neondatabase/serverless';

export async function GET() {
  try {
    const client = new Client({ 
      connectionString: process.env.DATABASE_URL 
    });
    
    await client.connect();
    
    const { rows } = await client.query(`
      SELECT 
        id as key,
        url,
        media_type as "mediaType",
        original_slide_name as "originalSlideName",
        title,
        subtitle,
        button_text as "buttonText",
        button_link as "buttonLink",
        alt_tag as alt,
        uploaded_at
      FROM carousel_media
      ORDER BY uploaded_at DESC
    `);
    
    await client.end();
    
    return NextResponse.json(rows);
  } catch (error: unknown) {
    console.error("Error listing carousel media:", 
      error instanceof Error ? error.message : String(error)
    );
    
    // Return empty array instead of error
    return NextResponse.json([]);
  }
}
