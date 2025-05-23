"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Edit, Trash2, FolderPlus, X, Copy, CheckCircle, ExternalLink, Info, Link as LinkIcon, Film, Download, Check, Layers, RefreshCw, Upload, ArrowLeft, ArrowRight, Folder, Image as ImageIcon } from "lucide-react";

// Extended interface to support both images and videos
interface GalleryMedia {
  id: number;
  url: string;
  title: string;
  "alt-tag"?: string;
  altTag?: string;
  folder?: string;
  description?: string;
  width?: number;
  height?: number;
  size?: number;
  format?: string;
  uploaded_at?: string;
  mediaType?: 'image' | 'video'; // New field to indicate media type
}

// Add thumbnail URLs for GIF and video files
export const thumbnailImages: { [key: string]: string } = {
  'about-mission-image': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/thumbnails/about-mission-thumbnail.jpg',
  // Add more thumbnail mappings as needed
};

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryMedia | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    alt: "",
    folder: "",
    description: "",
  });
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyingImageId, setCopyingImageId] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [folders, setFolders] = useState<string[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string>('');
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [movingMedia, setMovingMedia] = useState<GalleryMedia | null>(null);
  const [targetFolder, setTargetFolder] = useState('');
  const [showMoveModal, setShowMoveModal] = useState(false);
  const router = useRouter();

  // Check if we're on the client side to prevent SSR errors
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch images from admin API with folder filtering
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const url = currentFolder 
          ? `/api/admin/gallery/list?folder=${encodeURIComponent(currentFolder)}` 
          : '/api/admin/gallery/list';
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Error fetching images: ${response.statusText}`);
        }
        
        const data = await response.json();
        setImages(data.images || []);
        setFolders(data.folders || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        console.error("Failed to fetch images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [currentFolder]);

  // Add a refresh function to fetch latest images from Blobstore
  const refreshGallery = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/gallery/list?t=" + Date.now()); // Cache-busting
      
      if (!response.ok) {
        throw new Error(`Error fetching images: ${response.statusText}`);
      }
      
      const data = await response.json();
      setImages(data.images || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      console.error("Failed to fetch images:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (image: GalleryMedia) => {
    setSelectedImage(image);
    setEditData({
      title: image.title || "",
      alt: image.altTag || image["alt-tag"] || "",
      folder: image.folder || "",
      description: image.description || "",
    });
    setShowEditModal(true);
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedImage) return;
    
    try {
      // First ensure we're using the correct ID format
      const imageId = typeof selectedImage.id === 'number' ? selectedImage.id : parseInt(String(selectedImage.id));
      
      if (isNaN(imageId)) {
        throw new Error("Invalid image ID");
      }
      
      const response = await fetch("/api/admin/gallery/images", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: imageId,
          title: editData.title,
          alt: editData.alt,
          folder: editData.folder,
          description: editData.description,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error updating image: ${response.statusText}. ${errorData.error || ''}`);
      }
      
      const data = await response.json();
      const image = data.image;
      
      // Update the image in the local state with proper error checking
      if (image) {
        setImages(images.map(img => 
          img.id === imageId ? { ...img, ...image } : img
        ));
        
        // If folder changed, we may need to refresh
        if (image.folder !== selectedImage.folder) {
          refreshGallery();
        }
      }
      
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to update image:", err);
      alert(`Failed to update image: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm("Are you sure you want to delete this media? This action cannot be undone.")) {
      return;
    }
    
    setIsDeletingImage(true);
    
    try {
      const response = await fetch("/api/admin/gallery/images", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: imageId }),
      });
      
      if (!response.ok) {
        throw new Error(`Error deleting image: ${response.statusText}`);
      }
      
      // Remove the image from the local state
      setImages(images.filter(img => img.id !== imageId));
    } catch (err) {
      console.error("Failed to delete media:", err);
      alert("Failed to delete media. Please try again.");
    } finally {
      setIsDeletingImage(false);
    }
  };

  const handleUploadClick = () => {
    router.push("/admin/gallery/upload");
  };

  const handleImageClick = (image: GalleryMedia) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  const copyToClipboard = (text: string) => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      console.warn('Clipboard API not available');
      return;
    }
    
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text:', err);
      });
  };

  const copyImageUrl = (e: React.MouseEvent, imageUrl: string, imageId: number) => {
    e.stopPropagation(); // Prevent triggering the image click handler
    
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      console.warn('Clipboard API not available');
      return;
    }
    
    navigator.clipboard.writeText(imageUrl)
      .then(() => {
        setCopyingImageId(imageId);
        setTimeout(() => setCopyingImageId(null), 2000);
      })
      .catch(err => {
        console.error('Failed to copy image URL:', err);
      });
  };

  const openImageUrl = (e: React.MouseEvent, imageUrl: string) => {
    e.stopPropagation(); // Prevent triggering the image click handler
    
    if (typeof window === 'undefined') {
      console.warn('Window API not available');
      return;
    }
    
    window.open(imageUrl, '_blank', 'noopener,noreferrer');
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'Unknown';
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(2)} KB`;
    } else {
      return `${(kb / 1024).toFixed(2)} MB`;
    }
  };

  const isVideo = (url: string): boolean => {
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  const toggleItemSelection = (e: React.MouseEvent, itemId: number) => {
    e.stopPropagation(); // Prevent opening the item details modal
    
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(itemId)) {
      newSelectedItems.delete(itemId);
    } else {
      newSelectedItems.add(itemId);
    }
    
    setSelectedItems(newSelectedItems);
    
    // Exit selection mode if no items are selected
    if (newSelectedItems.size === 0) {
      setSelectionMode(false);
    }
  };

  const toggleSelectionMode = () => {
    if (selectionMode) {
      // Clear all selections when exiting selection mode
      setSelectedItems(new Set());
    }
    setSelectionMode(!selectionMode);
  };

  const selectAllItems = () => {
    if (selectedItems.size === images.length) {
      // Deselect all if all are already selected
      setSelectedItems(new Set());
    } else {
      // Select all items
      const allItemIds = images.map(item => item.id);
      setSelectedItems(new Set(allItemIds));
    }
  };

  const downloadSelectedMedia = async () => {
    if (selectedItems.size === 0) return;
    
    setIsDownloading(true);
    
    try {
      const selectedMedia = images.filter(item => selectedItems.has(item.id));
      
      if (selectedItems.size === 1) {
        const item = selectedMedia[0];
        const link = document.createElement('a');
        link.href = item.url;
        link.download = item.title || `media-${item.id}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        for (const item of selectedMedia) {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const link = document.createElement('a');
          link.href = item.url;
          link.download = item.title || `media-${item.id}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
      
      alert(`Successfully initiated download of ${selectedItems.size} files. Check your downloads folder.`);
    } catch (err) {
      console.error("Error downloading files:", err);
      alert("There was an error downloading some files. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    try {
      const response = await fetch('/api/admin/gallery/create-folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newFolderName,
          parent: currentFolder 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create folder');
      }
      
      // Refresh gallery to show new folder
      refreshGallery();
      setShowFolderModal(false);
      setNewFolderName('');
      
    } catch (err) {
      console.error('Error creating folder:', err);
      alert('Failed to create folder. Please try again.');
    }
  };

  const handleMoveMedia = async () => {
    if (!movingMedia) return;
    
    try {
      const response = await fetch('/api/admin/gallery/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mediaId: movingMedia.id,
          sourceUrl: movingMedia.url,
          targetFolder: targetFolder 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to move media');
      }
      
      // Refresh gallery after move
      refreshGallery();
      setShowMoveModal(false);
      setMovingMedia(null);
      setTargetFolder('');
      
    } catch (err) {
      console.error('Error moving media:', err);
      alert('Failed to move media. Please try again.');
    }
  };

  const openMoveDialog = (media: GalleryMedia) => {
    setMovingMedia(media);
    setTargetFolder('');
    setShowMoveModal(true);
  };

  const navigateToFolder = (folder: string) => {
    setCurrentFolder(folder);
  };

  const navigateUp = () => {
    if (!currentFolder) return;
    
    const parts = currentFolder.split('/');
    if (parts.length <= 1) {
      setCurrentFolder('');
    } else {
      setCurrentFolder(parts.slice(0, -1).join('/'));
    }
  };

  const renderImageWithFallback = (src: string, alt: string, className: string = '') => {
    return (
      <div className={`relative ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          unoptimized={true} // Skip optimization for Blobstore images
          onError={(e) => {
            // On error, replace with placeholder
            e.currentTarget.src = '/placeholder-image.jpg';
          }}
        />
      </div>
    );
  };

  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center my-12">
          <div className="h-10 w-10 bg-blue-100 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Gallery Management</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowFolderModal(true)}
            className="px-3 py-2 rounded-md flex items-center bg-green-600 text-white hover:bg-green-700 transition-all"
          >
            <FolderPlus size={16} className="mr-1.5" />
            New Folder
          </button>
          
          <button 
            onClick={refreshGallery}
            className="px-3 py-2 rounded-md flex items-center bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 transition-all"
            title="Refresh gallery"
            disabled={loading}
          >
            <RefreshCw size={16} className={`mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button 
            className={`px-3 py-2 rounded-md flex items-center transition-all ${
              selectionMode 
                ? "bg-blue-100 text-blue-700 border border-blue-300" 
                : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
            }`}
            onClick={toggleSelectionMode}
            title={selectionMode ? "Exit selection mode" : "Enter selection mode"}
          >
            <Layers size={16} className="mr-1.5" />
            {selectionMode ? "Exit Selection" : "Select Multiple"}
          </button>
          
          {/* Add the delete button here */}
          <button 
            className="px-3 py-2 rounded-md flex items-center bg-red-600 text-white hover:bg-red-700 transition-all"
            onClick={() => {
              if (selectedItems.size === 0) {
                alert('Please select items to delete first');
                return;
              }
              
              if (window.confirm(`Are you sure you want to delete ${selectedItems.size} selected items? This cannot be undone.`)) {
                const itemsToDelete = Array.from(selectedItems);
                setLoading(true);
                
                fetch('/api/admin/gallery/images', {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ ids: itemsToDelete })
                })
                  .then((response) => response.json())
                  .then((data) => {
                    if (data.results) {
                      setImages((prev) => prev.filter((img: GalleryMedia) => !data.results.success.includes(img.id)));
                      setSelectedItems(new Set());
                      alert(`Successfully deleted ${data.results.successCount} items${data.results.failCount > 0 ? `, failed to delete ${data.results.failCount}` : ''}.`);
                    } else {
                      alert('Error: ' + (data.error || 'Unknown error occurred'));
                    }
                  })
                  .catch((err) => {
                    console.error('Error deleting items:', err);
                    alert('Failed to delete items. Please try again.');
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              }
            }}
            disabled={selectedItems.size === 0 || loading}
            title="Delete selected items"
          >
            <Trash2 size={16} className="mr-1.5" />
            Delete Selected
          </button>
          
          <button 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 rounded-md flex items-center shadow-md hover:shadow-lg transition-all"
            onClick={handleUploadClick}
          >
            <Upload className="mr-1.5" size={16} /> 
            <span>Upload New Media</span>
          </button>
        </div>
      </div>      {/* Folder navigation */}
      <div className="bg-gray-50 border border-gray-200 rounded-md p-2 mb-4 flex items-center overflow-x-auto">
        <button 
          onClick={() => setCurrentFolder('')}
          className={`px-2 py-1 text-sm rounded-md mr-2 flex items-center ${!currentFolder ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
        >
          <Folder size={14} className="mr-1" /> Root
        </button>
        
        {/* Display default folders first for quick access */}
        {!currentFolder && (
          <>
            <div className="text-gray-400 mx-2">|</div>
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentFolder('images')}
                className="px-2 py-1 text-sm rounded-md hover:bg-gray-200 flex items-center"
              >
                <ImageIcon size={14} className="mr-1 text-blue-600" /> images
              </button>
              <button
                onClick={() => setCurrentFolder('carousel')}
                className="px-2 py-1 text-sm rounded-md hover:bg-gray-200 flex items-center"
              >
                <Film size={14} className="mr-1 text-green-600" /> carousel
              </button>
              <button
                onClick={() => setCurrentFolder('videos')}
                className="px-2 py-1 text-sm rounded-md hover:bg-gray-200 flex items-center"
              >
                <Film size={14} className="mr-1 text-red-600" /> videos
              </button>
            </div>
          </>
        )}
        
        {/* Breadcrumb navigation */}
        {currentFolder && (
          <div className="flex items-center">
            <div className="text-gray-400 mx-2">/</div>
            {currentFolder.split('/').map((folder, index, array) => (
              <div key={index} className="flex items-center">
                <button
                  onClick={() => navigateToFolder(array.slice(0, index + 1).join('/'))}
                  className={`px-2 py-1 text-sm rounded-md hover:bg-gray-200 flex items-center ${
                    index === array.length - 1 ? 'bg-blue-100 text-blue-700 font-medium' : ''
                  }`}
                >
                  {folder}
                </button>
                {index < array.length - 1 && <div className="text-gray-400 mx-1">/</div>}
              </div>
            ))}
          </div>
        )}
        
        {currentFolder && (
          <button
            onClick={navigateUp}
            className="px-2 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md mr-2 flex items-center"
          >
            <ArrowLeft size={12} className="mr-1" />
            Up
          </button>
        )}
        
        {currentFolder.split('/').map((part, index, array) => {
          const path = array.slice(0, index + 1).join('/');
          return (
            <button
              key={path}
              onClick={() => navigateToFolder(path)}
              className={`px-2 py-1 text-sm rounded-md mr-2 ${
                index === array.length - 1 ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'
              }`}
            >
              {part}
            </button>
          );
        })}
      </div>

      {selectionMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              checked={selectedItems.size > 0 && selectedItems.size === images.length}
              onChange={selectAllItems}
              className="h-5 w-5 text-blue-600 rounded mr-2"
            />
            <span className="mr-4 text-blue-800 font-medium">
              {selectedItems.size} {selectedItems.size === 1 ? 'item' : 'items'} selected
            </span>
          </div>
          
          <div className="flex space-x-2">
            {selectedItems.size > 0 && (
              <>
                <button 
                  onClick={downloadSelectedMedia}
                  disabled={isDownloading}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded flex items-center hover:bg-blue-700 disabled:opacity-50"
                >
                  {isDownloading ? (
                    <Loader2 size={16} className="mr-1.5 animate-spin" />
                  ) : (
                    <Download size={16} className="mr-1.5" />
                  )}
                  Download Selected
                </button>
                
                <button 
                  onClick={() => setSelectedItems(new Set())}
                  className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded flex items-center hover:bg-gray-300"
                >
                  <X size={16} className="mr-1.5" />
                  Clear Selection
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center my-12">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <p className="text-sm">Please check your database connection or try again later.</p>
        </div>
      ) : images.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Upload size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            {currentFolder ? `No media in ${currentFolder.split('/').pop()}` : 'No media found'}
          </h3>
          <p className="text-gray-500 mb-6">Upload some media files to get started</p>
          <button 
            onClick={handleUploadClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Upload Media
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((item) => (
            <div 
              key={item.id} 
              className={`border rounded-lg overflow-hidden bg-white shadow-md transition-all ${
                selectionMode && selectedItems.has(item.id) ? "ring-2 ring-blue-500" : "hover:shadow-lg"
              }`}
            >
              <div 
                className="relative h-48 w-full cursor-pointer"
                onClick={selectionMode ? (e) => toggleItemSelection(e, item.id) : () => handleImageClick(item)}
              >
                {selectionMode && (
                  <div className="absolute top-2 left-2 z-10">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                      selectedItems.has(item.id) 
                        ? "bg-blue-500 text-white" 
                        : "bg-black bg-opacity-40 text-white"
                    }`}>
                      {selectedItems.has(item.id) && <Check size={16} />}
                    </div>
                  </div>
                )}
              
                {isVideo(item.url) ? (
                  <div className="w-full h-full relative">
                    <video 
                      src={item.url}
                      className="object-cover w-full h-full"
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 rounded-full p-3">
                        <Film className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                ) : (
                  // Use unoptimized image with fallback
                  renderImageWithFallback(item.url, item.title, "hover:scale-105 transition-transform duration-300")
                )}
                
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md">
                  <Info size={14} className="inline mr-1 align-text-bottom" />
                  <span>Details</span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                <p className="text-sm text-gray-500 truncate">
                  {isVideo(item.url) ? 'Video' : `Alt: ${item.altTag || item["alt-tag"] || "None"}`}
                </p>
                {item.folder && (
                  <p className="text-sm text-gray-500 flex items-center">
                    <Folder size={12} className="mr-1" />
                    <span className="truncate">{item.folder}</span>
                  </p>
                )}
                
                <div className="mt-3 mb-3 bg-gray-50 p-2 rounded-md border border-gray-200 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-700 flex items-center">
                      <LinkIcon size={12} className="mr-1" /> URL
                    </span>
                    <div className="flex space-x-1">
                      <button 
                        onClick={(e) => copyImageUrl(e, item.url, item.id)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="Copy URL"
                      >
                        {copyingImageId === item.id ? <CheckCircle size={12} /> : <Copy size={12} />}
                      </button>
                      <button 
                        onClick={(e) => openImageUrl(e, item.url)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="Open in new tab"
                      >
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="truncate text-gray-600 text-[10px]" title={item.url}>
                    {item.url}
                  </div>
                </div>
                
                <div className="flex mt-2 space-x-2">
                  {!selectionMode ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(item);
                        }}
                        className="flex-1 flex items-center justify-center px-2 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                      >
                        <Edit size={14} className="mr-1" /> Edit
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openMoveDialog(item);
                        }}
                        className="flex-1 flex items-center justify-center px-2 py-1 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
                      >
                        <FolderPlus size={14} className="mr-1" /> Move
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(item.id);
                        }}
                        className="flex-1 flex items-center justify-center px-2 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                        disabled={isDeletingImage}
                      >
                        <Trash2 size={14} className="mr-1" /> Delete
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={(e) => toggleItemSelection(e, item.id)}
                      className={`w-full flex items-center justify-center px-2 py-1 rounded-md ${
                        selectedItems.has(item.id)
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {selectedItems.has(item.id) ? (
                        <>
                          <Check size={14} className="mr-1" /> Selected
                        </>
                      ) : (
                        "Select"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}      {/* Create folder modal */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Create New Folder</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Folder Name</label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter folder name (letters, numbers, hyphens)"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Only letters, numbers, and hyphens will be kept. Special characters will be replaced with hyphens.
              </p>
            </div>
            
            <div className="mb-4 bg-blue-50 p-3 rounded-md">
              <div className="flex items-start">
                <Info size={16} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">Gallery Structure</p>
                  <p className="text-xs text-blue-700 mt-1">
                    The gallery uses three main folders: <strong>images/</strong>, <strong>carousel/</strong>, and <strong>videos/</strong>. 
                    New folders will be created in the <strong>images/</strong> folder by default unless specified otherwise.
                  </p>
                </div>
              </div>
            </div>
            
            {currentFolder && (
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  This folder will be created inside: <span className="font-medium">{currentFolder}</span>
                </p>
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowFolderModal(false)}
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <X size={16} className="mr-1.5" /> Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <FolderPlus size={16} className="mr-1.5" /> Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Move media modal */}
      {showMoveModal && movingMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Move Media to Folder</h2>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Moving:</p>
              <div className="flex items-center p-2 bg-gray-50 rounded-md">
                {isVideo(movingMedia.url) ? (
                  <Film size={24} className="mr-2 text-gray-500" />
                ) : (
                  <ImageIcon size={24} className="mr-2 text-gray-500" />
                )}
                <span className="font-medium truncate">{movingMedia.title}</span>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Folder</label>
              <select
                value={targetFolder}
                onChange={(e) => setTargetFolder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Root (No Folder)</option>
                {folders.map(folder => (
                  <option key={folder} value={folder}>{folder}</option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowMoveModal(false)}
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <X size={16} className="mr-1.5" /> Cancel
              </button>
              <button
                onClick={handleMoveMedia}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <ArrowRight size={16} className="mr-1.5" /> Move
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Image</h2>
            
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({...editData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                <input
                  type="text"
                  value={editData.alt}
                  onChange={(e) => setEditData({...editData, alt: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Folder</label>
                <select
                  value={editData.folder}
                  onChange={(e) => setEditData({...editData, folder: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">No folder</option>
                  <option value="images">images</option>
                  <option value="carousel">carousel</option>
                  <option value="videos">videos</option>
                  {folders.filter(folder => 
                    !["images", "carousel", "videos"].includes(folder)
                  ).map((folder, idx) => (
                    <option key={`folder-${idx}`} value={folder}>
                      {folder}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({...editData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <X size={16} className="mr-1.5" /> Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <CheckCircle size={16} className="mr-1.5" /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-md w-[800px] max-w-[95vw] max-h-[85vh] overflow-hidden shadow-2xl relative flex flex-col">
            <div className="flex justify-between items-center bg-blue-600 text-white px-6 py-3">
              <h3 className="text-xl font-bold">{isVideo(selectedImage.url) ? 'Video' : 'Image'} Details</h3>
              <button 
                onClick={handleCloseImageModal}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row p-0 overflow-y-auto">
              <div className="w-full md:w-1/2 relative h-[400px] bg-gray-100 p-4">
                {isVideo(selectedImage.url) ? (
                  <video
                    src={selectedImage.url}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Image
                    src={selectedImage.url}
                    alt={selectedImage.altTag || selectedImage["alt-tag"] || selectedImage.title}
                    fill
                    className="object-contain"
                  />
                )}
              </div>

              <div className="w-full md:w-1/2 p-6 space-y-4">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedImage.title}</h2>
                  <p className="text-gray-600">
                    {selectedImage.description || "No description provided"}
                  </p>
                </div>

                <div>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="border-b border-gray-200 pb-2">
                      <p className="text-sm font-medium text-gray-500">Type</p>
                      <p className="text-base font-medium">
                        {isVideo(selectedImage.url) ? 'Video' : 'Image'}
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-200 pb-2">
                      <p className="text-sm font-medium text-gray-500">Dimensions</p>
                      <p className="text-base font-medium">
                        {selectedImage.width && selectedImage.height 
                          ? `${selectedImage.width} × ${selectedImage.height} px` 
                          : "Dimensions not available"}
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-200 pb-2">
                      <p className="text-sm font-medium text-gray-500">File Size</p>
                      <p className="text-base font-medium">
                        {selectedImage.size ? formatFileSize(selectedImage.size) : "Size not available"}
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-200 pb-2">
                      <p className="text-sm font-medium text-gray-500">Format</p>
                      <p className="text-base font-medium">
                        {selectedImage.format ? selectedImage.format.toUpperCase() : "Unknown format"}
                      </p>
                    </div>

                    {!isVideo(selectedImage.url) && (
                      <div className="border-b border-gray-200 pb-2">
                        <p className="text-sm font-medium text-gray-500">Alt Text</p>
                        <p className="text-base font-medium">
                          {selectedImage.altTag || selectedImage["alt-tag"] || "No alt text"}
                        </p>
                      </div>
                    )}
                    
                    {selectedImage.folder && (
                      <div className="border-b border-gray-200 pb-2">
                        <p className="text-sm font-medium text-gray-500">Folder</p>
                        <p className="text-base font-medium">{selectedImage.folder}</p>
                      </div>
                    )}
                    
                    <div className="pt-2">
                      <p className="text-sm font-medium text-gray-500 mb-2">Media URL</p>
                      <div className="flex items-center space-x-2 mb-2">
                        <button 
                          onClick={() => copyToClipboard(selectedImage.url)}
                          className="flex items-center text-blue-600 hover:text-blue-800 px-3 py-1 bg-blue-50 rounded-md"
                        >
                          {copySuccess ? <CheckCircle size={16} className="mr-1.5" /> : <Copy size={16} className="mr-1.5" />}
                          {copySuccess ? "Copied!" : "Copy URL"}
                        </button>
                        <a 
                          href={selectedImage.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-800 px-3 py-1 bg-blue-50 rounded-md"
                        >
                          <ExternalLink size={16} className="mr-1.5" />
                          Open
                        </a>
                      </div>
                      <div className="bg-gray-50 p-2 rounded border border-gray-200 overflow-auto max-h-[80px]">
                        <p className="text-sm break-all font-mono">{selectedImage.url}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 flex justify-end space-x-3">
              <button
                onClick={() => handleEditClick(selectedImage)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm flex items-center"
              >
                <Edit size={16} className="mr-1.5" /> Edit Details
              </button>
              <button
                onClick={handleCloseImageModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center"
              >
                <X size={16} className="mr-1.5" /> Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
