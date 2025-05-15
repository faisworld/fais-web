"use client";

import { useState } from "react";
import { Loader2, RefreshCw, Check, AlertCircle } from "lucide-react";

// Define the available video generation models
const VIDEO_MODELS = [
  { id: "google/veo-2:tjqhsk4eddrma0cn7w38c91tq8", name: "Google Veo 2" },
  { id: "minimax/video-01-director:654gq25cfxrmc0cmyjev7cz4rg", name: "Minimax Video 01 Director" },
  { id: "minimax/video-01:15eyanar9xrg80ckd3ytdz0hhr", name: "Minimax Video 01" },
];

// Constants for model-specific IDs
const MODEL_ID_MINIMAX_VIDEO_01_DIRECTOR = "minimax/video-01-director:654gq25cfxrmc0cmyjev7cz4rg";
const MODEL_ID_MINIMAX_VIDEO_01 = "minimax/video-01:15eyanar9xrg80ckd3ytdz0hhr";

export default function VideoGenerationPage() {
  const [selectedModel, setSelectedModel] = useState<string>(VIDEO_MODELS[0].id);
  const [prompt, setPrompt] = useState<string>("");
  const [negativePrompt, setNegativePrompt] = useState<string>("");
  const [durationSeconds, setDurationSeconds] = useState<number>(6);
  const [aspectRatio, setAspectRatio] = useState<string>("16:9");
  const [cameraMovements, setCameraMovements] = useState<string>("");
  const [referenceImageUrl, setReferenceImageUrl] = useState<string>("");
  
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) {
      setError("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedVideo(null);
    setSuccessMessage(null);

    try {
      const payload: any = {
        mediaType: "video",
        modelIdentifier: selectedModel,
        prompt,
        negativePrompt: negativePrompt || undefined,
        duration: durationSeconds,
        aspectRatio
      };

      // Add model-specific parameters
      if (selectedModel === MODEL_ID_MINIMAX_VIDEO_01_DIRECTOR && cameraMovements) {
        payload.cameraMovements = cameraMovements.split(',').map((s: string) => s.trim()).filter(Boolean);
      }

      if (selectedModel === MODEL_ID_MINIMAX_VIDEO_01 && referenceImageUrl) {
        payload.imageUrl = referenceImageUrl;
      }

      console.log("Sending request with payload:", payload);

      const response = await fetch('/api/admin/ai-tools/generate-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);
      
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate video");
      }

      setGeneratedVideo(data.videoUrl);
      setSuccessMessage("Video generated successfully!");
    } catch (err) {
      console.error("Error generating video:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsGenerating(false);
    }
  };

  // To handle testing via direct URL
  const handleDirectTestVideo = () => {
    setGeneratedVideo("https://mzcje1drftvqhdku.public.blob.vercel-storage.com/sample/placeholder-video.mp4");
    setSuccessMessage("Test video loaded successfully!");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">AI Video Generation</h1>

      <button 
        onClick={handleDirectTestVideo}
        className="mb-4 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
      >
        Load Test Video Directly
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6">Generation Controls</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <select 
                className="w-full border border-gray-300 rounded-lg py-2 px-3"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                {VIDEO_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prompt</label>
              <textarea 
                className="w-full border border-gray-300 rounded-lg py-2 px-3 min-h-[100px]"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the video you want to generate..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Negative Prompt (Optional)</label>
              <textarea 
                className="w-full border border-gray-300 rounded-lg py-2 px-3"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="What should NOT be in the video (e.g., blurry, low quality, etc.)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (seconds)</label>
                <input 
                  type="number" 
                  className="w-full border border-gray-300 rounded-lg py-2 px-3"
                  value={durationSeconds}
                  onChange={(e) => setDurationSeconds(parseInt(e.target.value) || 6)}
                  min={1}
                  max={60}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aspect Ratio</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg py-2 px-3"
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                >
                  <option value="16:9">16:9 (Landscape)</option>
                  <option value="1:1">1:1 (Square)</option>
                  <option value="9:16">9:16 (Portrait)</option>
                </select>
              </div>
            </div>

            {/* Model-specific inputs */}
            {selectedModel === MODEL_ID_MINIMAX_VIDEO_01_DIRECTOR && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Camera Movements (comma-separated, max 3)
                </label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg py-2 px-3"
                  value={cameraMovements}
                  onChange={(e) => setCameraMovements(e.target.value)}
                  placeholder="E.g., Pan left, Zoom in, Truck forward"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Supported: Truck, Pan, Push, Pull, Pedestal, Tilt, Zoom, Shake, Tracking, Static
                </p>
              </div>
            )}

            {selectedModel === MODEL_ID_MINIMAX_VIDEO_01 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reference Image URL (for Image-to-Video)
                </label>
                <input 
                  type="url" 
                  className="w-full border border-gray-300 rounded-lg py-2 px-3"
                  value={referenceImageUrl}
                  onChange={(e) => setReferenceImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Optional: Provide a reference image URL to generate a video based on this image
                </p>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Generating Video...
                </>
              ) : (
                <>
                  <RefreshCw className="h-5 w-5" />
                  Generate Video
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
              <AlertCircle className="inline mr-2" size={16} />
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-md">
              <Check className="inline mr-2" size={16} />
              {successMessage}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Generated Video</h2>
          <div className="bg-gray-100 rounded-md overflow-hidden" style={{ minHeight: '400px' }}>
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-[400px]">
                <Loader2 className="animate-spin h-8 w-8 text-blue-600 mb-2" />
                <p className="text-gray-500">Generating your video...</p>
                <p className="text-sm text-gray-400 mt-1">This may take a while</p>
              </div>
            ) : generatedVideo ? (
              <div>
                <video 
                  src={generatedVideo} 
                  controls
                  className="w-full h-auto max-h-[400px]"
                  playsInline
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px]">
                <p className="text-gray-500">Generated video will appear here</p>
              </div>
            )}
          </div>
          
          {generatedVideo && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">
                <span className="font-semibold">Video URL:</span>
              </p>
              <div className="bg-gray-50 p-2 rounded border border-gray-200 mb-3">
                <p className="text-xs break-all">{generatedVideo}</p>
              </div>
              <div className="flex space-x-2">
                <a 
                  href={generatedVideo} 
                  download="generated-video"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Download Video
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(generatedVideo)}
                  className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                >
                  Copy URL
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
