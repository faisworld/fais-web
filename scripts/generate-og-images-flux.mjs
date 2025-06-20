#!/usr/bin/env node

/**
 * Generate Open Graph images for social media platforms using Flux 1.1 Pro
 * Fixed version that properly uses the corrected API
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// OG Image specifications for different platforms
const OG_IMAGE_SPECS = [
  {
    name: 'main-og-image',
    platform: 'OpenGraph/Facebook',
    aspectRatio: '16:9',
    prompt: 'Professional business banner for Fantastic AI Studio, enterprise AI and blockchain development company. Modern tech design with gradient blue and purple colors, featuring AI neural network patterns, blockchain symbols, and "FAIS" logo. Clean, professional, high-tech aesthetic. Text overlay: "Fantastic AI Studio - Enterprise AI & Blockchain Development". Fortune 500 trusted company branding. 1200x630 pixels.',
    description: 'Main OG image for website and Facebook'
  },
  {
    name: 'twitter-card-image',
    platform: 'Twitter',
    aspectRatio: '16:9',
    prompt: 'Twitter card banner for Fantastic AI Studio. Modern minimalist design with tech elements, AI symbols, and blockchain graphics. Blue and purple gradient background. Clean typography with "FAIS" branding. Professional enterprise look suitable for Twitter sharing. 1200x630 pixels.',
    description: 'Optimized for Twitter cards'
  },
  {
    name: 'linkedin-share-image',
    platform: 'LinkedIn',
    aspectRatio: '16:9',
    prompt: 'LinkedIn professional share image for Fantastic AI Studio. Corporate business design with AI and blockchain elements. Professional blue color scheme, modern typography, tech patterns. Text: "Enterprise AI & Blockchain Development - Fortune 500 Trusted". Clean, authoritative, business-focused design. 1200x630 pixels.',
    description: 'Professional LinkedIn sharing image'
  }
];

// Function to generate image using the corrected Flux API
async function generateOGImage(spec) {
  console.log(`🎨 Generating ${spec.name} (${spec.platform})...`);
  
  try {
    const response = await fetch('http://localhost:3000/api/admin/ai-tools/generate-media', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': process.env.ADMIN_TOKEN || 'your-admin-token'
      },
      body: JSON.stringify({
        mediaType: 'image',
        modelIdentifier: 'black-forest-labs/flux-1.1-pro',
        prompt: spec.prompt,
        aspectRatio: spec.aspectRatio,
        negativePrompt: 'blurry, low quality, pixelated, unprofessional, messy, cluttered, inappropriate, offensive, text errors, spelling mistakes'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const result = await response.json();
    
    if (result.success && result.url) {
      console.log(`✅ Generated ${spec.name}: ${result.url}`);
      
      const imageInfo = {
        name: spec.name,
        platform: spec.platform,
        aspectRatio: spec.aspectRatio,
        url: result.url,
        description: spec.description,
        generatedAt: new Date().toISOString()
      };
      
      return imageInfo;
    } else {
      throw new Error(`Failed to generate image: ${result.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error(`❌ Failed to generate ${spec.name}:`, error.message);
    return null;
  }
}

// Function to save image references
async function saveImageReferences(imageInfos) {
  const validImages = imageInfos.filter(img => img !== null);
  
  if (validImages.length === 0) {
    console.log('❌ No images were generated successfully');
    return;
  }

  const referenceData = {
    generatedAt: new Date().toISOString(),
    totalImages: validImages.length,
    images: validImages,
    usage: {
      description: 'OpenGraph images for social media platforms',
      implementation: 'Update layout.tsx and page metadata with these URLs'
    }
  };

  // Save to public directory for easy access
  const ogImagesPath = path.join(projectRoot, 'public', 'og-images-reference.json');
  fs.writeFileSync(ogImagesPath, JSON.stringify(referenceData, null, 2));
  console.log(`📄 Saved OG images reference to ${ogImagesPath}`);

  // Generate layout.tsx code snippet
  const mainOgImage = validImages.find(img => img.name === 'main-og-image');
  const twitterImage = validImages.find(img => img.name === 'twitter-card-image');
  
  if (mainOgImage) {
    const layoutCode = `
// Updated OpenGraph image URLs - replace in app/layout.tsx
const twitterImageUrl = '${twitterImage?.url || mainOgImage.url}';

// Update the openGraph.images array:
images: [
  {
    url: '${mainOgImage.url}',
    width: 1200,
    height: 630,
    alt: 'Fantastic AI Studio - Enterprise AI & Blockchain Development Company',
    type: 'image/png'
  }
],

// Update the twitter.images array:
images: [
  {
    url: '${twitterImage?.url || mainOgImage.url}',
    width: 1200,
    height: 630,
    alt: 'Fantastic AI Studio - Innovative AI and Blockchain Solutions',
  }
],
    `;

    const codeFilePath = path.join(projectRoot, 'og-images-layout-update.txt');
    fs.writeFileSync(codeFilePath, layoutCode.trim());
    console.log(`📄 Generated layout update code: ${codeFilePath}`);
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting OG images generation for Fantastic AI Studio...\n');
    // Check if development server is running
  try {
    await fetch('http://localhost:3000/api/admin/ai-tools/generate-media', { 
      method: 'HEAD',
      headers: { 'x-admin-token': process.env.ADMIN_TOKEN || 'your-admin-token' }
    });
    console.log('✅ Development server is running');
  } catch (error) {
    console.error('❌ Development server not running or not accessible. Please run: npm run dev');
    console.error('Error:', error.message);
    process.exit(1);
  }

  const imageInfos = [];
  
  // Generate all OG images with delays between requests
  for (let i = 0; i < OG_IMAGE_SPECS.length; i++) {
    const spec = OG_IMAGE_SPECS[i];
    const imageInfo = await generateOGImage(spec);
    imageInfos.push(imageInfo);
    
    // Add delay between requests to avoid rate limiting
    if (i < OG_IMAGE_SPECS.length - 1) {
      console.log('⏳ Waiting 3 seconds before next generation...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // Save references and generate code
  await saveImageReferences(imageInfos);
  
  const successCount = imageInfos.filter(img => img !== null).length;
  console.log(`\n🎉 OG Images generation completed!`);
  console.log(`✅ Successfully generated: ${successCount}/${OG_IMAGE_SPECS.length} images`);
  
  if (successCount > 0) {
    console.log('\n🔧 Next steps:');
    console.log('1. Check og-images-layout-update.txt for code to update app/layout.tsx');
    console.log('2. Check public/og-images-reference.json for all generated URLs');
    console.log('3. Update your layout.tsx with the new image URLs');
    console.log('4. Test social media sharing on different platforms');
    console.log('\n📱 Test your OG images at: https://www.opengraph.xyz/');
  }
}

// Run the script
main().catch(console.error);
