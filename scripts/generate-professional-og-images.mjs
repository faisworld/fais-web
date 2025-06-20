#!/usr/bin/env node

/**
 * Generate professional OG images for FAIS website
 * Uses O3 assistant to understand design and creates text-free images
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Professional OG image specifications (NO TEXT in prompts to avoid corrupted text)
const OG_IMAGE_SPECS = [
  {
    name: 'main-og-image',
    platform: 'OpenGraph/Facebook',
    aspectRatio: '16:9',
    prompt: 'Professional technology company banner. Modern abstract design with neural network patterns, blockchain geometric shapes, gradient from deep blue to purple. Minimalist high-tech aesthetic. No text, no letters, no numbers. Clean professional background suitable for overlaying company information. Corporate tech branding style.',
    description: 'Main OG image for website and Facebook'
  },
  {
    name: 'twitter-card-image',
    platform: 'Twitter',
    aspectRatio: '16:9',
    prompt: 'Twitter-optimized tech banner. Sleek modern design with AI-inspired neural network graphics, subtle blockchain symbols. Blue and purple gradient background. Abstract geometric patterns. No text, no words, no letters. Professional minimalist style suitable for social media.',
    description: 'Optimized for Twitter cards'
  },
  {
    name: 'linkedin-professional',
    platform: 'LinkedIn',
    aspectRatio: '16:9',
    prompt: 'Corporate professional background for LinkedIn. Business-grade design with subtle tech elements, AI patterns, clean geometric shapes. Professional blue color palette. Abstract technology graphics. No text, no letters, no numbers. Authoritative corporate style.',
    description: 'Professional LinkedIn sharing image'
  }
];

// Function to generate image using corrected API
async function generateOGImage(spec) {
  console.log(`🎨 Generating ${spec.name} (${spec.platform})...`);
  
  try {
    const response = await fetch('http://localhost:3000/api/admin/ai-tools/generate-media', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': process.env.ADMIN_TOKEN || 'your-admin-token'
      },      body: JSON.stringify({
        mediaType: 'image',
        modelIdentifier: 'google/imagen-4', // Using Google Imagen 4 for better quality
        prompt: spec.prompt,
        aspectRatio: spec.aspectRatio,
        folder: 'images', // Save OG images to images/ folder, not article-images/
        negativePrompt: 'text, letters, words, numbers, typography, fonts, writing, phone numbers, contact information, blurry, low quality, pixelated, unprofessional, messy, cluttered'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      return null;
    }

    const result = await response.json();
    console.log('API Response:', JSON.stringify(result, null, 2));
    
    if (result.success && result.url) {
      console.log(`✅ Generated ${spec.name}: ${result.url}`);
      
      const imageInfo = {
        name: spec.name,
        platform: spec.platform,
        aspectRatio: spec.aspectRatio,
        url: result.url,
        blobUrl: result.url, // This should be the blob storage URL
        description: spec.description,
        generatedAt: new Date().toISOString(),
        savedToBlobStorage: result.url.includes('blob.vercel-storage.com')
      };
      
      return imageInfo;
    } else if (result.imageUrl) {
      // Fallback for different response format
      console.log(`✅ Generated ${spec.name}: ${result.imageUrl}`);
      
      const imageInfo = {
        name: spec.name,
        platform: spec.platform,
        aspectRatio: spec.aspectRatio,
        url: result.imageUrl,
        blobUrl: result.imageUrl,
        description: spec.description,
        generatedAt: new Date().toISOString(),
        savedToBlobStorage: result.imageUrl.includes('blob.vercel-storage.com')
      };
      
      return imageInfo;
    } else {
      console.error(`❌ Failed to generate ${spec.name}:`, result.error || 'No URL in response');
      return null;
    }
  } catch (error) {
    console.error(`❌ Failed to generate ${spec.name}:`, error.message);
    return null;
  }
}

// Function to create design-aware prompts using O3 assistant
async function getDesignAwarePrompts() {
  console.log('🤖 Asking O3 assistant about website design...');
  
  try {
    const response = await fetch('http://localhost:3000/api/admin/ai-tools/o3-website-assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': process.env.ADMIN_TOKEN || 'your-admin-token'
      },
      body: JSON.stringify({
        message: `Analyze our FAIS website design and branding. What are the main colors, design elements, and aesthetic style we use? I need to create professional OG images for social media that match our brand. Focus on: 1) Color palette 2) Design style (modern, minimal, corporate, etc.) 3) Key visual elements. Keep response concise and focused on visual design only.`,
        conversation: []
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('O3 Design Analysis:', result.message?.substring(0, 200) + '...');
      return result.message || '';
    } else {
      console.warn('Could not get O3 design analysis, using default prompts');
      return '';
    }
  } catch (error) {
    console.warn('Error getting O3 design analysis:', error.message);
    return '';
  }
}

// Function to save image references and generate layout code
async function saveResults(imageInfos) {
  const validImages = imageInfos.filter(img => img !== null);
  
  if (validImages.length === 0) {
    console.log('❌ No images were generated successfully');
    return;
  }

  // Check how many were saved to blob storage vs fallback URLs
  const blobImages = validImages.filter(img => img.savedToBlobStorage);
  const fallbackImages = validImages.filter(img => !img.savedToBlobStorage);
  
  console.log(`📊 Results: ${blobImages.length} saved to blob storage, ${fallbackImages.length} using fallback URLs`);

  const referenceData = {
    generatedAt: new Date().toISOString(),
    totalImages: validImages.length,
    blobStorageImages: blobImages.length,
    fallbackImages: fallbackImages.length,
    images: validImages,
    usage: {
      description: 'Professional OG images for social media - text-free designs',
      recommendation: 'Add company text overlay in frontend/CSS for better control'
    }
  };

  // Save reference file
  const ogImagesPath = path.join(projectRoot, 'public', 'og-images-professional.json');
  fs.writeFileSync(ogImagesPath, JSON.stringify(referenceData, null, 2));
  console.log(`📄 Saved results to ${ogImagesPath}`);

  // Generate layout.tsx update code
  const mainOgImage = validImages.find(img => img.name === 'main-og-image');
  const twitterImage = validImages.find(img => img.name === 'twitter-card-image');
  
  if (mainOgImage) {
    const layoutCode = `
// UPDATED OG IMAGE URLS FOR app/layout.tsx
// Replace the twitterImageUrl variable with:

const twitterImageUrl = '${twitterImage?.url || mainOgImage.url}';

// Update openGraph.images:
images: [
  {
    url: '${mainOgImage.url}',
    width: 1200,
    height: 630,
    alt: 'Fantastic AI Studio - Enterprise AI & Blockchain Development Company',
    type: 'image/png'
  }
],

// Update twitter.images:
images: [
  {
    url: '${twitterImage?.url || mainOgImage.url}',
    width: 1200,
    height: 630,
    alt: 'Fantastic AI Studio - Innovative AI and Blockchain Solutions',
  }
],

// BLOB STORAGE STATUS:
// Main OG Image: ${mainOgImage.savedToBlobStorage ? '✅ Saved to blob storage' : '❌ Using fallback URL'}
// Twitter Image: ${twitterImage ? (twitterImage.savedToBlobStorage ? '✅ Saved to blob storage' : '❌ Using fallback URL') : 'Not generated'}
    `;

    const codeFilePath = path.join(projectRoot, 'og-images-layout-professional.txt');
    fs.writeFileSync(codeFilePath, layoutCode.trim());
    console.log(`📄 Generated layout update code: ${codeFilePath}`);
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting professional OG images generation for FAIS...\n');
  
  // Check if development server is running
  try {
    await fetch('http://localhost:3000/api/admin/ai-tools/generate-media', { 
      method: 'HEAD',
      headers: { 'x-admin-token': process.env.ADMIN_TOKEN || 'your-admin-token' }
    });
    console.log('✅ Development server is running');
  } catch (error) {
    console.error('❌ Development server not accessible:', error.message);
    process.exit(1);
  }

  // Get design insights from O3 assistant (optional)
  const designAnalysis = await getDesignAwarePrompts();
  if (designAnalysis) {
    console.log('📋 Got design analysis from O3 assistant\n');
  }

  const imageInfos = [];
  
  // Generate all OG images
  for (let i = 0; i < OG_IMAGE_SPECS.length; i++) {
    const spec = OG_IMAGE_SPECS[i];
    const imageInfo = await generateOGImage(spec);
    imageInfos.push(imageInfo);
    
    // Add delay between requests
    if (i < OG_IMAGE_SPECS.length - 1) {
      console.log('⏳ Waiting 3 seconds before next generation...\n');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // Save results and generate code
  await saveResults(imageInfos);
  
  const successCount = imageInfos.filter(img => img !== null).length;
  const blobCount = imageInfos.filter(img => img?.savedToBlobStorage).length;
  
  console.log(`\n🎉 Professional OG Images generation completed!`);
  console.log(`✅ Successfully generated: ${successCount}/${OG_IMAGE_SPECS.length} images`);
  console.log(`💾 Saved to blob storage: ${blobCount}/${successCount} images`);
  
  if (successCount > 0) {
    console.log('\n🔧 Next steps:');
    console.log('1. Check og-images-layout-professional.txt for layout.tsx updates');
    console.log('2. These images are TEXT-FREE - add company text via CSS overlay');
    console.log('3. Test social media sharing to verify images display correctly');
    console.log('4. Images are saved to blob storage for permanent hosting');
    
    if (blobCount < successCount) {
      console.log('\n⚠️  Some images are using fallback URLs (not blob storage)');
      console.log('This might be due to blob storage upload issues - check server logs');
    }
  }
}

// Run the script
main().catch(console.error);
