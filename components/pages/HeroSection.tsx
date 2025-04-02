// filepath: c:\Users\solar\Projects\fais-web\components\pages\HeroSection.tsx
"use client";
import { useState } from "react";
import Carousel from "@/components/Carousel";
import { CSSProperties } from "react";

interface HeroSectionProps {
    config: Record<string, unknown>; // Use a more specific type if the structure of 'config' is known
    carouselItems: Array<{
        src: string;
        alt: string;
        title: string;
        subtitle: string;
        description: string;
        x?: CSSProperties["top"]; // Horizontal position for the text overlay
        y?: CSSProperties["left"]; // Vertical position for the text overlay
        backgroundColor?: CSSProperties["backgroundColor"]; // Background color for the text box
        backgroundOpacity?: number; // Opacity for the background
        border?: CSSProperties["border"]; // Border for the text box
        backgroundWidth?: CSSProperties["width"]; // Width of the text box
        backgroundHeight?: CSSProperties["height"]; // Height of the text box
        borderRadius?: CSSProperties["borderRadius"]; // Border radius for the text box
    }>;
}

export default function HeroSection({ carouselItems }: HeroSectionProps) {
    const [activeIndex, setActiveIndex] = useState(0); // Track the active slide index

    const handleSlideChange = (index: number) => {
        setActiveIndex(index); // Update the active slide index
    };

    return (
        <div className="relative w-full h-[100vh] overflow-hidden">
            {/* Carousel */}
            <Carousel items={carouselItems} onSlideChange={handleSlideChange} />

            {/* Overlay for the Active Slide */}
            {carouselItems[activeIndex] && (
                <div
                    className="absolute"
                    style={{
                        top: carouselItems[activeIndex].y || "50%",
                        left: carouselItems[activeIndex].x || "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: carouselItems[activeIndex].backgroundColor || "rgba(0, 0, 0, 0.5)",
                        opacity: carouselItems[activeIndex].backgroundOpacity || 0.8,
                        width: carouselItems[activeIndex].backgroundWidth || "400px",
                        height: carouselItems[activeIndex].backgroundHeight || "200px",
                        border: carouselItems[activeIndex].border || "1px solid white",
                        borderRadius: carouselItems[activeIndex].borderRadius || "10px",
                        padding: "20px",
                        textAlign: "center",
                        color: "white",
                        zIndex: 10, // Ensure it appears above the carousel
                    }}
                >
                    <h1 className="text-3xl font-bold">{carouselItems[activeIndex].title}</h1>
                    <h2 className="text-xl mt-2">{carouselItems[activeIndex].subtitle}</h2>
                    <p className="text-base mt-4">{carouselItems[activeIndex].description}</p>
                </div>
            )}
        </div>
    );
}