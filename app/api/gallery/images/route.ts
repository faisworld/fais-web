import { NextResponse } from "next/server"
import { Client } from "@neondatabase/serverless"

// GET handler to fetch a single image by ID
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 })
    }

    console.log(`API: Fetching image with ID ${id}`)
    const client = new Client(process.env.DATABASE_URL || "")
    await client.connect()

    try {
      // Use parameterized query to prevent SQL injection and include ALL fields
      const result = await client.query(
        `SELECT 
          id, url, title, description, uploaded_at, size, 
          width, height, format, folder, 
          "alt-tag" as "altTag", "alt-tag" 
         FROM images 
         WHERE id = $1`,
        [id],
      )

      console.log(`API: Query result rows: ${result.rows.length}`)

      if (result.rows.length === 0) {
        console.log(`API: No image found with ID ${id}`)
        return NextResponse.json({ error: "Image not found" }, { status: 404 })
      }

      console.log("Image data retrieved:", result.rows[0])
      return NextResponse.json({ image: result.rows[0] })
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Database error", details: String(dbError) }, { status: 500 })
    } finally {
      await client.end()
    }
  } catch (error) {
    console.error("Error fetching image:", error)
    return NextResponse.json({ error: "Failed to fetch image", details: String(error) }, { status: 500 })
  }
}

// PATCH handler to update image metadata
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, title, alt, folder, description } = body

    if (!id) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 })
    }

    console.log(`Updating image ${id} with:`, { title, alt, folder, description })

    const client = new Client(process.env.DATABASE_URL || "")
    await client.connect()

    try {
      // Update query with folder field and update the alt-tag field directly
      const result = await client.query(
        `UPDATE images 
         SET title = $1, "alt-tag" = $2, folder = $3, description = $4 
         WHERE id = $5 
         RETURNING id, url, title, "alt-tag" as "altTag", folder, description`,
        [title, alt, folder, description || null, id],
      )

      if (result.rowCount === 0) {
        return NextResponse.json({ error: "Image not found" }, { status: 404 })
      }

      console.log("Update successful:", result.rows[0])
      return NextResponse.json({
        message: "Image metadata updated successfully",
        image: result.rows[0],
      })
    } catch (dbError) {
      console.error("Database error during update:", dbError)
      return NextResponse.json({ error: "Database error during update", details: String(dbError) }, { status: 500 })
    } finally {
      await client.end()
    }
  } catch (error) {
    console.error("Error updating image:", error)
    return NextResponse.json({ error: "Failed to update image", details: String(error) }, { status: 500 })
  }
}

// DELETE handler to delete an image
export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 })
    }

    const client = new Client(process.env.DATABASE_URL || "")
    await client.connect()

    try {
      await client.query("DELETE FROM images WHERE id = $1", [id])
      return NextResponse.json({ message: "Image deleted successfully" })
    } catch (dbError) {
      console.error("Database error during delete:", dbError)
      return NextResponse.json({ error: "Database error during delete", details: String(dbError) }, { status: 500 })
    } finally {
      await client.end()
    }
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json({ error: "Failed to delete image", details: String(error) }, { status: 500 })
  }
}
