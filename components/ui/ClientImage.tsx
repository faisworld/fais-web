"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import type { ImageProps } from "next/image"
import { getPlaceholderImage } from "@/utils/image-utils"

type ClientImageProps = Omit<ImageProps, "onError"> & {
  fallbackSrc?: string
}

export default function ClientImage({ src, alt, fallbackSrc, ...rest }: ClientImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [hasError, setHasError] = useState(false)

  // Set the image source when the component mounts or src changes
  useEffect(() => {
    setImgSrc(src as string)
    setHasError(false)
  }, [src])

  const handleError = () => {
    console.warn(`Failed to load image: ${src}`)
    if (!hasError) {
      // Use our custom placeholder API
      const placeholder = getPlaceholderImage((alt as string) || "Image")
      setImgSrc(fallbackSrc || placeholder)
      setHasError(true)
    }
  }

  // If imgSrc is null (initial state), show nothing until useEffect runs
  if (imgSrc === null) {
    return null
  }

  return <Image src={imgSrc || getPlaceholderImage("Image")} alt={alt} onError={handleError} {...rest} />
}
