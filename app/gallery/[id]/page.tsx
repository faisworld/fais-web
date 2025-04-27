'use client';

import { useEffect, useState } from 'react';
import ImageEditClient from './ImageEditClient';
import { useParams } from 'next/navigation';

export default function GalleryImageEditPage() {
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const [img, setImg] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchImage() {
      const res = await fetch(`/api/gallery/images?id=${encodeURIComponent(id as string)}`);
      const data = await res.json();
      setImg(data.image || null);
      setLoading(false);
    }
    fetchImage();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  if (!img) {
    return <div className="p-8 text-center text-red-600">Image not found.</div>;
  }

  return <ImageEditClient img={img} alt={img['alt-tag'] || img.title || ''} />;
}
