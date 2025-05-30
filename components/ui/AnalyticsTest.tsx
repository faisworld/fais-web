"use client";

import { useEffect } from 'react';
import { track } from '@vercel/analytics';

export default function AnalyticsTest() {
  useEffect(() => {
    // Test analytics with a custom event
    if (typeof window !== 'undefined') {
      console.log('Analytics test component loaded');
      console.log('Current hostname:', window.location.hostname);
      console.log('Current pathname:', window.location.pathname);
      console.log('User agent:', navigator.userAgent);
      
      // Check if analytics script is loaded
      const vercelScripts = document.querySelectorAll('script[src*="vercel"]');
      console.log('Vercel scripts found:', vercelScripts.length);
      
      // Check for insights endpoints
      const checkInsights = async () => {
        try {
          const response = await fetch('/_vercel/insights/script.js', { method: 'HEAD' });
          console.log('Analytics script endpoint status:', response.status);
        } catch (error) {
          console.log('Analytics script endpoint error:', error);
        }
      };
      
      checkInsights();
      
      // Track a test event
      track('analytics_test', {
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
        hostname: window.location.hostname
      });
      
      // Log to help debug
      console.log('Analytics test event sent');
      
      // Monitor network requests for analytics
      const originalFetch = window.fetch;
      window.fetch = function(...args) {
        if (args[0]?.toString().includes('insights')) {
          console.log('Analytics request:', args[0]);
        }
        return originalFetch.apply(this, args);
      };
    }
  }, []);

  return null; // This component doesn't render anything
}
