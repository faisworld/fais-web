# Gallery & Carousel Management Simplification

## Overview
This document outlines the simplified approach to managing gallery media and carousel slides in the FAIS website.

## Key Changes

### 1. Consolidated Media Management
All media management (both images and videos) is now handled through a single interface:
- URL: `/admin/gallery`
- Supports both image and video uploads
- Includes folder organization
- Direct integration with carousel slides

### 2. Carousel Management Integration
The carousel management has been simplified and integrated directly with the gallery:
- **"Manage Carousel" button** - Opens the carousel manager directly from gallery
- **"Set as Carousel" option** - Available on each media item to quickly assign it to a carousel slot
- Carousel requires exactly 3 slides with specific keys:
  1. `advanced-ai-&-blockchain-solutions`
  2. `shaping-state-of-the-art-technologies`
  3. `driving-innovation-in-technology`

### 3. Removed Redundancy
- The standalone carousel upload page (`/admin/carousel-upload`) has been deprecated
- Removed dual approach to managing images/videos to prevent confusion

## How to Update the Carousel

### Method 1: Using "Set as Carousel" on Individual Media
1. Navigate to `/admin/gallery`
2. Find the image or video you want to use for a carousel slide
3. Click the "Set as Carousel" button
4. Select which slide position to use (1, 2, or 3)
5. The media will be assigned to that carousel slot with appropriate title/subtitle content

### Method 2: Using Carousel Manager
1. Navigate to `/admin/gallery`
2. Click the "Manage Carousel" button in the top bar
3. The modal shows all three required carousel slides
4. For each slide, select or upload the appropriate image/video

## Database Structure
The carousel data is stored in a `carousel_media` table with the following key fields:
- `id`: Unique identifier
- `key`: String identifier for the slide (e.g., `advanced-ai-&-blockchain-solutions`)
- `url`: URL to the media file
- `media_type`: Either 'image' or 'video'
- `title`: Slide title
- `subtitle`: Slide subtitle
- `button_text`: Text for the call-to-action button
- `button_link`: URL for the button
- `alt_tag`: Alt text for images
- Additional metadata fields: width, height, etc.

## API Endpoints
- `/api/admin/gallery/list` - List all gallery media
- `/api/admin/carousel/list` - List carousel slides
- `/api/admin/gallery/set-as-carousel-slide` - Set a gallery media as carousel slide
- `/api/admin/carousel/update/[id]` - Update a carousel slide

## Frontend Components
- `CarouselManager.tsx` - Component for managing all carousel slides
- `HomeCarousel.tsx` - Component that displays the carousel on the homepage
