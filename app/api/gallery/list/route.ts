import { NextResponse } from "next/server"
import { Client } from "@neondatabase/serverless"

export async function GET() {
  try {
    const client = new Client(process.env.DATABASE_URL)
    await client.connect()

    // Log that we're fetching images
    console.log("Fetching images from database...")

    const result = await client.query(
      `SELECT 
        id, url, title, uploaded_at, size, width, height, 
        "alt-tag", "alt-tag" as "altTag", folder, format, description 
       FROM images 
       ORDER BY uploaded_at DESC`,
    )

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
    return NextResponse.json({ error: "Failed to fetch images", details: error }, { status: 500 })
  }
}
