"use client";

import React, { useState } from "react";
import Replicate from "replicate";

export default function InstantIDPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // You must set REPLICATE_API_TOKEN in your environment and use a Next.js API route for security!
    const res = await fetch("/api/instant-id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageUrl, prompt }),
    });
    const data = await res.json();
    setResult(data.output || data.error || "No output");
    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto px-4 pb-12">
      <h1 className="text-2xl font-bold mb-4">InstantID Image Creator</h1>
      <form onSubmit={handleGenerate} className="space-y-4">
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          placeholder="Image URL"
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
          required
        />
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          placeholder="Prompt"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          required
        />
        <button
          type="submit"
          className="button"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Image"}
        </button>
      </form>
      {result && (
        <div className="mt-6">
          {result.startsWith("http") ? (
            <img src={result} alt="Generated" className="rounded shadow" />
          ) : (
            <div className="text-red-600">{result}</div>
          )}
        </div>
      )}
    </div>
  );
}
