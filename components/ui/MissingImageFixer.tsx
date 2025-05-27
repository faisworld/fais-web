'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getBlobImage, blobImages } from '@/utils/media-utils'

type MissingImage = {
  key: string
  description: string
  currentUrl?: string
}

type PageImageConfig = {
  [path: string]: {
    title: string;
    prefixes: string[];
    forceIncludeKeys?: string[];
    includeSubpaths?: boolean;
  }
}

function MissingImageFixer() {
  const pathname = usePathname() // Get the current path from Next.js router
  
  // Page-specific image configurations
  const pageConfig: PageImageConfig = {
    '/': {
      title: 'Homepage Images',
      prefixes: [''],
      forceIncludeKeys: [
        'pioneering-digital-transformation',
        'innovating-future',
        'shaping-sota-technologies',
        'ai-solutions',
        'blockchain-solutions',
        'ceo-portrait',
        'mev-staking',
        'web3-gaming',
        'nft-marketplace',
        'ai-services',
        'payment-systems'
      ]
    },
    '/about': {
      title: 'About Page Images',
      prefixes: ['about-'],
      forceIncludeKeys: [
        'about-mission-image',
        'about-vision-image',
        'about-value-innovation-image',
        'about-value-integrity-image',
        'about-value-collaboration-image',
        'about-team-member-eugene-lukyanov-image',
        'about-team-member-andrii-stehno-image',
        'about-team-member-julia-mazura-image',
        'about-team-member-vitalii-melnyk-image'
      ]
    },
    '/projects': {
      title: 'Projects Page Images',
      prefixes: ['projects-'],
      includeSubpaths: true,
      forceIncludeKeys: [
        'projects-dopple-ai',
        'projects-degen-kombat',
        'projects-heroes-of-mavia',
        'projects-multichain-dex',
        'projects-payment-system',
        'projects-base-org',
        'projects-optimism-io',
        'projects-blast-io'
      ]
    },
    '/services': {
      title: 'Services Page Images',
      prefixes: ['services-'],
      includeSubpaths: true,
      forceIncludeKeys: [
        'services-hero-banner',
        'services-ai-overview',
        'services-blockchain-overview',
        'services-web-development-overview',
        'services-consulting-visual',
        'services-cta-banner'
      ]
    },
    '/contact': {
      title: 'Contact Page Images',
      prefixes: ['contact-'],
      forceIncludeKeys: [
        'contact-hero-banner',
        'contact-form-visual',
        'contact-map-placeholder'
      ]
    },
    '/blog': {
      title: 'Blog Page Images',
      prefixes: ['blog-'],
      includeSubpaths: true,
      forceIncludeKeys: [
        'blog-hero-banner',
        'blog-featured-article-main',
        'blog-category-ai-promo',
        'blog-category-blockchain-promo',
        'blog-default-thumbnail'
      ]
    }
  }
  
  // Update current path when pathname changes
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') {
      return;
    }
    
    const path = pathname || '/';
    console.log('Path from Next.js router:', path);
    
    // Always regenerate images when path changes
    generatePageImages(path);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
    // Format key to readable description
  const formatDescription = (key: string): string => {
    // Split by dash and capitalize each word
    return key
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') + ' image';
  };
  
  // Check if a URL is an image or video
  const isImageUrl = (url: string | undefined): boolean => {
    if (!url) return false;
    
    // Ignore video files (mp4, webm, etc.)
    const videoExtensions = ['.mp4', '.webm', '.avi', '.mov', '.mkv', '.m4v'];
    if (videoExtensions.some(ext => url.toLowerCase().includes(ext))) {
      console.log(`Skipping video file: ${url}`);
      return false;
    }
    
    // Check if it's an image URL (ends with image extension or contains /images/)
    return (
      url.match(/\.(jpeg|jpg|gif|png|webp|avif|svg)$/i) !== null ||
      url.includes('/images/') ||
      url.includes('/carousel/')
    );
  };
    // Generate the list of images for the current page
  const generatePageImages = (path: string) => {
    // Default to root if path is empty
    if (!path) path = '/';
    
    console.log('Generating images for path:', path);
    
    // Find the most specific config that matches the path
    // First try exact match
    let config = pageConfig[path];
    
    // If we're on the services page, skip video files explicitly
    const isServicesPage = path === '/services' || path.startsWith('/services/');
    if (isServicesPage) {
      console.log('On services page - explicitly excluding video files');
    }
    
    // If no exact match, check for parent paths
    if (!config) {
      const pathSegments = path.split('/').filter(Boolean);
      for (let i = pathSegments.length - 1; i >= 0; i--) {
        const parentPath = '/' + pathSegments.slice(0, i).join('/');
        if (pageConfig[parentPath]) {
          config = pageConfig[parentPath];
          console.log(`Using parent path config: ${parentPath} for path: ${path}`);
          break;
        }
      }
    }
    
    // If still no match, use a default approach
    if (!config) {
      // Extract first segment as prefix
      const mainSegment = path.split('/')[1] || 'home';
      config = {
        title: `${mainSegment.charAt(0).toUpperCase() + mainSegment.slice(1)} Page Images`,
        prefixes: [`${mainSegment}-`]
      };
      console.log(`No config found, using default prefix: ${mainSegment}-`);
    }
    
    // Collect all matching images
    const matchingImages: MissingImage[] = [];
    
    try {
      // Add global images first (always include these on every page)
      const globalKeys = ['logo', 'logo-black', 'og-image'];
      globalKeys.forEach(key => {
        if (blobImages[key]) {
          matchingImages.push({
            key,
            description: formatDescription(key),
            currentUrl: getBlobImage(key)
          });
        }
      });
      
      // Extract path segments for more specific matching
      const pathSegments = path.split('/').filter(Boolean);
      
      // Add images that match the main page prefixes
      const mainPrefix = pathSegments.length > 0 ? pathSegments[0] : 'home';
      const mainPrefixWithDash = `${mainPrefix}-`;

      Object.keys(blobImages).forEach(key => {
        if (globalKeys.includes(key)) return;

        if (key.startsWith(mainPrefixWithDash) && !matchingImages.some(img => img.key === key)) {
          matchingImages.push({
            key,
            description: formatDescription(key),
            currentUrl: getBlobImage(key)
          });
        }
      });
      
      // For subpaths, add more specific images
      // For example, for /projects/web3, add keys that start with 'web3-'
      if (pathSegments.length > 1 && config.includeSubpaths) {
        // Check each subpath segment
        for (let i = 1; i < pathSegments.length; i++) {
          const segment = pathSegments[i];
          const segmentPrefix = `${segment}-`;
          
          Object.keys(blobImages).forEach(key => {
            // Skip keys already added
            if (matchingImages.some(img => img.key === key)) return;
            
            // Add keys that match this segment prefix
            if (key.startsWith(segmentPrefix)) {
              matchingImages.push({
                key,
                description: formatDescription(key),
                currentUrl: getBlobImage(key)
              });
            }
          });
        }
      }
      
      // Add forced include keys if specified
      if (config.forceIncludeKeys) {
        config.forceIncludeKeys.forEach(key => {
          if (!matchingImages.some(img => img.key === key)) {
            matchingImages.push({
              key,
              description: formatDescription(key),
              currentUrl: getBlobImage(key)
            });
          }
        });
      }
      
      // If no page-specific images found, add some generic global images
      if (matchingImages.length <= globalKeys.length) {
        console.log('No page-specific images found, adding generic images');
        const additionalGlobalKeys = Object.keys(blobImages).filter(key => {
          // Include keys that look global but aren't in our initial global keys list
          return (
            !globalKeys.includes(key) && 
            (!key.includes('-') || key.startsWith('logo-') || key.startsWith('og-'))
          );
        });
        
        additionalGlobalKeys.forEach(key => {
          if (!matchingImages.some(img => img.key === key)) {
            matchingImages.push({
              key,
              description: formatDescription(key),
              currentUrl: getBlobImage(key)
            });
          }
        });
      }
      
      console.log(`Found ${matchingImages.length} images for path: ${path}`);
    } catch (error) {
      console.error('Error generating page images:', error);
      // Add some fallback images if there's an error
      ['logo', 'logo-black', 'og-image'].forEach(key => {
        if (blobImages[key]) {
          matchingImages.push({
            key,
            description: formatDescription(key),
            currentUrl: getBlobImage(key)
          });
        }
      });
    }    // Instead of setting state, just log or use the images directly
    console.log(`Generated ${matchingImages.length} images for path: ${path}`);
    
    // Filter out video files before scanning
    const imageOnlyFiles = matchingImages.filter(img => {
      if (!img.currentUrl) return true;
      
      // Skip video files
      if (isImageUrl(img.currentUrl)) {
        return true;
      }
      
      console.log(`Skipping video file: ${img.key}`);
      return false;
    });
    
    console.log(`Filtered to ${imageOnlyFiles.length} image files (excluding videos)`);
    
    // Do something with matchingImages directly if needed
    scanAndFixImages(imageOnlyFiles);
  };
  // Add a function that uses the generated images directly
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const scanAndFixImages = (_images: MissingImage[]) => {
    // Use the images array directly here instead of accessing pageImages state
    // This could replace your scanForImages function in the second useEffect
    // Renamed to _images to indicate it's intentionally unused
  };

  // The component doesn't render anything
  return null;
}

// Only include the component in development builds
const ConditionalMissingImageFixer = () => {
  const [isLocalhost, setIsLocalhost] = useState(false);
  
  // Check if we're on localhost when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      setIsLocalhost(
        hostname === 'localhost' || 
        hostname === '127.0.0.1' ||
        hostname.includes('.local')
      );
    }
  }, []);

  // Only render if both in development AND on localhost
  if (process.env.NODE_ENV === 'development' && isLocalhost) {
    return <MissingImageFixer />;
  }
  return null;
};

export default ConditionalMissingImageFixer;
