import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { Client } from "@neondatabase/serverless"
import sharp from "sharp"

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Generate a unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-")
    const filename = `images/${timestamp}-${originalName}`

    // Get file buffer for processing with sharp
    const fileBuffer = await file.arrayBuffer()

    // Get image dimensions and metadata using sharp
    let width = null
    let height = null
    let format = null

    try {
      if (file.type.startsWith("image/")) {
        const metadata = await sharp(Buffer.from(fileBuffer)).metadata()
        width = metadata.width
        height = metadata.height
        format = metadata.format

        console.log(`Image dimensions detected: ${width}x${height}, format: ${format}`)
      }
    } catch (err) {
      console.warn("Could not determine image dimensions:", err)
    }

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
    })

    // Save metadata to database
    const client = new Client(process.env.DATABASE_URL)
    await client.connect()

    // Extract folder from formData if provided
    const folder = formData.get("folder") as string | null
    const title = (formData.get("title") as string) || file.name
    const altTag = (formData.get("alt") as string) || title
    const description = formData.get("description") as string | null

    // Insert into database with all metadata
    const result = await client.query(
      'INSERT INTO images (url, title, "alt-tag", size, width, height, format, folder, description, uploaded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING id',
      [blob.url, title, altTag, file.size, width, height, format, folder, description],
    )

    await client.end()

    return NextResponse.json({
      success: true,
      url: blob.url,
      id: result.rows[0]?.id,
      size: file.size,
      width,
      height,
      format,
      message: "Image uploaded successfully to Blob storage with dimensions detected",
    })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
