/**
 * Sitemap Date Updater
 * 
 * This script updates the lastmod dates in the sitemap.xml file
 * to the current date. Run it as part of the build process.
 */

const fs = require('fs');
const path = require('path');

const SITEMAP_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');

// Get today's date in YYYY-MM-DD format
const getFormattedDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Update the sitemap dates
const updateSitemapDates = () => {
  try {
    // Check if sitemap exists
    if (!fs.existsSync(SITEMAP_PATH)) {
      console.error('❌ Sitemap file not found!');
      return;
    }

    // Read the sitemap file
    let sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf8');
    const today = getFormattedDate();

    // Update all lastmod dates
    // This uses a regex to find and replace the lastmod tags
    const updatedContent = sitemapContent.replace(
      /<lastmod>(.*?)<\/lastmod>/g,
      `<lastmod>${today}</lastmod>`
    );

    // Write the updated content back to the file
    fs.writeFileSync(SITEMAP_PATH, updatedContent, 'utf8');
    console.log('✅ Sitemap dates updated to', today);
  } catch (error) {
    console.error('❌ Error updating sitemap dates:', error);
  }
};

// Run the update function
updateSitemapDates();
