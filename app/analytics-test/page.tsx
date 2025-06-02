'use client';

import { useState, useEffect } from 'react';
import { track } from '@vercel/analytics';


export default function AnalyticsTestPage() {
  const [logs, setLogs] = useState<{[key: string]: string[]}>({
    analytics: [],
    pageview: [],
    event: [],
    network: []
  });
  const [analyticsStatus, setAnalyticsStatus] = useState<{status: string, className: string}>({
    status: 'Checking analytics...',
    className: 'status warning'
  });
  const [envInfo, setEnvInfo] = useState<string[]>([]);

  const log = (category: string, message: string) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    
    setLogs(prev => ({
      ...prev,
      [category]: [...prev[category], logEntry]
    }));
    console.log(logEntry);
  };

  const checkAnalytics = () => {
    log('analytics', 'Checking for Vercel Analytics...');
    
    // Check if window object exists (client-side)
    if (typeof window === 'undefined') {
      log('analytics', 'Running on server-side');
      return;
    }

    try {
      // Check for Vercel Analytics script
      const scripts = Array.from(document.getElementsByTagName('script'));
      const vercelScripts = scripts.filter(script => 
        script.src && script.src.includes('vercel')
      );
      
      vercelScripts.forEach(script => {
        log('analytics', `Found Vercel script: ${script.src}`);
      });
      
      if (vercelScripts.length === 0) {
        log('analytics', 'No Vercel scripts found');
      }
      
      // Check for analytics functions
      if (typeof (window as any).va !== 'undefined') {
        log('analytics', 'Vercel Analytics (va) object found');
        setAnalyticsStatus({
          status: 'Analytics loaded successfully',
          className: 'status success'
        });
      } else {
        log('analytics', 'Vercel Analytics (va) object NOT found');
        setAnalyticsStatus({
          status: 'Analytics not loaded',
          className: 'status error'
        });
      }
    } catch (error) {
      log('analytics', `Error checking analytics: ${error}`);
    }
  };

  const testPageView = () => {
    log('pageview', 'Testing page view...');
    
    try {
      // Use the official @vercel/analytics track function
      track('pageview', { page: '/analytics-test-page' });
      log('pageview', 'Page view tracked successfully with @vercel/analytics');
    } catch (error: any) {
      log('pageview', `Error tracking page view: ${error.message}`);
    }

    // Also try with window.va if available (using correct Vercel Analytics API)
    if (typeof window !== 'undefined' && (window as any).va) {
      try {
        (window as any).va('pageview', { page: '/analytics-test-page' });
        log('pageview', 'Page view tracked successfully with window.va');
      } catch (error: any) {
        log('pageview', `Error tracking with window.va: ${error.message}`);
      }
    }
  };

  const testCustomEvent = () => {
    log('event', 'Testing custom event...');
    
    try {
      track('custom_event', {
        action: 'button_click',
        element: 'test_button',
        section: 'analytics_test_page'
      });
      log('event', 'Custom event tracked successfully');
    } catch (error: any) {
      log('event', `Error tracking custom event: ${error.message}`);
    }
  };

  const testUserAction = () => {
    log('event', 'Testing user action...');
    
    try {
      track('user_action', {
        action: 'button_click',
        element: 'test_button'
      });
      log('event', 'User action tracked successfully');
    } catch (error: any) {
      log('event', `Error tracking user action: ${error.message}`);
    }
  };

  const testConversion = () => {
    log('event', 'Testing conversion...');
    
    try {
      track('conversion', {
        type: 'test_conversion',
        value: 1,
        currency: 'USD'
      });
      log('event', 'Conversion tracked successfully');
    } catch (error: any) {
      log('event', `Error tracking conversion: ${error.message}`);
    }
  };

  const clearLogs = () => {
    setLogs({
      analytics: [],
      pageview: [],
      event: [],
      network: []
    });
    log('analytics', 'All logs cleared');
  };

  const displayEnvInfo = () => {
    if (typeof window === 'undefined') return;
    
    const info = [
      `User Agent: ${navigator.userAgent}`,
      `URL: ${window.location.href}`,
      `Referrer: ${document.referrer || 'None'}`,
      `Screen: ${screen.width}x${screen.height}`,
      `Viewport: ${window.innerWidth}x${window.innerHeight}`,
      `Language: ${navigator.language}`,
      `Cookies Enabled: ${navigator.cookieEnabled}`,
      `Do Not Track: ${navigator.doNotTrack || 'Not set'}`,
      `Local Storage: ${typeof(Storage) !== "undefined" ? 'Available' : 'Not available'}`,
      `Session Storage: ${typeof(sessionStorage) !== "undefined" ? 'Available' : 'Not available'}`
    ];
    
    setEnvInfo(info);
  };

  useEffect(() => {
    log('analytics', 'Analytics test page loaded');
    displayEnvInfo();
    
    // Check analytics after delays to allow scripts to load
    setTimeout(checkAnalytics, 1000);
    setTimeout(checkAnalytics, 3000);
    setTimeout(checkAnalytics, 5000);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">Vercel Analytics Test Page</h1>
        <p className="text-gray-600">This page is designed to test Vercel Analytics implementation and debug any issues.</p>
      </div>

      <div className="border border-gray-300 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3">Analytics Status</h2>
        <div className={`p-2 rounded ${analyticsStatus.className === 'status success' ? 'bg-green-100 text-green-800' : 
          analyticsStatus.className === 'status error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {analyticsStatus.status}
        </div>
        <div className="bg-gray-100 p-3 rounded mt-3 font-mono text-sm max-h-48 overflow-y-auto">
          {logs.analytics.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3">Page View Tests</h2>
        <p className="text-gray-600 mb-3">Test different types of page views and navigation:</p>        <div className="space-x-2">
          <button onClick={testPageView} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
            Test Page View
          </button>
        </div>
        <div className="bg-gray-100 p-3 rounded mt-3 font-mono text-sm max-h-48 overflow-y-auto">
          {logs.pageview.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3">Custom Event Tests</h2>
        <p className="text-gray-600 mb-3">Test custom analytics events:</p>
        <div className="space-x-2">          <button onClick={testCustomEvent} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
            Test Custom Event
          </button>
          <button onClick={testUserAction} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
            Test User Action
          </button>
          <button onClick={testConversion} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
            Test Conversion
          </button>
        </div>
        <div className="bg-gray-100 p-3 rounded mt-3 font-mono text-sm max-h-48 overflow-y-auto">
          {logs.event.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3">Environment Information</h2>
        <div className="bg-gray-100 p-3 rounded font-mono text-sm">
          {envInfo.map((info, i) => (
            <div key={i}>{info}</div>
          ))}
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3">Controls</h2>
        <div className="space-x-2">
          <button onClick={checkAnalytics} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Check Analytics Again
          </button>
          <button onClick={clearLogs} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Clear Logs
          </button>
        </div>
      </div>
    </div>
  );
}
