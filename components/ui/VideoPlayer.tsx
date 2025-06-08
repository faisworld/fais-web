'use client';

import { useRef } from 'react';

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
  const sources = Array.isArray(src) ? src : [src];

  return (
    <div className={`relative w-full ${className}`}>
      <video
        ref={videoRef}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        controls={controls}
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
      >
        {sources.map((source, idx) => (
          <source key={idx} src={source} type="video/mp4" />
        ))}
        Your browser does not support the video tag.
      </video>
    </div>
  );
}