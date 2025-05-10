// This script updates the sitemap.xml dates and runs after the sitemap is generated
// Usage: node scripts/update-blog-sitemap.js

const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const { format } = require('date-fns');

// Path to the sitemap.xml file
const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');

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
  { url: 'https://fais.world/blog/ai-healthcare-advancements', date: '2025-04-15' },
  { url: 'https://fais.world/blog/blockchain-sustainability', date: '2025-04-12' },
  { url: 'https://fais.world/blog/ai-ml-comparison', date: '2025-04-09' },
  { url: 'https://fais.world/blog/dao-governance-models', date: '2025-04-06' }
];

async function updateSitemap() {
  try {
    // Read the sitemap.xml file
    const sitemapXml = fs.readFileSync(sitemapPath, 'utf8');
    
    // Parse the XML
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(sitemapXml);
    
    // Get the URLs
    const urls = result.urlset.url;
    
    // Update each URL
    urls.forEach(url => {
      const loc = url.loc[0];
      
      // Check if this is the blog index page
      if (loc === 'https://fais.world/blog') {
        // Set high priority for blog index
        url.priority = ['0.9'];
        url.changefreq = ['daily'];
        url.lastmod = [format(new Date(), 'yyyy-MM-dd')];
      }
      
      // Check if this is a blog post
      const blogPost = blogPosts.find(post => post.url === loc);
      if (blogPost) {
        // Set the lastmod date to the publish date of the blog post
        url.lastmod = [blogPost.date];
        url.priority = ['0.8'];
        url.changefreq = ['weekly'];
      }
    });
    
    // Create a new builder
    const builder = new xml2js.Builder();
    
    // Build the XML
    const xml = builder.buildObject(result);
    
    // Write the updated XML to the sitemap.xml file
    fs.writeFileSync(sitemapPath, xml);
    
    console.log('Sitemap updated successfully!');
  } catch (error) {
    console.error('Error updating sitemap:', error);
  }
}

updateSitemap();
