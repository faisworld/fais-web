'use client';

import { useState } from 'react';

export default function ImageEditClient({ img, alt }: { img: any; alt: string }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(img.title);
  const [altText, setAltText] = useState(alt);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave() {
    setMessage(null);
    try {
      const res = await fetch('/api/gallery/images', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: img.id, title, alt: altText }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Saved successfully!');
        setEditing(false);
      } else {
        setMessage(data.error || 'Failed to save.');
      }
    } catch (err) {
      setMessage('An error occurred while saving.');
    }
    setTimeout(() => setMessage(null), 5000);
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-8">
      {/* Image column */}
      <div className="flex-1 flex flex-col items-center">
        <img
          src={img.url}
          alt={alt}
          className="w-full max-w-md h-auto max-h-[400px] object-contain rounded bg-gray-100"
        />
        <button
          className="mt-4 btn btn-secondary"
          onClick={() => alert('Cropping/resizing tools coming soon')}
          title="Cropping/resizing tools coming soon"
        >
          Resize / Crop
        </button>
      </div>
      {/* Info column */}
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <label className="font-semibold block mb-1">Title:</label>
          <input
            type="text"
            className="w-full border rounded px-2 py-1"
            value={title}
            disabled={!editing}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">ALT:</label>
          <input
            type="text"
            className="w-full border rounded px-2 py-1"
            value={altText}
            disabled={!editing}
            onChange={e => setAltText(e.target.value)}
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Dimensions:</label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              className="w-20 border rounded px-2 py-1"
              value={img.width || ''}
              disabled
            />
            <span>×</span>
            <input
              type="number"
              className="w-20 border rounded px-2 py-1"
              value={img.height || ''}
              disabled
            />
            <span>px</span>
          </div>
        </div>
        <div>
          <label className="font-semibold block mb-1">File size:</label>
          <span>
            {img.size
              ? `${(img.size / 1024 / 1024).toFixed(2)} MB (${(img.size / 1024).toFixed(1)} KB)`
              : 'N/A'}
          </span>
        </div>
        <div>
          <label className="font-semibold block mb-1">Link:</label>
          <a href={img.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">{img.url}</a>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            className="btn btn-primary"
            onClick={editing ? handleSave : () => setEditing(true)}
          >
            {editing ? 'Save' : 'Edit Info'}
          </button>
          {editing && (
            <button
              className="btn btn-secondary"
              onClick={() => { setEditing(false); setTitle(img.title); setAltText(alt); }}
            >
              Cancel
            </button>
          )}
        </div>
        {message && (
          <div className="mt-2 text-center text-sm bg-gray-100 border border-gray-300 rounded px-2 py-1">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
