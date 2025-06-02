import Image from 'next/image';
import { ComponentProps } from 'react';

interface ImageComponentProps extends Omit<ComponentProps<typeof Image>, 'src' | 'alt'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

// For GIF images, use unoptimized prop instead of img tag
export const OptimizedImage = ({ src, alt, ...props }: ImageComponentProps) => {
  const isGif = src.includes('.gif');
  
  // For GIFs, use Next.js Image component with unoptimized prop
  // This avoids ESLint warnings while still handling GIFs properly
  return (
    <Image
      src={src}
      alt={alt}
      unoptimized={isGif} // Disable optimization for GIFs to prevent timeouts
      {...props}
    />
  );
};