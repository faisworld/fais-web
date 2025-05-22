// app/api/admin/gallery/debug/route.ts
import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/utils/admin-auth';
import { Client } from '@neondatabase/serverless';

/**
 * API route to test database connection and queries for the gallery images
 */
export async function GET(request: Request) {
  const { isAuthenticated } = await checkAdminAuth(request);
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get('limit')) || 10;
  
  let client = null;
  
  try {
    // Create a new client with a timeout
    client = new Client({ 
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 15000 // 15 second timeout
    });
    await client.connect();
    
    // Check if images table exists
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'images'
      );
    `);
    
    const imagesTableExists = tableExists.rows[0].exists;
    
    if (!imagesTableExists) {
      return NextResponse.json({ 
        error: 'Images table does not exist in the database',
        tableExists: false
      }, { status: 404 });
    }
    
    // Get table structure
    const tableInfoQuery = `
      SELECT 
        column_name, 
        data_type,
        character_maximum_length,
        column_default,
        is_nullable
      FROM 
        information_schema.columns 
      WHERE 
        table_name = 'images'
      ORDER BY
        ordinal_position;
    `;
    
    const tableInfo = await client.query(tableInfoQuery);
    
    // Check which columns exist in the table
    const columnsResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'images'
    `);

    const existingColumns = columnsResult.rows.map((row) => row.column_name);
    
    // Build a query that only includes columns that exist
    const baseColumns = ["id", "url", "title", "uploaded_at"];

    // Check for either alt_tag or alt-tag
    const hasAltTag = existingColumns.includes("alt-tag");
    const hasAltTagUnderscore = existingColumns.includes("alt_tag");

    // Other optional columns
    const optionalColumns = ["size", "width", "height", "folder", "format", "description"];
    const existingOptionalColumns = optionalColumns.filter((col) => existingColumns.includes(col));

    // Construct the SELECT part of the query
    let selectParts = [...baseColumns];

    // Add optional columns
    if (existingOptionalColumns.length > 0) {
      selectParts = [...selectParts, ...existingOptionalColumns];
    }

    // Handle alt-tag specially due to the hyphen
    if (hasAltTag) {
      selectParts.push(`"alt-tag"`);
      selectParts.push(`"alt-tag" as "altTag"`);
    } else if (hasAltTagUnderscore) {
      selectParts.push(`alt_tag`);
      selectParts.push(`alt_tag as "altTag"`);
    }
    
    const selectClause = selectParts.join(", ");
    
    // Get most recent images
    const recentImagesQuery = `
      SELECT ${selectClause}
      FROM images 
      ORDER BY uploaded_at DESC
      LIMIT ${limit};
    `;
    
    const recentImages = await client.query(recentImagesQuery);
    
    // Count total records
    const countQuery = `SELECT COUNT(*) as total FROM images;`;
    const countResult = await client.query(countQuery);
    
    // Check for specific file URLs
    const searchResults = await client.query(`
      SELECT id, url, title, uploaded_at 
      FROM images 
      WHERE url ILIKE '%shaping%' 
      OR url ILIKE '%innovation%'
      OR url ILIKE '%blockchain%'
      OR title ILIKE '%shaping%' 
      OR title ILIKE '%innovation%'
      OR title ILIKE '%blockchain%'
      LIMIT 10;
    `);
    
    return NextResponse.json({
      status: 'success',
      tableExists: true,
      tableSchema: tableInfo.rows,
      existingColumns,
      totalImages: parseInt(countResult.rows[0].total),
      recentImages: recentImages.rows,
      searchResults: searchResults.rows
    });
    
  } catch (error) {
    console.error('Error in gallery debug endpoint:', error);
    
    return NextResponse.json({ 
      status: 'error',
      message: 'Database connection or query failed',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  } finally {
    if (client) {
      try {
        await client.end();
      } catch (closeError) {
        console.error('Error closing database connection:', closeError);
      }
    }
  }
}
