"use client";

import { useEffect } from 'react';
import { track } from '@vercel/analytics';

export default function AnalyticsTest() {
  useEffect(() => {
    // Test analytics with a custom event
    if (typeof window !== 'undefined') {
      console.log('Analytics test component loaded');
      
      // Track a test event
      track('analytics_test', {
        timestamp: new Date().toISOString(),
        page: window.location.pathname
      });
      
      // Log to help debug
      console.log('Analytics test event sent');
    }
  }, []);

  return null; // This component doesn't render anything
}
