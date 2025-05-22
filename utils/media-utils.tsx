'use client';

import type React from 'react';
import Image from 'next/image';

// ===== IMAGE UTILITIES =====

/**
 * Helper function to get a Vercel Blob URL for an image
 */
export function getBlobImageUrl(path: string): string {
  // Base URL for your Vercel Blob storage
  const blobBaseUrl = 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com';

  // If the path already starts with http, assume it's already a full URL
  if (path.startsWith('http')) {
    return path;
  }

  // If the path already starts with the blob base URL, return it as is
  if (path.startsWith(blobBaseUrl)) {
    return path;
  }

  // Ensure the path starts with a slash
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path;

  // Return the full URL
  return `${blobBaseUrl}/${normalizedPath}`;
}

/**
 * Generate a placeholder image URL
 */
export function getPlaceholderImage(text: string, width = 400, height = 300): string {
  return `/placeholder.svg?width=${width}&height=${height}&query=${encodeURIComponent(text)}`;
}

// Map of friendly names to actual blob URLs or placeholder SVGs
export const blobImages: { [key: string]: string } = {
  // Use actual Blob URLs for logos
  logo: 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Logo_white_fais-e1734783482439-0gYn1yvp1J0Oud09HvWZK7ePuLfaC4.png',
  'logo-black': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1746460117071-logo-fais-black.png',

  // Carousel and feature images
  'pioneering-digital-transformation': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/carousel/carousel-video-shaping-sota-technologies.mp4',
  'innovating-future': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1747831531794-tmpw2j61nje.mp4',
  'shaping-sota-technologies': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/carousel/carousel-video-innovating-the-future.mp4',

  // Solutions section images
  'ai-solutions': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1747076648350-20250512-2151-Futuristic-Office-Collaboration-simple-compose-01jv2xcqegeqzsm27xw0wayv3d.gif',
  'blockchain-solutions': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1747076641901-20250512-2155-Futuristic-Blockchain-Technology-simple-compose-01jv2xkk35fg99g5m1yecjjxa3.gif',
  
  // Project images
  'web3-gaming': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1747069232372-20250512-1951-Web3-Gaming-Revolution-simple-compose-01jv2phxzzeprrz0e36tjat8hy.gif',   
  'payment-systems': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1747075171305-20250512-2057-Futuristic-Blockchain-Payments-remix-01jv2tacjdf7prr72x36a3r710.gif',
  'mev-staking': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1747055425140-20250511-2158-Futuristic-Data-Connectivity-simple-compose-01jv0bd9emep8ssw4bwmkwkptb.gif',
  'nft-marketplace': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1747055463123-20250511-2149-AI-Glow-Effect-storyboard-01jv0aw3mvf7et4sgshfjs7z7v.gif',
  'ai-services': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1747055432399-20250511-2154-Digital-Harmony-simple-compose-01jv0b560pexvvbv6we6kkm31v.gif',
  
  // Projects page specific images
  'projects-dopple-ai': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Screenshot-2025-01-05-160711-X4TsCx0Tznl0kEKC9xteDtdk9eifzt.png',
  'projects-degen-kombat': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Screenshot-2025-01-05-160251-a1hFy83k9Rfzoenroo51nuUuLpXwXr.png',
  'projects-heroes-of-mavia': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Screenshot-2025-01-05-160852-CbIqDoFaMOWTENTm4tNfniGclPjKo3.png',
  'projects-multichain-dex': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Screenshot-2025-01-05-165735-YrpRehlPFZCuhQHFooDAEqol59jfjx.png',
  'projects-payment-system': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Screenshot-2025-01-05-174629-wxPq1MW2OplBB8V70zjeSN9RqpQ7W0.png',
  'projects-optimism-io': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Screenshot-2025-01-05-175331-WPpSHQyWIcLYFLTcfZHXYLrpY93PIx.png',
  'projects-blast-io': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Screenshot-2025-01-05-172306-qOsrwGzaEfz7gHuseaH756pBDbR88Y.png',
  'projects-base-org': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Screenshot-2025-01-05-172939-8HJfc36gfs5XyiuijmGkMiJgjnvIGI.png',

  // Services and about page images
  'services-og-image': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1746529491566-Shaping-State-of-The-Art-Technologies-.gif',
  'ceo-portrait': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1746354931230-instantid-1746354169011.webp',
  'service-image-1': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/service-image-1.webp',
  'service-image-2': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/service-image-2.webp',
  'service-image-3': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/service-image-3.webp',
  'service-image-4': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/service-image-4.webp',
  
  // About page images
  'about-mission-image': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1747069236709-20250512-1428-Futuristic-Innovation-Hub-simple-compose-01jv242h1dexrbkgvw5vn5wx5v.gif',
  'about-vision-image': '/placeholder.svg?width=500&height=300&query=Vision%20Image',
  'about-value-innovation-image': '/placeholder.svg?width=300&height=200&query=Innovation%20Value',
  'about-value-integrity-image': '/placeholder.svg?width=300&height=200&query=Integrity%20Value',
  'about-value-collaboration-image': '/placeholder.svg?width=300&height=200&query=Collaboration%20Value',
  'about-team-member-eugene-lukyanov-image': '/placeholder.svg?width=200&height=200&query=Eugene%20Lukyanov',
  'about-team-member-andrii-stehno-image': '/placeholder.svg?width=200&height=200&query=Andrii%20Stehno',
  'about-team-member-julia-mazura-image': '/placeholder.svg?width=200&height=200&query=Julia%20Mazura',
  'about-team-member-vitalii-melnyk-image': '/placeholder.svg?width=200&height=200&query=Vitalii%20Melnyk',
};

/**
 * Get an image URL from the Blob storage by its friendly name
 */
export function getBlobImage(key: string, fallback?: string): string {
  // If the provided key is already a full URL, return it
  if (key && typeof key === 'string' && key.startsWith('http')) {
    return key;
  }

  // Return the mapped URL or fallback
  return (key && blobImages[key]) || fallback || getPlaceholderImage(key || 'Image');
}

/**
 * Error handler for image loading failures
 */
export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>): void {
  console.warn(`Failed to load image: ${e.currentTarget.src}`);

  // Extract dimensions from the current image if possible
  const width = e.currentTarget.width || 400;
  const height = e.currentTarget.height || 300;
  const alt = e.currentTarget.alt || 'Image';

  // Only replace with placeholder if not already a placeholder
  if (!e.currentTarget.src.includes('placeholder.svg')) {
    e.currentTarget.src = `/placeholder.svg?width=${width}&height=${height}&query=${encodeURIComponent(alt)}`;
    e.currentTarget.onerror = null; // Prevent infinite error loop
  }
}

// ===== MEDIA TYPE DETECTION =====

/**
 * Determine if an image is a GIF
 */
export function isGif(url: string): boolean {
  return url?.toLowerCase().endsWith('.gif') || false;
}

/**
 * Determine if a URL is for a video
 */
export function isVideo(url: string): boolean {
  if (!url) return false;
  
  // Check file extensions
  const videoExtensions = ['.mp4', '.webm', '.mov', '.m4v', '.avi', '.mpg', '.mpeg', '.wmv', '.flv'];
  const hasVideoExtension = videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  
  // Check URL patterns that indicate video content
  const videoPatterns = [
    '/video/', 
    'video-',
    'carousel-video',  // Added this pattern to detect your carousel video
    '/videos/'
  ];
  const hasVideoPattern = videoPatterns.some(pattern => url.toLowerCase().includes(pattern));
  
  return hasVideoExtension || hasVideoPattern;
}

/**
 * Get appropriate image component props based on image type
 */
export function getImageProps(url: string) {
  const isAnimated = isGif(url);
  const isVideoContent = isVideo(url);

  if (isVideoContent) {
    return {
      unoptimized: true,
      loading: 'eager' as 'eager' | 'lazy',
    };
  }

  return {
    unoptimized: isAnimated, // Don't optimize GIFs to preserve animation
    loading: isAnimated ? 'eager' : ('lazy' as 'eager' | 'lazy'),
  };
}

// ===== VIDEO UTILITIES =====

/**
 * Video play queue to manage playback and prevent race conditions
 */
class VideoPlayQueue {
  private pendingPlays: Map<string, HTMLVideoElement> = new Map();
  private isProcessing: boolean = false;
  private activeVideo: { id: string; video: HTMLVideoElement } | null = null;
  
  /**
   * Add a video to the play queue with an identifier
   */
  public queueVideo(id: string, video: HTMLVideoElement): void {
    // Cancel any previous attempt for this ID
    if (this.pendingPlays.has(id)) {
      try {
        const previousVideo = this.pendingPlays.get(id);
        if (previousVideo) {
          previousVideo.pause();
        }
      } catch {
        // Ignore errors
      }
    }

    // If this is a new active video, release the old one
    if (this.activeVideo && this.activeVideo.id !== id) {
      try {
        this.activeVideo.video.pause();
      } catch {
        // Ignore errors during cleanup
      }
      this.activeVideo = null;
    }
    
    this.pendingPlays.set(id, video);
    this.processQueue();
  }
  
  /**
   * Clear the queue - useful when navigating away or changing slides
   */
  public clearQueue(): void {
    // Pause all videos in the queue
    for (const [, video] of this.pendingPlays) {
      try {
        video.pause();
      } catch {
        // Ignore errors
      }
    }
    
    // Clear the active video
    if (this.activeVideo) {
      try {
        this.activeVideo.video.pause();
      } catch {
        // Ignore errors
      }
      this.activeVideo = null;
    }
    
    this.pendingPlays.clear();
  }
  
  /**
   * Process the video play queue to avoid race conditions
   */
  private processQueue(): void {
    if (this.isProcessing || this.pendingPlays.size === 0) return;
    
    this.isProcessing = true;
    
    // Process the oldest video first (FIFO)
    const [id, video] = Array.from(this.pendingPlays.entries())[0];
    this.pendingPlays.delete(id);
    
    // Try to play the video
    this.safePlayVideo(video, id)
      .then(() => {
        // Store as active video if successfully played
        this.activeVideo = { id, video };
      })
      .catch(err => console.error('Error playing video:', err))
      .finally(() => {
        this.isProcessing = false;
        // Continue processing the queue after a delay
        if (this.pendingPlays.size > 0) {
          setTimeout(() => this.processQueue(), 100);
        }
      });
  }
  
  /**
   * Safely attempt to play a video with proper error handling
   */
  private async safePlayVideo(video: HTMLVideoElement, id: string): Promise<void> {
    if (!video) return;

    // Check if the video element has sources
    const hasSource = 
      (video.src && video.src !== '') || 
      video.querySelectorAll('source').length > 0;

    if (!hasSource) {
      console.warn(`Video ${id} has no source available`);
      throw new Error(`Video has no source available`);
    }

    try {
      // Ensure the video is ready to play
      if (video.readyState < 2) {
        console.log(`Video ${id} not ready yet, waiting...`);
        
        // Wait for the video to be ready
        await new Promise<void>((resolve, reject) => {
          const handleCanPlay = () => {
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('error', handleError);
            resolve();
          };
            
          const handleError = () => {
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('error', handleError);
            
            let errorMessage = 'Unknown error';
            if (video.error) {
              // Get more detailed error information from the MediaError object
              const errorCodes = {
                1: 'MEDIA_ERR_ABORTED',
                2: 'MEDIA_ERR_NETWORK',
                3: 'MEDIA_ERR_DECODE',
                4: 'MEDIA_ERR_SRC_NOT_SUPPORTED'
              };
              
              const code = video.error.code as keyof typeof errorCodes;
              errorMessage = errorCodes[code] || video.error.message || 'Unknown error';
              
              // Log additional information for debugging
              console.error(`Video error code: ${video.error.code}`);
              console.error(`Video source: ${video.src}`);
              console.error(`Video network state: ${video.networkState}`);
            }
            
            reject(new Error(`Video load error: ${errorMessage}`));
          };
          
          video.addEventListener('canplay', handleCanPlay);
          video.addEventListener('error', handleError);
          
          // Set a timeout in case the video never loads
          setTimeout(() => {
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('error', handleError);
            
            // If the video is loading, continue with playback attempt
            if (video.readyState >= 2) {
              resolve();
            } else {
              // Log the network state for debugging
              const networkStateMap = {
                0: 'NETWORK_EMPTY',
                1: 'NETWORK_IDLE', 
                2: 'NETWORK_LOADING',
                3: 'NETWORK_NO_SOURCE'
              };
              console.warn(`Video timeout: Network state is ${networkStateMap[video.networkState as keyof typeof networkStateMap]}`);
              console.warn(`Video source: ${video.src}`);
              
              // Try one more load attempt
              try {
                video.load();
                setTimeout(() => {
                  if (video.readyState >= 2) {
                    resolve();
                  } else {
                    reject(new Error('Video loading timed out after retry'));
                  }
                }, 3000);
              } catch {
                reject(new Error('Video loading timed out'));
              }
            }
          }, 10000); // Increased timeout to 10 seconds
          
          // Make sure video is loading
          try {
            if (video.networkState !== HTMLMediaElement.NETWORK_LOADING) {
              video.load();
            }
          } catch (e) {
            console.error('Error loading video:', e);
          }
        });
      }
      
      // Reset to beginning for consistent experience
      video.currentTime = 0;
      
      // Try to play the video with a small delay to avoid browser throttling
      await new Promise<void>(resolve => setTimeout(resolve, 50));
      await video.play();
      
      console.log(`Video ${id} playing successfully`);
      return;
    } catch (error) {
      console.warn(`Play attempt failed for video ${id}:`, error);
      throw error;
    }
  }
}

// Create a singleton instance to use across the application
export const videoPlayQueue = new VideoPlayQueue();

/**
 * Check if a video URL is valid
 */
export function isValidVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  if (url.includes('placeholder')) return false;
  if (!url.startsWith('http')) return false;
  
  return true;
}

/**
 * Determine the MIME type for a video URL
 */
export function getVideoMimeType(url: string): string {
  if (url.endsWith('.mp4')) return 'video/mp4';
  if (url.endsWith('.webm')) return 'video/webm';
  if (url.endsWith('.ogg')) return 'video/ogg';
  
  return 'video/mp4'; // Default to MP4
}

/**
 * Safely play a video element with error handling
 */
export async function safePlayVideo(
  video: HTMLVideoElement | null, 
  id: string
): Promise<void> {
  if (!video) return;
  
  // Add to the queue to avoid race conditions
  videoPlayQueue.queueVideo(id, video);
}

// ===== MEDIA RENDERING UTILITIES =====

/**
 * Render a media item (image or video) with proper fallbacks and error handling
 * @param url The media URL
 * @param altText Alt text for the media
 * @returns JSX for the rendered media
 */
export function renderMedia(url: string, altText: string = 'Media', options: {
  imgClassName?: string;
  videoClassName?: string;
  containerClassName?: string;
  onVideoPlay?: () => void;
  onVideoEnd?: () => void;
} = {}) {
  const {
    imgClassName = 'w-full h-full object-cover',
    videoClassName = 'w-full h-full object-cover',
    containerClassName = 'relative w-full h-full',
  } = options;

  // Determine media type
  const mediaType = isVideo(url) ? 'video' : (isGif(url) ? 'gif' : 'image');
  
  return (
    <div className={containerClassName}>
      {mediaType === 'video' ? (
        <video
          src={url}
          className={videoClassName}
          playsInline
          muted
          loop
          autoPlay
          onPlay={options.onVideoPlay}
          onEnded={options.onVideoEnd}
          onError={(e) => {
            console.warn(`Failed to load video: ${url}`);
            // Optionally replace with placeholder
            (e.target as HTMLVideoElement).poster = getPlaceholderImage(altText);
          }}
        />
      ) : (
        <Image
          src={url}
          alt={altText}
          className={imgClassName}
          onError={(e) => {
            handleImageError(e);
          }}
          fill
          style={{ objectFit: 'cover' }}
          {...getImageProps(url)}
        />
      )}
    </div>
  );
}
