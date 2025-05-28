
export interface VideoConfig {
  key: string
  url: string
  name: string
  recommendedAspectRatio: number
  qualityLevel: 'high' | 'medium' | 'low'
  optimizationSuggestions: string[]
}

export const carouselVideoConfigs: VideoConfig[] = [
  {
    key: 'pioneering-digital-transformation',
    url: 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/carousel/carousel-video-shaping-sota-technologies.mp4',
    name: 'Pioneering Digital Transformation',
    recommendedAspectRatio: 16/9, // Common widescreen format
    qualityLevel: 'medium',
    optimizationSuggestions: [
      'Consider re-encoding to 1920x1080 for consistency',
      'Apply slight contrast enhancement during encoding',
      'Ensure proper bitrate for web streaming'
    ]
  },
  {
    key: 'innovating-future',
    url: 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1747831531794-tmpw2j61nje.mp4',
    name: 'Innovating the Future',
    recommendedAspectRatio: 16/9,
    qualityLevel: 'medium',
    optimizationSuggestions: [
      'Check if this video has proper metadata',
      'Verify aspect ratio matches other carousel videos',
      'Consider upgrading resolution if source allows'
    ]
  },
  {
    key: 'shaping-sota-technologies',
    url: 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/carousel/carousel-video-innovating-the-future.mp4',
    name: 'Shaping SOTA Technologies',
    recommendedAspectRatio: 16/9,
    qualityLevel: 'medium',
    optimizationSuggestions: [
      'Standardize resolution with other carousel videos',
      'Apply consistent color grading across all videos',
      'Optimize file size for faster loading'
    ]
  }
]

// Optimal carousel dimensions based on most common screen sizes
export const carouselOptimalDimensions = {
  desktop: {
    width: 1920,
    height: 1080,
    aspectRatio: 16/9
  },
  tablet: {
    width: 1024,
    height: 768,
    aspectRatio: 4/3
  },
  mobile: {
    width: 390,
    height: 844,
    aspectRatio: 9/16 // Vertical for mobile
  }
}

export function getOptimalObjectFit(videoAspectRatio: number, containerAspectRatio: number): 'cover' | 'contain' {
  const aspectRatioDiff = Math.abs(videoAspectRatio - containerAspectRatio)
  
  // If aspect ratios are close (within 0.15), use cover for immersive experience
  // Otherwise use contain to prevent excessive content loss
  return aspectRatioDiff < 0.15 ? 'cover' : 'contain'
}

export function analyzeVideoQuality(
  videoWidth: number, 
  videoHeight: number, 
  containerWidth: number, 
  containerHeight: number
) {
  const videoAspectRatio = videoWidth / videoHeight
  const containerAspectRatio = containerWidth / containerHeight
  
  let scaledWidth, scaledHeight, cropPercentage = 0
  
  if (videoAspectRatio > containerAspectRatio) {
    // Video is wider - will be cropped horizontally when using object-fit: cover
    scaledHeight = containerHeight
    scaledWidth = scaledHeight * videoAspectRatio
    cropPercentage = ((scaledWidth - containerWidth) / scaledWidth) * 100
  } else {
    // Video is taller - will be cropped vertically when using object-fit: cover
    scaledWidth = containerWidth
    scaledHeight = scaledWidth / videoAspectRatio
    cropPercentage = ((scaledHeight - containerHeight) / scaledHeight) * 100
  }
  
  const qualityLevel = cropPercentage > 25 ? 'poor' : cropPercentage > 10 ? 'medium' : 'good'
  
  return {
    videoAspectRatio,
    containerAspectRatio,
    scaledWidth,
    scaledHeight,
    cropPercentage: Math.round(cropPercentage * 10) / 10,
    qualityLevel,
    recommendation: getQualityRecommendation(qualityLevel, cropPercentage)
  }
}

function getQualityRecommendation(qualityLevel: string, cropPercentage: number): string {
  switch (qualityLevel) {
    case 'good':
      return 'Video displays well with minimal quality loss'
    case 'medium':
      return `${cropPercentage.toFixed(1)}% content cropped - consider adjusting dimensions or using object-fit: contain`
    case 'poor':
      return `${cropPercentage.toFixed(1)}% content cropped - recommend re-encoding video or using different layout`
    default:
      return 'Quality analysis unavailable'
  }
}
