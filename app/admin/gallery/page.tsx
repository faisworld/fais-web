"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Edit, Trash2, FolderPlus, X, Copy, CheckCircle, ExternalLink, Info, Link as LinkIcon } from "lucide-react";

export default function AdminGalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
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
  const router = useRouter();

  // Fetch images from admin API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/gallery/list");
        
        if (!response.ok) {
          throw new Error(`Error fetching images: ${response.statusText}`);
        }
        
        const data = await response.json();
        setImages(data.images || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        console.error("Failed to fetch images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleEditClick = (image: any) => {
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
      const response = await fetch("/api/admin/gallery/images", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedImage.id,
          title: editData.title,
          alt: editData.alt,
          folder: editData.folder,
          description: editData.description,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error updating image: ${response.statusText}`);
      }
      
      const { image } = await response.json();
      
      // Update the image in the local state
      setImages(images.map(img => 
        img.id === selectedImage.id ? { ...img, ...image } : img
      ));
      
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to update image:", err);
      alert("Failed to update image. Please try again.");
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
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
      console.error("Failed to delete image:", err);
      alert("Failed to delete image. Please try again.");
    } finally {
      setIsDeletingImage(false);
    }
  };

  const handleUploadClick = () => {
    router.push("/admin/gallery/upload");
  };

  const handleImageClick = (image: any) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const copyImageUrl = (e: React.MouseEvent, imageUrl: string, imageId: number) => {
    e.stopPropagation(); // Prevent triggering the image click handler
    navigator.clipboard.writeText(imageUrl);
    setCopyingImageId(imageId);
    setTimeout(() => setCopyingImageId(null), 2000);
  };

  const openImageUrl = (e: React.MouseEvent, imageUrl: string) => {
    e.stopPropagation(); // Prevent triggering the image click handler
    window.open(imageUrl, '_blank');
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Gallery Management</h1>
        <button 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 rounded-md flex items-center shadow-md hover:shadow-lg transition-all"
          onClick={handleUploadClick}
        >
          <FolderPlus className="mr-1.5" size={16} /> 
          <span>Upload New Image</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <p className="text-sm">Please check your database connection or try again later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image) => (
            <div key={image.id} className="border rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-all">
              <div 
                className="relative h-48 w-full cursor-pointer"
                onClick={() => handleImageClick(image)}
              >
                <Image
                  src={image.url}
                  alt={image.altTag || image["alt-tag"] || image.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md">
                  <Info size={14} className="inline mr-1 align-text-bottom" />
                  <span>Details</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 truncate">{image.title}</h3>
                <p className="text-sm text-gray-500 truncate">
                  Alt: {image.altTag || image["alt-tag"] || "None"}
                </p>
                {image.folder && (
                  <p className="text-sm text-gray-500">Folder: {image.folder}</p>
                )}
                
                {/* Image URL display and actions */}
                <div className="mt-3 mb-3 bg-gray-50 p-2 rounded-md border border-gray-200 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-700 flex items-center">
                      <LinkIcon size={12} className="mr-1" /> URL
                    </span>
                    <div className="flex space-x-1">
                      <button 
                        onClick={(e) => copyImageUrl(e, image.url, image.id)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="Copy URL"
                      >
                        {copyingImageId === image.id ? <CheckCircle size={12} /> : <Copy size={12} />}
                      </button>
                      <button 
                        onClick={(e) => openImageUrl(e, image.url)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="Open in new tab"
                      >
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="truncate text-gray-600 text-[10px]" title={image.url}>
                    {image.url}
                  </div>
                </div>
                
                <div className="flex mt-2 space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(image);
                    }}
                    className="flex-1 flex items-center justify-center px-2 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    <Edit size={14} className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(image.id);
                    }}
                    className="flex-1 flex items-center justify-center px-2 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                    disabled={isDeletingImage}
                  >
                    <Trash2 size={14} className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
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
                <input
                  type="text"
                  value={editData.folder}
                  onChange={(e) => setEditData({...editData, folder: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
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

      {/* Image Details Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-md w-[800px] max-w-[95vw] max-h-[85vh] overflow-hidden shadow-2xl relative flex flex-col">
            <div className="flex justify-between items-center bg-blue-600 text-white px-6 py-3">
              <h3 className="text-xl font-bold">Image Details</h3>
              <button 
                onClick={handleCloseImageModal}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row p-0 overflow-y-auto">
              <div className="w-full md:w-1/2 relative h-[400px] bg-gray-100 p-4">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.altTag || selectedImage["alt-tag"] || selectedImage.title}
                  fill
                  className="object-contain"
                />
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

                    <div className="border-b border-gray-200 pb-2">
                      <p className="text-sm font-medium text-gray-500">Alt Text</p>
                      <p className="text-base font-medium">
                        {selectedImage.altTag || selectedImage["alt-tag"] || "No alt text"}
                      </p>
                    </div>
                    
                    {selectedImage.folder && (
                      <div className="border-b border-gray-200 pb-2">
                        <p className="text-sm font-medium text-gray-500">Folder</p>
                        <p className="text-base font-medium">{selectedImage.folder}</p>
                      </div>
                    )}
                    
                    <div className="pt-2">
                      <p className="text-sm font-medium text-gray-500 mb-2">Image URL</p>
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
