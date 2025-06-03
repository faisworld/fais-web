'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { getOptimalObjectFit } from '@/utils/video-config'

interface CarouselVideoPlayerProps {
  src: string
  isActive: boolean
  className?: string
  style?: React.CSSProperties
}

export default function CarouselVideoPlayer({ 
  src, 
  isActive, 
  className = '',
  style = {}
}: CarouselVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [aspectRatio, setAspectRatio] = useState<number | null>(null)
  const [objectFit, setObjectFit] = useState<'cover' | 'contain'>('cover')

  const calculateOptimalFit = useCallback(() => {
    if (!aspectRatio) return 'cover'
    
    const viewportAspectRatio = window.innerWidth / window.innerHeight
    const optimalFit = getOptimalObjectFit(aspectRatio, viewportAspectRatio)
    
    // Always use cover for carousel to avoid black bars
    // Only use contain if the aspect ratio difference is extreme (>50% content loss)
    const aspectRatioDiff = Math.abs(aspectRatio - viewportAspectRatio) / viewportAspectRatio
    return aspectRatioDiff > 0.5 ? optimalFit : 'cover'
  }, [aspectRatio])
  useEffect(() => {
    const video = videoRef.current
    
    if (!video) return

    const handleLoadedMetadata = () => {
      const videoAspectRatio = video.videoWidth / video.videoHeight
      setAspectRatio(videoAspectRatio)
      setVideoLoaded(true)
    }

    const handleError = () => {
      setVideoLoaded(false)
    }

    const handleLoadStart = () => {
      setVideoLoaded(false)
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('error', handleError)
    video.addEventListener('loadstart', handleLoadStart)    // Explicitly set the source and load the video
    if (video.src !== src) {
      video.src = src
      video.load()
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('error', handleError)
      video.removeEventListener('loadstart', handleLoadStart)
    }
  }, [src])

  // Separate effect for playback control
  useEffect(() => {
    const video = videoRef.current
    if (!video) return    // Control playback based on active state
    if (isActive && videoLoaded) {
      video.play().catch(() => {
        // Silently handle play errors
      })
    } else {
      video.pause()
    }
  }, [isActive, videoLoaded, src])

  // Separate effect for calculating optimal fit
  useEffect(() => {
    if (aspectRatio) {
      const fit = calculateOptimalFit()
      setObjectFit(fit)
    }
  }, [aspectRatio, calculateOptimalFit])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (aspectRatio) {
        const fit = calculateOptimalFit()
        setObjectFit(fit)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [aspectRatio, calculateOptimalFit])

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 w-full h-full bg-black ${className}`} 
      style={style}
    >
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full transition-none`}
        style={{
          objectFit: objectFit,
          filter: 'brightness(0.9) contrast(1.05) saturate(1.1)',
        }}        autoPlay={isActive}
        muted
        loop
        playsInline
        preload="metadata"
      />
      
      {/* Enhanced gradient overlay for text readability */}
      <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30' />
      
      {/* Loading state */}
      {!videoLoaded && (
        <div className='absolute inset-0 bg-black flex items-center justify-center'>
          <div className='w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin' />
        </div>
      )}
    </div>
  )
}
