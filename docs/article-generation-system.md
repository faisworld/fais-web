# Article Generation System

This document outlines the automated article generation system that creates AI-generated blog posts with relevant images for the Fantastic AI Studio website.

## Overview

The system uses GPT-4o to generate high-quality article content and Replicate's AI image generation models to create relevant images for each article. The generated articles are automatically added to the blog with appropriate metadata.

## Components

1. **Admin UI Tool**: Located at `/admin/ai-tools/article-generation`
2. **Article Generation API**: `/api/admin/ai-tools/generate-article` - Creates content using GPT-4o
3. **Save Article API**: `/api/admin/ai-tools/save-article` - Saves generated articles to blog data and markdown files
4. **Image Generation Tool**: Uses optimized Replicate models (Google Imagen 4 & Stability SDXL) to create and upload high-quality images
5. **Markdown Renderer**: Dynamically reads and renders markdown content for blog posts
6. **Scripts**: Optional automated generation tools (see scripts directory)

## How It Works

### Manual Article Generation (Recommended)

1. Navigate to the admin panel at `/admin/ai-tools/article-generation`
2. Enter a topic, keywords, and select other options (tone, word count, etc.)
3. Click "Generate Article"
4. The system will:
   - Generate article content using GPT-4o
   - Create a relevant image using Replicate
   - Upload the image to Vercel Blob storage
   - Return the completed article with image URL
5. Click "Save to Blog" to save the article
6. The article will be:
   - Added to `blog-data.ts` for listing display
   - Saved as a markdown file in `app/blog/content/`
   - Immediately viewable on the website

### Blog Post Rendering

The system now supports dynamic markdown rendering:

- **Legacy posts**: Use hardcoded React components (e.g., `how-optimism-layer-2-can-transform-your-business`)
- **Generated posts**: Automatically read from markdown files and rendered with proper styling
- **Fallback**: Shows "content being prepared" message for posts without content

### Data Flow

1. **Generation**: Admin UI → Generate API → GPT-4o + Replicate → Return content
2. **Saving**: Save API → Write to `blog-data.ts` + Create `.md` file
3. **Display**: Blog page reads from `blog-data.ts` for listings
4. **Individual posts**: Read markdown files dynamically and render HTML

### Optional Automated Article Generation

**Note**: The system now focuses on manual generation through the admin UI. Automated scripts are available but optional.

The system includes scripts for automated article generation:

- `scripts/automated-article-generation.mjs`: Runs the generation process for random topics
- `scripts/article-generator.mjs`: Core utility for generating articles

To set up automated generation (optional):

1. Configure environment variables:

   ```env
   OPENAI_API_KEY=your_openai_key
   REPLICATE_API_TOKEN=your_replicate_token
   INTERNAL_API_BASE_URL=https://your-site-url.com
   INTERNAL_API_KEY=your_internal_api_key
   ```

2. Set up a cron job to run the script at regular intervals:

   ```bash
   # Run daily at 2 AM
   0 2 * * * cd /path/to/fais-web && node scripts/automated-article-generation.mjs >> logs/article-gen.log 2>&1
   ```

## Available Models for Image Generation

The system supports several image generation models through Replicate:

1. **Minimax Image-01**: General-purpose image generation
2. **Google Imagen 4**: High-quality images with advanced safety filters
3. **NVIDIA SANA**: Photorealistic image generation

## Customization

You can customize article generation by modifying:

1. The topic list in `automated-article-generation.js`
2. The system prompt in the API route for different writing styles
3. Image generation parameters in `generateArticleImageTool.ts`

## Current Status ✅

The article generation system is now **fully operational** with all critical issues resolved:

- **Fixed Authentication**: Admin auth works with any localhost port
- **Complete UI**: Generation interface with save functionality
- **Dynamic Rendering**: Markdown files are automatically rendered for new articles
- **Clean Data Structure**: Proper excerpts instead of full content in blog listings
- **End-to-End Workflow**: Generate → Save → Display works seamlessly
- **Legacy Support**: Existing hardcoded articles still work
- **Image Integration**: AI-generated images are properly uploaded and displayed
- **Server-Side Blob Upload**: Fixed client/server-side function mismatch for reliable image uploads

## Recent Critical Fix

### Blob Upload Issue Resolution

- **Problem**: Image generation was failing due to server-side code calling client-side `uploadToBlob` function
- **Solution**: Created `utils/blob-upload-server.ts` with server-side `uploadToBlobServer` function
- **Updated Files**:
  - `utils/o3-assistant-tools/generateArticleImageTool.ts` - Now uses server-side blob upload
  - `utils/o3-assistant-tools/generateArticleVideoTool.ts` - Also updated for consistency
- **Result**: Image generation now works reliably with proper Vercel Blob storage URLs

## Image Quality Optimization (Latest Update)

### Optimization Summary

The image generation system has been optimized for significantly better quality and cost-effectiveness:

### Model Selection

- **Removed**: NVIDIA EDIFFI model (poor quality, described as "messy unattractive blob")
- **Kept**: Only high-quality, proven models:
  - **Google Imagen 4** (best quality) - Set as default
  - **Stability AI SDXL** (good quality, lower cost alternative)

### Enhanced Prompts

Updated image generation prompts for professional quality:

```text
Professional, high-quality blog featured image about [topic]. 
Modern, clean, visually appealing design. Corporate style, 
professional photography aesthetic. Relevant icons, graphics, 
or abstract representation. Bright, vibrant colors. No text overlays. 
Suitable for a technology blog header.
```

### Cost vs Quality Balance

- **Default**: Google Imagen 4 for optimal quality
- **Alternative**: Stability SDXL for cost-conscious generation
- Both models produce professional, blog-ready images
- Eliminated low-quality models that wasted API credits

### Implementation Status

- ✅ **Image generation working** with proper blob storage uploads
- ✅ **Image quality optimized** with better models and enhanced prompts
- ✅ **Cost optimization** by removing ineffective models
- ✅ **Ready for production** with optimized image generation pipeline

This optimization ensures all generated articles have professional, high-quality featured images suitable for a technology blog.

## Files Modified/Created

### Core System

- `app/admin/ai-tools/article-generation/page.tsx` - Enhanced UI with save functionality
- `app/api/admin/ai-tools/save-article/route.ts` - Created save endpoint
- `app/blog/[slug]/page.tsx` - Added dynamic markdown rendering
- `utils/markdown.ts` - Created markdown processing utility
- `utils/admin-auth.ts` - Fixed authentication for any localhost port

### Data & Content

- `app/blog/blog-data.ts` - Fixed excerpts for all 5 generated articles
- `app/blog/content/*.md` - 5 complete markdown articles with frontmatter

### Cleanup

- Removed temporary test files (`test-*.js`, `generate-all-articles.js`)
- Removed duplicate script versions (kept `.mjs` over `.js`)
- Updated documentation to reflect current state
