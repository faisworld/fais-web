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
  return `/placeholder.svg?width=${width}&height=${height}&query=${encodeURIComponent(text)}`
}

/**
 * When using images from Vercel Blob storage, we need to work with the actual URLs
 * which include unique hash strings. This utility helps manage and use those URLs.
 */

// Map of friendly names to actual blob URLs or placeholder SVGs
export const blobImages: { [key: string]: string } = {
  // Use actual Blob URLs for logos
  logo: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Logo_white_fais-e1734783482439-0gYn1yvp1J0Oud09HvWZK7ePuLfaC4.png",
  "logo-black": "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1746460117071-logo-fais-black.png",

  // Carousel images - replace these with actual Blob URLs if you have them
  "pioneering-digital-transformation":
    "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1746510866676-Innovating-the-Future-dark.png",
  "innovating-future":
    "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1746263671694-Innovating-the-Future.webp",
  "shaping-sota-technologies":
    "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1746529491566-Shaping-State-of-The-Art-Technologies-.gif",

  // Solutions section images
  "ai-solutions":
    "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/ai-placeholder-GkKOGVhxLv4Iw3bRlsrerHVp709TAM.png",
  "blockchain-solutions":
    "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/blockchain-placeholder-UNQuhq91UBgv4xGijnG5aAVBK6nhdm.png",

  // Project images
  "mev-staking":
    "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/MEV-Staking-Dapp-qu9tSLxD01qmZELWSWL4giLhFv3lan.webp",
  "web3-gaming":
    "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Web3-Game-jH8VUEwQa09rWqV0kUKvN7I7EhHz7W.webp",
  "nft-marketplace":
    "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/NFT-Marketplace-300x300-bUFrkFMbDGUlx3ei4rXiDV6h2MBMid.webp",
  "ai-services":
    "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/6-AI-Services-bw4-K0JK6LHIxJik1YvNVq8Avzche5h9Eg.webp",
  "payment-systems":
    "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Dapp-Development-300x300-0NIiVSQb62YUQ79OegmUC9nvn4U09B.webp",

  // Open Graph and social images
  "og-image":
    "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/vibrant-ai-workspace-og-image-7yTGHJKLmnOP.png",

  // CEO portrait
  "ceo-portrait":
    "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1746354931230-instantid-1746354169011.webp",

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

  // Extract dimensions from the current image if possible
  const width = e.currentTarget.width || 400
  const height = e.currentTarget.height || 300
  const alt = e.currentTarget.alt || "Image"

  // Only replace with placeholder if not already a placeholder
  if (!e.currentTarget.src.includes("placeholder.svg")) {
    e.currentTarget.src = `/placeholder.svg?width=${width}&height=${height}&query=${encodeURIComponent(alt)}`
    e.currentTarget.onerror = null // Prevent infinite error loop
  }
}

/**
 * Determine if an image is a GIF
 * @param url The image URL
 * @returns Boolean indicating if the image is a GIF
 */
export function isGif(url: string): boolean {
  return url?.toLowerCase().endsWith(".gif") || false
}

/**
 * Get appropriate image component props based on image type
 * @param url The image URL
 * @returns Object with appropriate props for the image
 */
export function getImageProps(url: string) {
  const isAnimated = isGif(url)

  return {
    unoptimized: isAnimated, // Don't optimize GIFs to preserve animation
    loading: isAnimated ? "eager" : ("lazy" as "eager" | "lazy"),
    // Other props as needed
  }
}
