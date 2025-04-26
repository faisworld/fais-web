import { Client } from 'pg';
<<<<<<< HEAD
import path from 'path';
import GalleryClient from './GalleryClient';

function generateAlt(title: string) {
  return title
    .replace(/[-_]/g, ' ')
    .replace(/\.\w+$/, '')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}

=======
import GalleryClient from './GalleryClient';
import path from 'path';

>>>>>>> be7bfa6 (feat: implement gallery client for image management and integrate with gallery page)
async function getImagesAndFolders() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  const res = await client.query('SELECT * FROM images ORDER BY uploaded_at DESC');
  await client.end();

<<<<<<< HEAD
  // Extract folders with hierarchy
  const foldersSet = new Set<string>();
  const images = res.rows.map((img: any) => {
    const urlPath = new URL(img.url).pathname;
    const segments = urlPath.split('/').filter(Boolean);
=======
  // Extract folders and subfolders from image URLs
  const foldersSet = new Set<string>();
  const images = res.rows.map((img: any) => {
    // Parse folder from URL path (e.g., .../images/blog/headers/filename.webp)
    const urlPath = new URL(img.url).pathname; // e.g., /images/blog/headers/filename.webp
    const segments = urlPath.split('/').filter(Boolean); // remove empty
    // Find folder path relative to /images/
>>>>>>> be7bfa6 (feat: implement gallery client for image management and integrate with gallery page)
    const imagesIdx = segments.indexOf('images');
    let folder = '';
    if (imagesIdx !== -1 && segments.length > imagesIdx + 1) {
      folder = segments.slice(imagesIdx + 1, -1).join('/');
<<<<<<< HEAD
      // Add all parent folders for hierarchy
      for (let i = imagesIdx + 1; i < segments.length - 1; i++) {
        const subfolder = segments.slice(imagesIdx + 1, i).join('/');
        if (subfolder) foldersSet.add(subfolder);
      }
      if (folder) {
        const parts = folder.split('/');
        for (let i = 1; i <= parts.length; i++) {
          foldersSet.add(parts.slice(0, i).join('/'));
        }
      }
    }
    // Use real width/height/size if available
    return {
      src: img.url,
      width: img.width || 800,
      height: img.height || 600,
      title: img.title,
      alt: img.alt || generateAlt(img.title || ''),
      key: img.id ? img.id.toString() : img.url,
      folder,
      sizeKB: img.size ? (img.size / 1024).toFixed(1) : null,
      sizeMB: img.size ? (img.size / 1024 / 1024).toFixed(2) : null,
=======
      if (folder) foldersSet.add(folder);
    }
    // File size in KB or MB
    const sizeKB = img.size ? (img.size / 1024).toFixed(1) : null;
    const sizeMB = img.size ? (img.size / 1024 / 1024).toFixed(2) : null;
    return {
      src: img.url,
      width: Number(img.width) > 0 ? Number(img.width) : 4,
      height: Number(img.height) > 0 ? Number(img.height) : 3,
      title: img.title,
      alt: img.alt || img.title || '',
      key: img.id ? img.id.toString() : img.url,
      folder,
      sizeKB,
      sizeMB,
>>>>>>> be7bfa6 (feat: implement gallery client for image management and integrate with gallery page)
      rawSize: img.size,
    };
  });

<<<<<<< HEAD
=======
  // Always include root folder (images not in subfolders)
>>>>>>> be7bfa6 (feat: implement gallery client for image management and integrate with gallery page)
  foldersSet.add('');
  const folders = Array.from(foldersSet).sort();

  return { images, folders };
}

export default async function GalleryPage() {
  const { images, folders } = await getImagesAndFolders();
  return (
<<<<<<< HEAD
    <section className="max-w-7xl mx-auto mt-24 px-4 py-8">
      <div className="rounded-xl bg-white shadow p-6 md:p-8">
        {/* Centered Gallery Title */}
        <div className="w-full flex justify-center mb-8">
          <h1 className="text-3xl font-bold text-center">Gallery</h1>
        </div>
=======
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Gallery</h1>
      <div className="rounded-xl bg-white shadow-lg p-4 md:p-8">
>>>>>>> be7bfa6 (feat: implement gallery client for image management and integrate with gallery page)
        <GalleryClient photos={images} folders={folders} />
      </div>
    </section>
  );
}
