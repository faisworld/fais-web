"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import dynamic from "next/dynamic"

const Slider = dynamic(() => import("react-slick"), { ssr: false })

interface CarouselItem {
  src: string
  alt?: string
  altTag?: string
  title?: string
}

interface CarouselProps {
  items: CarouselItem[]
  onSlideChange?: (index: number) => void
  height?: number
}

const Carousel: React.FC<CarouselProps> = ({ items, onSlideChange, height = 700 }) => {
  const [errorIndexes, setErrorIndexes] = useState<number[]>([])
  const [windowWidth, setWindowWidth] = useState(0)
  const carouselRef = useRef<any>(null)

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    // Set initial width
    setWindowWidth(window.innerWidth)

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleImageError = (index: number) => {
    setErrorIndexes((prev) => [...prev, index])
    console.error(`Failed to load image at index ${index}`)
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    afterChange: (current: number) => {
      if (onSlideChange) {
        onSlideChange(current)
      }
    },
    arrows: true,
    adaptiveHeight: false,
  }

  // Calculate optimal image dimensions
  const imageHeight = height || 700
  const imageWidth = Math.max(1920, windowWidth)

  return (
    <div className="relative w-full overflow-hidden" ref={carouselRef}>
      <Slider {...settings}>
        {items.map((item, index) => (
          <div key={item.alt || item.title || index} className="relative w-full" style={{ height: `${imageHeight}px` }}>
            {!errorIndexes.includes(index) ? (
              <div className="relative w-full h-full">
                <Image
                  src={item.src || "/placeholder.svg"}
                  alt={item.altTag || item.alt || item.title || ""}
                  title={item.title}
                  width={imageWidth}
                  height={imageHeight}
                  sizes="100vw"
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                  }}
                  priority={index === 0}
                  onError={() => handleImageError(index)}
                />
              </div>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Image not available</span>
              </div>
            )}
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default Carousel
