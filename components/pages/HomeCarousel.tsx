"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import ClientImage from "@/components/ui/ClientImage"
import { getBlobImage } from "@/utils/image-utils"
import Link from "next/link"

export default function HomeCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const autoRotateTimerRef = useRef<NodeJS.Timeout | null>(null)
  const transitioningRef = useRef(false)

  const carouselItems = useMemo(() => [
    {
      key: "pioneering-digital-transformation",
      alt: "Pioneering Digital Transformation - AI and blockchain solutions for digital transformation",
      title: "Pioneering Digital Transformation",
      subtitle: "Being at the forefront of digital revolutions delivering powerful, integrated solutions for your growth and success",
      buttonText: "learn more",
      buttonLink: "/services"
    },
    {
      key: "innovating-future",
      alt: "Innovating the Future - Advanced technology solutions for business innovation",
      title: "Innovating the Future",
      subtitle: "Dive into the world of advanced AI and blockchain solutions, and explore tailor-made technologies shaping a sustainable digital future.",
      buttonText: "explore solutions",
      buttonLink: "/services"
    },
    {
      key: "shaping-sota-technologies",
      alt: "Shaping State-of-the-Art Technologies - Cutting-edge AI and blockchain implementation",
      title: "Shaping Sota Technologies",
      subtitle: "Leveraging cutting-edge AI and Blockchain technologies for smarter solutions across industries.",
      buttonText: "our services",
      buttonLink: "/services"
    },
  ], [])

  const goToNextSlide = useCallback(() => {
    if (transitioningRef.current) return

    transitioningRef.current = true
    setActiveIndex((prevIndex) => (prevIndex + 1) % carouselItems.length)

    setTimeout(() => {
      transitioningRef.current = false
    }, 1000) // Match this with the transition duration
  }, [carouselItems.length])

  useEffect(() => {
    const startAutoRotate = () => {
      if (autoRotateTimerRef.current) {
        clearInterval(autoRotateTimerRef.current)
      }
      autoRotateTimerRef.current = setInterval(() => {
        goToNextSlide()
      }, 6000)
    }

    startAutoRotate() 

    return () => {
      if (autoRotateTimerRef.current) {
        clearInterval(autoRotateTimerRef.current)
      }
    }
  }, [goToNextSlide])

  const currentItem = carouselItems[activeIndex];

  return (
    <>
      {/* Desktop Carousel - Hidden on mobile, fixed to cover the entire viewport */}
      <div className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen hidden md:block overflow-hidden -z-10">
        <section
          className="w-full h-full"
          aria-roledescription="carousel"
          aria-label="Featured projects and services"
        >
          <div className="relative w-full h-full overflow-hidden">
            {carouselItems.map((item, index) => (
              <div
                key={item.key}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                  index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
                aria-hidden={index !== activeIndex}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${index + 1} of ${carouselItems.length}: ${item.title}`}
              >
                <div className="relative w-full h-full">
                  <ClientImage
                    src={getBlobImage(item.key)}
                    alt={item.alt}
                    fill
                    className="object-cover brightness-75 w-screen h-screen"
                    objectPosition="center center"
                    priority={index === 0}
                    sizes="100vw"
                    itemProp="image"
                    itemScope
                    itemType="https://schema.org/ImageObject"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-800/50 via-gray-700/40 to-gray-800/50"></div>
                </div>
              </div>
            ))}
          </div>

          {currentItem && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none pt-20">
              <div className="container mx-auto px-4 flex justify-center">
                <div className="max-w-3xl text-white bg-black/30 p-8 rounded-lg backdrop-blur-sm shadow-xl pointer-events-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center lowercase">
                      {currentItem.title.toLowerCase()}
                    </h1>
                    <p className="text-lg mb-6 text-center">
                      {currentItem.subtitle}
                    </p>
                    <div className="flex justify-center">
                      <Link 
                        href={currentItem.buttonLink} 
                        className="btn inline-block px-8 py-3 bg-black text-white hover:bg-neutral-700 transition-colors duration-300 rounded-md lowercase"
                      >
                        {currentItem.buttonText}
                      </Link>
                    </div>
                </div>
              </div>
            </div>
          )}

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                itemListElement: carouselItems.map((item, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  url: `#${item.key}`,
                  name: item.title,
                  image: getBlobImage(item.key),
                })),
              }),
            }}
          />
        </section>
      </div>
    </>
  )
}
