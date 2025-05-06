import { NextResponse } from "next/server"
import { Client } from "@neondatabase/serverless"

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
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400, headers: corsHeaders })
    }

    console.log(`API: Fetching image with ID ${id}`)
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

      console.log(`API: Query result rows: ${result.rows.length}`)

      if (result.rows.length === 0) {
        console.log(`API: No image found with ID ${id}`)
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
  try {
    const body = await request.json()
    const { id, title, alt, folder, description } = body

    if (!id) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400, headers: corsHeaders })
    }

    console.log(`Updating image ${id} with:`, { title, alt, folder, description })

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

// DELETE handler to delete an image
export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400, headers: corsHeaders })
    }

    const client = new Client(process.env.DATABASE_URL || "")
    await client.connect()

    try {
      await client.query("DELETE FROM images WHERE id = $1", [id])
      return NextResponse.json({ message: "Image deleted successfully" }, { headers: corsHeaders })
    } catch (dbError) {
      console.error("Database error during delete:", dbError)
      return NextResponse.json(
        { error: "Database error during delete", details: String(dbError) },
        { status: 500, headers: corsHeaders },
      )
    } finally {
      await client.end()
    }
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json(
      { error: "Failed to delete image", details: String(error) },
      { status: 500, headers: corsHeaders },
    )
  }
}
