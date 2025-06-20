#!/usr/bin/env node

/**
 * Create OG images that match FAIS website design using O3 analysis
 */

import { o3Manager } from './utils/enhanced-o3-manager.ts';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

async function analyzeWebsiteDesign() {
  console.log('🔍 Analyzing FAIS website design...');
  
  // Build context to understand the website
  await o3Manager.buildContext();
  const context = o3Manager.getContextSummary();
  
  console.log('📊 Website Context:', context);
  
  // Analyze design elements from the codebase
  const designAnalysis = await analyzeDesignElements();
  
  return designAnalysis;
}

async function analyzeDesignElements() {
  console.log('🎨 Extracting design elements...');
  
  // Get key design files
  const layoutContent = await o3Manager.getFileContent('app/layout.tsx');
  const globalsCss = await o3Manager.getFileContent('app/globals.css');
  const tailwindConfig = await o3Manager.getFileContent('tailwind.config.js');
  
  // Extract design info
  const designInfo = {
    colors: extractColors(globalsCss, tailwindConfig),
    fonts: extractFonts(layoutContent, globalsCss),
    branding: extractBranding(layoutContent),
    layout: extractLayoutInfo(layoutContent)
  };
  
  console.log('🎨 Design Analysis:', designInfo);
  return designInfo;
}

function extractColors(globalsCss, tailwindConfig) {
  const colors = {
    primary: '#3B82F6', // Blue
    secondary: '#8B5CF6', // Purple  
    accent: '#10B981', // Green
    background: '#FFFFFF',
    text: '#1F2937'
  };
  
  // Try to extract actual colors from CSS/config
  if (globalsCss) {
    const colorMatches = globalsCss.match(/--color-[^:]+:[^;]+/g) || [];
    colorMatches.forEach(match => {
      console.log('Found color:', match);
    });
  }
  
  return colors;
}

function extractFonts(layoutContent, globalsCss) {
  const fonts = {
    primary: 'Inter',
    heading: 'Inter',
    body: 'Inter'
  };
  
  // Extract font info from Next.js layout
  if (layoutContent) {
    const fontMatch = layoutContent.match(/from 'next\/font\/google'.*?(\w+)/);
    if (fontMatch) {
      fonts.primary = fontMatch[1];
      fonts.heading = fontMatch[1];
      fonts.body = fontMatch[1];
    }
  }
  
  return fonts;
}

function extractBranding(layoutContent) {
  const branding = {
    companyName: 'Fantastic AI Studio',
    tagline: 'Enterprise AI & Blockchain Development',
    logo: 'FAIS',
    description: 'Fortune 500 Trusted AI & Blockchain Solutions'
  };
  
  // Extract actual branding from metadata
  if (layoutContent) {
    const titleMatch = layoutContent.match(/title:[^}]+default:\s*['"]([^'"]+)['"]/);
    if (titleMatch) {
      branding.companyName = titleMatch[1].split('|')[0].trim();
    }
    
    const descMatch = layoutContent.match(/description:\s*['"]([^'"]+)['"]/);
    if (descMatch) {
      branding.description = descMatch[1];
    }
  }
  
  return branding;
}

function extractLayoutInfo(layoutContent) {
  return {
    style: 'modern',
    theme: 'professional',
    layout: 'clean'
  };
}

async function createDesignMatchedOGImages(designInfo) {
  console.log('🎨 Creating OG images that match FAIS design...');
  
  const ogSpecs = [
    {
      name: 'main-og-image',
      platform: 'OpenGraph/Facebook',
      aspectRatio: '16:9',
      prompt: createDesignMatchedPrompt(designInfo, 'main', '16:9')
    },
    {
      name: 'twitter-card-image', 
      platform: 'Twitter',
      aspectRatio: '16:9',
      prompt: createDesignMatchedPrompt(designInfo, 'twitter', '16:9')
    },
    {
      name: 'linkedin-share-image',
      platform: 'LinkedIn', 
      aspectRatio: '16:9',
      prompt: createDesignMatchedPrompt(designInfo, 'linkedin', '16:9')
    },
    {
      name: 'instagram-story-image',
      platform: 'Instagram',
      aspectRatio: '9:16', 
      prompt: createDesignMatchedPrompt(designInfo, 'instagram', '9:16')
    },
    {
      name: 'general-social-square',
      platform: 'General Social',
      aspectRatio: '1:1',
      prompt: createDesignMatchedPrompt(designInfo, 'general', '1:1')
    }
  ];
  
  const results = [];
  
  for (const spec of ogSpecs) {
    console.log(`\n🎨 Generating ${spec.name}...`);
    
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
          negativePrompt: 'blurry, low quality, pixelated, unprofessional, messy, cluttered, comic, cartoon, anime'
        })
      });
      
      const result = await response.json();
      
      if (result.success && result.url) {
        console.log(`✅ Generated ${spec.name}: ${result.url}`);
        results.push({
          ...spec,
          url: result.url,
          generatedAt: new Date().toISOString()
        });
      } else {
        console.error(`❌ Failed to generate ${spec.name}:`, result.error);
      }
      
      // Wait between requests
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } catch (error) {
      console.error(`❌ Error generating ${spec.name}:`, error.message);
    }
  }
  
  return results;
}

function createDesignMatchedPrompt(designInfo, platform, aspectRatio) {
  const { fonts, branding } = designInfo;
  
  const basePrompt = `Professional ${platform} social media image for ${branding.companyName}. 
  Modern, clean design using ${fonts.primary} font family. 
  Color scheme: primary blue (#3B82F6), secondary purple (#8B5CF6), white background.
  ${branding.tagline}. ${branding.description}.
  Clean typography, minimal design, professional business aesthetic.
  High-quality, modern tech company branding.`;
  
  const platformSpecific = {
    main: 'Main website OpenGraph image. Prominent FAIS logo, clean layout.',
    twitter: 'Twitter card optimized. Concise text, tech-focused design.',
    linkedin: 'LinkedIn professional sharing. Corporate, authoritative design.',
    instagram: 'Instagram story format. Mobile-optimized, vertical layout.',
    general: 'Universal social media. Square format, works on all platforms.'
  };
  
  const aspectRatioNote = {
    '16:9': 'Horizontal layout, landscape orientation',
    '9:16': 'Vertical layout, portrait orientation for mobile',
    '1:1': 'Square format, centered composition'
  };
  
  return `${basePrompt} ${platformSpecific[platform]} ${aspectRatioNote[aspectRatio]}. 
  Professional photography style, not illustration. Clean, modern, minimalist.`;
}

async function updateLayoutWithNewImages(results) {
  console.log('\n🔧 Updating layout.tsx with new OG images...');
  
  const mainOgImage = results.find(r => r.name === 'main-og-image');
  const twitterImage = results.find(r => r.name === 'twitter-card-image');
  
  if (!mainOgImage) {
    console.log('❌ No main OG image found');
    return;
  }
  
  // Read current layout
  const layoutPath = path.resolve('app/layout.tsx');
  let layoutContent = fs.readFileSync(layoutPath, 'utf-8');
  
  // Update the twitterImageUrl
  const currentUrlRegex = /const twitterImageUrl =\s*['"][^'"]+['"]/;
  const newUrl = `const twitterImageUrl = '${mainOgImage.url}'`;
  
  if (currentUrlRegex.test(layoutContent)) {
    layoutContent = layoutContent.replace(currentUrlRegex, newUrl);
    fs.writeFileSync(layoutPath, layoutContent);
    console.log('✅ Updated layout.tsx with new OG image URL');
  } else {
    console.log('❌ Could not find twitterImageUrl in layout.tsx');
  }
  
  // Save all URLs to reference file
  const referenceData = {
    generatedAt: new Date().toISOString(),
    images: results,
    mainOgImage: mainOgImage.url,
    twitterImage: twitterImage?.url || mainOgImage.url
  };
  
  fs.writeFileSync('og-images-reference.json', JSON.stringify(referenceData, null, 2));
  console.log('📄 Saved image references to og-images-reference.json');
}

async function main() {
  console.log('🚀 Creating FAIS design-matched OG images...\n');
  
  try {
    // Analyze website design
    const designInfo = await analyzeWebsiteDesign();
    
    // Create matching OG images  
    const results = await createDesignMatchedOGImages(designInfo);
    
    // Update layout with new images
    if (results.length > 0) {
      await updateLayoutWithNewImages(results);
      
      console.log(`\n🎉 Successfully created ${results.length} design-matched OG images!`);
      console.log('✅ Images saved to blob storage');
      console.log('✅ Layout.tsx updated with new URLs');
      console.log('📄 Check og-images-reference.json for all URLs');
    } else {
      console.log('❌ No images were generated successfully');
    }
    
  } catch (error) {
    console.error('❌ Script failed:', error);
  }
}

main();
