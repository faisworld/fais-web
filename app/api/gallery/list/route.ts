import { NextResponse } from "next/server"
import { Client } from "@neondatabase/serverless"

export async function GET() {
  try {
    const client = new Client(process.env.DATABASE_URL)
    await client.connect()

    // Log that we're fetching images
    console.log("Fetching images from database...")

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
      ORDER BY uploaded_at DESC
    `

    console.log("Executing query:", query)
    const result = await client.query(query)

    await client.end()

    // Log the result for debugging
    console.log(`Found ${result.rows.length} images`)

    // If there are no images, add a placeholder for testing
    if (result.rows.length === 0) {
      console.log("No images found, adding placeholder for testing")
      return NextResponse.json({
        images: [
          {
            id: 1,
            url: "/abstract-geometric-shapes.png",
            title: "No images found",
            altTag: "Placeholder image",
            width: 800,
            height: 600,
          },
        ],
      })
    }

    return NextResponse.json({ images: result.rows })
  } catch (error) {
    console.error("Error fetching images:", error)
    return NextResponse.json({ error: "Failed to fetch images", details: String(error) }, { status: 500 })
  }
}
