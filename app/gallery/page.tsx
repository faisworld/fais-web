"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Search, FolderOpen, Film, ImageIcon, ArrowLeft } from "lucide-react";
import { isGif, isVideo, handleImageError } from "@/utils/media-utils";

interface GalleryImage {
  id: number;
  url: string;
  title?: string;
  "alt-tag"?: string;
  altTag?: string;
  width?: number;
  height?: number;
  size?: number;
  folder?: string;
  uploaded_at?: string;
  description?: string;
  format?: string;
  seo_name?: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const url = currentFolder
          ? `/api/gallery/list?folder=${encodeURIComponent(currentFolder)}`
          : "/api/gallery/list";
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error fetching images: ${response.statusText}`);
        }

        const data = await response.json();
        setImages(data.images || []);
        setFolders(data.folders || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        console.error("Failed to fetch images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [currentFolder]);
  // Filter images based on search term
  const filteredImages = images.filter(
    (image) =>
      image.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.folder?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.seo_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle folder navigation
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

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Media Gallery</h1>

      {/* Search and filter */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search for images..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      {/* Folder navigation */}
      <div className="bg-gray-50 border border-gray-200 rounded-md p-2 mb-4 flex items-center overflow-x-auto">
        <button
          onClick={() => setCurrentFolder("")}
          className={`px-2 py-1 text-sm rounded-md mr-2 flex items-center ${
            !currentFolder ? "bg-gray-200 text-gray-800" : "hover:bg-gray-200"
          }`}
        >
          <FolderOpen size={14} className="mr-1" /> All Media
        </button>        {/* Display default folders first for quick access */}
        {!currentFolder && (
          <>
            <div className="text-gray-400 mx-2">|</div>
            <div className="flex flex-wrap gap-1">
              {folders.map((folder) => (
                <button
                  key={folder}
                  onClick={() => setCurrentFolder(folder)}
                  className="px-2 py-1 text-sm rounded-md hover:bg-gray-200 flex items-center"
                >
                  {folder === "images" && <ImageIcon size={14} className="mr-1 text-gray-600" />}
                  {folder === "carousel" && <Film size={14} className="mr-1 text-green-600" />}
                  {folder === "videos" && <Film size={14} className="mr-1 text-red-600" />}
                  {!["images", "carousel", "videos"].includes(folder) && <FolderOpen size={14} className="mr-1 text-gray-600" />}
                  {folder}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Breadcrumb navigation */}
        {currentFolder && (
          <div className="flex items-center">
            <div className="text-gray-400 mx-2">/</div>
            {currentFolder.split("/").map((folder, index, array) => (
              <div key={index} className="flex items-center">
                <button
                  onClick={() => navigateToFolder(array.slice(0, index + 1).join("/"))}
                  className={`px-2 py-1 text-sm rounded-md hover:bg-gray-200 flex items-center ${
                    index === array.length - 1 ? "bg-gray-200 text-gray-800 font-medium" : ""
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
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <Loader2 className="animate-spin text-gray-600" size={48} />
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <div className="text-gray-400 mb-4">
            <ImageIcon size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            {searchTerm
              ? "No images match your search"
              : currentFolder
              ? `No media in ${currentFolder.split("/").pop()}`
              : "No media found"}
          </h3>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-gray-600 hover:text-gray-800 mt-2"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((item) => (
            <Link 
              href={`/gallery/${item.id}`} 
              key={item.id}
              className="block border rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-all"
            >
              <div className="relative h-48 w-full">
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
                  <div className="w-full h-full relative">                    <Image
                      src={item.url}
                      alt={item.title || "Gallery image"}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      unoptimized={isGif(item.url)}
                      loading={isGif(item.url) ? "eager" : "lazy"}
                      priority={filteredImages.indexOf(item) < 4}
                      onError={handleImageError}
                    />
                  </div>
                )}
              </div>
                <div className="p-4">
                <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                <p className="text-sm text-gray-500 truncate">
                  {isVideo(item.url) ? 'Video' : item.seo_name ? `SEO: ${item.seo_name}` : `Alt: ${item.altTag || item["alt-tag"] || "None"}`}
                </p>
                {item.width && item.height && (
                  <p className="text-xs text-gray-400">
                    {item.width}×{item.height}
                  </p>
                )}
                {item.folder && (
                  <p className="text-sm text-gray-500 flex items-center">
                    <FolderOpen size={12} className="mr-1" />
                    <span className="truncate">{item.folder}</span>
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
