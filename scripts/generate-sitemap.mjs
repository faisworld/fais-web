// Generate sitemap and blog sitemap entries for FAIS website
// Run with node generate-sitemap.mjs

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

// Main site URLs with their configuration
const siteUrls = [
  // Homepage with highest priority
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  
  // Services pages
  { url: '/services', changefreq: 'monthly', priority: 0.9 },
  { url: '/blockchain-services', changefreq: 'monthly', priority: 0.9 },
  { url: '/ai-services', changefreq: 'monthly', priority: 0.9 },
  
  // Other important pages
  { url: '/about', changefreq: 'monthly', priority: 0.8 },
  { url: '/projects', changefreq: 'weekly', priority: 0.8 },
  { url: '/blog', changefreq: 'daily', priority: 0.9 },
  { url: '/contact', changefreq: 'monthly', priority: 0.8 },
  
  // Legal pages
  { url: '/privacy-policy', changefreq: 'yearly', priority: 0.5 },
  { url: '/terms-of-service', changefreq: 'yearly', priority: 0.5 },
  
  // Other pages
  { url: '/instant-id', changefreq: 'monthly', priority: 0.7 },
  { url: '/kvitka-poloniny', changefreq: 'monthly', priority: 0.7 },
  { url: '/sitemap-html', changefreq: 'monthly', priority: 0.5 },
];

// Blog posts with their publish dates
const blogPosts = [
  { url: '/blog/large-language-models-2025', date: '2025-05-08', changefreq: 'monthly', priority: 0.7 },
  { url: '/blog/blockchain-for-supply-chain', date: '2025-05-05', changefreq: 'monthly', priority: 0.7 },
  { url: '/blog/multimodal-ai-applications', date: '2025-05-03', changefreq: 'monthly', priority: 0.7 },
  { url: '/blog/defi-trends-2025', date: '2025-04-29', changefreq: 'monthly', priority: 0.7 },
  { url: '/blog/ai-governance-frameworks', date: '2025-04-26', changefreq: 'monthly', priority: 0.7 },
  { url: '/blog/nft-business-applications', date: '2025-04-24', changefreq: 'monthly', priority: 0.7 },
  { url: '/blog/ai-assisted-development', date: '2025-04-21', changefreq: 'monthly', priority: 0.7 },
  { url: '/blog/tokenization-real-world-assets', date: '2025-04-18', changefreq: 'monthly', priority: 0.7 },
];

// Generate sitemap XML
const generateSitemap = () => {
  // XML header
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Add main site URLs
  siteUrls.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}${page.url}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  // Add blog posts with their specific dates
  blogPosts.forEach(post => {
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}${post.url}</loc>\n`;
    xml += `    <lastmod>${post.date || today}</lastmod>\n`;
    xml += `    <changefreq>${post.changefreq}</changefreq>\n`;
    xml += `    <priority>${post.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  // Close XML
  xml += '</urlset>';
  
  return xml;
};

// Write sitemap to file
const writeSitemap = () => {
  const sitemap = generateSitemap();
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  console.log(`Sitemap generated at ${sitemapPath}`);
};

// Execute the sitemap generation
writeSitemap();
