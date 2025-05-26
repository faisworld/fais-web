import { NextResponse } from "next/server";
import { Client } from "@neondatabase/serverless";
import { checkAdminAuth } from "@/utils/auth-compat";
import { del, list } from "@vercel/blob";

// Enable CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

// OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  })
}

// GET handler to fetch a single image by ID
export async function GET(request: Request) {
  // Check admin authentication
  const authResult = await checkAdminAuth();
  if (!authResult.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }

  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400, headers: corsHeaders })
    }

    console.log(`Admin API: Fetching image with ID ${id}`)
    const client = new Client(process.env.DATABASE_URL || "")
    await client.connect()

    try {
      // Check which columns exist in the table
      const columnsResult = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'images'
      `)

      const existingColumns = columnsResult.rows.map((row) => row.column_name)
      console.log("Existing columns:", existingColumns)

      // Build a query that only includes columns that exist
      const baseColumns = ["id", "url", "title", "uploaded_at"]

      // Check specifically for alt-tag with quotes since it has a hyphen
      const hasAltTag = existingColumns.includes("alt-tag")

      // Other optional columns
      const optionalColumns = ["size", "width", "height", "folder", "format", "description"]
      const existingOptionalColumns = optionalColumns.filter((col) => existingColumns.includes(col))

      // Construct the SELECT part of the query
      let selectParts = [...baseColumns]

      // Add optional columns
      if (existingOptionalColumns.length > 0) {
        selectParts = [...selectParts, ...existingOptionalColumns]
      }

      // Handle alt-tag specially due to the hyphen
      if (hasAltTag) {
        selectParts.push(`"alt-tag"`)
        selectParts.push(`"alt-tag" as "altTag"`)
      }

      const selectClause = selectParts.join(", ")

      const query = `
        SELECT ${selectClause}
        FROM images 
        WHERE id = $1
      `

      console.log("Executing query:", query)
      const result = await client.query(query, [id])

      console.log(`Admin API: Query result rows: ${result.rows.length}`)

      if (result.rows.length === 0) {
        console.log(`Admin API: No image found with ID ${id}`)
        return NextResponse.json({ error: "Image not found" }, { status: 404, headers: corsHeaders })
      }

      console.log("Image data retrieved:", result.rows[0])
      return NextResponse.json({ image: result.rows[0] }, { headers: corsHeaders })
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json(
        { error: "Database error", details: String(dbError) },
        { status: 500, headers: corsHeaders },
      )
    } finally {
      await client.end()
    }
  } catch (error) {
    console.error("Error fetching image:", error)
    return NextResponse.json(
      { error: "Failed to fetch image", details: String(error) },
      { status: 500, headers: corsHeaders },
    )
  }
}

// PATCH handler to update image metadata
export async function PATCH(request: Request) {
  // Check admin authentication
  const authResult = await checkAdminAuth();
  if (!authResult.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }

  try {
    const body = await request.json()
    const { id, title, alt, folder, description } = body

    if (!id) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400, headers: corsHeaders })
    }

    console.log(`Admin: Updating image ${id} with:`, { title, alt, folder, description })

    const client = new Client(process.env.DATABASE_URL || "")
    await client.connect()

    try {
      // Check which columns exist in the table
      const columnsResult = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'images'
      `)

      const existingColumns = columnsResult.rows.map((row) => row.column_name)
      console.log("Existing columns for update:", existingColumns)

      // Build the SET part of the update query based on existing columns
      const updateParts = []
      const values = []
      let paramIndex = 1

      // Always update title
      updateParts.push(`title = $${paramIndex++}`)
      values.push(title)

      // Only include other fields if their columns exist
      // Check specifically for alt-tag with quotes since it has a hyphen
      const hasAltTag = existingColumns.includes("alt-tag")
      if (hasAltTag) {
        updateParts.push(`"alt-tag" = $${paramIndex++}`)
        values.push(alt)
      }

      if (existingColumns.includes("folder")) {
        updateParts.push(`folder = $${paramIndex++}`)
        values.push(folder)
      }

      if (existingColumns.includes("description")) {
        updateParts.push(`description = $${paramIndex++}`)
        values.push(description || null)
      }

      // Add the ID parameter
      values.push(id)

      // Build the RETURNING part based on existing columns
      const returningParts = ["id", "url", "title"]

      if (hasAltTag) {
        returningParts.push(`"alt-tag"`)
        returningParts.push(`"alt-tag" as "altTag"`)
      }

      if (existingColumns.includes("folder")) {
        returningParts.push("folder")
      }

      if (existingColumns.includes("description")) {
        returningParts.push("description")
      }

      const returningClause = returningParts.join(", ")

      const query = `
        UPDATE images 
        SET ${updateParts.join(", ")} 
        WHERE id = $${paramIndex} 
        RETURNING ${returningClause}
      `

      console.log("Executing update query:", query)
      console.log("With values:", values)

      const result = await client.query(query, values)

      if (result.rowCount === 0) {
        return NextResponse.json({ error: "Image not found" }, { status: 404, headers: corsHeaders })
      }

      console.log("Update successful:", result.rows[0])
      return NextResponse.json(
        {
          message: "Image metadata updated successfully",
          image: result.rows[0],
        },
        { headers: corsHeaders },
      )
    } catch (dbError) {
      console.error("Database error during update:", dbError)
      return NextResponse.json(
        { error: "Database error during update", details: String(dbError) },
        { status: 500, headers: corsHeaders },
      )
    } finally {
      await client.end()
    }
  } catch (error) {
    console.error("Error updating image:", error)
    return NextResponse.json(
      { error: "Failed to update image", details: String(error) },
      { status: 500, headers: corsHeaders },
    )
  }
}

// DELETE handler to delete media (image or video)
export async function DELETE(request: Request) {
  // Check admin authentication
  const authResult = await checkAdminAuth();
  if (!authResult.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }

  try {
    // Parse the body
    let id: string | number | string[];
    let isBulk = false;
    
    try {
      const body = await request.json();
      // Check if this is a bulk delete operation
      if (body.ids && Array.isArray(body.ids)) {
        id = body.ids;
        isBulk = true;
      } else {
        id = body.id;
      }
    } catch {
      // If body parsing fails, try to get ID from URL
      const url = new URL(request.url);
      const urlId = url.searchParams.get('id');
      // Ensure we have a string, not null
      id = urlId !== null ? urlId : '';
    }

    if (!id || (Array.isArray(id) && id.length === 0)) {
      return NextResponse.json({ error: "Media ID(s) required" }, { status: 400, headers: corsHeaders })
    }

    // Handle bulk deletion
    if (isBulk) {
      return await handleBulkDelete(id as string[]);
    }
    
    // Single item deletion - existing code
    console.log(`Attempting to delete media with ID: ${id}`);

    // Variables to track deletion status
    let foundMedia = false;
    let mediaUrl: string | null = null;
    let mediaType = 'media';
    let mediaSource = '';

    // First try to find the media in the database (if ID is numeric)
    if (!isNaN(Number(id))) {
      try {
        const client = new Client(process.env.DATABASE_URL || "");
        await client.connect();
        
        const mediaResult = await client.query("SELECT url, title FROM images WHERE id = $1", [id]);
        
        if (mediaResult.rows.length > 0) {
          foundMedia = true;
          mediaUrl = mediaResult.rows[0].url;
          const mediaTitle = mediaResult.rows[0].title || 'Untitled';
          mediaType = detectMediaType(mediaUrl || '');
          mediaSource = 'database';
          
          console.log(`Found ${mediaType} in database: ${mediaTitle} (ID: ${id})`);
          
          // Delete from database
          await client.query("DELETE FROM images WHERE id = $1", [id]);
          console.log(`Deleted record from database`);
        } else {
          console.log(`ID ${id} not found in database`);
        }
        
        await client.end();
      } catch (dbError) {
        console.error("Database error:", dbError);
      }
    }

    // If not found in database or deletion failed, try Blob storage directly
    if (!foundMedia) {
      try {
        // List all blobs
        const { blobs } = await list();
        
        // Try different ways to find the blob
        const idStr = String(id);
        const blobToDelete = blobs.find(blob => 
          blob.url.includes(idStr) || 
          blob.pathname.includes(idStr) ||
          String(hashString(blob.url)) === idStr
        );
        
        if (blobToDelete) {
          foundMedia = true;
          mediaUrl = blobToDelete.url;
          mediaType = detectMediaType(blobToDelete.pathname);
          mediaSource = 'blob';
          console.log(`Found ${mediaType} in blob storage: ${blobToDelete.url}`);
        } else {
          console.log(`ID ${id} not found in blob storage`);
        }
      } catch (blobError) {
        console.error("Error checking blob storage:", blobError);
        // Add additional handling to use the variable more explicitly
        if (blobError instanceof Error) {
          console.error(`Blob storage error details: ${blobError.message}`);
        }
      }
    }

    // If we didn't find the media anywhere
    if (!foundMedia) {
      console.error(`Media with ID ${id} not found in database or blob storage`);
      return NextResponse.json({ 
        error: "Media not found", 
        details: `Media with ID ${id} not found in database or blob storage`
      }, { status: 404, headers: corsHeaders });
    }

    // If we have a URL, try to delete from blob storage
    let blobDeleted = false;
    if (mediaUrl) {
      try {
        await del(mediaUrl);
        blobDeleted = true;
        console.log(`Deleted ${mediaType} from blob storage: ${mediaUrl}`);
      } catch (deleteError) {
        console.error(`Error deleting from blob storage:`, deleteError);
        
        // If we successfully deleted from database but failed blob deletion,
        // still return a partial success
        if (mediaSource === 'database') {
          return NextResponse.json({ 
            message: `${mediaType} record deleted from database, but could not delete file from storage`,
            partial: true
          }, { headers: corsHeaders });
        }
      }
    }

    // Success response
    return NextResponse.json({ 
      message: `${mediaType} deleted successfully`,
      mediaType,
      blobDeleted,
      source: mediaSource
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error processing delete request:", error);
    return NextResponse.json(
      { error: "Failed to delete media", details: String(error) },
      { status: 500, headers: corsHeaders },
    );
  }
  
  // Helper function for bulk deletion
  async function handleBulkDelete(ids: string[]) {
    console.log(`Bulk delete request for ${ids.length} items`);
    
    const results = {
      success: [] as string[],
      failed: [] as string[],
      totalCount: ids.length,
      successCount: 0,
      failCount: 0,
      details: [] as Array<{ id: string, success: boolean, error?: string, mediaType?: string }>
    };

    // Database batch deletion
    if (ids.some(id => !isNaN(Number(id)))) {
      const dbIds = ids.filter(id => !isNaN(Number(id)));
      try {
        const client = new Client(process.env.DATABASE_URL || "");
        await client.connect();
        
        // First get the URLs of the items to delete
        const placeholders = dbIds.map((_, i) => `$${i + 1}`).join(',');
        const mediaResult = await client.query(
          `SELECT id, url, title FROM images WHERE id IN (${placeholders})`, 
          dbIds
        );
        
        // Map of ID to URL for blob deletion
        const idToUrl = new Map<string, string>();
        for (const row of mediaResult.rows) {
          idToUrl.set(row.id.toString(), row.url);
        }
        
        // Delete from database
        if (mediaResult.rows.length > 0) {
          const deleteResult = await client.query(
            `DELETE FROM images WHERE id IN (${placeholders}) RETURNING id`, 
            dbIds
          );
          
          console.log(`Deleted ${deleteResult.rowCount} records from database`);
          
          // Track successful database deletions
          for (const row of deleteResult.rows) {
            const id = row.id.toString();
            results.success.push(id);
            results.successCount++;
            results.details.push({ 
              id, 
              success: true, 
              mediaType: detectMediaType(idToUrl.get(id) || '')
            });
            
            // Try to delete from blob storage
            if (idToUrl.has(id)) {
              try {
                await del(idToUrl.get(id) || '');
              } catch (blobError) {
                console.warn(`Failed to delete blob for ID ${id}, but database record was removed: ${blobError instanceof Error ? blobError.message : String(blobError)}`);
              }
            }
          }
        }
        
        await client.end();
      } catch (dbError) {
        console.error("Database error during bulk delete:", dbError);
      }
    }
    
    // Handle any remaining IDs or blob-only IDs
    const remainingIds = ids.filter(id => !results.success.includes(id) && !results.failed.includes(id));
    if (remainingIds.length > 0) {
      const { blobs } = await list();
      
      for (const id of remainingIds) {
        const idStr = String(id);
        const blobToDelete = blobs.find(blob => 
          blob.url.includes(idStr) || 
          blob.pathname.includes(idStr) ||
          String(hashString(blob.url)) === idStr
        );
        
        if (blobToDelete) {
          try {
            await del(blobToDelete.url);
            results.success.push(id);
            results.successCount++;
            results.details.push({ 
              id, 
              success: true, 
              mediaType: detectMediaType(blobToDelete.pathname)
            });
          } catch (deleteError) {
            console.error(`Failed to delete blob for ID ${id}: ${deleteError instanceof Error ? deleteError.message : String(deleteError)}`);
            results.failed.push(id);
            results.failCount++;
            results.details.push({ 
              id, 
              success: false, 
              error: "Failed to delete from blob storage",
              mediaType: detectMediaType(blobToDelete.pathname)
            });
          }
        } else {
          results.failed.push(id);
          results.failCount++;
          results.details.push({ 
            id, 
            success: false, 
            error: "Media not found in storage"
          });
        }
      }
    }
    
    return NextResponse.json({
      message: `Bulk deletion completed: ${results.successCount} succeeded, ${results.failCount} failed`,
      results
    }, { headers: corsHeaders });
  }
}

// Helper function to detect media type from URL or pathname
function detectMediaType(path: string): string {
  if (!path) return 'media';
  
  const videoExtensions = ['.mp4', '.webm', '.mov', '.m4v', '.avi'];
  const isVideo = videoExtensions.some(ext => path.toLowerCase().endsWith(ext)) || 
                 path.toLowerCase().includes('/videos/');
  return isVideo ? 'video' : 'image';
}

// Hash function for IDs
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}
