"use client"

import { useState, useEffect, useCallback } from "react"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { handleImageError } from "@/utils/image-utils"

type CarouselItem = {
  src: string
  alt: string
  title: string
  subtitle: string
  description: string
}

type HeroSectionProps = {
  carouselItems: CarouselItem[]
  config?: {
    autoplay?: boolean
    interval?: number
  }
}

export default function HeroSection({ carouselItems, config = { autoplay: true, interval: 5000 } }: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [loadedImages, setLoadedImages] = useState<boolean[]>(Array(carouselItems.length).fill(false))

  const nextSlide = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % carouselItems.length)
  }, [carouselItems.length])

  const prevSlide = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + carouselItems.length) % carouselItems.length)
  }, [carouselItems.length])

  // Set up autoplay
  useEffect(() => {
    if (config.autoplay) {
      const interval = setInterval(nextSlide, config.interval || 5000)
      return () => clearInterval(interval)
    }
  }, [config.autoplay, config.interval, nextSlide])

  return (
    <section className="relative w-full h-[600px] overflow-hidden">
      {/* Carousel items */}
      {carouselItems.map((item, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === activeIndex ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Use img tag with proper error handling for better control */}
          <div className="relative w-full h-full">
            <img
              src={item.src || "/placeholder.svg"}
              alt={item.alt}
              onError={handleImageError}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Content overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl text-white">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">{item.title}</h1>
                  <h2 className="text-xl md:text-2xl font-medium mb-4">{item.subtitle}</h2>
                  <p className="text-lg opacity-90 mb-8">{item.description}</p>
                  <button className="btn">Learn More</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 text-white z-10"
        aria-label="Previous slide"
      >
        <FiChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 text-white z-10"
        aria-label="Next slide"
      >
        <FiChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full ${index === activeIndex ? "bg-white" : "bg-white/50"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
