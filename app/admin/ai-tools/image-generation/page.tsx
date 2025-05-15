"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, AlertCircle, CheckCircle2, Copy, ExternalLink } from "lucide-react";

// Define the available image generation models
const IMAGE_MODELS = [
  { id: "minimax/image-01:w4agaakfhnrme0cnbhgtyfmstc", name: "Minimax Image 01" },
  { id: "google/imagen-3-fast:swntzryxznrm80cmvc1aqbnqgg", name: "Google Imagen 3 Fast" },
  { id: "nvidia/sana:c6b5d2b7459910fec94432e9e1203c3cdce92d6db20f714f1355747990b52fa6", name: "Nvidia Sana" },
];

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

  const handleGenerate = async () => {
    if (!prompt) {
      setError("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);
    setSuccess(false);

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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate image");
      }

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleCopyUrl = async () => {
    if (generatedImage) {
      await navigator.clipboard.writeText(generatedImage);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          AI Image Generation
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Create stunning images with advanced AI models. Just provide a prompt and watch the magic happen.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center">
            <span className="bg-blue-100 text-blue-700 p-2 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </span>
            Generation Controls
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">AI Model</label>
              <select 
                className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                {IMAGE_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prompt</label>
              <textarea 
                className="w-full border border-gray-300 rounded-lg py-2.5 px-3 min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Negative Prompt (Optional)</label>
              <textarea 
                className="w-full border border-gray-300 rounded-lg py-2.5 px-3 min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="What should NOT be in the image (e.g., blurry, low quality, etc.)"
              />
            </div>

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

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Generating...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Generate Image
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {success && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-start">
              <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>Image generated successfully!</div>
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center">
            <span className="bg-indigo-100 text-indigo-700 p-2 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
            Generated Image
          </h2>
          <div className="bg-gray-100 rounded-xl overflow-hidden border border-gray-200" style={{ height: '400px', position: 'relative' }}>
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="animate-spin h-8 w-8 text-blue-600 mb-2" />
                <p className="text-gray-600">Generating your image...</p>
              </div>
            ) : generatedImage ? (
              <div className="relative w-full h-full">
                <Image 
                  src={generatedImage} 
                  alt="Generated image" 
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Your generated image will appear here</p>
              </div>
            )}
          </div>
          {generatedImage && (
            <div className="mt-6">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Image URL:</p>
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleCopyUrl}
                      className="flex items-center text-xs font-medium text-blue-600 hover:text-blue-800 transition"
                    >
                      <Copy size={14} className="mr-1" />
                      {copySuccess ? "Copied!" : "Copy URL"}
                    </button>
                    <a 
                      href={generatedImage} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-xs font-medium text-blue-600 hover:text-blue-800 transition"
                    >
                      <ExternalLink size={14} className="mr-1" />
                      Open
                    </a>
                  </div>
                </div>
                <p className="text-xs text-gray-500 break-all overflow-hidden truncate" title={generatedImage}>
                  {generatedImage}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
