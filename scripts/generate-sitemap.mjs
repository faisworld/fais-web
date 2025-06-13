// Generate sitemap and blog sitemap entries for FAIS website
// Run with node generate-sitemap.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ⚠️ CRITICAL: Admin routes are EXPLICITLY EXCLUDED for SEO reasons
// The admin section contains sensitive management tools and should NEVER be indexed
// All /admin/* routes are blocked in robots.txt and excluded from sitemaps

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
  { url: '/terms-of-use', changefreq: 'yearly', priority: 0.5 },
  
  // Other pages
  { url: '/kvitka-poloniny', changefreq: 'monthly', priority: 0.7 },
  { url: '/sitemap-html', changefreq: 'monthly', priority: 0.5 },
];

// Import blog data to get actual blog posts

// Function to get actual blog posts from blog-data.ts
const getBlogPosts = () => {
  try {
    // Read the blog-data.ts file
    const blogDataPath = path.join(process.cwd(), 'app', 'blog', 'blog-data.ts');
    const blogDataContent = fs.readFileSync(blogDataPath, 'utf8');
    
    // Extract blog posts array from the TypeScript file
    // This is a simple regex extraction - in production you might want to use a proper TypeScript parser
    const blogPostsMatch = blogDataContent.match(/export const blogPosts: BlogPost\[\] = \[([\s\S]*?)\];/);
    if (!blogPostsMatch) {
      console.log('No blog posts found in blog-data.ts');
      return [];
    }
    
    // Extract slug and date from each blog post
    const blogPostsText = blogPostsMatch[1];
    const slugMatches = [...blogPostsText.matchAll(/slug: ["']([^"']+)["']/g)];
    const dateMatches = [...blogPostsText.matchAll(/date: ["']([^"']+)["']/g)];
    
    const blogPosts = [];
    for (let i = 0; i < slugMatches.length && i < dateMatches.length; i++) {
      const slug = slugMatches[i][1];
      const dateStr = dateMatches[i][1];
      
      // Convert date format from "June 8, 2025" to "2025-06-08"
      let formattedDate = today; // fallback to today
      try {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toISOString().split('T')[0];
        }      } catch {
        console.warn(`Could not parse date: ${dateStr}`);
      }
      
      blogPosts.push({
        url: `/blog/${slug}`,
        date: formattedDate,
        changefreq: 'monthly',
        priority: 0.7
      });
    }
    
    console.log(`Found ${blogPosts.length} actual blog posts`);
    return blogPosts;
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
};

// Enhanced sitemap generation with comprehensive SEO optimization
const generateEnhancedSitemap = () => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
  xml += '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n';
  xml += '        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n';
  
  // Add main site URLs (ADMIN ROUTES EXPLICITLY EXCLUDED)
  siteUrls.forEach(({ url, changefreq, priority }) => {
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}${url}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${changefreq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += '  </url>\n';
  });

  // Add blog posts
  const blogPosts = getBlogPosts();
  blogPosts.forEach(post => {
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}${post.url}</loc>\n`;
    xml += `    <lastmod>${post.date || today}</lastmod>\n`;
    xml += `    <changefreq>${post.changefreq}</changefreq>\n`;
    xml += `    <priority>${post.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  return xml;
};

// Write sitemap to file
const writeSitemap = () => {
  const sitemap = generateEnhancedSitemap();
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  console.log(`Sitemap generated at ${sitemapPath}`);
};

// Execute the sitemap generation
writeSitemap();
