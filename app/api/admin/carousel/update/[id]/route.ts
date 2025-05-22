// app/api/admin/carousel/update/[id]/route.ts
import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/utils/admin-auth';
import { Client } from '@neondatabase/serverless';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { isAuthenticated } = await checkAdminAuth(request);
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: 'Media ID required' }, { status: 400 });
  }
  
  // Log the ID for debugging
  console.log(`Processing update request for carousel media ID: ${id}`);
  
  // Check if ID is a key (string) or numeric ID
  const isNumericId = /^\d+$/.test(id);
  
  let client = null;
  
  try {
    // Create a new client with a timeout
    client = new Client({ 
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 10000 // 10 second timeout
    });
    await client.connect();
    
    const requestData = await request.json();
    const { title, subtitle, buttonText, buttonLink, alt, url } = requestData;
    
    // Log the update attempt for debugging
    console.log('Updating carousel media with ID:', id);
    console.log('Update data:', JSON.stringify(requestData, null, 2));
    
    // Check if the media item exists - handle both numeric IDs and string keys
    let checkQuery;
    let checkResult;
    
    if (isNumericId) {
      checkQuery = 'SELECT id FROM carousel_media WHERE id = $1';
      checkResult = await client.query(checkQuery, [id]);
    } else {
      // If not numeric, treat as a key
      checkQuery = 'SELECT id FROM carousel_media WHERE key = $1';
      checkResult = await client.query(checkQuery, [id]);
    }
    
    if (checkResult.rows.length === 0) {
      return NextResponse.json({ 
        error: `Media not found with identifier: ${id}`,
        isNumeric: isNumericId
      }, { status: 404 });
    }
    
    // Use the actual numeric ID for the update
    const actualId = checkResult.rows[0].id;
    
    // Query to update only the fields that are provided
    let query = 'UPDATE carousel_media SET ';
    const queryParams = [];
    const updateFields = [];
    
    if (title !== undefined) {
      queryParams.push(title);
      updateFields.push(`title = $${queryParams.length}`);
    }
    
    if (subtitle !== undefined) {
      queryParams.push(subtitle);
      updateFields.push(`subtitle = $${queryParams.length}`);
    }
    
    if (buttonText !== undefined) {
      queryParams.push(buttonText);
      updateFields.push(`button_text = $${queryParams.length}`);
    }
    
    if (buttonLink !== undefined) {
      queryParams.push(buttonLink);
      updateFields.push(`button_link = $${queryParams.length}`);
    }
    
    if (alt !== undefined) {
      queryParams.push(alt);
      updateFields.push(`alt_tag = $${queryParams.length}`);
    }
    
    if (url !== undefined) {
      queryParams.push(url);
      updateFields.push(`url = $${queryParams.length}`);
    }
    
    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }
    
    query += updateFields.join(', ');
    queryParams.push(actualId); // Use the resolved numeric ID
    query += ` WHERE id = $${queryParams.length} RETURNING *`;
    
    try {
      console.log('Executing carousel update query:', query);
      console.log('With parameters:', queryParams);
      
      const { rows } = await client.query(query, queryParams);
      
      if (rows.length === 0) {
        console.error(`Update failed for ID ${id}, no rows affected`);
        return NextResponse.json({ 
          error: 'Update failed, no rows affected',
          id: id,
          providedFields: Object.keys(requestData)
        }, { status: 500 });
      }
      
      console.log(`Successfully updated carousel media with ID: ${id}`);
      return NextResponse.json(rows[0]);
    } catch (dbError) {
      console.error(`Database query error for ID ${id}:`, dbError);
      return NextResponse.json({ 
        error: 'Database query failed', 
        details: dbError instanceof Error ? dbError.message : String(dbError),
        id: id,
        providedFields: Object.keys(requestData)
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating carousel media:', error);
    return NextResponse.json({ 
      error: 'Update failed', 
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
