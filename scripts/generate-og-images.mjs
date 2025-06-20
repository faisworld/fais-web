#!/usr/bin/env node

/**
 * Generate Open Graph images for social media platforms
 * Using Flux 1.1 Pro via the corrected API
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
    dimensions: '1200x630',
    aspectRatio: '16:9',
    prompt: 'Professional business banner for Fantastic AI Studio, enterprise AI and blockchain development company. Modern tech design with gradient blue and purple colors, featuring AI neural network patterns, blockchain symbols, and "FAIS" logo. Clean, professional, high-tech aesthetic. Text: "Fantastic AI Studio - Enterprise AI & Blockchain Development". Fortune 500 trusted company branding.',
    description: 'Main OG image for website and Facebook'
  },
  {
    name: 'twitter-card-image',
    platform: 'Twitter',
    dimensions: '1200x630',
    aspectRatio: '16:9',
    prompt: 'Twitter card banner for Fantastic AI Studio, enterprise AI and blockchain development company. Modern minimalist design with tech elements, AI symbols, and blockchain graphics. Blue and purple gradient background. Clean typography with "FAIS" branding. Professional enterprise look suitable for Twitter sharing.',
    description: 'Optimized for Twitter cards'
  },
  {
    name: 'linkedin-share-image',
    platform: 'LinkedIn',
    dimensions: '1200x630',
    aspectRatio: '16:9',
    prompt: 'LinkedIn professional share image for Fantastic AI Studio. Corporate business design with AI and blockchain elements. Professional blue color scheme, modern typography, tech patterns. Text: "Enterprise AI & Blockchain Development - Fortune 500 Trusted". Clean, authoritative, business-focused design.',
    description: 'Professional LinkedIn sharing image'
  },
  {
    name: 'instagram-story-image',
    platform: 'Instagram',
    dimensions: '1080x1920',
    aspectRatio: '9:16',
    prompt: 'Instagram story template for Fantastic AI Studio. Vertical mobile-optimized design with AI and blockchain graphics. Modern gradient background, tech elements, and clear "FAIS" branding. Eye-catching design for Instagram stories and mobile sharing.',
    description: 'Vertical image for Instagram stories'
  },
  {
    name: 'general-social-square',
    platform: 'General Social',
    dimensions: '1200x1200',
    aspectRatio: '1:1',
    prompt: 'Square social media image for Fantastic AI Studio. Universal design suitable for all platforms. AI and blockchain themed graphics, modern tech aesthetic, "FAIS" logo prominent. Clean, professional design that works across all social media platforms.',
    description: 'Square format for universal social media use'
  }
];

// Function to generate image using Flux API
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
        negativePrompt: 'blurry, low quality, pixelated, unprofessional, messy, cluttered, inappropriate, offensive'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success && result.url) {
      console.log(`✅ Generated ${spec.name}: ${result.url}`);
      
      // Save image info to a reference file
      const imageInfo = {
        name: spec.name,
        platform: spec.platform,
        dimensions: spec.dimensions,
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

const OG_IMAGES_CONFIG = {
  // Primary site OG image
  site: {
    title: "FAIS - Fantastic AI Studio",
    subtitle: "#1 Enterprise AI & Blockchain Development Company",
    description: "Transform your business with cutting-edge AI & blockchain solutions. Trusted by Fortune 500 companies worldwide.",
    size: "1200x630", // Facebook, LinkedIn, Twitter recommended
    filename: "fais-og-main.png"
  },
  
  // Blog articles default
  blog: {
    title: "FAIS Blog",
    subtitle: "Latest AI & Blockchain Insights",
    description: "Expert insights on artificial intelligence, blockchain technology, and digital transformation.",
    size: "1200x630",
    filename: "fais-og-blog.png"
  },
  
  // Services page
  services: {
    title: "AI & Blockchain Services",
    subtitle: "Enterprise Solutions by FAIS",
    description: "Custom development, proven results, 95% satisfaction rate. Transforming businesses with AI & blockchain.",
    size: "1200x630",
    filename: "fais-og-services.png"
  },
  
  // About page
  about: {
    title: "About FAIS",
    subtitle: "Leading AI & Blockchain Innovation",
    description: "Pioneering the future of technology with cutting-edge AI and blockchain solutions for enterprises worldwide.",
    size: "1200x630",
    filename: "fais-og-about.png"
  },

  // Twitter specific (smaller format)
  twitter: {
    title: "FAIS - AI & Blockchain Studio",
    subtitle: "Enterprise Technology Solutions",
    description: "Transforming businesses with AI & blockchain",
    size: "1200x600", // Twitter card
    filename: "fais-twitter-card.png"
  },

  // Square format for Instagram
  instagram: {
    title: "FAIS",
    subtitle: "AI & Blockchain Studio",
    description: "Enterprise AI & Blockchain Solutions",
    size: "1080x1080", // Instagram square
    filename: "fais-instagram.png"
  }
};

const BRAND_COLORS = {
  primary: "#1e40af", // Blue
  secondary: "#7c3aed", // Purple
  accent: "#059669", // Green
  background: "#0f172a", // Dark blue
  text: "#f8fafc", // Light
  gradient: "linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)"
};

async function generateOGImageHTML(config) {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            width: ${config.size.split('x')[0]}px;
            height: ${config.size.split('x')[1]}px;
            background: ${BRAND_COLORS.gradient};
            font-family: 'Arial', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            position: relative;
        }
        
        .og-container {
            width: 90%;
            height: 90%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            color: ${BRAND_COLORS.text};
            position: relative;
            z-index: 2;
        }
        
        .logo-section {
            margin-bottom: 40px;
        }
        
        .logo {
            font-size: 72px;
            font-weight: bold;
            color: ${BRAND_COLORS.text};
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            margin-bottom: 10px;
        }
        
        .title {
            font-size: 48px;
            font-weight: bold;
            margin-bottom: 20px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            line-height: 1.2;
        }
        
        .subtitle {
            font-size: 32px;
            font-weight: 600;
            margin-bottom: 25px;
            color: ${BRAND_COLORS.accent};
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }
        
        .description {
            font-size: 24px;
            line-height: 1.4;
            max-width: 80%;
            opacity: 0.9;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }
        
        .decorative-elements {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
            opacity: 0.1;
        }
        
        .tech-icon {
            position: absolute;
            font-size: 120px;
            color: ${BRAND_COLORS.text};
        }
        
        .ai-icon {
            top: 50px;
            right: 100px;
            transform: rotate(15deg);
        }
        
        .blockchain-icon {
            bottom: 60px;
            left: 80px;
            transform: rotate(-10deg);
        }
        
        .footer-brand {
            position: absolute;
            bottom: 30px;
            right: 40px;
            font-size: 20px;
            font-weight: 600;
            color: ${BRAND_COLORS.text};
            opacity: 0.8;
        }
        
        /* Square format adjustments */
        ${config.size === '1080x1080' ? `
        .title { font-size: 42px; }
        .subtitle { font-size: 28px; }
        .description { font-size: 20px; }
        .logo { font-size: 64px; }
        ` : ''}
        
        /* Twitter format adjustments */
        ${config.size === '1200x600' ? `
        .title { font-size: 44px; }
        .subtitle { font-size: 30px; }
        .description { font-size: 22px; }
        .og-container { height: 85%; }
        ` : ''}
    </style>
</head>
<body>
    <div class="decorative-elements">
        <div class="tech-icon ai-icon">🤖</div>
        <div class="tech-icon blockchain-icon">⛓️</div>
    </div>
    
    <div class="og-container">
        <div class="logo-section">
            <div class="logo">FAIS</div>
        </div>
        
        <h1 class="title">${config.title}</h1>
        <h2 class="subtitle">${config.subtitle}</h2>
        <p class="description">${config.description}</p>
    </div>
    
    <div class="footer-brand">fais.world</div>
</body>
</html>
  `;
}

async function generateOGImages() {
  console.log('🎨 Generating Open Graph images for social media...\n');

  // Create public/og-images directory
  const ogDir = path.join(process.cwd(), 'public', 'og-images');
  if (!fs.existsSync(ogDir)) {
    fs.mkdirSync(ogDir, { recursive: true });
  }

  // Generate HTML templates for each image
  for (const [key, config] of Object.entries(OG_IMAGES_CONFIG)) {
    console.log(`📄 Generating HTML template for ${key}...`);
    
    const html = await generateOGImageHTML(config);
    const htmlPath = path.join(ogDir, `${key}-template.html`);
    
    fs.writeFileSync(htmlPath, html);
    console.log(`✅ Created: ${htmlPath}`);
  }

  // Create a simple fallback image configuration
  const fallbackConfig = {
    instructions: "To generate actual PNG images from these HTML templates:",
    methods: [
      "1. Use Puppeteer or Playwright to screenshot each HTML file",
      "2. Use online HTML to image converters",
      "3. Use the image generation API in your admin panel",
      "4. Manually screenshot each HTML template in a browser"
    ],
    sizes: Object.entries(OG_IMAGES_CONFIG).map(([key, config]) => ({
      name: key,
      size: config.size,
      filename: config.filename
    }))
  };

  fs.writeFileSync(
    path.join(ogDir, 'generation-instructions.json'),
    JSON.stringify(fallbackConfig, null, 2)
  );

  console.log('\n🎯 Open Graph image templates generated!');
  console.log(`📁 Location: ${ogDir}`);
  console.log('📋 Next steps:');
  console.log('   1. Open each HTML template in your browser');
  console.log('   2. Take screenshots at exact dimensions specified');
  console.log('   3. Save as PNG files with the specified filenames');
  console.log('   4. Update metadata to use these new images');
}

// Export for use as module
export { generateOGImages, OG_IMAGES_CONFIG, BRAND_COLORS };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateOGImages().catch(console.error);
}
