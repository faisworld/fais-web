import { NextResponse } from "next/server"
import { Client } from "@neondatabase/serverless"
import { checkAdminAuth } from "@/utils/admin-auth"

// GET handler to list all folders
export async function GET(request: Request) {
  // Check admin authentication
  const authResult = await checkAdminAuth(request);
  if (!authResult.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = new Client(process.env.DATABASE_URL)
    await client.connect()

    const result = await client.query("SELECT id, name FROM folders ORDER BY name")
    await client.end()

    return NextResponse.json({ folders: result.rows })
  } catch (error) {
    console.error("Error fetching folders:", error)
    return NextResponse.json({ error: "Failed to fetch folders" }, { status: 500 })
  }
}

// POST handler to create a folder
export async function POST(request: Request) {
  // Check admin authentication
  const authResult = await checkAdminAuth(request);
  if (!authResult.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json()
    const { folder } = body

    if (!folder) {
      return NextResponse.json({ error: "Folder name is required" }, { status: 400 })
    }

    const client = new Client(process.env.DATABASE_URL)
    await client.connect()

    // Check if folder already exists
    const existingFolder = await client.query("SELECT id FROM folders WHERE name = $1", [folder])

    if (existingFolder.rows.length > 0) {
      await client.end()
      return NextResponse.json({ error: "Folder already exists" }, { status: 400 })
    }

    const result = await client.query("INSERT INTO folders (name) VALUES ($1) RETURNING id", [folder])

    await client.end()

    return NextResponse.json({
      message: "Folder created successfully",
      id: result.rows[0]?.id,
    })
  } catch (error) {
    console.error("Error creating folder:", error)
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 })
  }
}

// DELETE handler to delete a folder
export async function DELETE(request: Request) {
  // Check admin authentication
  const authResult = await checkAdminAuth(request);
  if (!authResult.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json()
    const { folder } = body

    if (!folder) {
      return NextResponse.json({ error: "Folder name is required" }, { status: 400 })
    }

    const client = new Client(process.env.DATABASE_URL)
    await client.connect()

    await client.query("DELETE FROM folders WHERE name = $1", [folder])
    await client.end()

    return NextResponse.json({ message: "Folder deleted successfully" })
  } catch (error) {
    console.error("Error deleting folder:", error)
    return NextResponse.json({ error: "Failed to delete folder" }, { status: 500 })
  }
}
