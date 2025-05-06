"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import ClientImage from "@/components/ui/ClientImage"
import { getBlobImage } from "@/utils/image-utils"

export default function HomeCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const autoRotateTimerRef = useRef<NodeJS.Timeout | null>(null)
  const transitioningRef = useRef(false)

  // Define carousel items with keys that match the blobImages object
  const carouselItems = [
    {
      key: "pioneering-digital-transformation",
      alt: "Pioneering Digital Transformation - AI and blockchain solutions for digital transformation",
      title: "Pioneering Digital Transformation",
    },
    {
      key: "innovating-future",
      alt: "Innovating the Future - Advanced technology solutions for business innovation",
      title: "Innovating the Future",
    },
    {
      key: "shaping-sota-technologies",
      alt: "Shaping State-of-the-Art Technologies - Cutting-edge AI and blockchain implementation",
      title: "Shaping Sota Technologies",
    },
  ]

  // Function to go to the next slide
  const goToNextSlide = useCallback(() => {
    if (transitioningRef.current) return

    transitioningRef.current = true
    setActiveIndex((prevIndex) => (prevIndex + 1) % carouselItems.length)

    // Reset the transitioning flag after animation completes
    setTimeout(() => {
      transitioningRef.current = false
    }, 1000) // Match this with the transition duration
  }, [carouselItems.length])

  // Set up auto-rotation
  useEffect(() => {
    // Start the auto-rotation timer
    const startAutoRotate = () => {
      if (autoRotateTimerRef.current) {
        clearInterval(autoRotateTimerRef.current)
      }

      autoRotateTimerRef.current = setInterval(() => {
        goToNextSlide()
      }, 5000) // Change slide every 5 seconds
    }

    // Preload images
    const preloadImages = async () => {
      try {
        await Promise.all(
          carouselItems.map((item) => {
            return new Promise((resolve) => {
              const img = new Image()
              img.src = getBlobImage(item.key)
              img.onload = resolve
              img.onerror = resolve // Still resolve on error to continue loading
            })
          }),
        )
        setImagesLoaded(true)
        startAutoRotate() // Start auto-rotation after images are loaded
      } catch (error) {
        console.error("Error preloading images:", error)
        setImagesLoaded(true)
        startAutoRotate() // Start auto-rotation even if there was an error
      }
    }

    preloadImages()

    // Clean up the timer when the component unmounts
    return () => {
      if (autoRotateTimerRef.current) {
        clearInterval(autoRotateTimerRef.current)
      }
    }
  }, [goToNextSlide])

  return (
    <>
      {/* Use a wrapper div to control the height and prevent overlap */}
      <div className="relative" style={{ height: "90vh" }}>
        {/* Full-width carousel section */}
        <section
          className="absolute left-0 right-0 w-full"
          style={{
            height: "90vh", // Explicitly set height to 90vh (much taller than before)
          }}
          aria-roledescription="carousel"
          aria-label="Featured projects and services"
        >
          {/* Carousel display - Full width with increased height */}
          <div className="relative w-full h-full overflow-hidden">
            {carouselItems.map((item, index) => (
              <div
                key={index}
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
                    className="object-cover"
                    objectPosition="top center"
                    priority={index === 0}
                    sizes="100vw"
                    itemProp="image"
                    itemScope
                    itemType="https://schema.org/ImageObject"
                  />
                  {/* Add a subtle gradient overlay to ensure text readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Loading state - Fixed to prevent overlap */}
          {!imagesLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
              <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
            </div>
          )}

          {/* Overlay content for each slide */}
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="container mx-auto px-4 flex justify-center">
              <div className="max-w-2xl text-white bg-black/10 p-6 rounded-lg backdrop-blur-[1px] pointer-events-auto">
                {activeIndex === 0 && (
                  <>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
                      Pioneering Digital Transformation
                    </h1>
                    <p className="text-lg mb-6 text-center">
                      Being at the forefront of digital revolutions delivering powerful, integrated solutions for your
                      growth and success
                    </p>
                    <div className="flex justify-center">
                      <button className="btn">Learn More</button>
                    </div>
                  </>
                )}

                {activeIndex === 1 && (
                  <>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Innovating the Future</h1>
                    <p className="text-lg mb-6 text-center">
                      Dive into the world of advanced AI and blockchain solutions, and explore tailor-made technologies
                      shaping a sustainable digital future.
                    </p>
                    <div className="flex justify-center">
                      <button className="btn">Explore Solutions</button>
                    </div>
                  </>
                )}

                {activeIndex === 2 && (
                  <>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Shaping Sota Technologies</h1>
                    <p className="text-lg mb-6 text-center">
                      Leveraging cutting-edge AI and Blockchain technologies for smarter solutions across industries.
                    </p>
                    <div className="flex justify-center">
                      <button className="btn">Our Services</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Add structured data for SEO */}
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

      {/* Add a spacer div to ensure content below doesn't overlap */}
      <div style={{ height: "20px" }}></div>
    </>
  )
}
