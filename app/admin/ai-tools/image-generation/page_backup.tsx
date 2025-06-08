"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle, Check, Link } from "lucide-react";
import Image from "next/image";

// Define the available image generation models
const IMAGE_MODELS = [
  { id: "stability-ai/sdxl", name: "Stability AI SDXL" },
  { id: "google/imagen-4", name: "Google Imagen 4" },
];

// Interface for the request body
interface ImageGenerationRequest {
  mediaType: string;
  modelIdentifier: string;
  prompt: string;
  aspectRatio?: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  modelVariant?: string;
  numInferenceSteps?: number;
  guidanceScale?: number;
  pagGuidanceScale?: number;
  seed?: number;
  // Minimax Image 01 specific
  aspect_ratio?: string;
  number_of_images?: number;
  prompt_optimizer?: boolean;
  subject_reference?: string;
  // Google Imagen 3 Fast specific
  safety_filter_level?: string;
}

// Standard resolution presets for different aspect ratios
const RESOLUTION_PRESETS = {
  "1:1": [
    { width: 512, height: 512, label: "512×512" },
    { width: 1024, height: 1024, label: "1024×1024" },
    { width: 2048, height: 2048, label: "2048×2048" },
  ],
  "16:9": [
    { width: 1024, height: 576, label: "1024×576" },
    { width: 1920, height: 1080, label: "1920×1080" },
    { width: 3840, height: 2160, label: "3840×2160" },
  ],
  "4:3": [
    { width: 1024, height: 768, label: "1024×768" },
    { width: 2048, height: 1536, label: "2048×1536" },
  ],
  "3:2": [
    { width: 1024, height: 683, label: "1024×683" },
    { width: 2048, height: 1365, label: "2048×1365" },
  ],
  "2:3": [
    { width: 683, height: 1024, label: "683×1024" },
    { width: 1365, height: 2048, label: "1365×2048" },
  ],
  "3:4": [
    { width: 768, height: 1024, label: "768×1024" },
    { width: 1536, height: 2048, label: "1536×2048" },
  ],
  "9:16": [
    { width: 576, height: 1024, label: "576×1024" },
    { width: 1080, height: 1920, label: "1080×1920" },
  ],
  "21:9": [
    { width: 1024, height: 437, label: "1024×437" },
    { width: 2048, height: 875, label: "2048×875" },
  ],
};

// Function to get placeholder image dimensions based on aspect ratio (for preview)
const getPlaceholderDimensions = (aspectRatio: string) => {
  const baseHeight = 400; // Container height
  switch (aspectRatio) {
    case "16:9":
      return { width: Math.round(baseHeight * 16/9), height: baseHeight };
    case "1:1":
      return { width: baseHeight, height: baseHeight };
    case "4:3":
      return { width: Math.round(baseHeight * 4/3), height: baseHeight };
    case "3:2":
      return { width: Math.round(baseHeight * 3/2), height: baseHeight };
    case "2:3":
      return { width: Math.round(baseHeight * 2/3), height: baseHeight };
    case "3:4":
      return { width: Math.round(baseHeight * 3/4), height: baseHeight };
    case "9:16":
      return { width: Math.round(baseHeight * 9/16), height: baseHeight };
    case "21:9":
      return { width: Math.round(baseHeight * 21/9), height: baseHeight };
    default:
      return { width: 800, height: 600 };
  }
};

// Generate placeholder URL based on aspect ratio
const getPlaceholderUrl = (aspectRatio: string) => {
  const { width, height } = getPlaceholderDimensions(aspectRatio);
  return `https://picsum.photos/${width}/${height}?grayscale`;
};

export default function ImageGenerationPage() {
  const [selectedModel, setSelectedModel] = useState<string>(IMAGE_MODELS[0].id);
  const [prompt, setPrompt] = useState<string>("");
  const [aspectRatio, setAspectRatio] = useState<string>("1:1");
  const [negativePrompt, setNegativePrompt] = useState<string>("");
  const [seed, setSeed] = useState<string>("");
  
  // Minimax Image 01 specific parameters
  const [numberOfImages, setNumberOfImages] = useState<number>(1);
  const [promptOptimizer, setPromptOptimizer] = useState<boolean>(true);
  const [subjectReference, setSubjectReference] = useState<string>("");
  
  // Google Imagen 3 Fast specific parameters
  const [safetyFilterLevel, setSafetyFilterLevel] = useState<string>("block_only_high");
  
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [originalImageUrls, setOriginalImageUrls] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown> | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  
  // Check if running in browser
  useEffect(() => {
    setIsClient(true);
  }, []);
  const handleGenerate = async () => {
    if (!prompt) {
      setError("Please enter a prompt");
      return;
    }    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);    setOriginalImageUrl(null);
    setImageLoaded(false);
    setImageError(false);
    setDebugInfo(null);try {
      const requestBody: ImageGenerationRequest = {
        mediaType: "image",
        modelIdentifier: selectedModel,
        prompt,
      };      // Add model-specific parameters
      if (selectedModel === 'stability-ai/sdxl') {
        // Stability AI SDXL specific parameters
        requestBody.aspectRatio = aspectRatio;
        if (negativePrompt) requestBody.negativePrompt = negativePrompt;
      } else if (selectedModel === 'google/imagen-4') {
        // Google Imagen 4 specific parameters
        requestBody.aspect_ratio = aspectRatio;
        requestBody.safety_filter_level = safetyFilterLevel;
      } else {
        // For other models, use aspect ratio
        requestBody.aspectRatio = aspectRatio;
        if (negativePrompt) requestBody.negativePrompt = negativePrompt;
      }

      const response = await fetch('/api/admin/ai-tools/generate-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to generate image");
      }      console.log('API Response:', data);
      console.log('Generated image URL:', data.imageUrl);
      console.log('All generated images:', data.imageUrls);
      console.log('Number of images:', data.count);
        // Handle multiple images if they exist
      if (data.imageUrls && Array.isArray(data.imageUrls)) {
        // Store original URLs
        setOriginalImageUrls(data.imageUrls);
        
        // Process all URLs through proxy if needed
        const processedUrls = data.imageUrls.map((url: string) => {
          if (url && (url.includes('replicate.delivery') || url.includes('replicate.com'))) {
            return `/api/image-proxy?url=${encodeURIComponent(url)}`;
          }
          return url;
        });
        
        setGeneratedImages(processedUrls);
        setGeneratedImage(processedUrls[0]); // Set first image as primary
        setCurrentImageIndex(0);
      } else {
        // Fallback for single image (backward compatibility)
        setOriginalImageUrls([data.imageUrl]);
        
        let displayUrl = data.imageUrl;
        if (data.imageUrl && (data.imageUrl.includes('replicate.delivery') || data.imageUrl.includes('replicate.com'))) {
          displayUrl = `/api/image-proxy?url=${encodeURIComponent(data.imageUrl)}`;
          console.log('Using proxy URL:', displayUrl);
        }
        
        setGeneratedImages([displayUrl]);
        setGeneratedImage(displayUrl);
        setCurrentImageIndex(0);
      }      
      setOriginalImageUrl(data.imageUrl); // Store the original URL for backward compatibility
    } catch (error) {
      console.error("Error generating image:", error);
      setError(error instanceof Error ? error.message : String(error));
      // Don't automatically set a fallback image - let user see the actual error
    } finally {
      setIsGenerating(false);
    }
  };  const loadDemoImage = () => {
    const imageUrl = getPlaceholderUrl(aspectRatio);
    setGeneratedImage(imageUrl);
    setImageLoaded(true);
    setError(null);
  };const handleCopyUrl = async () => {
    try {
      const currentUrl = generatedImages[currentImageIndex];
      // If originalImageUrls exists and has a corresponding URL, use that instead of the proxy URL
      const urlToCopy = originalImageUrls[currentImageIndex] || currentUrl;
      
      await navigator.clipboard.writeText(urlToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
      // Use console.error instead of toast since toast is not defined
      console.error("Error: Failed to copy image URL to clipboard");
    }
  };const debugImageUrl = async (url: string) => {
    try {
      const response = await fetch(`/api/debug/image-proxy?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      setDebugInfo(data);
      console.log('Debug info:', data);
    } catch (error) {
      console.error('Debug failed:', error);
      setDebugInfo({ error: 'Debug request failed' });
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const imgElement = e.currentTarget;
    if (!imgElement.classList.contains('thumbnail-image')) {
      // Main image error handling
      setImageError(true);
      setImageLoaded(false);
    } else {
      // Thumbnail error handling
      imgElement.style.display = 'none';
      const placeholderDiv = imgElement.parentElement?.querySelector('div');
      if (placeholderDiv) {
        placeholderDiv.style.display = 'flex';
      }
    }
  };

  // Add styles for thumbnail placeholders
  const thumbnailPlaceholderStyle = {
    backgroundColor: '#f3f4f6', // Light gray background
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    color: '#9ca3af', // Gray text
    fontSize: '0.75rem',
  };

  // Show simple loader when not on client yet (prevent hydration mismatch)
  if (!isClient) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
      </div>
    );
  }

  // Function to handle image navigation
  const navigateToImage = (index: number) => {
    if (index >= 0 && index < generatedImages.length) {
      setCurrentImageIndex(index);
      setGeneratedImage(generatedImages[index]);
      setImageError(false);
      setImageLoaded(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">AI Image Generation</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6">Generation Controls</h2>
          
          <div className="space-y-4">            {/* AI Model Select */}
            <div>
              <label htmlFor="ai-model-select" className="block text-sm font-medium text-gray-700 mb-1">AI Model</label>
              <select 
                id="ai-model-select"
                name="aiModel"
                className="w-full border border-gray-300 rounded-lg py-2.5 px-3"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                {IMAGE_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </select>
            </div>

            {/* Prompt Input */}
            <div>
              <label htmlFor="prompt-textarea" className="block text-sm font-medium text-gray-700 mb-1">Prompt</label>
              <textarea 
                id="prompt-textarea"
                name="prompt"
                className="w-full border border-gray-300 rounded-lg py-2.5 px-3 min-h-[120px]"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate..."
              />
            </div>

            {/* Negative Prompt Input */}
            <div>
              <label htmlFor="negative-prompt-textarea" className="block text-sm font-medium text-gray-700 mb-1">Negative Prompt</label>
              <textarea 
                id="negative-prompt-textarea"
                name="negativePrompt"
                className="w-full border border-gray-300 rounded-lg py-2.5 px-3 min-h-[80px]"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="What should NOT appear in the image..."
              />
            </div>{/* Model-specific controls */}            {selectedModel === 'nvidia/sana' ? (
              <>
                {/* Resolution Selection for nvidia/sana */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resolution</label>
                  <div className="grid grid-cols-2 gap-2">
                    {RESOLUTION_PRESETS[aspectRatio as keyof typeof RESOLUTION_PRESETS]?.map((resolution) => (
                      <button
                        key={`${resolution.width}x${resolution.height}`}
                        type="button"
                        onClick={() => setSelectedResolution({ width: resolution.width, height: resolution.height })}                        className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                          selectedResolution.width === resolution.width && selectedResolution.height === resolution.height
                            ? 'bg-black !text-white border-black shadow-md !bg-black'
                            : 'bg-white !text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 !bg-white hover:!bg-gray-50'
                        }`}
                      >
                        {resolution.label}
                      </button>
                    ))}
                  </div>
                </div>                {/* Aspect Ratio for nvidia/sana (affects available resolutions) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aspect Ratio</label>
                  <div className="grid grid-cols-5 gap-2">
                    {["16:9", "1:1", "4:3", "3:2", "9:16"].map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setAspectRatio(ratio)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                          aspectRatio === ratio
                            ? '!bg-black !text-white border-black shadow-md'
                            : '!bg-white !text-gray-700 border-gray-300 hover:!bg-gray-50 hover:border-gray-400'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model Variant</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg py-2.5 px-3"
                    value={modelVariant}
                    onChange={(e) => setModelVariant(e.target.value)}
                  >
                    <option value="1600M-1024px">1600M 1024px</option>
                    <option value="1600M-1024px-multilang">1600M 1024px Multilang</option>
                    <option value="1600M-512px">1600M 512px</option>
                    <option value="600M-1024px-multilang">600M 1024px Multilang</option>
                    <option value="600M-512px-multilang">600M 512px Multilang</option>
                  </select>
                </div>

                {/* Inference Steps */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inference Steps: {numInferenceSteps}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={numInferenceSteps}
                    onChange={(e) => setNumInferenceSteps(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1</span>
                    <span>50</span>
                  </div>
                </div>

                {/* Guidance Scale */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Guidance Scale: {guidanceScale}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.1"
                    value={guidanceScale}
                    onChange={(e) => setGuidanceScale(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1.0</span>
                    <span>20.0</span>
                  </div>
                </div>

                {/* PAG Guidance Scale */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PAG Guidance Scale: {pagGuidanceScale}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={pagGuidanceScale}
                    onChange={(e) => setPagGuidanceScale(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1.0</span>
                    <span>5.0</span>
                  </div>
                </div>

                {/* Seed */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seed (optional)</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg py-2.5 px-3"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}                  placeholder="Leave empty for random seed"
                  />                </div>
              </>            ) : selectedModel === 'stability-ai/sdxl' ? (
              <>
                {/* Stability AI SDXL specific controls */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aspect Ratio</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["1:1", "16:9", "4:3", "3:2", "2:3", "3:4", "9:16", "21:9"].map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setAspectRatio(ratio)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                          aspectRatio === ratio
                            ? '!bg-black !text-white border-black shadow-md'
                            : '!bg-white !text-gray-700 border-gray-300 hover:!bg-gray-50 hover:border-gray-400'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>                {/* Number of Images */}
                <div>
                  <label htmlFor="number-of-images-range" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Images: {numberOfImages}
                  </label>
                  <input
                    id="number-of-images-range"
                    name="numberOfImages"
                    type="range"
                    min="1"
                    max="9"
                    value={numberOfImages}
                    onChange={(e) => setNumberOfImages(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1</span>
                    <span>9</span>
                  </div>
                </div>

                {/* Prompt Optimizer */}
                <div>
                  <label htmlFor="prompt-optimizer-checkbox" className="flex items-center">
                    <input
                      id="prompt-optimizer-checkbox"
                      name="promptOptimizer"
                      type="checkbox"
                      checked={promptOptimizer}
                      onChange={(e) => setPromptOptimizer(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Use Prompt Optimizer</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Automatically enhance your prompt for better results</p>
                </div>

                {/* Subject Reference */}
                <div>
                  <label htmlFor="subject-reference-input" className="block text-sm font-medium text-gray-700 mb-1">Subject Reference (optional)</label>
                  <input
                    id="subject-reference-input"
                    name="subjectReference"
                    type="url"
                    className="w-full border border-gray-300 rounded-lg py-2.5 px-3"
                    value={subjectReference}
                    onChange={(e) => setSubjectReference(e.target.value)}
                    placeholder="URL to character reference image (human face)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional character reference image for consistent subject generation</p>
                </div>
              </>
            ) : selectedModel === 'google/imagen-4' ? (
              <>            {/* Google Imagen 4 specific controls */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aspect Ratio</label>
                  <div className="grid grid-cols-5 gap-2">
                    {["1:1", "9:16", "16:9", "3:4", "4:3"].map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setAspectRatio(ratio)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                          aspectRatio === ratio
                            ? '!bg-black !text-white border-black shadow-md'
                            : '!bg-white !text-gray-700 border-gray-300 hover:!bg-gray-50 hover:border-gray-400'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>                {/* Safety Filter Level */}
                <div>
                  <label htmlFor="safety-filter-select" className="block text-sm font-medium text-gray-700 mb-1">Safety Filter Level</label>
                  <select
                    id="safety-filter-select"
                    name="safetyFilterLevel"
                    className="w-full border border-gray-300 rounded-lg py-2.5 px-3"
                    value={safetyFilterLevel}
                    onChange={(e) => setSafetyFilterLevel(e.target.value)}
                  >
                    <option value="block_only_high">Block Only High (Most Permissive)</option>
                    <option value="block_medium_and_above">Block Medium and Above</option>
                    <option value="block_low_and_above">Block Low and Above (Strictest)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Controls content filtering strictness</p>
                </div>
              </>
            ) : (/* Aspect Ratio Controls for other models */
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aspect Ratio</label>
                <div className="grid grid-cols-4 gap-2">
                  {["1:1", "16:9", "4:3", "3:2", "2:3", "3:4", "9:16", "21:9"].map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAspectRatio(ratio)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                        aspectRatio === ratio
                          ? '!bg-black !text-white border-black shadow-md'
                          : '!bg-white !text-gray-700 border-gray-300 hover:!bg-gray-50 hover:border-gray-400'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
            )}            {/* Generate & Demo Buttons */}
            <div className="pt-2">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
                className="w-full !bg-black !text-white py-2.5 px-4 rounded-md hover:!bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <span>Generate Image</span>
                )}
              </button>                <button
                onClick={loadDemoImage}
                className="w-full border border-gray-300 !text-gray-700 !bg-white py-2.5 px-4 rounded-md hover:!bg-gray-50 transition"
              >
                Load Demo Image
              </button>              <button
                onClick={() => {
                  // Test with a known working Replicate image URL format
                  const testUrl = "https://replicate.delivery/pbxt/foo.png";
                  setGeneratedImage(testUrl);
                  setImageLoaded(false);
                  setImageError(false);
                  setError(null);
                  console.log('Testing with URL:', testUrl);
                }}
                className="w-full border border-orange-300 !text-orange-700 !bg-orange-50 py-2.5 px-4 rounded-md hover:!bg-orange-100 transition"
              >
                Test Replicate URL Format
              </button>
              <button
                onClick={async () => {
                  try {
                    setIsGenerating(true);
                    setError(null);
                    console.log('🧪 Running comprehensive test...');
                    
                    const response = await fetch('/api/test/image-generation', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ prompt: prompt || "A beautiful test image" })
                    });
                    
                    const data = await response.json();
                    console.log('🧪 Test results:', data);
                    setDebugInfo(data);
                    
                    if (data.imageUrl) {
                      setOriginalImageUrl(data.imageUrl);
                      const displayUrl = data.imageUrl.includes('replicate') 
                        ? `/api/image-proxy?url=${encodeURIComponent(data.imageUrl)}`
                        : data.imageUrl;
                      setGeneratedImage(displayUrl);
                    }
                  } catch (err) {
                    console.error('🧪 Test failed:', err);
                    setError(`Test failed: ${err instanceof Error ? err.message : String(err)}`);
                  } finally {
                    setIsGenerating(false);
                  }
                }}
                className="w-full border border-green-300 !text-green-700 !bg-green-50 py-2.5 px-4 rounded-md hover:!bg-green-100 transition"
                disabled={isGenerating}
              >
                {isGenerating ? 'Running Test...' : 'Run Comprehensive Test'}
              </button>{(generatedImage || originalImageUrl) && (
                <button
                  onClick={() => {
                    const urlToDebug = originalImageUrl || generatedImage;
                    if (urlToDebug) debugImageUrl(urlToDebug);
                  }}
                  className="w-full border border-gray-300 !text-gray-700 !bg-gray-50 py-2.5 px-4 rounded-md hover:!bg-gray-100 transition"
                >
                  Debug Current Image URL
                </button>
              )}
            </div>
          </div>

          {/* Debug Information */}
          {debugInfo && (            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
              <h4 className="font-medium text-gray-800 mb-2">Debug Information:</h4>
              <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              <AlertCircle className="inline-block mr-2 h-5 w-5" />
              {error}
            </div>
          )}
        </div>

        {/* Generated Image Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6">Generated Image</h2>
            <div className="bg-gray-100 rounded-lg overflow-hidden border border-gray-200 h-[400px] relative flex items-center justify-center">            {isGenerating ? (
              <div className="text-center">
                <Loader2 className="animate-spin h-8 w-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-600">Generating your image...</p>
              </div>
            ) : generatedImage ? (              <div className="w-full h-full relative">                
                <Image 
                  src={generatedImage}
                  alt="Generated image"
                  className="object-contain w-full h-full main-image"
                  fill
                  unoptimized
                  onLoad={() => {
                    setImageLoaded(true);
                    setImageError(false);
                    console.log('Image loaded successfully:', generatedImage);
                  }}
                  onError={handleImageError}
                  style={{ display: imageError ? 'none' : 'block' }}
                />
                {imageError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">                    <div className="text-center p-4">
                      <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Image display failed</p>
                      <p className="text-xs text-gray-500 mb-1 break-all">Display URL: {generatedImage}</p>
                      {originalImageUrl && originalImageUrl !== generatedImage && (
                        <p className="text-xs text-gray-500 mb-3 break-all">Original URL: {originalImageUrl}</p>
                      )}
                      <a 
                        href={originalImageUrl || generatedImage} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-800 text-sm"
                      >
                        Open original in new tab
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (              <div className="text-center p-4">
                <div className="mb-4">
                  <div className="text-gray-400 border-2 border-dashed border-gray-300 rounded-lg p-8 inline-flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-lg mb-1">
                        Preview ({selectedModel === 'nvidia/sana' ? 'Generation' : aspectRatio})
                      </p>
                      <p className="text-sm">
                        {selectedModel === 'nvidia/sana' 
                          ? `${selectedResolution.width} × ${selectedResolution.height}`
                          : `${getPlaceholderDimensions(aspectRatio).width} × ${getPlaceholderDimensions(aspectRatio).height}`
                        }
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-500 mb-2">Your generated image will appear here</p>
                <p className="text-sm text-gray-400">Enter a prompt and click &quot;Generate Image&quot;</p>
              </div>            )}
          </div>
          
          {/* Multiple Images Navigation */}
          {generatedImages.length > 1 && (
            <div className="mt-4 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateToImage(currentImageIndex - 1)}
                  disabled={currentImageIndex === 0}
                  className="px-3 py-1 bg-white border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Image {currentImageIndex + 1} of {generatedImages.length}
                </span>
                <button
                  onClick={() => navigateToImage(currentImageIndex + 1)}
                  disabled={currentImageIndex === generatedImages.length - 1}
                  className="px-3 py-1 bg-white border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <button
                onClick={handleCopyUrl}
                className="flex items-center space-x-1 px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                {copySuccess ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Link className="h-4 w-4" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>
            </div>
          )}
          
          {/* All Images Grid (for multiple images) */}
          {generatedImages.length > 1 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">All Generated Images:</h3>
              <div className="grid grid-cols-3 gap-2">
                {generatedImages.map((imageUrl, index) => (
                  <button
                    key={index}
                    onClick={() => navigateToImage(index)}
                    className={`aspect-square relative rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index ? 'border-gray-500' : 'border-transparent'
                    }`}
                  >                    <Image
                      src={imageUrl}
                      alt={`Generated image ${index + 1}`}
                      className="thumbnail-image object-cover w-full h-full"
                      fill
                      unoptimized
                      onError={handleImageError}
                    />
                    {/* Thumbnail placeholder for error state */}
                    <div
                      style={thumbnailPlaceholderStyle}
                      className="absolute inset-0 flex items-center justify-center bg-gray-100"
                    >
                      <span>Image {index + 1}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Image URL and Actions */}
          {generatedImage && imageLoaded && !imageError && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleCopyUrl}
                  className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
                >
                  <Link className="h-4 w-4" />
                  {copySuccess ? 'URL Copied!' : 'Copy Image URL'}
                </button>
                {originalImageUrls[currentImageIndex] && (
                  <button
                    onClick={() => window.open(originalImageUrls[currentImageIndex], '_blank')}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    View Original
                  </button>
                )}
              </div>
              <div className="text-xs text-gray-500">
                Resolution: {selectedResolution.width}x{selectedResolution.height}
              </div>
            </div>
          )}          {/* Thumbnail Grid View (for multiple images) */}
          {generatedImages.length > 1 && (
            <div className="mt-4 grid grid-cols-3 gap-2 max-w-[600px]">
              {generatedImages.map((imageUrl, index) => (
                <button
                  key={index}
                  onClick={() => navigateToImage(index)}
                  className={`relative aspect-square w-full overflow-hidden rounded-lg border ${
                    index === currentImageIndex
                      ? 'border-gray-500 ring-2 ring-gray-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={imageUrl}
                      alt={`Generated thumbnail ${index + 1}`}
                      className="thumbnail-image object-cover"
                      fill
                      unoptimized
                      onError={handleImageError}
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
