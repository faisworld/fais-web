'use client';

import { useState, useRef } from 'react';

interface BasicVideoPlayerProps {
  videoUrl: string;
  fallbackUrl?: string;
  posterUrl?: string;
  className?: string;
  height?: string;
}

export default function BasicVideoPlayer({
  videoUrl,
  fallbackUrl,
  posterUrl,
  className = '',
  height = '100%'
}: BasicVideoPlayerProps) {
  const [showFallback, setShowFallback] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle video error
  const handleVideoError = () => {
    if (fallbackUrl) {
      console.log('Video error detected, switching to fallback URL');
      setShowFallback(true);
    }
  };

  // Log when the video starts playing
  const handlePlaying = () => {
    console.log('Video is now playing!');
  };

  // Log when the video metadata is loaded
  const handleLoadedMetadata = () => {
    console.log('Video metadata loaded successfully');
  };

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ height }}>
      {!showFallback ? (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl}
          onError={handleVideoError}
          onPlaying={handlePlaying}
          onLoadedMetadata={handleLoadedMetadata}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <video
          src={fallbackUrl}
          poster={posterUrl}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  );
}
