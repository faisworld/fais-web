"use client"

import { put } from "@vercel/blob"

/**
 * Helper function to upload an image to Vercel Blob storage
 * @param file The file to upload
 * @param options Upload options
 * @returns The uploaded blob URL
 */
export async function uploadToBlob(
  file: File,
  options?: {
    folder?: string
    prefix?: string
  },
) {
  try {
    const folder = options?.folder || "images"
    const prefix = options?.prefix || ""
    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-")
    const filename = `${folder}/${prefix}${timestamp}-${safeName}`

    const blob = await put(filename, file, {
      access: "public",
    })

    return {
      success: true,
      url: blob.url,
      filename: blob.pathname,
    }
  } catch (error) {
    console.error("Error uploading to Blob:", error)
    return {
      success: false,
      error: String(error),
    }
  }
}

/**
 * Helper function to create a friendly name for a blob URL
 * @param url The blob URL
 * @returns A friendly name for the blob
 */
export function getFriendlyBlobName(url: string): string {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const parts = pathname.split("/")
    const filename = parts[parts.length - 1]

    // Remove timestamp and hash
    const nameWithoutTimestamp = filename.replace(/^\d+-/, "")
    const nameWithoutHash = nameWithoutTimestamp.replace(/-[a-zA-Z0-9]{20,}\./, ".")

    // Remove extension
    const name = nameWithoutHash.split(".")[0]

    return name
  } catch (error) {
    return "image"
  }
}
