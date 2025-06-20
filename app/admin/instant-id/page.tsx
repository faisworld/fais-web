'use client';

import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Download, Wand2, AlertCircle, CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface GeneratedImage {
  url: string;
  databaseId?: number;
  prompt: string;
  timestamp: string;
}

export default function InstantIDPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image file must be smaller than 10MB');
      return;
    }

    setSelectedFile(file);
    setError('');
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!selectedFile || !prompt.trim()) {
      setError('Please select an image and enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError('');
    setSuccess('');
    setGeneratedImage(null);

    try {
      // Convert file to base64 for the API
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Image = reader.result as string;
          
          const response = await fetch('/api/instant-id', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image: base64Image,
              prompt: prompt.trim(),
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate image');
          }

          const data = await response.json();
          
          if (data.error) {
            throw new Error(data.error);
          }

          setGeneratedImage({
            url: data.url,
            databaseId: data.databaseId,
            prompt: prompt.trim(),
            timestamp: new Date().toISOString(),
          });
          
          setSuccess('✅ Image generated and saved successfully!');
        } catch (err) {
          console.error('Generation error:', err);
          setError(err instanceof Error ? err.message : 'Failed to generate image');
        } finally {
          setIsGenerating(false);
        }
      };
      
      reader.readAsDataURL(selectedFile);
    } catch (err) {
      console.error('File reading error:', err);
      setError('Failed to process the selected image');
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage?.url) return;
    
    try {
      const response = await fetch(generatedImage.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `instant-id-${Date.now()}.webp`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download image');
    }
  };

  const clearForm = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setPrompt('');
    setGeneratedImage(null);
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center mb-6">
            <Wand2 className="h-6 w-6 text-purple-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">InstantID Image Generator</h1>
          </div>
            <p className="text-gray-600 mb-8">
            Upload a reference image and describe how you want to transform it. The AI will generate a new image 
            that maintains the person&apos;s identity while following your creative prompt.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference Image
                </label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {previewUrl ? (
                    <div className="space-y-3">                      <Image 
                        src={previewUrl} 
                        alt="Preview" 
                        width={128}
                        height={128}
                        className="mx-auto h-32 w-32 object-cover rounded-lg"
                      />
                      <p className="text-sm text-gray-600">{selectedFile?.name}</p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearForm();
                        }}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div>
                        <p className="text-gray-600">Click to upload an image</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Supported formats: JPG, PNG, WebP (max 10MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                  Creative Prompt
                </label>
                <textarea
                  id="prompt"
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe how you want to transform the image... e.g., 'professional headshot in business attire', 'artistic portrait with dramatic lighting', 'casual photo in a coffee shop'"
                  disabled={isGenerating}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Be specific about style, setting, clothing, or mood for best results
                </p>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!selectedFile || !prompt.trim() || isGenerating}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    <span>Generate Image</span>
                  </>
                )}
              </button>
            </div>

            {/* Output Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Generated Image
                </label>
                <div className="border border-gray-300 rounded-lg p-6 bg-gray-50 min-h-[300px] flex items-center justify-center">
                  {generatedImage ? (
                    <div className="space-y-4 text-center">                      <Image 
                        src={generatedImage.url} 
                        alt="Generated" 
                        width={256}
                        height={256}
                        className="mx-auto max-h-64 w-auto rounded-lg shadow-md"
                      />
                      <div className="flex space-x-3 justify-center">
                        <button
                          onClick={handleDownload}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </button>
                        <button
                          onClick={clearForm}
                          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                        >
                          New Generation
                        </button>
                      </div>
                      {generatedImage.databaseId && (
                        <p className="text-xs text-gray-600">
                          ✅ Saved to database (ID: {generatedImage.databaseId})
                        </p>
                      )}
                    </div>
                  ) : isGenerating ? (
                    <div className="text-center space-y-4">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
                      <p className="text-gray-600">Generating your image...</p>
                      <p className="text-sm text-gray-500">This usually takes 30-60 seconds</p>
                    </div>
                  ) : (
                    <div className="text-center space-y-3">
                      <ImageIcon className="mx-auto h-16 w-16 text-gray-400" />
                      <p className="text-gray-500">Generated image will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          {/* Usage Guidelines */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Tips for Best Results</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use clear, well-lit reference photos with visible faces</li>
              <li>• Be specific in your prompts (mention clothing, setting, style)</li>
              <li>• Avoid overly complex or contradictory descriptions</li>
              <li>• Generated images are automatically saved to your media library</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
