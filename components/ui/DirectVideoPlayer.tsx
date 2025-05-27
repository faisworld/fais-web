'use client';

import { useState, useEffect, useRef } from 'react';

interface DirectVideoPlayerProps {
  sources: string[];
  poster?: string;
  className?: string;
}

export default function DirectVideoPlayer({
  sources,
  poster,
  className = ''
}: DirectVideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Log all events for debugging
    const handleCanPlay = () => {
      console.log('DirectVideoPlayer: Can play');
      setIsLoading(false);
    };
    
    const handlePlaying = () => {
      console.log('DirectVideoPlayer: Playing');
      setIsLoading(false);
    };
    
    const handleError = (e: Event) => {
      console.error('DirectVideoPlayer: Error', e);
      const videoEl = e.target as HTMLVideoElement;
      if (videoEl?.error) {
        console.error('Video error code:', videoEl.error.code);
        console.error('Video error message:', videoEl.error.message);
      }
      setError(true);
    };
    
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('error', handleError);
    
    // Force video load
    video.load();
    
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('error', handleError);
    };
  }, []);
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>Loading video...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center p-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium">Failed to load video</h3>
            <p className="text-sm text-gray-500 mt-2">Please try refreshing the page</p>
          </div>
        </div>
      )}
      
      <video
        ref={videoRef}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        controls={false}
        className="w-full h-full object-cover"
      >
        {sources.map((src, index) => (
          <source key={index} src={src} type="video/mp4" />
        ))}
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
