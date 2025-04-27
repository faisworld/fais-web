'use client';

import { useEffect, useState } from 'react';
import GalleryClient from './GalleryClient';

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Replace with your actual API endpoint or logic
      const res = await fetch('/api/gallery/list');
      const data = await res.json();
      setImages(data.images || []);
      setFolders(data.folders || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Gallery</h1>
        <div>Loading...</div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Gallery</h1>
      <div className="rounded-xl bg-white shadow-lg p-4 md:p-8">
        <GalleryClient photos={images} folders={folders} />
      </div>
    </section>
  );
}