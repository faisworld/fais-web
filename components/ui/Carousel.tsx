import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import dynamic from "next/dynamic";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

interface CarouselItem {
    src: string;
    alt: string;
}

interface CarouselProps {
    items: CarouselItem[];
    onSlideChange?: (index: number) => void;
}

const Carousel: React.FC<CarouselProps> = ({ items, onSlideChange }) => { // Added onSlideChange prop
    const [errorIndexes, setErrorIndexes] = useState<number[]>([]);
    const carouselRef = useRef<any>(null);

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
        <div className="relative w-full overflow-hidden" ref={carouselRef}>
            <Slider {...settings}>
                {items.map((item, index) => (
                    <div key={item.alt} className="relative w-full" style={{ height: '700px' }}>
                        {!errorIndexes.includes(index) ? (
                            <Image
                                src={item.src}
                                alt={item.alt}
                                width={1530}
                                height={700}
                                sizes="(max-width: 1530px) 100vw, 1530px"
                                style={{ objectFit: "contain" }}
                                priority={index === 0}
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                Placeholder
                            </div>
                        )}
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Carousel;