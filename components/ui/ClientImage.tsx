"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import type { ImageProps, StaticImageData } from "next/image"

// Simplify our approach - use a type that's union-compatible with StaticImageData
type ImageSource = string | StaticImageData;

// Helper to check if src is a StaticImageData-like object
function isImageObject(src: unknown): src is { src: string } {
  return typeof src === 'object' && src !== null && 'src' in src && typeof (src as { src: string }).src === 'string';
}

type ClientImageProps = Omit<ImageProps, "onError" | "placeholder"> & {
  src: ImageSource; // Use our union-compatible type
  fallbackSrc?: string;
  itemProp?: string;
  itemScope?: boolean;
  itemType?: string;
  objectPosition?: string;
  placeholder?: ImageProps["placeholder"];
}

export default function ClientImage({
  src,
  alt,
  fallbackSrc,
  itemProp,
  itemScope,
  itemType,
  objectPosition = "center",
  placeholder = "blur",
  ...rest
}: ClientImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let urlToSet: string | null = null;
    if (typeof src === "string") {
      urlToSet = src.trim();
    } else if (isImageObject(src)) {
      urlToSet = src.src.trim();
    }
    setImgSrc(urlToSet);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    const currentSrcForError = typeof src === 'string' ? src : (isImageObject(src) ? src.src : 'unknown source');
    console.warn(`Failed to load image: ${imgSrc || currentSrcForError}`);
    if (!hasError) {
      const defaultFallback = `/placeholder.svg?width=${rest.width || 400}&height=${rest.height || 300}&query=${encodeURIComponent((alt as string) || "Image")}`;
      setImgSrc(fallbackSrc || defaultFallback);
      setHasError(true);
    }
  };

  // If imgSrc is null (initial state or unhandled src type) and not priority, render nothing.
  if (imgSrc === null && !rest.priority) {
    return null;
  }

  const structuredDataProps = itemProp
    ? { itemProp, ...(itemScope && { itemScope: true }), ...(itemType && { itemType }) }
    : {};

  // Determine if we should use a string or pass the original object
  let finalSrc: ImageSource;
  let effectivePlaceholder = placeholder;
  
  if (hasError || imgSrc !== null) {
    // If we have an error or have processed a string URL in the useEffect
    finalSrc = imgSrc as string; // We know it's a string at this point
    
    // Check if it's a remote URL or placeholder SVG to avoid blur effect
    if (typeof finalSrc === 'string' && (
      finalSrc.startsWith('/placeholder.svg') ||
      finalSrc.startsWith('http://') ||
      finalSrc.startsWith('https://')
    )) {
      effectivePlaceholder = "empty";
    }
  } else {
    // Use the original src (could be StaticImageData with proper blurDataURL)
    finalSrc = src;
    
    // If it's a remote URL in the original src, avoid blur
    if (typeof src === 'string' && (
      src.startsWith('http://') ||
      src.startsWith('https://')
    )) {
      effectivePlaceholder = "empty";
    }
  }
  
  return (
    <Image
      src={finalSrc}
      alt={alt}
      onError={handleError}
      placeholder={effectivePlaceholder}
      style={{ ...rest.style, objectPosition }}
      {...structuredDataProps}
      {...rest}
    />
  );
}
