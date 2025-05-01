"use client"

import { useState } from "react"
import ClientImage from "@/components/ui/ClientImage"
import { getBlobImage } from "@/utils/image-utils"

export default function HomeCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)

  // Define carousel items with placeholder URLs from Blob storage
  const carouselItems = [
    {
      src: getBlobImage("pioneering-digital-transformation"),
      alt: "Pioneering Digital Transformation",
      title: "Pioneering Digital Transformation",
    },
    {
      src: getBlobImage("innovating-future"),
      alt: "Innovating the Future",
      title: "Innovating the Future",
    },
    {
      src: getBlobImage("shaping-sota-technologies"),
      alt: "Shaping Sota Technologies",
      title: "Shaping Sota Technologies",
    },
  ]

  return (
    <section className="relative">
      {/* Carousel display */}
      <div className="relative w-full h-[700px] overflow-hidden">
        {carouselItems.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === activeIndex ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="relative w-full h-full">
              <ClientImage src={item.src} alt={item.alt} fill className="object-cover" priority={index === 0} />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation dots */}
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

      {/* Overlay content for each slide */}
      <div className="absolute inset-0 flex items-center z-10 pointer-events-none">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl text-white bg-black/40 p-6 rounded-lg backdrop-blur-sm pointer-events-auto">
            {activeIndex === 0 && (
              <>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Pioneering Digital Transformation</h1>
                <p className="text-lg mb-6">
                  Being at the forefront of digital revolutions delivering powerful, integrated solutions for your
                  growth and success
                </p>
                <button className="btn">Learn More</button>
              </>
            )}

            {activeIndex === 1 && (
              <>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Innovating the Future</h1>
                <p className="text-lg mb-6">
                  Dive into the world of advanced AI and blockchain solutions, and explore tailor-made technologies
                  shaping a sustainable digital future.
                </p>
                <button className="btn">Explore Solutions</button>
              </>
            )}

            {activeIndex === 2 && (
              <>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Shaping Sota Technologies</h1>
                <p className="text-lg mb-6">
                  Leveraging cutting-edge AI and Blockchain technologies for smarter solutions across industries.
                </p>
                <button className="btn">Our Services</button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
