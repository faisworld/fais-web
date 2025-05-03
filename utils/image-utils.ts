import type React from "react"

/**
 * Helper function to get a Vercel Blob URL for an image
 * @param path The path to the image in Blob storage (e.g., "images/my-image.png")
 * @returns The full Blob URL
 */
export function getBlobImageUrl(path: string): string {
  // Base URL for your Vercel Blob storage
  const blobBaseUrl = "https://mzcje1drftvqhdku.public.blob.vercel-storage.com"

  // If the path already starts with http, assume it's already a full URL
  if (path.startsWith("http")) {
    return path
  }

  // If the path already starts with the blob base URL, return it as is
  if (path.startsWith(blobBaseUrl)) {
    return path
  }

  // Ensure the path starts with a slash
  const normalizedPath = path.startsWith("/") ? path.substring(1) : path

  // Return the full URL
  return `${blobBaseUrl}/${normalizedPath}`
}

/**
 * Generate a placeholder image URL
 * @param text The text to display on the placeholder
 * @param width The width of the placeholder
 * @param height The height of the placeholder
 * @returns The placeholder URL
 */
export function getPlaceholderImage(text: string, width = 400, height = 300): string {
  return `/api/placeholder?width=${width}&height=${height}&text=${encodeURIComponent(text)}`
}

/**
 * When using images from Vercel Blob storage, we need to work with the actual URLs
 * which include unique hash strings. This utility helps manage and use those URLs.
 */

// Map of friendly names to actual blob URLs or placeholder SVGs
export const blobImages: { [key: string]: string } = {
  // Use actual Blob URLs for logos
  logo: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Logo_white_fais-e1734783482439-0gYn1yvp1J0Oud09HvWZK7ePuLfaC4.png",
  "logo-black":
    "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Logo_black_fais-KqvcixzlHRVD1xlXsWGkAvjM9YPJgQ.png",

  // Placeholder SVGs for other images
  "pioneering-digital-transformation": `/api/placeholder?width=1200&height=700&text=Digital%20Transformation`,
  "innovating-future": `/api/placeholder?width=1200&height=700&text=Innovating%20Future`,
  "shaping-sota-technologies": `/api/placeholder?width=1200&height=700&text=SOTA%20Technologies`,

  // Solutions section images
  "ai-solutions": `/api/placeholder?width=600&height=400&text=AI%20Solutions`,
  "blockchain-solutions": `/api/placeholder?width=600&height=400&text=Blockchain%20Solutions`,

  // Project images
  "mev-staking": `/api/placeholder?width=600&height=400&text=MEV%20Staking`,
  "web3-gaming": `/api/placeholder?width=600&height=400&text=Web3%20Gaming`,
  "nft-marketplace": `/api/placeholder?width=600&height=400&text=NFT%20Marketplace`,
  "ai-services": `/api/placeholder?width=600&height=400&text=AI%20Services`,
  "payment-systems": `/api/placeholder?width=600&height=400&text=Payment%20Systems`,

  // Open Graph and social images
  "og-image": `/api/placeholder?width=1200&height=630&text=Fantastic%20AI%20Studio`,

  // Add more as needed
}

/**
 * Get an image URL from the Blob storage by its friendly name
 * @param key The friendly name key for the image
 * @param fallback Optional fallback URL if the image isn't found
 * @returns The actual Blob storage URL or fallback
 */
export function getBlobImage(key: string, fallback?: string): string {
  // If the provided key is already a full URL, return it
  if (key && typeof key === "string" && key.startsWith("http")) {
    return key
  }

  // Return the mapped URL or fallback
  return (key && blobImages[key]) || fallback || getPlaceholderImage(key || "Image")
}

/**
 * Error handler for image loading failures
 * @param e The error event
 */
export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>): void {
  console.warn(`Failed to load image: ${e.currentTarget.src}`)
  e.currentTarget.src = getPlaceholderImage("Error")
  e.currentTarget.onerror = null // Prevent infinite error loop
}
