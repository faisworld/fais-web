/**
 * Sitemap Date Updater (ESM version)
 * 
 * This script updates the lastmod dates in the sitemap.xml file
 * to the current date. Run it as part of the build process.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define path to sitemap.xml
const SITEMAP_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');

// Get today's date in YYYY-MM-DD format
const getFormattedDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Update the sitemap dates
const updateSitemapDates = () => {
  try {
    // Check if sitemap.xml exists
    if (!fs.existsSync(SITEMAP_PATH)) {
      console.error(`Sitemap not found at: ${SITEMAP_PATH}`);
      console.log('Make sure to run "next-sitemap" before running this script.');
      return;
    }

    // Read the sitemap file
    let sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf8');
    const today = getFormattedDate();
    
    // Replace all lastmod dates with today's date using regex
    const dateRegex = /(<lastmod>)(.+?)(<\/lastmod>)/g;
    const updatedContent = sitemapContent.replace(dateRegex, `$1${today}$3`);
    
    // Check if any replacements were made
    if (updatedContent === sitemapContent) {
      console.log('No lastmod tags found or dates already up to date.');
    } else {
      // Write the updated content back to the sitemap
      fs.writeFileSync(SITEMAP_PATH, updatedContent, 'utf8');
      console.log(`Updated all lastmod dates to ${today}`);
    }
  } catch (error) {
    console.error('Error updating sitemap dates:', error);
  }
};

// Execute the update function
updateSitemapDates();
