"use client";

import dynamic from "next/dynamic";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CarouselImage from "./CarouselImage"; // Import CarouselImage

const Slider = dynamic(() => import("react-slick"), { ssr: false });

interface CarouselItem {
    src: string;
    alt: string;
    title?: string;
    subtitle?: string;
    description?: string;
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
        <div className="relative w-full h-[100vh] overflow-hidden">
            <Slider {...settings}>
                {items.map((item) => (
                    <div key={item.alt} className="relative w-full h-[100vh]">
                        <CarouselImage src={item.src} alt={item.alt} /> {/* Use CarouselImage */}
                        <div className="absolute text-center">
                            <h2 className="carousel-title carousel-title-text">{item.title}</h2>
                            <p className="carousel-subtitle carousel-subtitle-text">{item.subtitle}</p>
                            <p className="carousel-description carousel-description-text">{item.description}</p>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}