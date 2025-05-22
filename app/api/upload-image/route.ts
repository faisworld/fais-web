import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { Client } from "@neondatabase/serverless"

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

    // Get file buffer for processing (will be used in upload)
    const arrayBuffer = await file.arrayBuffer()

    // Initialize variables for image metadata
    let width = null
    let height = null
    let format = null

    // Try to get image dimensions using image-size if available
    // We'll skip Sharp since it's causing issues
    try {
      if (file.type.startsWith("image/")) {
        // Extract dimensions from image headers if possible
        // For now, we'll skip this and rely on client-side reporting
        console.log("Skipping image dimension detection due to Sharp module issues")

        // If we have image dimensions in the form data, use those
        const formWidth = formData.get("width")
        const formHeight = formData.get("height")

        if (formWidth && formHeight) {
          width = Number.parseInt(formWidth.toString(), 10)
          height = Number.parseInt(formHeight.toString(), 10)
          console.log(`Using provided dimensions: ${width}x${height}`)
        }

        // Try to determine format from mime type
        if (file.type === "image/jpeg" || file.type === "image/jpg") {
          format = "jpeg"
        } else if (file.type === "image/png") {
          format = "png"
        } else if (file.type === "image/gif") {
          format = "gif"
        } else if (file.type === "image/webp") {
          format = "webp"
        } else if (file.type === "image/svg+xml") {
          format = "svg"
        } else {
          format = file.type.split("/")[1]
        }
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

    // Check which columns exist in the table
    const columnsResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'images'
    `)

    const existingColumns = columnsResult.rows.map((row) => row.column_name)
    console.log("Existing columns:", existingColumns)

    // Extract folder from formData if provided
    const folder = formData.get("folder") as string | null
    const title = (formData.get("title") as string) || file.name
    const altTag = (formData.get("alt") as string) || title
    const description = formData.get("description") as string | null

    // Build the INSERT query dynamically based on existing columns
    const insertColumns = ["url", "title"]
    const insertValues = [blob.url, title]
    const placeholders = ["$1", "$2"]
    let paramIndex = 3

    // Check for each optional column and add it if it exists
    if (existingColumns.includes("alt-tag")) {
      insertColumns.push('"alt-tag"')
      insertValues.push(altTag)
      placeholders.push(`$${paramIndex++}`)
    }

    if (existingColumns.includes("size")) {
      insertColumns.push("size")
      insertValues.push(file.size.toString())
      placeholders.push(`$${paramIndex++}`)
    }

    if (existingColumns.includes("width") && width !== null) {
      insertColumns.push("width")
      insertValues.push(width.toString())
      placeholders.push(`$${paramIndex++}`)
    }

    if (existingColumns.includes("height") && height !== null) {
      insertColumns.push("height")
      insertValues.push(height.toString())
      placeholders.push(`$${paramIndex++}`)
    }

    if (existingColumns.includes("format") && format !== null) {
      insertColumns.push("format")
      insertValues.push(format)
      placeholders.push(`$${paramIndex++}`)
    }

    if (existingColumns.includes("folder") && folder) {
      insertColumns.push("folder")
      insertValues.push(folder)
      placeholders.push(`$${paramIndex++}`)
    }

    if (existingColumns.includes("description") && description) {
      insertColumns.push("description")
      insertValues.push(description)
      placeholders.push(`$${paramIndex++}`)
    }

    // Add uploaded_at if it exists
    if (existingColumns.includes("uploaded_at")) {
      insertColumns.push("uploaded_at")
      insertValues.push(new Date().toISOString())
      placeholders.push(`$${paramIndex++}`)
    }

    // Construct the final query
    const query = `
      INSERT INTO images (${insertColumns.join(", ")}) 
      VALUES (${placeholders.join(", ")}) 
      RETURNING id
    `

    console.log("Executing insert query:", query)
    console.log("With values:", insertValues)

    const result = await client.query(query, insertValues)

    await client.end()

    return NextResponse.json({
      success: true,
      url: blob.url,
      id: result.rows[0]?.id,
      size: file.size,
      width,
      height,
      format,
      message: "Image uploaded successfully to Blob storage",
    })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ error: "Failed to upload image", details: String(error) }, { status: 500 })
  }
}
