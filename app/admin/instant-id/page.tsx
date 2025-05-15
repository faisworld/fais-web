"use client";

import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import { FiUpload, FiImage, FiRefreshCw } from "react-icons/fi";

export default function InstantIdPage() {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("File must be an image");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateImage = async () => {
    if (!image || !prompt) {
      setError("Please upload an image and enter a prompt");
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const response = await fetch("/api/instant-id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image,
          prompt,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate image");
      }

      const data = await response.json();
      setGeneratedImage(data.output);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Instant ID Tool</h1>
      <p className="mb-6 text-gray-600">
        Upload a portrait photo and enter a prompt to generate new images with the same person in different styles.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Source Image</h2>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
            style={{ height: "300px" }}
            onClick={() => fileInputRef.current?.click()}
          >
            {image ? (
              <div className="relative w-full h-full">
                <Image
                  src={image}
                  alt="Source"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
            ) : (
              <>
                <FiImage size={48} className="mb-2 text-gray-400" />
                <p className="text-gray-500">Click to upload an image</p>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
          <button
            className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            onClick={() => fileInputRef.current?.click()}
          >
            <FiUpload /> Upload Image
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Prompt</h2>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 mb-4 h-32"
            placeholder="Describe the style, scene, or concept (e.g., 'a cyberpunk character in a neon city')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>
          <button
            className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleGenerateImage}
            disabled={loading || !image || !prompt}
          >
            {loading ? (
              <>
                <FiRefreshCw className="animate-spin" /> Generating...
              </>
            ) : (
              <>Generate Image</>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {generatedImage && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Generated Image</h2>
          <div className="relative w-full h-[400px]">
            <Image
              src={generatedImage}
              alt="Generated image"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <p>Path: {generatedImage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
