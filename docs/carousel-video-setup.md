# Adding Videos to the Homepage Carousel

This document explains how to add and manage video content in the homepage carousel.

## Video Support Overview

The homepage carousel supports both image and video content types. Videos can provide more engaging and dynamic content for visitors.

## Adding a New Video

### 1. Upload video file to Vercel Blob Storage

- Use the Admin Gallery interface to upload your video file
- Make sure the video is in MP4 format for best browser compatibility
- Keep video files reasonably sized (recommend under 10MB)
- H.264 encoding is recommended for maximum compatibility
- Aim for 1920x1080 resolution or similar 16:9 aspect ratio

### 2. Register the video in image-utils.ts

Add your video to the `blobImages` object in `utils/image-utils.ts`:

```typescript
// Video files for carousel
"my-video-key": "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/videos/my-video.mp4",
```

### 3. Update carousel items

Update the `carouselItems` array in `components/pages/HomeCarousel.tsx` to use your video:

```typescript
const carouselItems = useMemo(() => [
  {
    key: "my-video-key", // Must match the key in blobImages
    alt: "My Video Description",
    title: "My Video Title",
    subtitle: "Video subtitle or description text",
    buttonText: "Call to action",
    buttonLink: "/destination-page",
    mediaType: "video" // Important: must be "video" to render as video
  },
  // ... other carousel items
], [])
```

## Using the Video Setup Script

For convenience, you can use the `set-carousel-videos.js` script to configure videos:

```bash
node scripts/set-carousel-videos.js
```

This script will:

1. Update the `carouselItems` array in HomeCarousel.tsx with video items
2. Display instructions for uploading video files

## Troubleshooting

If videos aren't playing properly:

1. Check browser console for errors
2. Ensure the video URL is correct and accessible
3. Verify the video format is supported by most browsers (MP4 with H.264 encoding is recommended)
4. Make sure `mediaType` is set to "video"
5. Check that the video key in `carouselItems` matches a key in `blobImages`

## Best Practices

- Keep videos short (10-15 seconds) for best performance
- Use videos with a focal point that works with different screen sizes
- Include subtitles or captions in the video when possible
- Consider performance impact: videos use more bandwidth than images
- Provide a compelling static image for the video poster (first frame)
