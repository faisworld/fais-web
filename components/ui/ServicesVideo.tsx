'use client';

import { useEffect, useRef, useState } from 'react';

interface ServicesVideoProps {
  primaryUrl: string;
  fallbackUrl: string;
  posterUrl?: string;
  className?: string;
}

export default function ServicesVideo({ 
  primaryUrl, 
  fallbackUrl, 
  posterUrl,
  className = ''
}: ServicesVideoProps) {
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Log events for debugging
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleLoaded = () => {
      console.log('ServicesVideo: Metadata loaded');
      setIsLoading(false);
    };
    
    const handleError = (e: ErrorEvent) => {
      console.error('ServicesVideo: Error loading video', e);
      setVideoError(true);
      setIsLoading(false);
    };
    
    const handlePlaying = () => {
      console.log('ServicesVideo: Video is playing');
    };
    
    // Add event listeners
    video.addEventListener('loadedmetadata', handleLoaded);
    video.addEventListener('error', handleError as EventListener);
    video.addEventListener('playing', handlePlaying);
    
    // Clean up
    return () => {
      video.removeEventListener('loadedmetadata', handleLoaded);
      video.removeEventListener('error', handleError as EventListener);
      video.removeEventListener('playing', handlePlaying);
    };
  }, [videoRef]);
  
  // Current video URL to use
  const currentUrl = videoError ? fallbackUrl : primaryUrl;
  
  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p className="text-sm text-gray-500">Loading video...</p>
          </div>
        </div>
      )}
      
      <video
        ref={videoRef}
        src={currentUrl}
        poster={posterUrl}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
        onError={() => setVideoError(true)}
      />
    </div>
  );
}
