"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle, CheckCircle2, Copy, ExternalLink } from "lucide-react";

// Define the available image generation models
const IMAGE_MODELS = [
  { id: "minimax/image-01", name: "Minimax Image 01" },
  { id: "google/imagen-3-fast", name: "Google Imagen 3 Fast" },
  { id: "nvidia/sana", name: "Nvidia Sana" },
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
    // New state for resolution and nvidia/sana specific parameters
  const [selectedResolution, setSelectedResolution] = useState<{ width: number; height: number }>({ width: 1024, height: 1024 });
  const [modelVariant, setModelVariant] = useState<string>("Sana_1600M_1024px");
  const [numInferenceSteps, setNumInferenceSteps] = useState<number>(18);
  const [guidanceScale, setGuidanceScale] = useState<number>(5);
  const [pagGuidanceScale, setPagGuidanceScale] = useState<number>(2);
  const [seed, setSeed] = useState<string>("");
  
  // Minimax Image 01 specific parameters
  const [numberOfImages, setNumberOfImages] = useState<number>(1);
  const [promptOptimizer, setPromptOptimizer] = useState<boolean>(true);
  const [subjectReference, setSubjectReference] = useState<string>("");
  
  // Google Imagen 3 Fast specific parameters
  const [safetyFilterLevel, setSafetyFilterLevel] = useState<string>("block_only_high");
  
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  
  // Update resolution when aspect ratio changes
  useEffect(() => {
    const resolutions = RESOLUTION_PRESETS[aspectRatio as keyof typeof RESOLUTION_PRESETS];
    if (resolutions && resolutions.length > 0) {
      setSelectedResolution({ width: resolutions[0].width, height: resolutions[0].height });
    }
  }, [aspectRatio]);

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
    setGeneratedImage(null);
    setImageLoaded(false);
    setImageError(false);
    setRetryCount(0);    try {
      const requestBody: ImageGenerationRequest = {
        mediaType: "image",
        modelIdentifier: selectedModel,
        prompt,
      };      // Add model-specific parameters
      if (selectedModel === 'nvidia/sana') {
        requestBody.negativePrompt = negativePrompt || undefined;
        requestBody.width = selectedResolution.width;
        requestBody.height = selectedResolution.height;
        requestBody.modelVariant = modelVariant;
        requestBody.numInferenceSteps = numInferenceSteps;
        requestBody.guidanceScale = guidanceScale;
        requestBody.pagGuidanceScale = pagGuidanceScale;
        if (seed) requestBody.seed = parseInt(seed);
      } else if (selectedModel === 'minimax/image-01') {
        // Minimax Image 01 specific parameters
        requestBody.aspect_ratio = aspectRatio;
        requestBody.number_of_images = numberOfImages;
        requestBody.prompt_optimizer = promptOptimizer;
        if (subjectReference) requestBody.subject_reference = subjectReference;
      } else if (selectedModel === 'google/imagen-3-fast') {
        // Google Imagen 3 Fast specific parameters
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
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to generate image");
      }      setGeneratedImage(data.imageUrl);    } catch (err) {
      console.error("Error generating image:", err);
      setError(err instanceof Error ? err.message : String(err));
      const fallbackUrl = selectedModel === 'nvidia/sana' 
        ? `https://picsum.photos/${selectedResolution.width}/${selectedResolution.height}?grayscale`
        : getPlaceholderUrl(aspectRatio);
      setGeneratedImage(fallbackUrl);
      setImageError(true);
    } finally {
      setIsGenerating(false);
    }
  };
  const loadDemoImage = () => {
    const imageUrl = selectedModel === 'nvidia/sana' 
      ? `https://picsum.photos/${selectedResolution.width}/${selectedResolution.height}?grayscale`
      : getPlaceholderUrl(aspectRatio);
    setGeneratedImage(imageUrl);
    setImageLoaded(true);
    setError(null);
  };
  
  const handleCopyUrl = () => {
    if (generatedImage && navigator.clipboard) {
      navigator.clipboard.writeText(generatedImage);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };  const handleImageError = () => {
    console.log(`Image failed to load (attempt ${retryCount + 1})`);
    
    if (retryCount < 2) {
      // Try another image source
      setRetryCount(retryCount + 1);
      const retryUrl = selectedModel === 'nvidia/sana' 
        ? `https://picsum.photos/${selectedResolution.width}/${selectedResolution.height}?grayscale&retry=${retryCount}`
        : getPlaceholderUrl(aspectRatio) + "?retry=" + retryCount;
      setGeneratedImage(retryUrl);
    } else {
      // After 3 attempts, show error state
      setImageError(true);
      setImageLoaded(true);
    }
  };

  // Show simple loader when not on client yet (prevent hydration mismatch)
  if (!isClient) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">AI Image Generation</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6">Generation Controls</h2>
          
          <div className="space-y-4">
            {/* AI Model Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">AI Model</label>
              <select 
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Prompt</label>
              <textarea 
                className="w-full border border-gray-300 rounded-lg py-2.5 px-3 min-h-[120px]"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate..."
              />
            </div>

            {/* Negative Prompt Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Negative Prompt</label>
              <textarea 
                className="w-full border border-gray-300 rounded-lg py-2.5 px-3 min-h-[80px]"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="What should NOT appear in the image..."
              />
            </div>            {/* Model-specific controls */}
            {selectedModel === 'nvidia/sana' ? (
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
                            ? 'bg-blue-600 !text-white border-blue-600 shadow-md !bg-blue-600'
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
                            ? '!bg-blue-600 !text-white border-blue-600 shadow-md'
                            : '!bg-white !text-gray-700 border-gray-300 hover:!bg-gray-50 hover:border-gray-400'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Model Variant */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model Variant</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg py-2.5 px-3"
                    value={modelVariant}
                    onChange={(e) => setModelVariant(e.target.value)}
                  >
                    <option value="Sana_1600M_1024px">Sana 1600M 1024px</option>
                    <option value="Sana_1600M_512px">Sana 1600M 512px</option>
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
                    onChange={(e) => setSeed(e.target.value)}
                    placeholder="Leave empty for random seed"
                  />                </div>
              </>
            ) : selectedModel === 'minimax/image-01' ? (
              <>
                {/* Minimax Image 01 specific controls */}
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
                            ? '!bg-blue-600 !text-white border-blue-600 shadow-md'
                            : '!bg-white !text-gray-700 border-gray-300 hover:!bg-gray-50 hover:border-gray-400'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Number of Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Images: {numberOfImages}
                  </label>
                  <input
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
                  <label className="flex items-center">
                    <input
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject Reference (optional)</label>
                  <input
                    type="url"
                    className="w-full border border-gray-300 rounded-lg py-2.5 px-3"
                    value={subjectReference}
                    onChange={(e) => setSubjectReference(e.target.value)}
                    placeholder="URL to character reference image (human face)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional character reference image for consistent subject generation</p>
                </div>
              </>
            ) : selectedModel === 'google/imagen-3-fast' ? (
              <>
                {/* Google Imagen 3 Fast specific controls */}
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
                            ? '!bg-blue-600 !text-white border-blue-600 shadow-md'
                            : '!bg-white !text-gray-700 border-gray-300 hover:!bg-gray-50 hover:border-gray-400'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Safety Filter Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Safety Filter Level</label>
                  <select
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
            ) : (              /* Aspect Ratio Controls for other models */
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
                          ? '!bg-blue-600 !text-white border-blue-600 shadow-md'
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
                className="w-full !bg-blue-600 !text-white py-2.5 px-4 rounded-md hover:!bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <span>Generate Image</span>
                )}
              </button>
                <button
                onClick={loadDemoImage}
                className="w-full border border-gray-300 !text-gray-700 !bg-white py-2.5 px-4 rounded-md hover:!bg-gray-50 transition"
              >
                Load Demo Image
              </button>
            </div>
          </div>

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
            <div className="bg-gray-100 rounded-lg overflow-hidden border border-gray-200 h-[400px] relative flex items-center justify-center">
            {isGenerating ? (
              <div className="text-center">
                <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-gray-600">Generating your image...</p>
              </div>
            ) : generatedImage ? (
              <div className="w-full h-full relative">
                <img 
                  src={generatedImage} 
                  alt="Generated image"
                  className="object-contain w-full h-full"
                  onLoad={() => setImageLoaded(true)}
                  onError={handleImageError}
                  style={{ display: imageError ? 'none' : 'block' }}
                />
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
              </div>
            )}
          </div>
          
          {/* Image URL and Actions */}
          {generatedImage && imageLoaded && !imageError && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium text-gray-700">Image URL:</p>
                <div className="flex items-center space-x-2">                  <button
                    onClick={handleCopyUrl}
                    className="!text-blue-600 hover:!text-blue-800 !bg-transparent text-sm flex items-center"
                  >
                    {copySuccess ? <CheckCircle2 size={16} className="mr-1" /> : <Copy size={16} />}
                    {copySuccess ? "Copied!" : "Copy URL"}
                  </button>
                  <a
                    href={generatedImage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="!text-blue-600 hover:!text-blue-800 text-sm flex items-center"
                  >
                    <ExternalLink size={16} className="mr-1" />
                    Open
                  </a>
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded border border-gray-200">
                <p className="text-xs text-gray-600 break-all">{generatedImage}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
