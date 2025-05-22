## Carousel Update Instructions

This document provides instructions for updating the carousel content on the website.

### 1. Update Text Content

The carousel text content has been updated in the `HomeCarousel.tsx` component to use the following content:

```typescript
const slideTextContent = [
  {
    title: 'Advanced AI & Blockchain Solutions',
    subtitle: 'Pioneering digital transformation with elegant, powerful solutions that drive business innovation and growth',
    buttonText: 'Explore Services',
    buttonLink: '/services',
    alt: 'AI and Blockchain Solutions'
  },
  {
    title: 'Shaping State-of-the-Art Technologies',
    subtitle: 'Fantastic AI Studio merges cutting-edge design with robust technological frameworks to revolutionize your digital experiences',
    buttonText: 'Our Projects',
    buttonLink: '/projects',
    alt: 'State-of-the-Art Technologies'
  },
  {
    title: 'Driving Innovation in Technology',
    subtitle: 'An effective way to empower your business with innovative solutions that optimize processes and secure transactions',
    buttonText: 'Get Started',
    buttonLink: '/contact',
    alt: 'Innovation in Technology'
  }
]
```

### 2. Update Database Content

Run the database migration to update the slide names in the carousel_media table:

```bash
# Use your preferred database tool to run the migration
# For example, with psql:
psql -U your_username -d your_database < migrations/update_carousel_slide_names.sql

# Or, using the script (make sure DATABASE_URL is set)
export DATABASE_URL="postgresql://username:password@host:port/database"
npx tsx scripts/update-carousel-content.ts
```

### 3. Thumbnail Generation for Videos

The carousel now automatically tries to generate thumbnails for videos when they are uploaded. The thumbnail generation code will:

1. Generate a JPEG thumbnail from the video file
2. Store the thumbnail with the same name as the video but with a `.jpg` extension
3. This ensures the video element can automatically find and use the thumbnail

### 4. Video Quality Improvements

For better video quality:

1. Upload MP4 videos with H.264 encoding for best compatibility
2. Recommended video dimensions: 1920×1080 (16:9 ratio)
3. Keep videos short (10-30 seconds) and small in size (<10MB)
4. Use proper lighting and high-quality source material

### 5. Error Handling

The carousel component now includes improved error handling:

- Better fallback for when the API fails
- Automatic recovery from video loading failures
- Consistent loading of thumbnails for videos

## Remaining Tasks

1. Clean up any unused carousel components
2. Monitor for any TypeScript errors in the carousel components
3. Implement server-side thumbnail generation for videos if needed
