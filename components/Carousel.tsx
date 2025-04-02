"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

interface CarouselItem {
    src: string;
    alt: string;
}

interface CarouselProps {
    items: CarouselItem[];
    onSlideChange?: (index: number) => void; // Add onSlideChange as an optional prop
}

export default function Carousel({ items, onSlideChange }: CarouselProps) {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        afterChange: (current: number) => {
            if (onSlideChange) {
                onSlideChange(current); // Trigger onSlideChange callback if provided
            }
        },
    };

    return (
        <div className="relative w-full h-[100vh] overflow-hidden">
            <Slider {...settings}>
                {items.map((item) => (
                    <div key={item.alt} className="relative w-full h-[100vh]">
                        <Image
                            src={item.src}
                            alt={item.alt}
                            fill
                            style={{ objectFit: "cover" }}
                            unoptimized
                            onError={(e: any) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/images/placeholder.png"; // Ensure this placeholder exists
                            }}
                            priority
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
}