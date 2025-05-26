// app/api/admin/carousel/check-data/route.ts
import { NextResponse } from 'next/server';
import { Client } from '@neondatabase/serverless';
import { checkAdminAuth } from "@/utils/auth-compat";

/**
 * API route to check the database structure and data for carousel debugging
 * Returns detailed information about the carousel_media table and data
 */
export async function GET(request: Request) {
  const { isAuthenticated } = await checkAdminAuth(request);
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const debugInfo = {
    timestamp: new Date().toISOString(),
    databaseConnection: {
      status: 'unknown',
      error: null
    },
    tableInfo: {
      exists: false,
      columns: [],
      error: null
    },
    requiredSlides: [
      'advanced-ai-&-blockchain-solutions',
      'shaping-state-of-the-art-technologies', 
      'driving-innovation-in-technology'
    ],
    slidesFound: [],
    totalSlides: 0
  };
  
  let client = null;
  
  try {
    // Test database connection
    client = new Client({ 
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 10000 // 10 second timeout
    });
    await client.connect();
    debugInfo.databaseConnection.status = 'connected';
    
    // Check if carousel_media table exists
    try {
      const tableCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'carousel_media'
        );
      `);
      
      debugInfo.tableInfo.exists = tableCheck.rows[0].exists;
      
      if (debugInfo.tableInfo.exists) {
        // Get column information
        const columnsResult = await client.query(`
          SELECT column_name, data_type
          FROM information_schema.columns 
          WHERE table_name = 'carousel_media'
          ORDER BY ordinal_position;
        `);
        
        debugInfo.tableInfo.columns = columnsResult.rows;
        
        // Get count of slides
        const countResult = await client.query(`
          SELECT COUNT(*) as total FROM carousel_media;
        `);
        
        debugInfo.totalSlides = parseInt(countResult.rows[0].total);
        
        // Check if required slides exist
        const requiredSlidesQuery = `
          SELECT id, url, media_type, original_slide_name, title, subtitle 
          FROM carousel_media 
          WHERE id IN ($1, $2, $3)
          OR original_slide_name ILIKE ANY(ARRAY[
            '%Advanced AI & Blockchain Solutions%',
            '%Shaping State-of-the-Art Technologies%',
            '%Driving Innovation in Technology%'
          ]);
        `;
        
        const slidesResult = await client.query(requiredSlidesQuery, 
          debugInfo.requiredSlides.map(key => key.toLowerCase())
        );
        
        debugInfo.slidesFound = slidesResult.rows;
      }
    } catch (tableError) {
      debugInfo.tableInfo.error = tableError instanceof Error ? 
        tableError.message : String(tableError);
    }
    
    return NextResponse.json(debugInfo);
  } catch (error) {
    console.error('Error in carousel check-data:', error);
    return NextResponse.json({ 
      error: 'Database connection failed', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  } finally {
    // Ensure the client connection is closed properly
    if (client) {
      try {
        await client.end();
      } catch (closeError) {
        console.error('Error closing database connection:', closeError);
      }
    }
  }
}
