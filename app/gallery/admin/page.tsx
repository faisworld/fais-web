'use client';
import { useRef, useState } from 'react';

export default function GalleryAdminPage() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileInput.current?.files?.[0];
    if (!file) return setMessage('No file selected.');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);

    setMessage('Uploading...');
    const res = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      setMessage('Upload successful!');
      if (fileInput.current) {
        fileInput.current.value = '';
      }
    } else {
      setMessage('Upload failed.');
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
    </div>
  );
}
