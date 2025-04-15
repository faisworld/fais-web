// Example: components/ui/ManagedImage.tsx (New file)
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface ManagedImageProps extends ImageProps {
  fallbackSrc?: string;
}

export default function ManagedImage({ src, fallbackSrc = "/images/placeholder.png", onError, ...props }: ManagedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImgSrc(fallbackSrc);
    if (onError) {
      onError(e); // Call original onError if provided
    }
  };

  return <Image src={imgSrc} onError={handleError} {...props} />;
}