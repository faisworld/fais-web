/**
 * Sitemap Ping Tool - ESM Version
 * 
 * This script pings search engines to notify them of sitemap updates.
 * Run this after deploying a new version of your site.
 */

import https from 'https';
import http from 'http';

const SITE_URL = 'https://fais.world';
// Use sitemap index file for search engine pings
const SITEMAP_URL = `${SITE_URL}/sitemap-index.xml`;

// List of search engines to ping
const searchEngines = [
  {
    name: 'Google',
    url: `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
    method: 'get'
  },
  {
    name: 'Bing',
    url: `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
    method: 'get'
  },
  {
    name: 'Yandex',
    url: `https://webmaster.yandex.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
    method: 'get'
  }
];

/**
 * Send an HTTP(S) request to ping a search engine
 * @param {Object} engine - Search engine config
 */
const pingEngine = (engine) => {
  return new Promise((resolve) => {
    console.log(`Pinging ${engine.name}...`);
    
    const url = new URL(engine.url);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: engine.method.toUpperCase()
    };

    const requester = url.protocol === 'https:' ? https : http;
    
    const req = requester.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`✅ ${engine.name} responded with status code ${res.statusCode}`);
          resolve({
            engine: engine.name,
            success: true,
            statusCode: res.statusCode
          });
        } else {
          console.error(`❌ ${engine.name} responded with status code ${res.statusCode}`);
          resolve({
            engine: engine.name,
            success: false,
            statusCode: res.statusCode,
            response: data
          });
        }
      });
    });
    
    req.on('error', (error) => {
      console.error(`❌ Error pinging ${engine.name}:`, error.message);
      resolve({
        engine: engine.name,
        success: false,
        error: error.message
      });
    });
    
    req.end();
  });
};

/**
 * Ping all search engines in parallel
 */
const pingAllEngines = async () => {
  console.log(`Pinging search engines for sitemap: ${SITEMAP_URL}`);
  
  try {
    const results = await Promise.all(searchEngines.map(pingEngine));
    
    const successCount = results.filter(r => r.success).length;
    console.log(`\nSummary: Successfully pinged ${successCount} of ${searchEngines.length} search engines.`);
    
  } catch (error) {
    console.error('Error pinging search engines:', error);
  }
};

// Execute the ping function
pingAllEngines();
