'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { blogPosts } from '@/app/blog/blog-data';

interface SocialMetadata {
  title: string;
  description: string;
  url: string;
  image: string;
  openGraph: {
    title: string;
    description: string;
    type: string;
    url: string;
    images: Array<{ url: string; width: number; height: number; alt: string }>;
    siteName: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    images: string[];
    creator: string;
    site: string;
  };
  linkedin: Record<string, unknown>;
  facebook: Record<string, unknown>;
}

export default function SocialMetadataVerification() {
  const [selectedSlug, setSelectedSlug] = useState('');
  const [metadata, setMetadata] = useState<SocialMetadata | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMetadata = async (slug: string) => {
    if (!slug) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/social-metadata?slug=${slug}`);
      const data = await response.json();
      setMetadata(data);
    } catch (error) {
      console.error('Error fetching metadata:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSlug) {
      fetchMetadata(selectedSlug);
    }
  }, [selectedSlug]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Social Media Metadata Verification</h1>
      
      <div className="mb-8">
        <label htmlFor="slug-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Blog Post:
        </label>
        <select
          id="slug-select"
          value={selectedSlug}
          onChange={(e) => setSelectedSlug(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a blog post...</option>
          {blogPosts.map((post) => (
            <option key={post.slug} value={post.slug}>
              {post.title}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading metadata...</p>
        </div>
      )}

      {metadata && (
        <div className="space-y-8">
          {/* Preview Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Twitter Preview */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 text-blue-600">Twitter Preview</h3>              <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="relative w-full h-48">
                  <Image 
                    src={metadata.image} 
                    alt={metadata.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-sm line-clamp-2">{metadata.title}</h4>
                  <p className="text-gray-600 text-xs mt-1 line-clamp-3">{metadata.description}</p>
                  <p className="text-gray-400 text-xs mt-2">fais.world</p>
                </div>
              </div>
            </div>

            {/* LinkedIn Preview */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 text-blue-700">LinkedIn Preview</h3>              <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="relative w-full h-48">
                  <Image 
                    src={metadata.image} 
                    alt={metadata.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-sm line-clamp-2">{metadata.title}</h4>
                  <p className="text-gray-600 text-xs mt-1 line-clamp-3">{metadata.description}</p>
                  <p className="text-gray-400 text-xs mt-2">fais.world</p>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata Details */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Open Graph */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 text-green-600">Open Graph (Facebook/LinkedIn)</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Title:</strong> {metadata.openGraph.title}</div>
                <div><strong>Description:</strong> {metadata.openGraph.description}</div>
                <div><strong>Image:</strong> <a href={metadata.openGraph.images[0].url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Image</a></div>
                <div><strong>Type:</strong> {metadata.openGraph.type}</div>
                <div><strong>URL:</strong> {metadata.openGraph.url}</div>
                <div><strong>Site Name:</strong> {metadata.openGraph.siteName}</div>
              </div>
            </div>

            {/* Twitter */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 text-blue-500">Twitter Card</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Card Type:</strong> {metadata.twitter.card}</div>
                <div><strong>Title:</strong> {metadata.twitter.title}</div>
                <div><strong>Description:</strong> {metadata.twitter.description}</div>
                <div><strong>Image:</strong> <a href={metadata.twitter.images[0]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Image</a></div>
                <div><strong>Creator:</strong> {metadata.twitter.creator}</div>
                <div><strong>Site:</strong> {metadata.twitter.site}</div>
              </div>
            </div>
          </div>

          {/* Raw Metadata */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Raw Metadata JSON</h3>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
              {JSON.stringify(metadata, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
