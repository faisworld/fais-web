"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle, CheckCircle2, Copy, ExternalLink } from "lucide-react";

// Define the available image generation models
const IMAGE_MODELS = [
  { id: "minimax/image-01", name: "Minimax Image 01" },
  { id: "google/imagen-3-fast", name: "Google Imagen 3 Fast" },
  { id: "nvidia/sana", name: "Nvidia Sana" },
];

const FALLBACK_IMAGE = "https://picsum.photos/800/600?grayscale";

export default function ImageGenerationPage() {
  const [selectedModel, setSelectedModel] = useState<string>(IMAGE_MODELS[0].id);
  const [prompt, setPrompt] = useState<string>("");
  const [aspectRatio, setAspectRatio] = useState<string>("16:9");
  const [negativePrompt, setNegativePrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);

  // Check if running in browser
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleGenerate = async () => {
    if (!prompt) {
      setError("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);
    setSuccess(false);
    setImageLoaded(false);
    setImageError(false);
    setRetryCount(0);

    try {
      const response = await fetch('/api/admin/ai-tools/generate-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mediaType: "image",
          modelIdentifier: selectedModel,
          prompt,
          negativePrompt: negativePrompt || undefined,
          aspectRatio,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to generate image");
      }

      setGeneratedImage(data.imageUrl);
      setSuccess(true);
    } catch (err) {
      console.error("Error generating image:", err);
      setError(err instanceof Error ? err.message : String(err));
      setGeneratedImage(FALLBACK_IMAGE);
      setImageError(true);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const loadDemoImage = () => {
    setGeneratedImage(FALLBACK_IMAGE);
    setImageLoaded(true);
    setSuccess(true);
    setError(null);
  };
  
  const handleCopyUrl = () => {
    if (generatedImage && navigator.clipboard) {
      navigator.clipboard.writeText(generatedImage);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleImageError = () => {
    console.log(`Image failed to load (attempt ${retryCount + 1})`);
    
    if (retryCount < 2) {
      // Try another image source
      setRetryCount(retryCount + 1);
      setGeneratedImage(FALLBACK_IMAGE + "?retry=" + retryCount);
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
            </div>

            {/* Aspect Ratio Controls */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aspect Ratio</label>
              <div className="grid grid-cols-5 gap-2">
                {["16:9", "1:1", "4:3", "3:2", "9:16"].map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium ${
                      aspectRatio === ratio
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate & Demo Buttons */}
            <div className="pt-2">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
                className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-2"
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
                className="w-full border border-gray-300 text-gray-700 py-2.5 px-4 rounded-md hover:bg-gray-50 transition"
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
                  onError={() => setImageError(true)}
                  style={{ display: imageError ? 'none' : 'block' }}
                />
              </div>
            ) : (
              <div className="text-center p-4">
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
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyUrl}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    {copySuccess ? <CheckCircle2 size={16} className="mr-1" /> : <Copy size={16} />}
                    {copySuccess ? "Copied!" : "Copy URL"}
                  </button>
                  <a
                    href={generatedImage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
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
