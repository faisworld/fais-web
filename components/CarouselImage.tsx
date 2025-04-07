"use client";

import Image from "next/image";
import { useState } from "react";

export interface CarouselImageProps {
    src: string;
    alt: string;
}

export default function CarouselImage({ src, alt }: CarouselImageProps) {
    const [isError, setIsError] = useState(false);

    return (
        <div className="relative w-full h-full" style={{ height: "100vh" }}>
            {!isError ? (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    style={{ objectFit: "cover" }}
                    onError={() => setIsError(true)}
                    priority
                />
            ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    Placeholder
                </div>
            )}
        </div>
    );
}