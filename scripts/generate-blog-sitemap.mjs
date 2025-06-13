// Generate blog sitemap for FAIS website
// Run with node generate-blog-sitemap.mjs

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

// Blog posts with their publish dates
const blogPosts = [
  { url: '/blog/large-language-models-2025', date: '2025-05-08', changefreq: 'weekly', priority: 0.8 },
  { url: '/blog/blockchain-for-supply-chain', date: '2025-05-05', changefreq: 'weekly', priority: 0.8 },
  { url: '/blog/multimodal-ai-applications', date: '2025-05-03', changefreq: 'weekly', priority: 0.8 },
  { url: '/blog/defi-trends-2025', date: '2025-04-29', changefreq: 'weekly', priority: 0.8 },
  { url: '/blog/ai-governance-frameworks', date: '2025-04-26', changefreq: 'weekly', priority: 0.8 },
  { url: '/blog/nft-business-applications', date: '2025-04-24', changefreq: 'weekly', priority: 0.8 },
  { url: '/blog/ai-assisted-development', date: '2025-04-21', changefreq: 'weekly', priority: 0.8 },
  { url: '/blog/tokenization-real-world-assets', date: '2025-04-18', changefreq: 'weekly', priority: 0.8 },
];

// Generate blog sitemap XML
const generateBlogSitemap = () => {
  // XML header
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Add blog main page
  xml += '  <!-- Blog Main Page -->\n';
  xml += '  <url>\n';
  xml += `    <loc>${SITE_URL}/blog</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += '    <changefreq>daily</changefreq>\n';
  xml += '    <priority>0.9</priority>\n';
  xml += '  </url>\n';
  
  // Add blog posts section header
  xml += '  \n  <!-- Blog Posts -->\n';
  
  // Add blog posts with their specific dates
  blogPosts.forEach(post => {
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}${post.url}</loc>\n`;
    xml += `    <lastmod>${post.date}</lastmod>\n`;
    xml += `    <changefreq>${post.changefreq}</changefreq>\n`;
    xml += `    <priority>${post.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  // Close XML
  xml += '</urlset>';
  
  return xml;
};

// Write blog sitemap to file
const writeBlogSitemap = () => {
  const sitemap = generateBlogSitemap();
  const sitemapPath = path.join(__dirname, '..', 'public', 'blog-sitemap.xml');
  
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  console.log(`Blog sitemap generated at ${sitemapPath}`);
};

// Execute the sitemap generation
writeBlogSitemap();
