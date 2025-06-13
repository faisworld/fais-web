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

// Function to get actual blog posts from blog-data.ts
const getBlogPosts = () => {
  try {
    // Read the blog-data.ts file
    const blogDataPath = path.join(process.cwd(), 'app', 'blog', 'blog-data.ts');
    const blogDataContent = fs.readFileSync(blogDataPath, 'utf8');
    
    // Extract blog posts array from the TypeScript file
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
        }
      } catch {
        console.warn(`Could not parse date: ${dateStr}`);
      }
      
      blogPosts.push({
        url: `/blog/${slug}`,
        date: formattedDate,
        changefreq: 'weekly',
        priority: 0.8
      });
    }
    
    console.log(`Found ${blogPosts.length} blog posts from blog-data.ts`);
    return blogPosts;
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
};

const blogPosts = getBlogPosts();

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
