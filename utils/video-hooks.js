'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook to preload a video file
 * @param {string} src - URL of the video file to preload
 * @param {string} fallbackSrc - Fallback URL if the main one fails
 * @returns {Object} - Status of the preload operation
 */
export function useVideoPreload(src, fallbackSrc = null) {
  const [status, setStatus] = useState({
    isLoading: true,
    isLoaded: false,
    error: null,
    usedFallback: false,
    activeSource: src
  });

  useEffect(() => {
    if (!src) {
      setStatus({
        isLoading: false,
        isLoaded: false,
        error: new Error('No source provided'),
        usedFallback: false,
        activeSource: null
      });
      return;
    }

    // Create an HTMLVideoElement to preload the video
    const video = document.createElement('video');
    let timeoutId = null;    const handleLoad = () => {
      if (timeoutId) clearTimeout(timeoutId);
      
      setStatus(prev => ({
        ...prev,
        isLoading: false,
        isLoaded: true,
        error: null
      }));
    };

    const handleError = (err) => {      
      if (timeoutId) clearTimeout(timeoutId);
      
      // Try fallback if available
      if (fallbackSrc && status.activeSource !== fallbackSrc) {
        setStatus(prev => ({
          ...prev,
          activeSource: fallbackSrc,
          usedFallback: true
        }));
        
        // The effect will run again with the fallback source
      } else {
        // No fallback or fallback also failed
        setStatus(prev => ({
          ...prev,
          isLoading: false,
          isLoaded: false,
          error: err || new Error('Unknown video loading error')
        }));
      }
    };

    // Set a timeout for loading
    timeoutId = setTimeout(() => {
      handleError(new Error('Video preload timed out'));
    }, 10000); // 10 seconds timeout

    // Set up event listeners
    video.addEventListener('loadeddata', handleLoad);    video.addEventListener('error', handleError);
    
    // Start preloading
    video.src = status.activeSource;
    video.load();

    // Clean up
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      video.removeEventListener('loadeddata', handleLoad);
      video.removeEventListener('error', handleError);
      video.src = '';
      video.load();
    };
  }, [src, fallbackSrc, status.activeSource]);

  return status;
}

/**
 * Custom hook to check if the device is in power saving mode
 * @returns {boolean} - True if the device is likely in power saving mode
 */
export function usePowerSavingMode() {
  const [isPowerSaving, setIsPowerSaving] = useState(false);
  
  useEffect(() => {    // Check if the browser supports battery API
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      // Use proper type handling for Battery API
      const getBattery = navigator.getBattery || undefined;
      if (getBattery) {
        getBattery.call(navigator).then(battery => {
          // If battery level is low, assume power saving mode
          if (battery.level < 0.2 && !battery.charging) {
            setIsPowerSaving(true);
          }
          
          // Listen for battery changes
          battery.addEventListener('levelchange', () => {
            setIsPowerSaving(battery.level < 0.2 && !battery.charging);
          });
          
          battery.addEventListener('chargingchange', () => {
            setIsPowerSaving(battery.level < 0.2 && !battery.charging);
          });
        });
      }
    }
      // Check for data saver mode
    if (navigator && typeof navigator === 'object') {
      // Access the connection API safely
      const nav = navigator;
      if ('connection' in nav) {
        const connection = nav.connection;
        if (connection && 'saveData' in connection) {
          setIsPowerSaving(prev => prev || connection.saveData);
          
          // Listen for changes
          connection.addEventListener('change', () => {
            setIsPowerSaving(prev => prev || connection.saveData);
          });
        }
      }
    }
    
    // Chrome's experimental power save mode
    if (navigator && typeof navigator === 'object') {
      const nav = navigator;
      if ('powerSaveMode' in nav) {
        setIsPowerSaving(prev => prev || nav.powerSaveMode);
      }
    }
  }, []);
  
  return isPowerSaving;
}
