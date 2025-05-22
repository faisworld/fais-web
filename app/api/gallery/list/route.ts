import { NextResponse } from "next/server"
import { Client } from "@neondatabase/serverless"

export async function GET() {
  let client = null;
  
  try {
    client = new Client({
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 10000 // 10 second timeout for slow connections
    })
    await client.connect()

    // Log that we're fetching images
    console.log("Fetching images from database...")

    // First check if the images table exists
    const tableExistsResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'images'
      );
    `)
    
    const tableExists = tableExistsResult.rows[0].exists
    
    if (!tableExists) {
      console.error("Images table does not exist in the database")
      return NextResponse.json({ 
        images: [], 
        error: "Images table does not exist" 
      })
    }

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

    // Check for either alt_tag or alt-tag
    const hasAltTag = existingColumns.includes("alt-tag")
    const hasAltTagUnderscore = existingColumns.includes("alt_tag")

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
    } else if (hasAltTagUnderscore) {
      selectParts.push(`alt_tag`)
      selectParts.push(`alt_tag as "altTag"`)
    }

    const selectClause = selectParts.join(", ")

    const query = `
      SELECT ${selectClause}
      FROM images 
      ORDER BY uploaded_at DESC
      LIMIT 100
    `

    console.log("Executing query:", query)
    
    try {
      const result = await client.query(query)
      console.log(`Found ${result.rows.length} images`)
      
      // Process results to ensure consistent property names
      const processedRows = result.rows.map(row => {
        // Make sure each row has an altTag property
        if (row['alt-tag'] && !row.altTag) {
          row.altTag = row['alt-tag']
        }
        
        if (row.alt_tag && !row.altTag) {
          row.altTag = row.alt_tag
        }
        
        // Convert ISO dates to user-friendly format
        if (row.uploaded_at) {
          try {
            const date = new Date(row.uploaded_at)
            row.uploadedDate = date.toLocaleDateString()
          } catch (e) {
            // Keep the original if date parsing fails
          }
        }
        
        return row
      })
      
      // If there are no images, add a placeholder for testing
      if (processedRows.length === 0) {
        console.log("No images found, adding placeholder for testing")
        return NextResponse.json({
          images: [
            {
              id: 0,
              url: "/placeholder/abstract-geometric-shapes.png", 
              title: "No images found",
              altTag: "Placeholder image",
              width: 800,
              height: 600,
            },
          ],
        })
      }

      return NextResponse.json({ images: processedRows })
    } catch (queryError) {
      console.error("Error executing query:", queryError)
      return NextResponse.json({ 
        error: "Failed to query images", 
        details: String(queryError)
      }, { status: 500 })
    }
  } catch (error) {
    console.error("Error fetching images:", error)
    return NextResponse.json({ 
      error: "Failed to fetch images", 
      details: String(error) 
    }, { status: 500 })
  } finally {
    // Ensure database connection is closed
    if (client) {
      try {
        await client.end()
      } catch (closeError) {
        console.error("Error closing database connection:", closeError)
      }
    }
  }
}
