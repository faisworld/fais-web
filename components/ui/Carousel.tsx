"use client";

import dynamic from "next/dynamic";
import ManagedImage from "@/components/ui/ManagedImage";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

interface CarouselItem {
    src: string;
    alt: string;
}

interface CarouselProps {
    items: CarouselItem[];
    onSlideChange?: (index: number) => void;
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
                onSlideChange(current);
            }
        },
    };

    return (
        <div className="relative w-full h-[110vh] overflow-hidden bg-white">
            <Slider {...settings}>
                {items.map((item, index) => (
                    <div key={item.alt} className="relative w-full h-[150vh] flex items-center justify-center bg-white">
                        <ManagedImage
                            src={item.src}
                            alt={item.alt}
                            fill
                            sizes="100vw"
                            quality={90}
                            style={{ objectFit: "cover" }}
                            fallbackSrc="/images/placeholder.png"
                            priority={index === 0}
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
}