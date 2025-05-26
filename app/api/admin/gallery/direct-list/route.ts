import { NextResponse } from "next/server"
import { list } from "@vercel/blob"
import { checkAdminAuth } from "@/utils/auth-compat";

export async function GET() {
  // Check admin authentication
  const authResult = await checkAdminAuth();
  if (!authResult.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("Admin: Fetching images directly from Vercel Blob storage...")
    
    // List all blobs in the 'images' prefix
    const blobs = await list({
      prefix: "images/",
      limit: 1000,
    })

    // Extract basic image info from each blob
    const images = blobs.blobs.map((blob, index) => ({
      id: index + 1, 
      url: blob.url,
      title: getBlobTitle(blob.pathname),
      "alt-tag": getBlobTitle(blob.pathname), // Include both formats for compatibility
      altTag: getBlobTitle(blob.pathname),
      size: blob.size,
      uploaded_at: blob.uploadedAt,
      folder: getFolderFromPath(blob.pathname),
      format: getFileExtension(blob.pathname),
      width: 0, // Will be filled client-side if needed
      height: 0 // Will be filled client-side if needed
    }))

    console.log(`Found ${images.length} images in Blob storage`)
    
    return NextResponse.json({ images })
  } catch (error) {
    console.error("Error fetching images from Blob storage:", error)
    
    // Return sample data for development
    return NextResponse.json({ 
      images: [
        {
          id: 1,
          url: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Logo_white_fais-e1734783482439-0gYn1yvp1J0Oud09HvWZK7ePuLfaC4.png",
          title: "Logo White Fais",
          "alt-tag": "FAIS Logo White",
          altTag: "FAIS Logo White",
          size: 12345,
          uploaded_at: new Date().toISOString(),
          format: "png"
        },
        {
          id: 2,
          url: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1746460117071-logo-fais-black.png",
          title: "Logo Fais Black",
          "alt-tag": "FAIS Logo Black",
          altTag: "FAIS Logo Black",
          size: 12345,
          uploaded_at: new Date().toISOString(),
          format: "png"
        }
      ]
    })
  }
}

// Helper function to extract a title from blob pathname
function getBlobTitle(pathname: string): string {
  // Extract the filename from the pathname
  const filename = pathname.split('/').pop() || ''
  
  // Remove the hash portion and file extension
  return decodeURIComponent(
    filename
      .replace(/-.{13}\.[^.]+$/, '') // Remove Vercel Blob hash
      .replace(/\.[^.]+$/, '')        // Remove file extension
      .replace(/^\d+-/, '')           // Remove leading timestamp
      .replace(/-/g, ' ')             // Replace hyphens with spaces
  )
}

// Extract folder from path (if present)
function getFolderFromPath(pathname: string): string | undefined {
  const parts = pathname.split('/')
  if (parts.length > 2) {
    return parts[1] || undefined
  }
  return undefined
}

// Get file extension
function getFileExtension(pathname: string): string {
  const match = pathname.match(/\.([^.]+)$/)
  return match ? match[1].toLowerCase() : ''
}
