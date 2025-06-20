#!/usr/bin/env node

/**
 * Professional OG Image Generator using HTML Canvas
 * Creates clean, professional images without AI text corruption
 */

import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// FAIS Brand Colors (extracted from your website)
const BRAND_COLORS = {
  primary: '#1e40af',      // Blue
  secondary: '#7c3aed',    // Purple  
  accent: '#06b6d4',       // Cyan
  dark: '#1f2937',         // Dark gray
  light: '#f8fafc',        // Light gray
  white: '#ffffff'
};

// OG Image specifications
const OG_SPECS = [
  {
    name: 'main-og-image',
    width: 1200,
    height: 630,
    title: 'Fantastic AI Studio',
    subtitle: 'Enterprise AI & Blockchain Development',
    description: 'Fortune 500 Trusted • USA • UK • Germany',
    style: 'gradient'
  },
  {
    name: 'twitter-card-image', 
    width: 1200,
    height: 630,
    title: 'FAIS',
    subtitle: 'AI & Blockchain Solutions',
    description: '95% Client Satisfaction • Custom Development',
    style: 'minimal'
  },
  {
    name: 'linkedin-share-image',
    width: 1200, 
    height: 630,
    title: 'Fantastic AI Studio',
    subtitle: 'Enterprise Development Company',
    description: 'Custom AI Solutions • Smart Contracts • DeFi',
    style: 'professional'
  }
];

function createGradientBackground(ctx, width, height, style) {
  if (style === 'gradient') {
    // Diagonal gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, BRAND_COLORS.primary);
    gradient.addColorStop(0.5, BRAND_COLORS.secondary);
    gradient.addColorStop(1, BRAND_COLORS.accent);
    ctx.fillStyle = gradient;
  } else if (style === 'minimal') {
    // Clean single color
    ctx.fillStyle = BRAND_COLORS.dark;
  } else if (style === 'professional') {
    // Professional blue
    ctx.fillStyle = BRAND_COLORS.primary;
  }
  
  ctx.fillRect(0, 0, width, height);
  
  // Add subtle pattern overlay
  ctx.globalAlpha = 0.1;
  for (let i = 0; i < width; i += 40) {
    for (let j = 0; j < height; j += 40) {
      ctx.fillStyle = BRAND_COLORS.white;
      ctx.fillRect(i, j, 2, 2);
    }
  }
  ctx.globalAlpha = 1;
}

function drawText(ctx, text, x, y, fontSize, color = BRAND_COLORS.white, align = 'left') {
  ctx.fillStyle = color;
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.textAlign = align;
  
  // Add text shadow for better readability
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  
  ctx.fillText(text, x, y);
  
  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

function generateOGImage(spec) {
  console.log(`🎨 Creating ${spec.name}...`);
  
  const canvas = createCanvas(spec.width, spec.height);
  const ctx = canvas.getContext('2d');
  
  // Create background
  createGradientBackground(ctx, spec.width, spec.height, spec.style);
  
  // Add logo area (placeholder circle)
  const logoSize = 80;
  const logoX = 60;
  const logoY = (spec.height - logoSize) / 2;
  
  ctx.fillStyle = BRAND_COLORS.white;
  ctx.beginPath();
  ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 0, 2 * Math.PI);
  ctx.fill();
  
  // Add "FAIS" text in logo
  ctx.fillStyle = BRAND_COLORS.primary;
  ctx.font = 'bold 24px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('FAIS', logoX + logoSize/2, logoY + logoSize/2 + 8);
  
  // Add main text
  const textStartX = logoX + logoSize + 40;
  const centerY = spec.height / 2;
  
  // Title
  drawText(ctx, spec.title, textStartX, centerY - 60, 48, BRAND_COLORS.white, 'left');
  
  // Subtitle  
  drawText(ctx, spec.subtitle, textStartX, centerY - 10, 32, BRAND_COLORS.white, 'left');
  
  // Description
  drawText(ctx, spec.description, textStartX, centerY + 35, 24, BRAND_COLORS.white, 'left');
  
  // Add decorative elements
  ctx.strokeStyle = BRAND_COLORS.accent;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(textStartX, centerY + 60);
  ctx.lineTo(textStartX + 200, centerY + 60);
  ctx.stroke();
  
  return canvas.toBuffer('image/png');
}

async function uploadToBlob(imageBuffer, filename) {
  const formData = new FormData();
  const blob = new Blob([imageBuffer], { type: 'image/png' });
  formData.append('file', blob, filename);
  formData.append('folder', 'images'); // Save to images folder, not article-images
  
  try {
    const response = await fetch('http://localhost:3000/api/admin/upload-image', {
      method: 'POST',
      headers: {
        'x-admin-token': process.env.ADMIN_TOKEN || 'your-admin-token'
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }
    
    const result = await response.json();
    return result.url;
  } catch (error) {
    console.error(`Failed to upload ${filename}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Generating professional OG images without AI text corruption...\n');
  
  const results = [];
  
  for (const spec of OG_SPECS) {
    try {
      // Generate clean image
      const imageBuffer = generateOGImage(spec);
      
      // Save locally for backup
      const localPath = path.join(projectRoot, 'public', 'temp', `${spec.name}.png`);
      fs.mkdirSync(path.dirname(localPath), { recursive: true });
      fs.writeFileSync(localPath, imageBuffer);
      console.log(`💾 Saved locally: ${localPath}`);
      
      // Upload to blob storage in correct folder
      const filename = `og-${spec.name}-${Date.now()}.png`;
      const blobUrl = await uploadToBlob(imageBuffer, filename);
      
      if (blobUrl) {
        console.log(`✅ Uploaded: ${blobUrl}`);
        results.push({
          name: spec.name,
          url: blobUrl,
          localPath: localPath
        });
      }
      
    } catch (error) {
      console.error(`❌ Failed to create ${spec.name}:`, error.message);
    }
  }
  
  // Save results
  if (results.length > 0) {
    const resultsFile = path.join(projectRoot, 'og-images-professional.json');
    fs.writeFileSync(resultsFile, JSON.stringify({
      generated: new Date().toISOString(),
      images: results,
      notes: 'Professional OG images created without AI text corruption'
    }, null, 2));
    
    console.log(`\n🎉 Generated ${results.length} professional OG images!`);
    console.log(`📄 Results saved to: ${resultsFile}`);
    
    // Generate layout update code
    const mainImage = results.find(r => r.name === 'main-og-image');
    const twitterImage = results.find(r => r.name === 'twitter-card-image');
    
    if (mainImage) {
      const layoutCode = `
// Update app/layout.tsx with these professional OG images:
const twitterImageUrl = '${twitterImage?.url || mainImage.url}';

// Replace in openGraph.images:
images: [
  {
    url: '${mainImage.url}',
    width: 1200,
    height: 630,
    alt: 'Fantastic AI Studio - Enterprise AI & Blockchain Development Company',
    type: 'image/png'
  }
],

// Replace in twitter.images:
images: [
  {
    url: '${twitterImage?.url || mainImage.url}',
    width: 1200,
    height: 630,
    alt: 'Fantastic AI Studio - Professional AI Solutions',
  }
],
      `;
      
      fs.writeFileSync(path.join(projectRoot, 'og-images-layout-update-professional.txt'), layoutCode.trim());
      console.log('📄 Layout update code generated');
    }
  }
}

main().catch(console.error);
