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
  // Update these lines in utils/image-utils.ts
// in the blobImages object:

// Note: For better image organization:
// - Use page-specific prefixes (home-, projects-, services-, etc.)
// - For subpages, consider prefixes like projects-web3- or blog-article-
// - Keep global images like logo, logo-black, og-image without prefixes

  // 20250511 2234 Futuristic Lab Collaboration simple compose 01jv0deq63ftxae9efk3hvka21 (gif) - suggested better key name (was: pioneering-digital-transformation)
 // Update these lines in utils/image-utils.ts
// in the blobImages object:

// Note: For better image organization:
// - Use page-specific prefixes (home-, projects-, services-, etc.)
// - For subpages, consider prefixes like projects-web3- or blog-article-
// - Keep global images like logo, logo-black, og-image without prefixes

  // 20250511 2234 Futuristic Lab Collaboration simple compose 01jv0deq63ftxae9efk3hvka21 (gif) - suggested better key name (was: pioneering-digital-transformation)
  "pioneering-digital-transformation": "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1747055414197-20250511-2234-Futuristic-Lab-Collaboration-simple-compose-01jv0deq63ftxae9efk3hvka21.gif",
  "innovating-future":
    "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1746263671694-Innovating-the-Future.webp",
  "shaping-sota-technologies":
    "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1746646077344-20250426-2326-Cyborg-Collaboration-Hub-remix-01jsswceste5nthezcfcemp8rs.png",

  // Solutions section images
  "ai-solutions":
    "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/ai-placeholder-GkKOGVhxLv4Iw3bRlsrerHVp709TAM.png",
  "blockchain-solutions":
    "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/blockchain-placeholder-UNQuhq91UBgv4xGijnG5aAVBK6nhdm.png",

  // Project images
 // Update these lines in utils/image-utils.ts
// in the blobImages object:

// Note: For better image organization:
// - Use page-specific prefixes (home-, projects-, services-, etc.)
// - For subpages, consider prefixes like projects-web3- or blog-article-
// - Keep global images like logo, logo-black, og-image without prefixes

  // 20250512 1951 Web3 Gaming Revolution simple compose 01jv2phxzzeprrz0e36tjat8hy (gif) - suggested better key name (was: web3-gaming)
  "web3-gaming": "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1747069232372-20250512-1951-Web3-Gaming-Revolution-simple-compose-01jv2phxzzeprrz0e36tjat8hy.gif",   
  // Update these lines in utils/image-utils.ts
// in the blobImages object:

// Note: For better image organization:
// - Use page-specific prefixes (home-, projects-, services-, etc.)
// - For subpages, consider prefixes like projects-web3- or blog-article-
// - Keep global images like logo, logo-black, og-image without prefixes

  // 20250512 2057 Futuristic Blockchain Payments remix 01jv2tacjdf7prr72x36a3r710 (gif) - suggested better key name (was: payment-systems)
  "payment-systems": "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1747075171305-20250512-2057-Futuristic-Blockchain-Payments-remix-01jv2tacjdf7prr72x36a3r710.gif",
  // 20250511 2158 Futuristic Data Connectivity simple compose 01jv0bd9emep8ssw4bwmkwkptb (gif) - suggested better key name (was: mev-staking)
  "mev-staking": "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1747055425140-20250511-2158-Futuristic-Data-Connectivity-simple-compose-01jv0bd9emep8ssw4bwmkwkptb.gif",

  // 20250511 2149 AI Glow Effect storyboard 01jv0aw3mvf7et4sgshfjs7z7v (gif) - suggested better key name (was: nft-marketplace)
  "nft-marketplace": "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1747055463123-20250511-2149-AI-Glow-Effect-storyboard-01jv0aw3mvf7et4sgshfjs7z7v.gif",

  // 20250511 2154 Digital Harmony simple compose 01jv0b560pexvvbv6we6kkm31v (gif) - suggested better key name (was: ai-services)
  "ai-services": "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1747055432399-20250511-2154-Digital-Harmony-simple-compose-01jv0b560pexvvbv6we6kkm31v.gif",
  // Projects page specific images

// Update these lines in utils/image-utils.ts
// in the blobImages object:

// Note: For better image organization:
// - Use page-specific prefixes (home-, projects-, services-, etc.)
// - For subpages, consider prefixes like projects-web3- or blog-article-
// - Keep global images like logo, logo-black, og-image without prefixes

  // Screenshot 2025 01 05 160711 X4TsCx0Tznl0kEKC9xteDtdk9eifzt (png) for projects page
  "projects-dopple-ai": "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Screenshot-2025-01-05-160711-X4TsCx0Tznl0kEKC9xteDtdk9eifzt.png",

  // Screenshot 2025 01 05 160251 a1hFy83k9Rfzoenroo51nuUuLpXwXr (png) for projects page
  "projects-degen-kombat": "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Screenshot-2025-01-05-160251-a1hFy83k9Rfzoenroo51nuUuLpXwXr.png",

  // Screenshot 2025 01 05 160852 CbIqDoFaMOWTENTm4tNfniGclPjKo3 (png) for projects page
  "projects-heroes-of-mavia": "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Screenshot-2025-01-05-160852-CbIqDoFaMOWTENTm4tNfniGclPjKo3.png",

  // Screenshot 2025 01 05 165735 YrpRehlPFZCuhQHFooDAEqol59jfjx (png) for projects page
  "projects-multichain-dex": "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Screenshot-2025-01-05-165735-YrpRehlPFZCuhQHFooDAEqol59jfjx.png",

  // Screenshot 2025 01 05 174629 wxPq1MW2OplBB8V70zjeSN9RqpQ7W0 (png) for projects page
  "projects-payment-system": "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Screenshot-2025-01-05-174629-wxPq1MW2OplBB8V70zjeSN9RqpQ7W0.png",

  // Screenshot 2025 01 05 175331 WPpSHQyWIcLYFLTcfZHXYLrpY93PIx (png) for projects page
  "projects-optimism-io": "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Screenshot-2025-01-05-175331-WPpSHQyWIcLYFLTcfZHXYLrpY93PIx.png",

  // Screenshot 2025 01 05 172306 qOsrwGzaEfz7gHuseaH756pBDbR88Y (png) for projects page
  "projects-blast-io": "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Screenshot-2025-01-05-172306-qOsrwGzaEfz7gHuseaH756pBDbR88Y.png",

  // Screenshot 2025 01 05 172939 8HJfc36gfs5XyiuijmGkMiJgjnvIGI (png) for projects page
  "projects-base-org": "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Screenshot-2025-01-05-172939-8HJfc36gfs5XyiuijmGkMiJgjnvIGI.png",

 // Update these lines in utils/image-utils.ts
// in the blobImages object:

  // Shaping State of The Art (gif) for services page
  "services-og-image": "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1746529491566-Shaping-State-of-The-Art-Technologies-.gif",
  
  // CEO portrait
  "ceo-portrait":
    "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1746354931230-instantid-1746354169011.webp",

  // Services page images:
  "service-image-1":
    "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/service-image-1.webp",
  "service-image-2":
    "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/service-image-2.webp",
  "service-image-3":
    "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/service-image-3.webp",
  "service-image-4":
    "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/service-image-4.webp",
  
  // Add more images as needed

  // 20250512 1428 Futuristic Innovation Hub simple compose 01jv242h1dexrbkgvw5vn5wx5v (gif) for about page
  "about-mission-image": "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1747069236709-20250512-1428-Futuristic-Innovation-Hub-simple-compose-01jv242h1dexrbkgvw5vn5wx5v.gif",
  "about-vision-image": "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/your-vision-image-url.gif",
  "about-value-innovation-image": "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/your-innovation-image-url.gif",
  "about-value-integrity-image": "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/your-integrity-image-url.gif",
  "about-value-collaboration-image": "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/your-collaboration-image-url.gif",
  "about-team-member-eugene-lukyanov-image": "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/eugene-lukyanov-image-url.png",
  "about-team-member-andrii-stehno-image": "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/andrii-stehno-image-url.png",
  "about-team-member-julia-mazura-image": "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/julia-mazura-image-url.png",
  "about-team-member-vitalii-melnyk-image": "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/vitalii-melnyk-image-url.png",
   
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
