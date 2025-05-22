'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import ClientImage from '@/components/ui/ClientImage'
import { getBlobImage } from '@/utils/media-utils'
import Link from 'next/link'

export default function HomeCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const autoRotateTimerRef = useRef<NodeJS.Timeout | null>(null)
  const transitioningRef = useRef(false)

  const carouselItems = useMemo(() => [
    {
      key: 'pioneering-digital-transformation',
      alt: 'Pioneering Digital Transformation - AI and blockchain solutions for digital transformation',
      title: 'Pioneering Digital Transformation',
      subtitle: 'Being at the forefront of digital revolutions delivering powerful, integrated solutions for your growth and success',
      buttonText: 'learn more',
      buttonLink: '/projects'
    },
    {
      key: 'innovating-future',
      alt: 'Innovating the Future - Advanced technology solutions for business innovation',
      title: 'Innovating the Future',
      subtitle: 'Dive into the world of advanced AI and blockchain solutions, and explore tailor-made technologies shaping a sustainable digital future.',
      buttonText: 'explore solutions',
      buttonLink: '/services'
    },
    {
      key: 'shaping-sota-technologies',
      alt: 'Shaping State-of-the-Art Technologies - Cutting-edge AI and blockchain implementation',
      title: 'Shaping Sota Technologies',
      subtitle: 'Leveraging cutting-edge AI and Blockchain technologies for smarter solutions across industries.',
      buttonText: 'our services',
      buttonLink: '/ai-services'
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
  
  const goToPrevSlide = useCallback(() => {
    if (transitioningRef.current) return
    
    transitioningRef.current = true
    setActiveIndex((prevIndex) => (prevIndex - 1 + carouselItems.length) % carouselItems.length)
    
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
  const renderSlideMedia = (slide: typeof carouselItems[number], index: number) => {
    // Get the URL for the media
    const mediaUrl = getBlobImage(slide.key);
    
    // Check if media is a video (by URL pattern or special key)
    const isVideoItem = 
      slide.key === 'shaping-sota-technologies' ||
      mediaUrl.match(/\.(mp4|webm|mov)$/i) || 
      mediaUrl.includes('video');
      
    if (isVideoItem) {
      return (
        <video
          src={mediaUrl}
          className='absolute inset-0 w-full h-full object-cover'
          autoPlay
          muted
          loop
          playsInline
        />
      );
    }
    
    // Otherwise render as image - use fill without width/height
    return (
      <ClientImage
        src={getBlobImage(slide.key)}
        alt={slide.alt}
        fill={true}
        className='object-cover brightness-75'
        priority={index === 0} // Load first slide with priority
        sizes='100vw'
        itemProp='image'
        itemScope
        itemType='https://schema.org/ImageObject'
      />
    );
  };

  return (
    <>
      {/* Desktop Carousel - Hidden on mobile, fixed to cover the entire viewport */}
      <div className='fixed top-0 left-0 right-0 bottom-0 w-screen h-screen hidden md:block overflow-hidden -z-10'>
        <section
          className='w-full h-full'
          aria-roledescription='carousel'
          aria-label='Featured projects and services'
        >          <div className='relative w-full h-full overflow-hidden'>
            {carouselItems.map((item, index) => (
              <div
                key={item.key}
                className={`absolute inset-0 w-screen h-screen transition-opacity duration-1000 ${
                  index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
                aria-hidden={index !== activeIndex}
                role='group'
                aria-roledescription='slide'
                aria-label={`Slide ${index + 1} of ${carouselItems.length}: ${item.title}`}
              >
                <div
                  className='relative w-screen h-screen'
                  style={{ top: 0, height: '100vh' }}
                >
                  {renderSlideMedia(item, index)}
                </div>
              </div>
            ))}
            
            {/* Navigation Arrows */}
            <button 
              onClick={goToPrevSlide}
              className='absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-black/20 hover:bg-black/40 text-white/70 hover:text-white/90 transition-all focus:outline-none'
              aria-label='Previous slide'
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={goToNextSlide}
              className='absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-black/20 hover:bg-black/40 text-white/70 hover:text-white/90 transition-all focus:outline-none'
              aria-label='Next slide'
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>          {currentItem && (
            <div className='absolute inset-0 flex items-center justify-center z-20 pointer-events-none pt-20'>
              <div className='container mx-auto px-4 flex justify-center'>
                <div className='max-w-3xl text-white bg-black/30 p-8 rounded-lg backdrop-blur-sm shadow-xl pointer-events-auto'>
                    <h1 className='text-4xl md:text-5xl font-bold mb-4 text-center lowercase'>
                      {currentItem.title.toLowerCase()}
                    </h1>
                    <p className='text-lg mb-6 text-center'>
                      {currentItem.subtitle}
                    </p>
                    <div className='flex justify-center'>
                      <Link 
                        href={currentItem.buttonLink} 
                        className='btn inline-block px-8 py-3 bg-black text-white hover:bg-neutral-700 transition-colors duration-300 rounded-md lowercase'
                      >
                        {currentItem.buttonText}
                      </Link>
                    </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Slide indicators */}
          <div className='absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-2'>
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!transitioningRef.current) {
                    transitioningRef.current = true;
                    setActiveIndex(index);
                    setTimeout(() => {
                      transitioningRef.current = false;
                    }, 1000);
                  }
                }}
                className={`w-3 h-3 rounded-full ${
                  index === activeIndex 
                    ? 'bg-white/80' 
                    : 'bg-white/30 hover:bg-white/50'
                } transition-all duration-300`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : 'false'}
              />
            ))}
          </div>

          <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                itemListElement: carouselItems.map((item, index) => ({
                  '@type': 'ListItem',
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
