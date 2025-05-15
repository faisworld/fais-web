import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface MediaItem {
  url: string;
  type: 'image' | 'video';
  alt?: string;
}

interface CarouselProps {
  items: MediaItem[];
  autoPlay?: boolean;
  interval?: number;
  showControls?: boolean;
  className?: string;
}

export default function Carousel({
  items,
  autoPlay = true,
  interval = 5000,
  showControls = true,
  className = '',
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  
  // Detect media type based on URL
  const getMediaType = (url: string): 'image' | 'video' => {
    const videoExtensions = ['.mp4', '.webm', '.mov', '.m4v', '.avi'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext)) ? 'video' : 'image';
  };

  // Map items to include type if not provided
  const mediaItems = items.map(item => ({
    ...item,
    type: item.type || getMediaType(item.url)
  }));

  // Auto advance slides (but not for videos)
  useEffect(() => {
    if (!autoPlay || isPaused) return;
    
    const currentItem = mediaItems[currentIndex];
    if (currentItem.type === 'video') return; // Don't auto-advance during videos
    
    const timer = setTimeout(() => {
      goToNext();
    }, interval);
    
    return () => clearTimeout(timer);
  }, [currentIndex, autoPlay, isPaused]);

  // Handle video playback
  useEffect(() => {
    const currentItem = mediaItems[currentIndex];
    
    // Pause all videos first
    videoRefs.current.forEach(video => {
      if (video) {
        video.pause();
      }
    });
    
    // Play current video if it's a video slide
    if (currentItem.type === 'video' && videoRefs.current[currentIndex]) {
      const video = videoRefs.current[currentIndex];
      if (video) {
        video.currentTime = 0;
        video.play().catch(e => console.error('Video play error:', e));
      }
    }
  }, [currentIndex]);

  // Next and previous controls
  const goToPrevious = () => {
    setCurrentIndex(current => 
      current === 0 ? mediaItems.length - 1 : current - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(current => 
      current === mediaItems.length - 1 ? 0 : current + 1
    );
  };

  // Handle direct navigation
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Toggle video playback
  const toggleVideoPlayback = () => {
    const currentItem = mediaItems[currentIndex];
    if (currentItem.type !== 'video') return;
    
    const video = videoRefs.current[currentIndex];
    if (!video) return;
    
    if (video.paused) {
      video.play().catch(e => console.error('Video play error:', e));
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  };

  // Render media item based on type
  const renderMediaItem = (item: MediaItem, index: number) => {
    if (item.type === 'video') {
      return (
        <video
          ref={el => { videoRefs.current[index] = el; }}
          src={item.url}
          className="w-full h-full object-cover"
          muted
          playsInline
          onEnded={goToNext}
          onClick={toggleVideoPlayback}
        />
      );
    } else {
      return (
        <img
          src={item.url}
          alt={item.alt || `Slide ${index + 1}`}
          className="w-full h-full object-cover"
        />
      );
    }
  };

  return (
    <div 
      className={`relative overflow-hidden media-carousel ${className}`}
      aria-roledescription="carousel"
    >
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {mediaItems.map((item, index) => (
          <div key={index} className="w-full flex-shrink-0">
            {renderMediaItem(item, index)}
          </div>
        ))}
      </div>
      
      {showControls && mediaItems.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
          
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            {mediaItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`mx-1 w-3 h-3 rounded-full ${
                  index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
          
          {mediaItems[currentIndex].type === 'video' && (
            <button
              onClick={toggleVideoPlayback}
              className="carousel-video-control"
              aria-label={isPaused ? 'Play video' : 'Pause video'}
            >
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
            </button>
          )}
        </>
      )}
    </div>
  );
}
