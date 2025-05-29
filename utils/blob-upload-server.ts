import { put } from "@vercel/blob"

/**
 * Server-side helper function to upload an image to Vercel Blob storage
 * @param file The file (as ArrayBuffer) to upload
 * @param filename The desired filename
 * @param contentType The content type of the file
 * @param options Upload options
 * @returns The uploaded blob URL
 */
export async function uploadToBlobServer(
  fileData: ArrayBuffer,
  filename: string,
  contentType: string,
  options?: {
    folder?: string
    prefix?: string
  },
) {
  try {
    const folder = options?.folder || "images"
    const prefix = options?.prefix || ""
    const timestamp = Date.now()
    const safeName = filename.replace(/[^a-zA-Z0-9.-]/g, "-")
    const fullFilename = `${folder}/${prefix}${timestamp}-${safeName}`

    const blob = await put(fullFilename, fileData, {
      access: "public",
      contentType,
    })

    return {
      success: true,
      url: blob.url,
      filename: blob.pathname,
    }
  } catch (error) {
    console.error("Error uploading to Blob (server-side):", error)
    return {
      success: false,
      error: String(error),
    }
  }
}
