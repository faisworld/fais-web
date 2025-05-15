"use client";

import { useState, useEffect, useRef } from 'react';
// ...existing imports...

interface CarouselSlide {
  title: string;
  subtitle?: string;
  description?: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  ctaText?: string;
  ctaUrl?: string;
}

export default function Carousel() {
  // ...existing state variables...
  const videoRefs = useRef<{[key: string]: HTMLVideoElement | null}>({});
  
  // ...existing functions...

  // Add function to handle video playback when slide changes
  useEffect(() => {
    // Stop all videos
    Object.values(videoRefs.current).forEach(videoEl => {
      if (videoEl) {
        videoEl.pause();
        videoEl.currentTime = 0;
      }
    });
    
    // Play the current video if it exists
    const currentVideo = videoRefs.current[currentSlide];
    if (currentVideo && slides[currentSlide].mediaType === 'video') {
      currentVideo.play().catch(err => console.error("Error playing video:", err));
    }
  }, [currentSlide, slides]);

  // Render media (image or video)
  const renderSlideMedia = (slide: CarouselSlide, index: number) => {
    if (slide.mediaType === 'video') {
      return (
        <video
          ref={el => videoRefs.current[index] = el}
          src={slide.mediaUrl}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          loop
          poster="/video-poster.jpg" // Optional fallback image
        />
      );
    }
    
    // Default to image
    return (
      <Image
        src={slide.mediaUrl}
        alt={slide.title}
        fill
        className="object-cover"
        priority={index === 0} // Prioritize loading the first image
      />
    );
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Carousel slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {renderSlideMedia(slide, index)}
          
          {/* Overlay content */}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center">
            <div className="container mx-auto px-4">
              {/* ...existing content... */}
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation controls */}
      {/* ...existing navigation code... */}
    </div>
  );
}
