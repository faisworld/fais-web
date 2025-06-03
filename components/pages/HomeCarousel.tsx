'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import ClientImage from '@/components/ui/ClientImage'
import CarouselVideoPlayer from '@/components/ui/CarouselVideoPlayer'
import { getBlobImage } from '@/utils/media-utils'
import Link from 'next/link'

export default function HomeCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const autoRotateTimerRef = useRef<NodeJS.Timeout | null>(null)
  const transitioningRef = useRef(false)

  const carouselItems = useMemo(() => [
    {
      key: 'pioneering-digital-transformation',
      alt: 'Enterprise AI Development - Leading Fortune 500 AI solutions and custom machine learning development',
      title: 'Enterprise AI Development',
      subtitle: 'Transform your business with custom AI solutions trusted by Fortune 500 companies. 95% client satisfaction rate across USA, UK, Germany.',
      buttonText: 'Get Free AI Consultation',
      buttonLink: '/contact'
    },
    {
      key: 'innovating-future',
      alt: 'Blockchain Innovation - Smart contracts, DeFi platforms, and enterprise blockchain solutions',
      title: 'Blockchain Innovation Leaders',
      subtitle: 'Pioneer blockchain transformation with smart contracts, DeFi platforms, and enterprise blockchain solutions. Proven results, cutting-edge technology.',
      buttonText: 'Explore Blockchain Services',
      buttonLink: '/blockchain-services'
    },
    {
      key: 'shaping-sota-technologies',
      alt: 'Digital Transformation - AI and blockchain solutions for enterprise digital innovation',
      title: 'Digital Transformation Experts',
      subtitle: 'Accelerate your digital journey with integrated AI and blockchain solutions. Custom development, strategic consulting, measurable ROI.',
      buttonText: 'View Our Projects',
      buttonLink: '/projects'
    },
  ], [])

  const goToNextSlide = useCallback(() => {
    if (transitioningRef.current) return

    transitioningRef.current = true
    setActiveIndex((prevIndex) => (prevIndex + 1) % carouselItems.length)

    setTimeout(() => {
      transitioningRef.current = false
    }, 1000)
  }, [carouselItems.length])
  
  const goToPrevSlide = useCallback(() => {
    if (transitioningRef.current) return
    
    transitioningRef.current = true
    setActiveIndex((prevIndex) => (prevIndex - 1 + carouselItems.length) % carouselItems.length)
    
    setTimeout(() => {
      transitioningRef.current = false
    }, 1000)
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
    }  }, [goToNextSlide])

  const currentItem = carouselItems[activeIndex]

  const renderSlideMedia = (slide: typeof carouselItems[number], index: number) => {
    const mediaUrl = getBlobImage(slide.key)
    const isVideoItem = 
      slide.key === 'pioneering-digital-transformation' ||
      slide.key === 'innovating-future' ||
      slide.key === 'shaping-sota-technologies' ||
      mediaUrl.match(/\.(mp4|webm|mov)$/i) || 
      mediaUrl.includes('video')

    if (isVideoItem) {
      return (
        <CarouselVideoPlayer
          src={mediaUrl}
          isActive={index === activeIndex}
          className='absolute inset-0 w-full h-full'
        />
      )
    }
    
    return (
      <ClientImage
        src={getBlobImage(slide.key)}
        alt={slide.alt}
        fill={true}
        className='object-cover brightness-75'
        priority={index === 0}
        sizes='100vw'
        itemProp='image'
        itemScope
        itemType='https://schema.org/ImageObject'
      />
    )
  }

  return (
    <>
      {/* Desktop Carousel - Full viewport with consistent width */}
      <div className='fixed top-0 left-0 right-0 bottom-0 w-screen h-screen overflow-hidden -z-10'>
        <section
          className='w-full h-full relative'
          aria-roledescription='carousel'
          aria-label='Featured projects and services'
        >
          {/* Video/Image Container - Prevent layout shift with fixed dimensions */}
          <div className='absolute inset-0 w-full h-full overflow-hidden bg-black'>
            {carouselItems.map((item, index) => (
              <div
                key={item.key}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                  index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
                aria-hidden={index !== activeIndex}
                role='group'
                aria-roledescription='slide'
                aria-label={`Slide ${index + 1} of ${carouselItems.length}: ${item.title}`}
              >
                <div className='absolute inset-0 w-full h-full'>
                  {renderSlideMedia(item, index)}
                </div>
              </div>
            ))}
          </div>
            
          {/* Navigation Arrows - Match header padding for consistency */}
          <div className='absolute inset-0 pointer-events-none z-30'>
            <button 
              onClick={goToPrevSlide}
              className='absolute left-6 top-1/2 -translate-y-1/2 pointer-events-auto p-3 md:p-4 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm border border-white/20'
              aria-label='Previous slide'
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={goToNextSlide}
              className='absolute right-6 top-1/2 -translate-y-1/2 pointer-events-auto p-3 md:p-4 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm border border-white/20'
              aria-label='Next slide'
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Content Overlay - Match header padding */}
          {currentItem && (
            <div className='absolute inset-0 flex items-center justify-center z-20 pointer-events-none pt-20'>
              <div className='w-full px-6 flex justify-center'>
                <div className='max-w-3xl text-white bg-black/40 p-8 rounded-lg backdrop-blur-sm shadow-xl pointer-events-auto border border-white/10'>
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
          <div className='absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-3'>
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!transitioningRef.current) {
                    transitioningRef.current = true
                    setActiveIndex(index)
                    setTimeout(() => {
                      transitioningRef.current = false
                    }, 1000)
                  }
                }}
                className={`w-3 h-3 rounded-full border border-white/30 ${
                  index === activeIndex 
                    ? 'bg-white/90 shadow-lg' 
                    : 'bg-white/20 hover:bg-white/40'
                } transition-all duration-300 backdrop-blur-sm`}
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
