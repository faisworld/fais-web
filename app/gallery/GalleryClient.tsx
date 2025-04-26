'use client';

<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GalleryClient({ photos, folders }: { photos: any[]; folders: string[] }) {
  const [activeFolder, setActiveFolder] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  // Auto-dismiss message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Build folder tree for sidebar
  const folderTree = buildFolderTree(folders);

  // Only show images in the selected folder (root: images not in subfolders)
=======
import { useState } from 'react';

interface Photo {
  src: string;
  width: number;
  height: number;
  title: string;
  alt: string;
  key: string;
  folder: string;
  sizeKB: string | null;
  sizeMB: string | null;
  rawSize: number | null;
}

export default function GalleryClient({ photos, folders }: { photos: Photo[]; folders: string[] }) {
  const [activeFolder, setActiveFolder] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [modalPhoto, setModalPhoto] = useState<Photo | null>(null);

  // Only show images in the selected folder
>>>>>>> be7bfa6 (feat: implement gallery client for image management and integrate with gallery page)
  const filteredPhotos = activeFolder
    ? photos.filter((p) => p.folder === activeFolder)
    : photos.filter((p) => !p.folder);

  // Folder actions
<<<<<<< HEAD
  async function handleCreateFolder(parentPath: string) {
    const name = prompt('Enter new folder name:');
    if (name) {
      const folderPath = parentPath ? `${parentPath}/${name}` : name;
      const res = await fetch('/api/gallery/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: folderPath }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Folder created.');
        window.location.reload();
      } else {
        setMessage(data.error || 'Failed to create folder.');
      }
    }
  }
  async function handleDeleteFolder(folder: string) {
    if (confirm(`Delete folder "${folder}" and all its images?`)) {
      const res = await fetch('/api/gallery/folders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Folder deleted.');
        window.location.reload();
      } else {
        setMessage(data.error || 'Failed to delete folder.');
      }
    }
  }
  async function handleRenameFolder(folder: string) {
    const newName = prompt('Enter new folder name:', folder.split('/').pop());
    if (newName && newName !== folder.split('/').pop()) {
      const parent = folder.split('/').slice(0, -1).join('/');
      const newPath = parent ? `${parent}/${newName}` : newName;
      const res = await fetch('/api/gallery/folders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldName: folder, newName: newPath }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Folder renamed.');
        window.location.reload();
      } else {
        setMessage(data.error || 'Failed to rename folder.');
      }
=======
  function handleDeleteFolder(folder: string) {
    if (confirm(`Delete folder "${folder}" and all its images?`)) {
      // TODO: Call API to delete folder and its images
      alert('Folder deletion not implemented.');
    }
  }
  function handleRenameFolder(folder: string) {
    const newName = prompt('Enter new folder name:', folder);
    if (newName && newName !== folder) {
      // TODO: Call API to rename folder
      alert('Folder renaming not implemented.');
>>>>>>> be7bfa6 (feat: implement gallery client for image management and integrate with gallery page)
    }
  }

  // Image actions
<<<<<<< HEAD
  async function handleDeleteImage(photo: any) {
    if (confirm(`Delete image "${photo.title}"?`)) {
      const res = await fetch('/api/gallery/images', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: photo.key }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Image deleted.');
        window.location.reload();
      } else {
        setMessage(data.error || 'Failed to delete image.');
      }
    }
  }
  async function handleRenameImage(photo: any) {
    const newTitle = prompt('Enter new image title:', photo.title);
    if (newTitle && newTitle !== photo.title) {
      const res = await fetch('/api/gallery/images', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: photo.key, title: newTitle }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Image title updated.');
        window.location.reload();
      } else {
        setMessage(data.error || 'Failed to update image title.');
      }
    }
  }
  async function handleEditAlt(photo: any) {
    const newAlt = prompt('Enter new ALT text:', photo.alt);
    if (newAlt && newAlt !== photo.alt) {
      const res = await fetch('/api/gallery/images', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: photo.key, alt: newAlt }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'ALT text updated.');
        window.location.reload();
      } else {
        setMessage(data.error || 'Failed to update ALT text.');
      }
    }
  }

=======
  function handleDeleteImage(photo: Photo) {
    if (confirm(`Delete image "${photo.title}"?`)) {
      // TODO: Call API to delete image
      alert('Image deletion not implemented.');
    }
  }
  function handleRenameImage(photo: Photo) {
    const newTitle = prompt('Enter new image title:', photo.title);
    if (newTitle && newTitle !== photo.title) {
      // TODO: Call API to rename image
      alert('Image renaming not implemented.');
    }
  }
  function handleEditAlt(photo: Photo) {
    const newAlt = prompt('Enter new ALT text:', photo.alt);
    if (newAlt && newAlt !== photo.alt) {
      // TODO: Call API to update alt text
      alert('ALT text editing not implemented.');
    }
  }

  function handleImageClick(photo: Photo) {
    setModalPhoto(photo);
    setShowModal(true);
  }
  function handleCloseModal() {
    setShowModal(false);
    setModalPhoto(null);
  }

>>>>>>> be7bfa6 (feat: implement gallery client for image management and integrate with gallery page)
  return (
    <div className="flex gap-8">
      {/* Sidebar */}
      <aside className="w-56 min-w-[180px] bg-white rounded-xl shadow p-4 h-fit sticky top-24 self-start z-10">
<<<<<<< HEAD
        {/* No gallery label here */}
        <div className="flex items-center justify-between mb-4">
          {/* Only folders title */}
          <h2 className="text-lg font-semibold">Folders</h2>
          <button
            className="text-green-600 hover:text-green-800 font-bold text-xl"
            title="Create Folder"
            onClick={() => handleCreateFolder('')}
          >＋</button>
        </div>
        {/* Root folder button (rendered separately, not in FolderTree) */}
        <button
          className={`w-full mb-2 text-left px-2 py-1 rounded hover:bg-blue-50 transition ${
            activeFolder === '' ? 'bg-blue-100 font-bold' : ''
          }`}
          onClick={() => setActiveFolder('')}
        >
          root
        </button>
        {/* Render folder tree */}
        <FolderTree
          node={folderTree}
          activeFolder={activeFolder}
          setActiveFolder={setActiveFolder}
          onCreateFolder={handleCreateFolder}
          onRenameFolder={handleRenameFolder}
          onDeleteFolder={handleDeleteFolder}
        />
      </aside>
      {/* Gallery Grid */}
      <div className="flex-1">
        {/* Ensure title is always visible */}

=======
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Folders</h2>
          {/* Add folder button (optional) */}
        </div>
        <ul className="space-y-2">
          {folders.map((folder) => (
            <li key={folder || 'root'} className="flex items-center group">
              <button
                className={`w-full text-left px-2 py-1 rounded hover:bg-blue-50 transition ${
                  activeFolder === folder ? 'bg-blue-100 font-bold' : ''
                }`}
                onClick={() => setActiveFolder(folder)}
              >
                {folder ? folder : 'root'}
              </button>
              {folder && (
                <span className="ml-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    className="text-xs text-blue-600 hover:underline"
                    title="Rename folder"
                    onClick={() => handleRenameFolder(folder)}
                  >✎</button>
                  <button
                    className="text-xs text-red-600 hover:underline"
                    title="Delete folder"
                    onClick={() => handleDeleteFolder(folder)}
                  >🗑</button>
                </span>
              )}
            </li>
          ))}
        </ul>
      </aside>
      {/* Gallery Grid */}
      <div className="flex-1">
>>>>>>> be7bfa6 (feat: implement gallery client for image management and integrate with gallery page)
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.key}
              className="relative rounded-lg overflow-hidden shadow group bg-gray-100 cursor-pointer"
<<<<<<< HEAD
              onClick={() => router.push(`/gallery/${photo.key}`)}
=======
              onClick={() => handleImageClick(photo)}
>>>>>>> be7bfa6 (feat: implement gallery client for image management and integrate with gallery page)
              style={{
                aspectRatio: `${photo.width} / ${photo.height}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#eee',
              }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover object-center transition-transform duration-200 group-hover:scale-105"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                  width: '100%',
                  height: '100%',
                  background: '#ddd',
                }}
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                {photo.title}
              </div>
              {/* Image actions */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  className="text-xs text-blue-600 bg-white rounded px-1"
                  title="Rename"
                  onClick={(e) => { e.stopPropagation(); handleRenameImage(photo); }}
                >✎</button>
                <button
                  className="text-xs text-green-600 bg-white rounded px-1"
                  title="Edit ALT"
                  onClick={(e) => { e.stopPropagation(); handleEditAlt(photo); }}
                >ALT</button>
                <button
                  className="text-xs text-red-600 bg-white rounded px-1"
                  title="Delete"
                  onClick={(e) => { e.stopPropagation(); handleDeleteImage(photo); }}
                >🗑</button>
              </div>
            </div>
          ))}
        </div>
      </div>
<<<<<<< HEAD
      {/* Message display */}
      {message && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-300 px-4 py-2 rounded shadow text-center transition-opacity duration-300">
          {message}
=======
      {/* Modal for image info */}
      {showModal && modalPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              onClick={handleCloseModal}
              title="Close"
            >×</button>
            <img
              src={modalPhoto.src}
              alt={modalPhoto.alt}
              className="w-full h-64 object-contain rounded mb-4 bg-gray-100"
            />
            <div className="space-y-2">
              <div><strong>Title:</strong> {modalPhoto.title}</div>
              <div>
                <strong>Dimensions:</strong> {modalPhoto.width} × {modalPhoto.height} px
                <button
                  className="ml-2 text-xs text-blue-600 underline"
                  onClick={() => navigator.clipboard.writeText(`${modalPhoto.width} × ${modalPhoto.height}`)}
                >Copy</button>
              </div>
              <div>
                <strong>File size:</strong> {modalPhoto.sizeMB ? `${modalPhoto.sizeMB} MB` : modalPhoto.sizeKB ? `${modalPhoto.sizeKB} KB` : 'N/A'}
                {modalPhoto.rawSize && (
                  <button
                    className="ml-2 text-xs text-blue-600 underline"
                    onClick={() => navigator.clipboard.writeText(modalPhoto.rawSize.toString())}
                  >Copy bytes</button>
                )}
              </div>
              <div>
                <strong>Link:</strong>
                <a
                  href={modalPhoto.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-blue-600 underline break-all"
                >{modalPhoto.src}</a>
                <button
                  className="ml-2 text-xs text-blue-600 underline"
                  onClick={() => navigator.clipboard.writeText(modalPhoto.src)}
                >Copy</button>
              </div>
              <div>
                <strong>ALT:</strong> {modalPhoto.alt}
                <button
                  className="ml-2 text-xs text-blue-600 underline"
                  onClick={() => handleEditAlt(modalPhoto)}
                >Edit</button>
              </div>
            </div>
          </div>
>>>>>>> be7bfa6 (feat: implement gallery client for image management and integrate with gallery page)
        </div>
      )}
    </div>
  );
}
<<<<<<< HEAD

function buildFolderTree(folders: string[]) {
  const root: any = {};
  for (const folder of folders) {
    const parts = folder.split('/').filter(Boolean);
    let node = root;
    for (const part of parts) {
      node.children = node.children || {};
      node.children[part] = node.children[part] || {};
      node = node.children[part];
    }
    node.path = folder;
  }
  return root;
}

function FolderTree(props: any) {
  const {
    node,
    path = '',
    activeFolder,
    setActiveFolder,
    level = 0,
    onCreateFolder,
    onRenameFolder,
    onDeleteFolder,
  } = props;

  return (
    <ul className={level === 0 ? "space-y-2" : "ml-4 space-y-1"}>
      {node.children &&
        Object.entries(node.children).map(([name, child]: any) => (
          <li key={child.path || name} className="flex items-center group">
            <button
              className={`w-full text-left px-2 py-1 rounded hover:bg-blue-50 transition ${
                activeFolder === (child.path || name) ? 'bg-blue-100 font-bold' : ''
              }`}
              onClick={() => setActiveFolder(child.path || name)}
            >
              {name}
            </button>
            <span className="ml-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
              <button
                className="text-xs text-blue-600 hover:underline"
                title="Rename folder"
                onClick={() => onRenameFolder(child.path || name)}
              >✎</button>
              <button
                className="text-xs text-red-600 hover:underline"
                title="Delete folder"
                onClick={() => onDeleteFolder(child.path || name)}
              >🗑</button>
              {level < 2 && (
                <button
                  className="text-xs text-green-600 hover:underline"
                  title="Create subfolder"
                  onClick={() => onCreateFolder(child.path || name)}
                >＋</button>
              )}
            </span>
            {/* Recursively render subfolders */}
            <FolderTree
              node={child}
              path={child.path || name}
              activeFolder={activeFolder}
              setActiveFolder={setActiveFolder}
              level={level + 1}
              onCreateFolder={onCreateFolder}
              onRenameFolder={onRenameFolder}
              onDeleteFolder={onDeleteFolder}
            />
          </li>
        ))}
    </ul>
  );
}
=======
>>>>>>> be7bfa6 (feat: implement gallery client for image management and integrate with gallery page)
