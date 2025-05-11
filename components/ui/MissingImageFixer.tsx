"use client"

import { useState, useEffect } from "react"
import { FiImage, FiEdit, FiX, FiRefreshCw } from "react-icons/fi"
import Image from "next/image"
import { usePathname } from "next/navigation"
import ImagePicker from "./ImagePicker"
import { getBlobImage, blobImages } from "@/utils/image-utils"

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

export default function MissingImageFixer() {
  const [isOpen, setIsOpen] = useState(false)
  const [showImagePicker, setShowImagePicker] = useState(false)
  const [selectedImageKey, setSelectedImageKey] = useState<string | null>(null)
  const [updatedImages, setUpdatedImages] = useState<Record<string, string>>({})
  const [currentPath, setCurrentPath] = useState<string>("")
  const [pageImages, setPageImages] = useState<MissingImage[]>([])
  const pathname = usePathname() // Get the current path from Next.js router
  
  // Page-specific image configurations
  const pageConfig: PageImageConfig = {
    "/": {
      title: "Homepage Images",
      prefixes: ["home-"],
      forceIncludeKeys: [
        "pioneering-digital-transformation",
        "innovating-future",
        "shaping-sota-technologies",
        "ai-solutions",
        "blockchain-solutions",
        "ceo-portrait",
      ]
    },
    "/projects": {
      title: "Projects Page Images",
      prefixes: ["projects-"],
      includeSubpaths: true,
      forceIncludeKeys: [
        // Project-specific images from the projects page
        "projects-dopple-ai",
        "projects-degen-kombat",
        "projects-heroes-of-mavia",
        "projects-multichain-dex",
        "projects-payment-system",
        "projects-base-org",
        "projects-optimism-io",
        "projects-blast-io",
        // General project categories (keeping these for breadth)
        "mev-staking",
        "web3-gaming",
        "nft-marketplace",
        "ai-services",
        "payment-systems"
      ]
    },
    "/services": {
      title: "Services Page Images",
      prefixes: ["services-"],
      includeSubpaths: true
    },
    "/about": {
      title: "About Page Images",
      prefixes: ["about-"]
    },
    "/contact": {
      title: "Contact Page Images",
      prefixes: ["contact-"]
    },
    "/blog": {
      title: "Blog Page Images",
      prefixes: ["blog-"],
      includeSubpaths: true
    }
  }
  
  // Update current path when pathname changes
  useEffect(() => {
    const path = pathname || "/";
    console.log("Path from Next.js router:", path);
    
    // Always update with the latest path
    setCurrentPath(path);
    
    // Force clear any cached images
    setPageImages([]);
    
    // Always regenerate images when path changes
    generatePageImages(path);
    
    // If the component is open, refreshing the UI for the new path
    if (isOpen) {
      console.log("Path changed while component open, refreshing:", path);
      setUpdatedImages({}); // Clear any pending updates
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  
  // Update path and images whenever the component is opened
  useEffect(() => {
    if (isOpen) {
      const path = pathname || "/";
      console.log("Component opened, refreshing path:", path);
      
      // Always use the latest pathname
      setCurrentPath(path);
      
      // Clear any cached image data
      setPageImages([]);
      
      // Regenerate images for this path
      generatePageImages(path);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  
  // Generate the list of images for the current page
  const generatePageImages = (path: string) => {
    // Default to root if path is empty
    if (!path) path = "/";
    
    console.log("Generating images for path:", path);
    
    // Find the most specific config that matches the path
    // First try exact match
    let config = pageConfig[path];
    
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
      const mainSegment = path.split('/')[1] || "home";
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
      const globalKeys = ["logo", "logo-black", "og-image"];
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
        // Skip global keys we've already added
        if (globalKeys.includes(key)) return;
        
        // Add keys that match the main prefix
        if (key.startsWith(mainPrefixWithDash) && !matchingImages.some(img => img.key === key)) {
          matchingImages.push({
            key,
            description: formatDescription(key),
            currentUrl: getBlobImage(key)
          });
        }
      });
      
      // For subpaths, add more specific images
      // For example, for /projects/web3, add keys that start with "web3-"
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
        console.log("No page-specific images found, adding generic images");
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
      console.error("Error generating page images:", error);
      // Add some fallback images if there's an error
      ["logo", "logo-black", "og-image"].forEach(key => {
        if (blobImages[key]) {
          matchingImages.push({
            key,
            description: formatDescription(key),
            currentUrl: getBlobImage(key)
          });
        }
      });
    }
    
    setPageImages(matchingImages);
  };
  
  // Format key to readable description
  const formatDescription = (key: string): string => {
    // Split by dash and capitalize each word
    return key
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') + ' image';
  };

  // Function to determine if an image should be highlighted as needing replacement
  const isPlaceholder = (url: string) => {
    return (
      !url || 
      url === "" || 
      url.includes("/placeholder.svg") || 
      url.includes("?query=") || 
      !url.includes("vercel-storage.com")
    )
  }

  // Handle image selection from the picker
  const handleImageSelect = (imageUrl: string) => {
    if (selectedImageKey) {
      setUpdatedImages((prev) => ({
        ...prev,
        [selectedImageKey]: imageUrl,
      }))
      setShowImagePicker(false)
      setSelectedImageKey(null)
    }
  }

  // Extract metadata from an image URL
  const extractImageInfo = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = pathname.split('/').pop() || '';
      
      // Extract basename without unique hash and extension
      const baseName = filename
        .replace(/-.{13}\.[^.]+$/, '') // Remove hash+extension 
        .replace(/\.[^.]+$/, '')        // Remove extension
        .replace(/^\d+-/, '')           // Remove leading timestamp
        .replace(/-/g, ' ');            // Replace hyphens with spaces
      
      // Get file format/extension
      const format = (pathname.match(/\.([^.]+)$/) || ['', 'unknown'])[1].toLowerCase();
      
      // Get folder from path if available
      const folderMatch = pathname.match(/\/images\/([^\/]+)\//) || [];
      const folder = folderMatch[1] || "images";
      
      return {
        filename,
        baseName,
        format,
        folder,
        isPlaceholder: !url.includes('vercel-storage.com')
      };
    } catch (error) {
      console.error("Error extracting image info:", error);
      return {
        filename: 'unknown',
        baseName: 'Unknown Image',
        format: 'unknown',
        folder: 'images',
        isPlaceholder: true
      };
    }
  };
  
  // Get a suggested key based on context
  const getSuggestedKey = (imageKey: string, imageUrl: string): string => {
    // Get page-specific prefix from the current path
    const pathSegments = currentPath.split('/').filter(Boolean);
    const pagePrefix = pathSegments.length > 0 ? pathSegments[0] : 'home';
    
    // Extract image info for better naming
    const info = extractImageInfo(imageUrl);
    
    // If it's a global key like logo or og-image, leave as is
    if (['logo', 'logo-black', 'og-image'].includes(imageKey)) {
      return imageKey;
    }
    
    // If the key already has the proper prefix for this page, keep it
    if (imageKey.startsWith(`${pagePrefix}-`)) {
      return imageKey;
    }
    
    // Special case for project-specific images from the screenshots
    if (currentPath === "/projects" && imageUrl.includes("Screenshot-2025-01-05")) {
      // If this is a project-specific image from the static folder
      const filename = imageUrl.split('/').pop() || '';
      
      if (filename.includes("160711")) {
        return "projects-dopple-ai";
      } else if (filename.includes("160251")) {
        return "projects-degen-kombat";
      } else if (filename.includes("160852")) {
        return "projects-heroes-of-mavia";
      } else if (filename.includes("165735")) {
        return "projects-multichain-dex";
      } else if (filename.includes("174629")) {
        return "projects-payment-system";
      } else if (filename.includes("172939")) {
        return "projects-base-org";
      } else if (filename.includes("175331")) {
        return "projects-optimism-io";
      } else if (filename.includes("172306")) {
        return "projects-blast-io";
      }
    }
    
    // Special handling for placeholder images
    if (isPlaceholder(imageUrl)) {
      // Keep special cross-page keys as they are
      if (['ceo-portrait', 'ai-solutions', 'blockchain-solutions'].includes(imageKey)) {
        return imageKey;
      }
      
      // For generic keys, create a more contextual name based on the path
      if (['image', 'banner', 'background', 'pic', 'photo', 'hero', 'icon'].includes(imageKey)) {
        // Special handling for subpaths
        if (pathSegments.length > 1) {
          const subPath = pathSegments[1];
          // For subpaths like /projects/web3, use web3-hero instead of projects-web3-hero
          // This matches the expected naming pattern better
          
          // Check if the current image is more related to the subpath than main path
          const isSubpathSpecific = subPath && 
                                  ['banner', 'hero', 'main', 'background'].includes(imageKey);
          
          if (isSubpathSpecific) {
            return `${subPath}-${imageKey}`;
          } else {
            // Use main page prefix with subpath qualifier
            return `${pagePrefix}-${subPath}-${imageKey}`;
          }
        } else {
          // Main page - use prefix with a more descriptive name if possible
          
          // If we have image base name from the URL, use that for suggestions
          if (info.baseName && info.baseName !== 'Unknown Image') {
            const baseNameWords = info.baseName.split(' ').slice(0, 2).join('-').toLowerCase();
            if (baseNameWords.length > 3) {
              return `${pagePrefix}-${baseNameWords}`;
            }
          }
          
          // Otherwise, just use the page prefix
          return `${pagePrefix}-${imageKey}`;
        }
      }
      
      // For existing keys that aren't generic but missing the prefix
      if (!imageKey.includes('-')) {
        return `${pagePrefix}-${imageKey}`;
      }
      
      // For keys with their own prefixes that don't match the page
      const keyParts = imageKey.split('-');
      const keyPrefix = keyParts[0];
      
      // If the key has a prefix from a different page, replace it
      const knownPrefixes = Object.keys(pageConfig).map(p => p.replace(/^\//, '')).filter(Boolean);
      if (knownPrefixes.includes(keyPrefix) && keyPrefix !== pagePrefix) {
        // Replace the prefix but keep the rest of the key
        keyParts[0] = pagePrefix;
        return keyParts.join('-');
      }
    }
    
    // For real images (not placeholders), be more conservative with renaming
    // If key has a different prefix already, consider replacing it
    if (imageKey.includes('-')) {
      const segments = imageKey.split('-');
      // Check if first segment is a known page prefix that doesn't match current page
      const knownPrefixes = Object.keys(pageConfig).map(p => p.replace(/^\//, '')).filter(Boolean);
      if (knownPrefixes.includes(segments[0]) && segments[0] !== pagePrefix) {
        // Replace the prefix
        segments[0] = pagePrefix;
        return segments.join('-');
      }
    }
    
    // Otherwise create a new page-specific key
    let newKey = `${pagePrefix}-${imageKey}`;
    
    // If key seems very generic, add more context from the image or path
    if (['image', 'banner', 'background', 'pic', 'photo', 'hero'].includes(imageKey)) {
      // Try to get a more descriptive name from the image URL
      if (info.baseName && info.baseName !== 'Unknown Image') {
        const baseNameWords = info.baseName.split(' ').slice(0, 2).join('-').toLowerCase();
        if (baseNameWords.length > 3) {
          newKey = `${pagePrefix}-${baseNameWords}`;
        }
      }
      
      // If there's a subpath, consider adding it
      if (pathSegments.length > 1) {
        const subPath = pathSegments[1];
        newKey = `${pagePrefix}-${subPath}-${imageKey}`;
      }
    }
    
    return newKey;
  };

  // Generate better, more semantic image keys for the current page
  const generateBetterImageKey = (originalKey: string, imageUrl: string) => {
    // Simply use our getSuggestedKey function to maintain consistency
    return getSuggestedKey(originalKey, imageUrl);
  };
  
  // Generate code to update the blobImages object
  const generateUpdateCode = () => {
    const codeLines = Object.entries(updatedImages).map(([key, url]) => {
      const info = extractImageInfo(url);
      const betterKey = generateBetterImageKey(key, url);
      
      // More descriptive comment for the image
      let comment = `${info.baseName} (${info.format})`;
      if (info.folder && info.folder !== 'images') {
        comment += ` from ${info.folder} folder`;
      }
      
      // Add page context to the comment
      const pathSegments = currentPath.split('/').filter(Boolean);
      let contextComment = '';
      
      if (pathSegments.length > 1) {
        contextComment = ` for ${pathSegments.join('/')} page`;
      } else if (pathSegments.length === 1) {
        contextComment = ` for ${pathSegments[0]} page`;
      } else {
        contextComment = ' for homepage';
      }
      
      // Note if the key was renamed with a better prefix
      if (betterKey !== key) {
        const oldKeySegments = key.split('-');
        const newKeySegments = betterKey.split('-');
        
        // Check if only the prefix changed
        if (oldKeySegments.length === newKeySegments.length && 
            oldKeySegments[0] !== newKeySegments[0] && 
            oldKeySegments.slice(1).join('-') === newKeySegments.slice(1).join('-')) {
          comment += ` - renamed from ${key} for better organization`;
        } 
        // If the key structure changed more significantly
        else {
          comment += ` - suggested better key name (was: ${key})`;
        }
      } else {
        comment += contextComment;
      }
      
      return [
        `  // ${comment}`,
        `  "${betterKey}": "${url}",`
      ].join('\n');
    });

    // Add a helpful note about image organization
    const helperNote = `// Note: For better image organization:\n` +
                       `// - Use page-specific prefixes (home-, projects-, services-, etc.)\n` +
                       `// - For subpages, consider prefixes like projects-web3- or blog-article-\n` +
                       `// - Keep global images like logo, logo-black, og-image without prefixes\n\n`;

    return `// Update these lines in utils/image-utils.ts\n// in the blobImages object:\n\n${helperNote}${codeLines.join("\n\n")}`
  };

  // Copy the update code to clipboard
  const copyUpdateCode = () => {
    const code = generateUpdateCode();
    navigator.clipboard.writeText(code);
    alert("Code copied to clipboard! Remember to use descriptive keys for your images.");
  }

  // Get page config title
  const getPageTitle = (): string => {
    // Try exact match
    const config = pageConfig[currentPath];
    if (config) return config.title;
    
    // Try parent paths
    const pathSegments = currentPath.split('/').filter(Boolean);
    for (let i = pathSegments.length - 1; i >= 0; i--) {
      const parentPath = '/' + pathSegments.slice(0, i).join('/');
      const parentConfig = pageConfig[parentPath];
      if (parentConfig) {
        // If we're on a subpath, add it to the title
        if (i < pathSegments.length - 1 && parentConfig.includeSubpaths) {
          const subpath = pathSegments.slice(i).join('/');
          return `${parentConfig.title} - ${subpath}`;
        }
        return parentConfig.title;
      }
    }
    
    // Fall back to default
    const mainSegment = currentPath.split('/')[1] || "home";
    return `${mainSegment.charAt(0).toUpperCase() + mainSegment.slice(1)} Page Images`;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700"
        title="Fix Missing Images"
      >
        <FiImage size={24} />
        {pageImages.some(img => isPlaceholder(img.currentUrl || "")) && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 bg-red-500 text-white text-xs items-center justify-center rounded-full">
            {pageImages.filter(img => isPlaceholder(img.currentUrl || "")).length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-xl font-semibold">{getPageTitle()}</h2>
                <p className="text-sm text-gray-500">Current path: {currentPath}</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4 mb-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">
                    Click on any image row to select a replacement from your gallery.
                  </p>
                  <button 
                    onClick={() => generatePageImages(pathname || "/")}
                    className="text-sm px-3 py-1 flex items-center gap-1 bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    <FiRefreshCw size={14} /> Refresh images
                  </button>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-1">Recommended image naming for this page:</h3>
                  <p className="text-sm text-blue-700">
                    Use <span className="font-mono bg-blue-100 px-1 rounded">{currentPath === "/" ? "home" : currentPath.replace(/^\//, '').split('/')[0]}-descriptive-name</span> format 
                    for better organization (e.g., <span className="font-mono bg-blue-100 px-1 rounded">{currentPath === "/" ? "home" : currentPath.replace(/^\//, '').split('/')[0]}-hero-banner</span>)
                  </p>
                  {currentPath.split('/').filter(Boolean).length > 1 && (
                    <p className="text-sm text-blue-700 mt-1">
                      For subpaths like <span className="font-mono bg-blue-100 px-1 rounded">{currentPath}</span>, consider using 
                      <span className="font-mono bg-blue-100 px-1 rounded ml-1">{currentPath.split('/').filter(Boolean)[1]}-specific-name</span> for
                      page-specific images.
                    </p>
                  )}
                </div>
              </div>

              {pageImages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No images found for this page.</p>
                  <p className="mt-2 text-sm">
                    Try creating image keys with the prefix: {currentPath === "/" ? "home-" : currentPath.replace(/^\//, '').split('/')[0] + "-"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pageImages.map((image) => {
                    const currentUrl = updatedImages[image.key] || image.currentUrl || "/placeholder.svg"
                    const isMissing = isPlaceholder(currentUrl)

                    return (
                      <div
                        key={image.key}
                        className={`border rounded-lg overflow-hidden cursor-pointer hover:shadow-md ${
                          isMissing ? "border-orange-300 bg-orange-50" : "border-green-300 bg-green-50"
                        }`}
                        onClick={() => {
                          setSelectedImageKey(image.key)
                          setShowImagePicker(true)
                        }}
                      >
                        <div className="flex items-center p-4">
                          <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden mr-4 flex-shrink-0 relative">
                            <Image
                              src={currentUrl || "/placeholder.svg"}
                              alt={image.description}
                              className="object-cover"
                              fill
                              sizes="64px"
                              onError={(e) => {
                                // TypeScript requires type assertion for onError event
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder.svg";
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{image.key}</h3>
                            <p className="text-sm text-gray-600">{image.description}</p>
                            <div className="mt-1 text-xs text-gray-500 truncate">{currentUrl}</div>
                            {isMissing && image.key !== generateBetterImageKey(image.key, currentUrl) && (
                              <div className="mt-1 text-xs text-orange-600">
                                Suggested key: <span className="font-mono bg-orange-100 px-1 rounded">
                                  {generateBetterImageKey(image.key, currentUrl)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div
                            className="ml-2 p-2 text-blue-600 bg-white rounded-full shadow-sm hover:bg-blue-50"
                            title="Select image"
                          >
                            <FiEdit size={20} />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="p-4 border-t">
              <div className="flex justify-between mb-4">
                <div className="text-sm text-gray-600">{Object.keys(updatedImages).length} image(s) updated</div>
                
                {/* Show warning if there's an og-image update and we're not on home */}
                {Object.keys(updatedImages).some(key => key === 'og-image') && currentPath !== '/' && (
                  <div className="text-yellow-600 text-sm flex items-center gap-1">
                    <span>⚠️</span> Using &quot;og-image&quot; on a non-home page may cause conflicts
                  </div>
                )}
              </div>
              
              {Object.keys(updatedImages).length > 0 && (
                <div className="mb-4 p-3 bg-gray-50 border rounded text-xs text-gray-600">
                  <p className="font-medium mb-1">When you copy and paste the code:</p>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Open <span className="font-mono bg-gray-100 px-1 rounded">utils/image-utils.ts</span></li>
                    <li>Find the <span className="font-mono bg-gray-100 px-1 rounded">blobImages</span> object</li>
                    <li>Paste the generated code in the correct position</li>
                    <li>Better keys will be suggested based on the current page context</li>
                  </ol>
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  onClick={copyUpdateCode}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                  disabled={Object.keys(updatedImages).length === 0}
                >
                  Copy Update Code
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="ml-2 px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showImagePicker && (
        <ImagePicker
          isOpen={showImagePicker}
          onClose={() => setShowImagePicker(false)}
          onSelect={handleImageSelect}
          title={`Select image for: ${selectedImageKey}`}
        />
      )}
    </>
  )
}
