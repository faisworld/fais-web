"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface ClientImageProps extends ImageProps {
  fallbackSrc?: string;
}

// Component to handle client-side image loading with fallback and error handling
export default function ClientImage({ 
  fallbackSrc = "/images/placeholder.jpg", 
  alt, 
  ...props 
}: ClientImageProps) {
  const [error, setError] = useState(false);

  // Create a proper set of image props, avoiding contradictory properties
  const imageProps: ImageProps = {
    alt: alt || "Image",
    src: error ? fallbackSrc : props.src,
    onError: () => setError(true),
    ...props
  };

  // If using fill property, remove any width and height props
  if (props.fill) {
    delete imageProps.width;
    delete imageProps.height;
  } 
  // Otherwise, ensure width and height are provided
  else if (!imageProps.width || !imageProps.height) {
    // Provide default dimensions if not specified
    imageProps.width = imageProps.width || 1920;
    imageProps.height = imageProps.height || 1080;
  }

  return <Image {...imageProps} />;
}
