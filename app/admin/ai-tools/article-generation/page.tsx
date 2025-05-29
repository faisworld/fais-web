"use client";

import { useState } from "react";
import { Loader2, RefreshCw, Check } from "lucide-react";
import Image from "next/image";

export default function ArticleGenerationPage() {
  const [topic, setTopic] = useState<string>("");
  const [keywords, setKeywords] = useState<string>("");
  const [toneOptions] = useState([
    "informative", "professional", "conversational", "enthusiastic", "technical"
  ]);
  const [selectedTone, setSelectedTone] = useState<string>("informative");
  const [wordCount, setWordCount] = useState<number>(800);
  const [includeImage, setIncludeImage] = useState<boolean>(true);
  
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedContent, setGeneratedContent] = useState<{
    title: string;
    content: string;
    imageUrl?: string;
    slug?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic) {
      setError("Please enter a topic");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedContent(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/admin/ai-tools/generate-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
          tone: selectedTone,
          wordCount,
          includeImage
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate article");
      }

      const data = await response.json();
      setGeneratedContent(data);
      setSuccessMessage("Article generated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToBlog = async () => {
    if (!generatedContent) {
      setError("No article to save");
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);
    setError(null);

    try {
      const response = await fetch('/api/admin/ai-tools/save-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: generatedContent.title,
          content: generatedContent.content,
          imageUrl: generatedContent.imageUrl,
          slug: generatedContent.slug,
          category: 'ai', // Default category, could be made configurable
          keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save article to blog");
      }      await response.json();
      setSaveMessage("Article saved to blog successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">AI Article Generation</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Generation Controls</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic/Title</label>
              <input
                type="text" 
                className="w-full border border-gray-300 rounded-md py-2 px-3"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="E.g., The Future of Artificial Intelligence in Healthcare"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Keywords (comma-separated)</label>
              <input
                type="text" 
                className="w-full border border-gray-300 rounded-md py-2 px-3"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="E.g., AI, healthcare, future, technology, medical"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
              <select 
                className="w-full border border-gray-300 rounded-md py-2 px-3"
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
              >
                {toneOptions.map((tone) => (
                  <option key={tone} value={tone}>{tone.charAt(0).toUpperCase() + tone.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Word Count (approx.)
              </label>
              <div className="flex items-center">
                <input 
                  type="range" 
                  min="300" 
                  max="2000" 
                  step="100"
                  className="w-full mr-4" 
                  value={wordCount}
                  onChange={(e) => setWordCount(parseInt(e.target.value))}
                />
                <span className="text-sm font-medium w-16">{wordCount}</span>
              </div>
            </div>

            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="includeImage"
                checked={includeImage}
                onChange={(e) => setIncludeImage(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor="includeImage" className="ml-2 text-sm text-gray-700">
                Generate and include a featured image
              </label>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Generating Article (This may take a while)...
                </>
              ) : (
                <>
                  <RefreshCw className="h-5 w-5" />
                  Generate Article
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md flex items-center">
              <Check className="h-5 w-5 mr-2" />
              {successMessage}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md overflow-auto max-h-[800px]">
          <h2 className="text-xl font-semibold mb-4">Generated Article</h2>
          
          {isGenerating && (
            <div className="flex flex-col items-center justify-center p-8">
              <Loader2 className="animate-spin h-8 w-8 text-blue-500 mb-4" />
              <p className="text-gray-600">Generating your article...</p>
              <p className="text-sm text-gray-500 mt-2">This may take 1-2 minutes</p>
            </div>
          )}
          
          {!isGenerating && !generatedContent && (
            <div className="flex items-center justify-center h-[400px] bg-gray-100 rounded-md">
              <p className="text-gray-500">Your generated article will appear here</p>
            </div>
          )}
          
          {generatedContent && (
            <div className="article-preview">
              <h1 className="text-2xl font-bold mb-4">{generatedContent.title}</h1>
              {generatedContent.imageUrl && (
                <div className="mb-4">
                  <Image 
                    src={generatedContent.imageUrl} 
                    alt={generatedContent.title}
                    width={800}
                    height={256}
                    className="rounded-md w-full h-auto max-h-64 object-cover"
                  />
                  <p className="text-xs text-gray-500 mt-1">Generated featured image</p>
                </div>
              )}
              <div className="prose max-w-none">
                {generatedContent.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">{paragraph}</p>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedContent.content)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                  >
                    Copy Content
                  </button>
                  
                  <button
                    onClick={() => {
                      const blob = new Blob([generatedContent.content], { type: 'text/markdown' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${generatedContent.slug || 'article'}.md`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-sm"
                  >
                    Download Markdown
                  </button>
                </div>

                <div className="mt-4">
                  <button
                    onClick={handleSaveToBlog}
                    disabled={isSaving || !generatedContent}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5" />
                        Saving to Blog...
                      </>
                    ) : (
                      <>
                        <Check className="h-5 w-5" />
                        Save to Blog
                      </>
                    )}
                  </button>
                </div>

                {saveMessage && (
                  <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
                    {saveMessage}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
