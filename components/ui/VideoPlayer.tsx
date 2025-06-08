'use client';

import { useRef, useState, useEffect } from 'react';

interface VideoPlayerProps {
  src: string | string[];
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
}

export default function VideoPlayer({
  src,
  poster,
  className = '',
  autoPlay = false,
  loop = true,
  muted = false,
  controls = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const sources = Array.isArray(src) ? src : [src];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      if (autoPlay && muted) {
        // Ensure autoplay works by explicitly calling play
        video.play().catch((error) => {
          console.warn('Autoplay failed:', error);
        });
      }
    };

    const handleError = () => {
      setHasError(true);
      setIsLoaded(true);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [autoPlay, muted]);

  return (
    <div className={`relative w-full ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center rounded-lg">
          <div className="text-white text-center">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm">Loading video...</p>
          </div>
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
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ display: isLoaded ? 'block' : 'none' }}
      >
        {sources.map((source, idx) => (
          <source key={idx} src={source} type="video/mp4" />
        ))}
        Your browser does not support the video tag.
      </video>

      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg">
          <div className="text-gray-600 text-center">
            <p className="text-sm">Unable to load video content</p>
          </div>
        </div>
      )}
    </div>
  );
}