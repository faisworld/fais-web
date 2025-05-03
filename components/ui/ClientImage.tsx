"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import type { ImageProps } from "next/image"

type ClientImageProps = Omit<ImageProps, "onError"> & {
  fallbackSrc?: string
  itemProp?: string
  itemScope?: boolean
  itemType?: string
}

export default function ClientImage({
  src,
  alt,
  fallbackSrc,
  itemProp,
  itemScope,
  itemType,
  ...rest
}: ClientImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Set the image source when the component mounts or src changes
  useEffect(() => {
    // If src is a direct URL to a Blob Store image, use it directly
    if (
      typeof src === "string" &&
      (src.includes("vercel-storage.com") || src.startsWith("https://") || src.startsWith("http://"))
    ) {
      setImgSrc(src)
    } else {
      setImgSrc(src as string)
    }
    setHasError(false)
    setIsLoaded(false)
  }, [src])

  const handleError = () => {
    console.warn(`Failed to load image: ${src}`)
    if (!hasError) {
      // Use fallback if provided, otherwise use a simple placeholder
      const defaultFallback = `/placeholder.svg?width=${rest.width || 400}&height=${rest.height || 300}&query=${encodeURIComponent((alt as string) || "Image")}`
      setImgSrc(fallbackSrc || defaultFallback)
      setHasError(true)
    }
  }

  const handleLoad = () => {
    setIsLoaded(true)
  }

  // If imgSrc is null (initial state), show nothing until useEffect runs
  if (imgSrc === null) {
    return null
  }

  // Create structured data attributes if provided
  const structuredDataProps = itemProp
    ? {
        itemProp,
        ...(itemScope ? { itemScope: true } : {}),
        ...(itemType ? { itemType } : {}),
      }
    : {}

  return (
    <>
      {!isLoaded && rest.priority !== true && <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>}
      <Image
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        {...structuredDataProps}
        {...rest}
      />
    </>
  )
}
