# Article Generation System

This document outlines the automated article generation system that creates AI-generated blog posts with relevant images for the Fantastic AI Studio website.

## Overview

The system uses GPT-4o to generate high-quality article content and Replicate's AI image generation models to create relevant images for each article. The generated articles are automatically added to the blog with appropriate metadata.

## Components

1. **Admin UI Tool**: Located at `/admin/ai-tools/article-generation`
2. **API Endpoint**: Handles article generation at `/api/admin/ai-tools/generate-article`
3. **Image Generation Tool**: Uses Replicate models to create and upload images
4. **Automated Script**: Scheduled task for periodic article generation

## How It Works

### Manual Article Generation

1. Navigate to the admin panel at `/admin/ai-tools/article-generation`
2. Enter a topic, keywords, and select other options
3. Click "Generate Article"
4. The system will:
   - Generate article content using GPT-4o
   - Create a relevant image using Replicate
   - Upload the image to Vercel Blob storage
   - Return the completed article with image URL

### Automated Article Generation

The system includes scripts for automated article generation:

- `scripts/automated-article-generation.js`: Runs the generation process for random topics
- `scripts/article-generator.js`: Core utility for generating articles

To set up automated generation:

1. Configure environment variables:
   ```
   OPENAI_API_KEY=your_openai_key
   REPLICATE_API_TOKEN=your_replicate_token
   INTERNAL_API_BASE_URL=https://your-site-url.com
   INTERNAL_API_KEY=your_internal_api_key
   ```

2. Set up a cron job to run the script at regular intervals:
   ```
   # Run daily at 2 AM
   0 2 * * * cd /path/to/fais-web && node scripts/automated-article-generation.js >> logs/article-gen.log 2>&1
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

## Troubleshooting

- If article generation fails, check API keys and network connectivity
- For image generation issues, ensure Replicate API is working correctly
- Monitor logs for any errors in the generation process

## Future Enhancements

Potential improvements include:

- Adding more diverse topic selection
- Implementing a content calendar feature
- Supporting multiple author personas
- Enhancing image generation with more specific prompts
