// filepath: c:\Users\solar\Projects\fais-web\components\pages\HeroSection.tsx
"use client";
import { useState } from "react";
import Carousel from "@/components/ui/Carousel";

interface HeroSectionProps {
    config: Record<string, unknown>;
    carouselItems: Array<{
        src: string;
        alt: string;
        title: string;
        subtitle: string;
        description: string;
    }>;
}

export default function HeroSection({ carouselItems }: HeroSectionProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleSlideChange = (index: number) => {
        setActiveIndex(index);
    };

    return (
        <div className="relative w-full h-[120vh] overflow-hidden">
            <Carousel
                items={carouselItems.map(({ src, alt }) => ({ src, alt }))}
                onSlideChange={handleSlideChange}
            />
            {carouselItems[activeIndex] && (
                <div
                    className="absolute flex flex-col items-center justify-center shadow-xl border border-gray-200 rounded-xl"
                    style={{
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "rgba(253, 252, 236, 0.59)",
                        width: "500px", // Increased width by 20px
                        height: "280px", // Reduced height for a tighter fit
                        minWidth: "320px",
                        maxWidth: "95vw",
                        color: "#222",
                        zIndex: 10,
                        textAlign: "center",
                        padding: "32px 32px", // Reduced padding for less space above/below
                        margin: "var(--hero-overlay-margin, 0)",
                    }}
                >
                    <h1 className="text-3xl font-bold mb-2 drop-shadow-lg bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                        {carouselItems[activeIndex].title}
                    </h1>
                    <h2 className="text-xl mt-2 mb-2 bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                        {carouselItems[activeIndex].subtitle}
                    </h2>
                    <p className="text-base mt-2 text-gray-800">
                        {carouselItems[activeIndex].description}
                    </p>
                </div>
            )}
        </div>
    );
}