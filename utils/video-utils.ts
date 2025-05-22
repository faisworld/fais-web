"use client";

/**
 * Video management utilities
 * 
 * This file provides utilities to help manage video playback in the HomeCarousel component,
 * specifically addressing the issues with interrupted play() requests.
 */

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
      .catch(err => console.error("Error playing video:", err))
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
            console.error("Error loading video:", e);
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
