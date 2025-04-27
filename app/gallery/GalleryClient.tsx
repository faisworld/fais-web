'use client';

import { useEffect, useState } from 'react';

export default function GalleryClient() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      const res = await fetch('/api/gallery/list');
      const data = await res.json();
      setImages(data.images || []);
      setLoading(false);
    }
    fetchImages();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {images.map((img) => (
        <div key={img.id} className="bg-white rounded shadow p-2">
          <img
            src={img.url}
            alt={img['alt-tag'] || img.title}
            title={img.title}
            className="w-full h-auto rounded"
          />
          <div className="mt-2 text-sm text-gray-600">{img.title}</div>
        </div>
      ))}
    </div>
  );
}

