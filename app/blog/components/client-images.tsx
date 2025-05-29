'use client';

import Image from "next/image";
import { getBlobImage } from "@/utils/media-utils";

type AuthorImageProps = {
  authorImage: string;
  author: string;
};

export function AuthorImage({ authorImage, author }: AuthorImageProps) {
  return (
    <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
      <Image 
        src={getBlobImage(authorImage)} 
        alt={author}
        width={32}
        height={32}
        className="object-cover"
      />
    </div>
  );
}

type BlogImageProps = {
  src: string;
  alt: string;
};

export function BlogCoverImage({ src, alt }: BlogImageProps) {
  return (
    <Image
      src={getBlobImage(src)}
      alt={alt}
      fill
      className="object-cover"
      priority
    />
  );
}

type RelatedPostImageProps = {
  src: string;
  alt: string;
};

export function RelatedPostImage({ src, alt }: RelatedPostImageProps) {
  return (
    <Image
      src={getBlobImage(src)}
      alt={alt}
      fill
      className="object-cover transition duration-300 group-hover:scale-105"
    />
  );
}
