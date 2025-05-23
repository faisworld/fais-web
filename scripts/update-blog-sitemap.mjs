// This script updates the sitemap.xml with blog post dates
// Usage: node scripts/update-blog-sitemap.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the sitemap.xml file
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');

// Blog posts with their publish dates for more accurate lastmod values
const blogPosts = [
  { url: 'https://fais.world/blog/large-language-models-2025', date: '2025-05-08' },
  { url: 'https://fais.world/blog/blockchain-for-supply-chain', date: '2025-05-05' },
  { url: 'https://fais.world/blog/multimodal-ai-applications', date: '2025-05-03' },
  { url: 'https://fais.world/blog/defi-trends-2025', date: '2025-04-29' },
  { url: 'https://fais.world/blog/ai-governance-frameworks', date: '2025-04-26' },
  { url: 'https://fais.world/blog/nft-business-applications', date: '2025-04-24' },
  { url: 'https://fais.world/blog/ai-assisted-development', date: '2025-04-21' },
  { url: 'https://fais.world/blog/tokenization-real-world-assets', date: '2025-04-18' },
];

// Function to update sitemap directly without XML parsing
const updateSitemap = () => {
  try {
    if (!fs.existsSync(sitemapPath)) {
      console.error(`Sitemap not found at: ${sitemapPath}`);
      return;
    }
    
    let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    
    // Update dates for each blog post
    let updatedCount = 0;
    
    blogPosts.forEach(post => {
      const urlPattern = new RegExp(`<loc>${post.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</loc>[\\s\\n]*<lastmod>([^<]+)</lastmod>`);
      if (urlPattern.test(sitemapContent)) {
        sitemapContent = sitemapContent.replace(urlPattern, `<loc>${post.url}</loc>\n  <lastmod>${post.date}</lastmod>`);
        updatedCount++;
      }
    });
    
    if (updatedCount > 0) {
      fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
      console.log(`Updated dates for ${updatedCount} blog posts in sitemap`);
    } else {
      console.log('No blog posts were found in the sitemap to update');
    }
    
  } catch (error) {
    console.error('Error updating blog sitemap:', error);
  }
};

// Execute the update function
updateSitemap();
