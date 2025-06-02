"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, AlertCircle, Check } from "lucide-react";

// Define the available video generation models
const VIDEO_MODELS = [
  { id: "google/veo-2", name: "Google Veo 2" },
  { id: "minimax/video-01-director", name: "Minimax Video 01 Director" },
  { id: "minimax/video-01", name: "Minimax Video 01" },
];

// Constants for model-specific IDs
const MODEL_ID_GOOGLE_VEO_2 = "google/veo-2";
const MODEL_ID_MINIMAX_VIDEO_01_DIRECTOR = "minimax/video-01-director";
const MODEL_ID_MINIMAX_VIDEO_01 = "minimax/video-01";

// Define type-safe interface for the API payload
interface VideoGenerationPayload {
  mediaType: "video";
  modelIdentifier: string;
  prompt: string;
  negativePrompt?: string;
  duration?: number;
  aspectRatio?: string;
  cameraMovements?: string[];
  imageUrl?: string;
  // Google Veo 2 specific parameters
  seed?: number;
  // Minimax Video specific parameters
  prompt_optimizer?: boolean;
  first_frame_image?: string;
  subject_reference?: string;
}

// Sample video URL for testing
const PLACEHOLDER_VIDEO_URL = "https://download.samplelib.com/mp4/sample-5s.mp4";

export default function VideoGenerationPage() {
  // State variables
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedModel') || VIDEO_MODELS[0].id;
    }
    return VIDEO_MODELS[0].id;
  });
  const [prompt, setPrompt] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('prompt') || "";
    }
    return "";
  });
  const [negativePrompt, setNegativePrompt] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('negativePrompt') || "";
    }
    return "";
  });
  const [durationSeconds, setDurationSeconds] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('durationSeconds') || "6");
    }
    return 6;
  });
  const [aspectRatio, setAspectRatio] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('aspectRatio') || "16:9";
    }
    return "16:9";
  });
  const [cameraMovements, setCameraMovements] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cameraMovements') || "";
    }
    return "";
  });  const [referenceImageUrl, setReferenceImageUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('referenceImageUrl') || "";
    }
    return "";
  });
  
  // New state variables for model-specific parameters
  const [seed, setSeed] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('seed') || "";
    }
    return "";
  });
  const [promptOptimizer, setPromptOptimizer] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('promptOptimizer') === 'true';
    }
    return true;
  });
  const [firstFrameImage, setFirstFrameImage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('firstFrameImage') || "";
    }
    return "";
  });
  const [subjectReference, setSubjectReference] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('subjectReference') || "";
    }
    return "";
  });
  
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // useRef to prevent multiple calls
  const isMounted = useRef(false);

  // Check if component is mounted to prevent hydration errors
  useEffect(() => {
    isMounted.current = true;
    setIsLoaded(true);
    return () => {
      isMounted.current = false;
    };
  }, []);
  // Persist form data to localStorage
  useEffect(() => {
    if (isMounted.current && typeof window !== 'undefined') {
      localStorage.setItem('selectedModel', selectedModel);
      localStorage.setItem('prompt', prompt);
      localStorage.setItem('negativePrompt', negativePrompt);
      localStorage.setItem('durationSeconds', durationSeconds.toString());
      localStorage.setItem('aspectRatio', aspectRatio);
      localStorage.setItem('cameraMovements', cameraMovements);
      localStorage.setItem('referenceImageUrl', referenceImageUrl);
      localStorage.setItem('seed', seed);
      localStorage.setItem('promptOptimizer', promptOptimizer.toString());
      localStorage.setItem('firstFrameImage', firstFrameImage);
      localStorage.setItem('subjectReference', subjectReference);
    }
  }, [selectedModel, prompt, negativePrompt, durationSeconds, aspectRatio, cameraMovements, referenceImageUrl, seed, promptOptimizer, firstFrameImage, subjectReference]);

  // For demo purposes - show instant demo video when loading the page in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && isLoaded) {
      // Set a demo video after 1 second delay
      const timer = setTimeout(() => {
        setGeneratedVideo(PLACEHOLDER_VIDEO_URL);
        setSuccessMessage("Demo video loaded for development");
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  const handleGenerate = async () => {
    if (!prompt) {
      setError("Please enter a prompt");
      return;
    }

    // Prevent multiple calls
    if (isGenerating) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedVideo(null);
    setSuccessMessage(null);

    try {      // Create payload with proper type
      const payload: VideoGenerationPayload = {
        mediaType: "video",
        modelIdentifier: selectedModel,
        prompt,
        negativePrompt: negativePrompt || undefined,
        duration: durationSeconds,
        aspectRatio
      };

      // Add model-specific parameters
      if (selectedModel === MODEL_ID_GOOGLE_VEO_2) {
        // Google Veo 2 specific parameters
        if (seed) payload.seed = parseInt(seed);
        if (firstFrameImage) payload.first_frame_image = firstFrameImage;
      } else if (selectedModel === MODEL_ID_MINIMAX_VIDEO_01_DIRECTOR) {
        // Minimax Video 01 Director specific parameters
        payload.prompt_optimizer = promptOptimizer;
        if (firstFrameImage) payload.first_frame_image = firstFrameImage;
        payload.cameraMovements = cameraMovements ? cameraMovements.split(',').map(s => s.trim()).filter(Boolean) : undefined;
      } else if (selectedModel === MODEL_ID_MINIMAX_VIDEO_01) {
        // Minimax Video 01 specific parameters
        payload.prompt_optimizer = promptOptimizer;
        if (firstFrameImage) payload.first_frame_image = firstFrameImage;
        if (subjectReference) payload.subject_reference = subjectReference;
        payload.imageUrl = referenceImageUrl || undefined;
      }

      console.log("Sending API request with payload:", payload);

      const response = await fetch('/api/admin/ai-tools/generate-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate video");
      }

      const data = await response.json();
      setGeneratedVideo(data.videoUrl);
      setSuccessMessage("Video generated successfully!");
    } catch (err) {
      console.error("Error generating video:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDirectTestVideo = () => {
    setGeneratedVideo(PLACEHOLDER_VIDEO_URL);
    setSuccessMessage("Test video loaded successfully!");
  };

  // Safe copy to clipboard function
  const copyToClipboard = (text: string) => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      console.warn('Clipboard API not available');
      return;
    }
    
    navigator.clipboard.writeText(text)
      .then(() => {
        setSuccessMessage("URL copied to clipboard!");
        setTimeout(() => setSuccessMessage(null), 2000);
      })
      .catch(err => {
        console.error("Failed to copy text:", err);
        setError("Failed to copy to clipboard");
      });
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">AI Video Generation</h1>
      
      <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6 text-gray-800">
        <p className="text-sm">
          <strong>Development Mode:</strong> This tool uses a placeholder video in development.
          For production deployment, please ensure your AI API keys are properly configured.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6">Generation Controls</h2>
          
          <div className="space-y-6">
            {/* AI Model Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">AI Model</label>
              <select 
                className="w-full border border-gray-300 rounded-lg py-2.5 px-3"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                {VIDEO_MODELS.map((model) => (
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
                placeholder="Describe the video you want to generate..."
              />
            </div>

            {/* Negative Prompt Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Negative Prompt</label>
              <textarea 
                className="w-full border border-gray-300 rounded-lg py-2.5 px-3 min-h-[80px]"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="What should NOT appear in the video..."
              />
            </div>            {/* Duration Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (seconds)
                {selectedModel === MODEL_ID_GOOGLE_VEO_2 && (
                  <span className="text-xs text-gray-500 ml-1">(5-8 seconds for Veo 2)</span>
                )}
              </label>
              <input 
                type="number" 
                className="w-full border border-gray-300 rounded-lg py-2.5 px-3"
                value={durationSeconds}
                onChange={(e) => setDurationSeconds(parseInt(e.target.value) || 6)}
                min={selectedModel === MODEL_ID_GOOGLE_VEO_2 ? 5 : 1}
                max={selectedModel === MODEL_ID_GOOGLE_VEO_2 ? 8 : 60}
              />
            </div>{/* Aspect Ratio Controls */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-2">
                {selectedModel === MODEL_ID_GOOGLE_VEO_2 ? (                // Google Veo 2 supports only 16:9 and 9:16
                  ["16:9", "9:16"].map((ratio) => (
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
                  ))
                ) : (                  // Minimax models support more ratios
                  ["16:9", "1:1", "4:3", "3:2", "9:16"].map((ratio) => (
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
                  ))
                )}
              </div>
            </div>            {/* Camera Movements Input */}
            {selectedModel === MODEL_ID_MINIMAX_VIDEO_01_DIRECTOR && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Camera Movements</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg py-2.5 px-3"
                  value={cameraMovements}
                  onChange={(e) => setCameraMovements(e.target.value)}
                  placeholder="Pan left, Zoom in, Truck forward"
                />
                <p className="text-xs text-gray-500 mt-1">Comma-separated camera movements (up to 3)</p>
              </div>
            )}

            {/* Reference Image URL Input */}
            {selectedModel === MODEL_ID_MINIMAX_VIDEO_01 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference Image URL</label>
                <input 
                  type="url" 
                  className="w-full border border-gray-300 rounded-lg py-2.5 px-3"
                  value={referenceImageUrl}
                  onChange={(e) => setReferenceImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">Optional: URL of image for image-to-video generation</p>
              </div>
            )}

            {/* Google Veo 2 specific controls */}
            {selectedModel === MODEL_ID_GOOGLE_VEO_2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seed</label>
                  <input 
                    type="number" 
                    className="w-full border border-gray-300 rounded-lg py-2.5 px-3"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    placeholder="Leave empty for random seed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional: Set seed for reproducible results</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Frame Image URL</label>
                  <input 
                    type="url" 
                    className="w-full border border-gray-300 rounded-lg py-2.5 px-3"
                    value={firstFrameImage}
                    onChange={(e) => setFirstFrameImage(e.target.value)}
                    placeholder="https://example.com/first-frame.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional: URL of image to use as first frame</p>
                </div>
              </>
            )}

            {/* Minimax models specific controls */}
            {(selectedModel === MODEL_ID_MINIMAX_VIDEO_01_DIRECTOR || selectedModel === MODEL_ID_MINIMAX_VIDEO_01) && (
              <>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <input
                      type="checkbox"
                      checked={promptOptimizer}
                      onChange={(e) => setPromptOptimizer(e.target.checked)}
                      className="rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                    />
                    Prompt Optimizer
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Automatically enhance the prompt for better results</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Frame Image URL</label>
                  <input 
                    type="url" 
                    className="w-full border border-gray-300 rounded-lg py-2.5 px-3"
                    value={firstFrameImage}
                    onChange={(e) => setFirstFrameImage(e.target.value)}
                    placeholder="https://example.com/first-frame.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional: URL of image to use as first frame</p>
                </div>

                {selectedModel === MODEL_ID_MINIMAX_VIDEO_01 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject Reference Image URL</label>
                    <input 
                      type="url" 
                      className="w-full border border-gray-300 rounded-lg py-2.5 px-3"
                      value={subjectReference}
                      onChange={(e) => setSubjectReference(e.target.value)}
                      placeholder="https://example.com/subject-reference.jpg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Optional: Reference image for consistent subject generation</p>
                  </div>
                )}
              </>
            )}

            {/* Generate & Demo Buttons */}
            <div className="pt-2">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
                className="w-full bg-black text-white py-2.5 px-4 rounded-md hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Generating Video...</span>
                  </>
                ) : (
                  <span>Generate Video</span>
                )}
              </button>
              
              <button
                onClick={handleDirectTestVideo}
                className="w-full border border-gray-300 text-gray-700 py-2.5 px-4 rounded-md hover:bg-gray-50 transition"
              >
                Load Test Video
              </button>
            </div>
          </div>          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              <AlertCircle className="inline-block mr-2 h-5 w-5" />
              {error}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
              <Check className="inline-block mr-2 h-5 w-5" />
              {successMessage}
            </div>
          )}
        </div>

        {/* Generated Video Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Generated Video</h2>
          <div className="bg-gray-100 rounded-md overflow-hidden" style={{ minHeight: '400px' }}>
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-[400px]">
                <Loader2 className="animate-spin h-8 w-8 text-gray-600 mb-2" />
                <p className="text-gray-500">Generating your video...</p>
                <p className="text-sm text-gray-400 mt-1">This might take several minutes</p>
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
            <div className="mt-4 space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-1">Video URL</p>
                <p className="text-xs break-all font-mono bg-white p-2 border border-gray-200 rounded">
                  {generatedVideo}
                </p>
              </div>
              
              <div className="flex space-x-2">
                <a 
                  href={generatedVideo} 
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
                >
                  Download Video
                </a>
                <button
                  onClick={() => copyToClipboard(generatedVideo)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
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
