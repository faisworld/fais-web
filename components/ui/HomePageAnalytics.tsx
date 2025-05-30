'use client';

import { useEffect } from 'react';
import { track } from '@vercel/analytics';

export default function HomePageAnalytics() {
  useEffect(() => {
    // Track homepage visit
    track('homepage_visit', {
      timestamp: new Date().toISOString(),
      source: 'direct'
    });
  }, []);

  return null; // This component doesn't render anything
}
