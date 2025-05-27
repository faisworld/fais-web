'use client';

import { useEffect, useState } from 'react';
import { checkVideoAvailability } from '@/app/actions/video-checker';

// Define types for VideoChecker props and state
interface VideoCheckResult {
  success: boolean;
  message: string;
  statusCode?: number;
  contentType?: string;
  contentLength?: string;
}

interface VideoCheckerProps {
  videoUrl: string;
  showDetails?: boolean;
}

interface VideoCheckerState {
  loading: boolean;
  success?: boolean;
  message?: string;
  statusCode?: number;
  contentType?: string;
  contentLength?: string;
}

/**
 * Component that checks if videos are accessible from Vercel Blob storage
 */
export default function VideoChecker({ videoUrl, showDetails = false }: VideoCheckerProps) {
  const [status, setStatus] = useState<VideoCheckerState>({ loading: true });
  
  useEffect(() => {
    async function checkVideo() {
      if (!videoUrl) return;
      
      setStatus({ loading: true });
      
      try {
        const result = await checkVideoAvailability(videoUrl) as VideoCheckResult;
        setStatus({
          loading: false,
          ...result
        });
        
        // Log result to console for debugging
        console.log('Video check result:', result);
      } catch (error) {
        setStatus({
          loading: false,
          success: false,
          message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    }
    
    checkVideo();
  }, [videoUrl]);
  
  // Don't render anything in production unless showDetails is true
  if (process.env.NODE_ENV === 'production' && !showDetails) {
    return null;
  }
    // Only show in development and when there's an error
  if (!status.loading && !status.success) {
    return (
      <div style={{ 
        padding: '4px 8px', 
        margin: '4px',
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        border: '1px solid #ff0000',
        borderRadius: '4px',
        fontSize: '12px',
        position: 'absolute',
        bottom: '8px',
        right: '8px',
        zIndex: 20
      }}>
        <div>Video unavailable ❌</div>
      </div>
    );
  }
  
  return null;
}
