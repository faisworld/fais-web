'use client';

import React, { useEffect, useRef, useState } from 'react';
import VideoFallback from '@/components/ui/VideoFallback';
import '@/app/services/services-video.css';

// Enhanced video component specifically for the services page
const EnhancedServiceVideo = () => {
  // Properly type the video reference
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  // Remove unused variable warning with ESLint disable comment
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentSource, setCurrentSource] = useState('');
  const remoteVideoUrl = 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/videos/8b42303a-6fd5-4e3e-99dc-ff5d2c207ead.mp4';
  const localVideoUrl = '/videos/services-video.mp4';
    // Check if browser is in low-power mode
  useEffect(() => {
    // Check for data saver mode
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) {
      setFailedAttempts(3); // Force fallback
    }
  }, []);
    useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const handleLoadStart = (): void => {
      setIsLoaded(false);
    };
    
    const handleLoaded = (): void => {
      setIsLoaded(true);
      setHasError(false);
      setFailedAttempts(0); // Reset failed attempts on successful load
      setCurrentSource(videoElement.currentSrc);
      
      // Ensure video plays after loading
      videoElement.play().catch(() => {
        setFailedAttempts(prev => prev + 1);
      });
    };
    
    const handleError = (): void => {
      setHasError(true);
      setFailedAttempts(prev => prev + 1);
      
      // Try to switch to the next source
      const sources = Array.from(videoElement.querySelectorAll('source'));
      const currentSrc = videoElement.currentSrc;
      const currentIndex = sources.findIndex((source: HTMLSourceElement) => 
        source.src === currentSrc || source.src === new URL(currentSrc, window.location.href).href
      );
      
      if (currentIndex >= 0 && currentIndex < sources.length - 1) {
        const nextSource = (sources[currentIndex + 1] as HTMLSourceElement).src;
        videoElement.src = nextSource;
        videoElement.load();
      }
    };
    
    // Add event listeners
    videoElement.addEventListener('loadstart', handleLoadStart);
    videoElement.addEventListener('loadeddata', handleLoaded);
    videoElement.addEventListener('error', handleError);
    
    // Cleanup
    return () => {
      videoElement.removeEventListener('loadstart', handleLoadStart);
      videoElement.removeEventListener('loadeddata', handleLoaded);
      videoElement.removeEventListener('error', handleError);
    };
  }, [failedAttempts]);

  return (
    <>
      {/* Show fallback component if all video sources have failed after multiple attempts */}
      {failedAttempts >= 3 ? (
        <VideoFallback 
          title="Our Services" 
          description="Delivering innovative solutions that transform businesses for the digital era" 
        />
      ) : (
        <div className="services-video-container">
          <div className="absolute inset-0">
            {/* Status indicators for debugging */}
            {!isLoaded && !hasError && (
              <div className="video-loading-indicator">
                Loading video...
              </div>
            )}
            
            {hasError && (
              <div className="video-error-indicator">
                Video error. Using fallback...
              </div>
            )}
            
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/videos/services-poster.svg"
              className="services-video"
            >
              {/* Local source first for faster loading */}
              <source src={localVideoUrl} type="video/mp4" />
              <source src={remoteVideoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          
          <div className="services-video-overlay">
            <div className="services-video-content">
              <h1 className="services-video-title">Our Services</h1>
              <p className="services-video-description">
                Delivering innovative solutions that transform businesses for the digital era
              </p>
            </div>
          </div>        </div>
      )}
    </>
  );
};

export default EnhancedServiceVideo;
