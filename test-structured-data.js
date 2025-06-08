// Script to test structured data implementation
const puppeteer = require('puppeteer');
const fs = require('fs');

async function testStructuredData() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  const testPages = [
    'http://localhost:3000',
    'http://localhost:3000/services',
    'http://localhost:3000/ai-services',
    'http://localhost:3000/blockchain-services',
    'http://localhost:3000/blog',
    'http://localhost:3000/contact'
  ];
  
  const results = {};
  
  for (const url of testPages) {
    try {
      console.log(`Testing: ${url}`);
      await page.goto(url, { waitUntil: 'networkidle0' });
      
      // Extract all JSON-LD structured data
      const structuredData = await page.evaluate(() => {
        const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
        return scripts.map(script => {
          try {
            return JSON.parse(script.textContent);
          } catch (e) {
            return { error: e.message, content: script.textContent };
          }
        });
      });
      
      results[url] = structuredData;
      console.log(`Found ${structuredData.length} structured data items on ${url}`);
      
    } catch (error) {
      console.error(`Error testing ${url}:`, error.message);
      results[url] = { error: error.message };
    }
  }
  
  // Save results to file
  fs.writeFileSync('structured-data-results.json', JSON.stringify(results, null, 2));
  console.log('Results saved to structured-data-results.json');
  
  await browser.close();
}

// Check if puppeteer is available, if not provide manual testing instructions
try {
  testStructuredData().catch(console.error);
} catch (error) {
  console.log('Puppeteer not available. Please test manually:');
  console.log('1. Open your browser developer tools');
  console.log('2. Visit each page and look for <script type="application/ld+json"> tags');
  console.log('3. Copy the JSON content and validate at: https://validator.schema.org/');
  console.log('4. Test with Google Rich Results Test: https://search.google.com/test/rich-results');
}
