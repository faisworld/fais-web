// app/api/admin/gallery/set-as-carousel-slide/route.ts
import { NextResponse } from 'next/server';
import { checkAdminAuth } from "@/utils/auth-compat";
import { Client } from '@neondatabase/serverless';

/**
 * API route to set a gallery image as a carousel slide
 */
export async function POST(request: Request) {
  const { isAuthenticated } = await checkAdminAuth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { mediaId, slideKey } = body;
    
    if (!mediaId) {
      return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
    }

    if (!slideKey) {
      return NextResponse.json({ error: 'Slide key is required' }, { status: 400 });
    }
    
    // Check which slide is being set
    const validSlideKeys = [
      'advanced-ai-&-blockchain-solutions',
      'shaping-state-of-the-art-technologies',
      'driving-innovation-in-technology'
    ];
    
    if (!validSlideKeys.includes(slideKey)) {
      return NextResponse.json({ 
        error: `Invalid slide key. Valid values are: ${validSlideKeys.join(', ')}` 
      }, { status: 400 });
    }
    
    // Connect to database
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 10000
    });
    
    await client.connect();
    
    try {
      // First, get the media item details from the images table
      const mediaQuery = `
        SELECT url, title, alt_tag, width, height
        FROM images
        WHERE id = $1
      `;
      
      const mediaResult = await client.query(mediaQuery, [mediaId]);
      
      if (mediaResult.rows.length === 0) {
        return NextResponse.json({ error: 'Media not found' }, { status: 404 });
      }
      
      const media = mediaResult.rows[0];
      
      // Determine if it's a video or image based on file extension
      const isVideo = media.url.match(/\.(mp4|webm|mov|avi)$/i) !== null;
      const mediaType = isVideo ? 'video' : 'image';
      
      // Set slide-specific metadata
      let title, subtitle, buttonText, buttonLink, alt;
      
      switch(slideKey) {
        case 'advanced-ai-&-blockchain-solutions':
          title = 'Advanced AI & Blockchain Solutions';
          subtitle = 'Pioneering digital transformation with elegant, powerful solutions that drive business innovation and growth';
          buttonText = 'Explore Services';
          buttonLink = '/services';
          alt = media.alt_tag || 'AI and Blockchain Solutions';
          break;
        case 'shaping-state-of-the-art-technologies':
          title = 'Shaping State-of-the-Art Technologies';
          subtitle = 'Fantastic AI Studio merges cutting-edge design with robust technological frameworks to revolutionize your digital experiences';
          buttonText = 'Our Projects';
          buttonLink = '/projects';
          alt = media.alt_tag || 'State-of-the-Art Technologies';
          break;
        case 'driving-innovation-in-technology':
          title = 'Driving Innovation in Technology';
          subtitle = 'An effective way to empower your business with innovative solutions that optimize processes and secure transactions';
          buttonText = 'Get Started';
          buttonLink = '/contact';
          alt = media.alt_tag || 'Innovation in Technology';
          break;
      }
      
      // Check if record exists for this slide key
      const checkQuery = `
        SELECT id FROM carousel_media WHERE key = $1
      `;
      const checkResult = await client.query(checkQuery, [slideKey]);
      
      if (checkResult.rows.length > 0) {
        // Update existing slide
        const updateQuery = `
          UPDATE carousel_media 
          SET 
            url = $1, 
            media_type = $2, 
            title = $3, 
            subtitle = $4, 
            button_text = $5, 
            button_link = $6, 
            alt_tag = $7,
            original_slide_name = $8,
            width = $9,
            height = $10
          WHERE key = $11
          RETURNING id;
        `;
        
        const updateResult = await client.query(updateQuery, [
          media.url,
          mediaType,
          title,
          subtitle,
          buttonText,
          buttonLink,
          alt,
          title,
          media.width,
          media.height,
          slideKey
        ]);
        
        return NextResponse.json({
          success: true,
          message: `Updated carousel slide "${slideKey}"`,
          id: updateResult.rows[0].id
        });
      } else {
        // Create new slide
        const insertQuery = `
          INSERT INTO carousel_media (
            key, url, media_type, title, subtitle, button_text, button_link, alt_tag, original_slide_name, width, height
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
          ) RETURNING id;
        `;
        
        const insertResult = await client.query(insertQuery, [
          slideKey,
          media.url,
          mediaType,
          title,
          subtitle,
          buttonText,
          buttonLink,
          alt,
          title,
          media.width,
          media.height
        ]);
        
        return NextResponse.json({
          success: true,
          message: `Created carousel slide "${slideKey}"`,
          id: insertResult.rows[0].id
        });
      }
    } finally {
      await client.end();
    }
  } catch (error) {
    console.error('Error setting carousel slide:', error);
    return NextResponse.json({ 
      error: 'Failed to set carousel slide', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
