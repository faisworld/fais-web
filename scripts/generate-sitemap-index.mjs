// Generate sitemap index for FAIS website
// References the main sitemap.xml and blog-sitemap.xml
// Run with node generate-sitemap-index.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base site URL
const SITE_URL = 'https://fais.world';

// Today's date
const today = new Date().toISOString().split('T')[0];

// Generate sitemap index XML
const generateSitemapIndex = () => {
  // XML header
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Add main sitemap
  xml += '  <sitemap>\n';
  xml += `    <loc>${SITE_URL}/sitemap.xml</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += '  </sitemap>\n';
  
  // Add blog sitemap
  xml += '  <sitemap>\n';
  xml += `    <loc>${SITE_URL}/blog-sitemap.xml</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += '  </sitemap>\n';
  
  // Close XML
  xml += '</sitemapindex>';
  
  return xml;
};

// Write sitemap index to file
const writeSitemapIndex = () => {
  const sitemapIndex = generateSitemapIndex();
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap-index.xml');
  
  fs.writeFileSync(sitemapPath, sitemapIndex, 'utf8');
  console.log(`Sitemap index generated at ${sitemapPath}`);
};

// Execute the sitemap index generation
try {
  console.log('Starting sitemap index generation...');
  writeSitemapIndex();
  console.log('Sitemap index generation completed.');
} catch (error) {
  console.error('Error generating sitemap index:', error);
}
