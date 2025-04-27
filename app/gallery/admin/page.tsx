'use client';
import { useRef, useState } from 'react';

export default function GalleryAdminPage() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileInput.current?.files?.[0];
    if (!file) return setMessage('No file selected.');

    setMessage('Uploading...');
    const res = await fetch(`/api/upload-image?filename=${encodeURIComponent(file.name)}`, {
      method: 'POST',
      body: file,
    });

    if (res.ok) {
      const data = await res.json();
      setMessage('Upload successful!');
      setBlobUrl(data.url);
      if (fileInput.current) {
        fileInput.current.value = '';
      }
    } else {
      setMessage('Upload failed.');
      setBlobUrl(null);
    }
  }

  return (
    <div className="max-w-lg mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4">Upload Image to Gallery</h1>
      <form onSubmit={handleUpload} className="space-y-4">
        <input type="file" ref={fileInput} accept="image/*" required className="block" />
        <button type="submit" className="btn btn-primary">Upload</button>
      </form>
      {message && <div className="mt-4">{message}</div>}
      {blobUrl && (
        <div className="mt-2">
          Blob url: <a href={blobUrl} target="_blank" rel="noopener noreferrer">{blobUrl}</a>
        </div>
      )}
    </div>
  );
}
