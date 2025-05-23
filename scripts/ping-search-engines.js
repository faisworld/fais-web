/**
 * Sitemap Ping Tool
 * 
 * This script pings search engines to notify them of sitemap updates.
 * Run this after deploying a new version of your site.
 */

import https from 'https';
import http from 'http';

const SITE_URL = 'https://fais.world';
// Use sitemap index for search engine pings
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
  }
];

/**
 * Ping a search engine with the sitemap URL
 * @param {Object} engine The search engine to ping
 */
function pingSearchEngine(engine) {
  return new Promise((resolve) => {
    const protocol = engine.url.startsWith('https') ? https : http;
    
    const req = protocol.get(engine.url, (res) => {
      const { statusCode } = res;
      
      res.on('data', () => {}); // Just consume the data without storing it
      res.on('end', () => {
        if (statusCode < 200 || statusCode >= 300) {
          console.log(`❌ ${engine.name} ping failed with status: ${statusCode}`);
          resolve(false);
        } else {
          console.log(`✅ ${engine.name} successfully pinged (${statusCode})`);
          resolve(true);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error(`❌ Error pinging ${engine.name}: ${error.message}`);
      resolve(false);
    });
    
    req.end();
  });
}

/**
 * Ping all search engines
 */
async function pingAllSearchEngines() {
  console.log(`🔍 Pinging search engines for sitemap: ${SITEMAP_URL}`);
  console.log('==================================================');
  
  const results = [];
  
  for (const engine of searchEngines) {
    try {
      const result = await pingSearchEngine(engine);
      results.push({ engine: engine.name, success: result });
    } catch (error) {
      console.error(`Error with ${engine.name}: ${error.message}`);
      results.push({ engine: engine.name, success: false });
    }
  }
  
  console.log('==================================================');
  console.log('Summary:');
  
  const successful = results.filter(r => r.success).length;
  console.log(`✅ ${successful}/${results.length} search engines successfully pinged`);
  
  return results;
}

// Run the ping operation
pingAllSearchEngines();
