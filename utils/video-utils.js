'use client';

import React from 'react';

// Core video utilities focused on robust video display

/**
 * @typedef {Object} VideoPlayerProps
 * @property {string} src - Video source URL
 * @property {string} [fallbackSrc] - Fallback video source if primary fails
 * @property {string} [poster] - Poster image URL
 * @property {(string|number)} [width=100%] - Video width
 * @property {(string|number)} [height=auto] - Video height
 * @property {string} [className] - Additional CSS classes
 * @property {Function} [onError] - Error handler callback
 * @property {Function} [onLoaded] - Loaded event callback
 * @property {boolean} [disableInLowPower] - Whether to disable video in low power mode
 */

/**
 * Basic video player component with error handling
 */
export function SimpleVideo({ 
  src, 
  fallbackSrc,
  poster,
  width = '100%', 
  height = 'auto', 
  className = '',
  onError = null,
  onLoaded = null,
  disableInLowPower = false
}) {
  const [isLowPower, setIsLowPower] = React.useState(false);
    // Check power-saving mode on mount
  React.useEffect(() => {
    if (!disableInLowPower) return;
    
    // Only check data saver mode
    if (navigator?.connection?.saveData) {
      setIsLowPower(true);
    }
  }, [disableInLowPower]);
  
  // If in low power mode and disableInLowPower is true, render poster image instead
  if (isLowPower && disableInLowPower) {
    return (
      <div 
        style={{ 
          width, 
          height,
          background: `url(${poster}) center/cover no-repeat`,
          position: 'relative'
        }}
        className={className}
      >
        <div style={{ 
          position: 'absolute', 
          bottom: '10px', 
          right: '10px',
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          Video disabled (power saving mode)
        </div>
      </div>
    );
  }
  
  const handleError = (e) => {
    console.error('Video error:', e);
    
    // Try fallback if available
    if (fallbackSrc && e.target.src !== fallbackSrc) {
      console.log('Trying fallback video source:', fallbackSrc);
      e.target.src = fallbackSrc;
      e.target.load();
    }
    
    if (onError) onError(e);
  };
  
  const handleLoaded = (e) => {
    console.log('Video loaded successfully');
    if (onLoaded) onLoaded(e);
  };

  return (
    <video 
      src={src} 
      width={width} 
      height={height} 
      poster={poster}
      autoPlay 
      muted 
      loop 
      playsInline
      onError={handleError}
      onLoadedData={handleLoaded}
      className={className}
    />
  );
}
