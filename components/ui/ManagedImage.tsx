// Example: components/ui/ManagedImage.tsx (New file)
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface ManagedImageProps extends ImageProps {
  fallbackSrc?: string;
  quality?: number;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
}

export default function ManagedImage({
  src,
  fallbackSrc = "/images/placeholder.png",
  onError,
  quality = 90,
  sizes = "100vw",
  placeholder = "empty",
  ...props
}: ManagedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImgSrc(fallbackSrc);
    if (onError) {
      onError(e);
    }
  };

  // If fill is set, don't pass width/height
  const { fill, width, height, ...rest } = props;
  const imageProps = fill
    ? { fill: true, quality, sizes, placeholder, ...rest }
    : { width, height, quality, sizes, placeholder, ...rest };

  return (
    <Image
      src={imgSrc}
      onError={handleError}
      {...imageProps}
    />
  );
}