'use client';

import { useState, useEffect, useRef, useMemo } from 'react';

interface VideoPlayerProps {
  src: string | string[];
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  height?: string | number;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  loadingTimeout?: number;
}

export default function VideoPlayer({
  src,
  poster,
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  controls = false,
  height = 'auto',
  objectFit = 'cover',
  loadingTimeout = 8000
}: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);    // Convert single src to array for consistency
  const sources = useMemo(() => (
    Array.isArray(src) ? src : [src]
  ), [src]);
  useEffect(() => {
    if (!sources || sources.length === 0) {
      setError(true);
      setIsLoading(false);
      return;
    }
    
    const video = videoRef.current;
    if (!video) return;
    
    // Reset states when src changes
    setIsLoading(true);
    setError(false);
    
    // Function to try the next source if available
    const tryNextSource = () => {
      if (currentSourceIndex < sources.length - 1) {
        setCurrentSourceIndex(prev => prev + 1);
      } else {
        setError(true);
        setIsLoading(false);
      }
    };    // Handle loaded metadata
    const handleLoaded = () => {
      setIsLoading(false);
      
      // Only attempt autoplay if it's enabled
      if (autoPlay) {
        video.play().catch(() => {
          setIsLoading(false);
        });
      }
    };      // Handle errors by trying next source
    const handleError = () => {
      tryNextSource();
    };    // Set up video element
    try {
      video.load(); // Force reload
    } catch {
      setError(true);
      setIsLoading(false);
      return;
    }
    
    // Register event listeners
    video.addEventListener('loadedmetadata', handleLoaded, { once: true });
    video.addEventListener('error', handleError);
    
    // Fallback to hide loader after specified timeout
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, loadingTimeout);

    // Cleanup function
    return () => {
      video.removeEventListener('loadedmetadata', handleLoaded);
      video.removeEventListener('error', handleError);
      clearTimeout(timeout);
    };
  }, [sources, currentSourceIndex, autoPlay, loadingTimeout]);

  return (
    <div 
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height }}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p className="text-sm text-gray-500">Loading video...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center flex-col">
          <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500">Failed to load video</p>
        </div>
      )}
        <video
        ref={videoRef}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        controls={controls}
        playsInline
        preload="auto"
        className={`object-${objectFit} w-full h-full`}
      >
        {/* Explicitly add source tags for better browser compatibility */}
        {sources.map((source, idx) => (
          <source key={idx} src={source} type="video/mp4" />
        ))}
        Your browser does not support the video tag.
      </video>
    </div>
  );
}