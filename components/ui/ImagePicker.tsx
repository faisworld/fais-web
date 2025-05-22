"use client"

import { useState, useEffect } from "react"
import { FiX, FiSearch, FiRefreshCw, FiCheck } from "react-icons/fi"
import Image from "next/image"
import { getBlobImage } from '@/utils/image-utils';

interface ImagePickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (imageUrl: string) => void
  title?: string
}

// Match the ImageItem type used in GalleryClient
interface ImageItem {
  id: number
  url: string
  title: string
  altTag?: string
  "alt-tag"?: string
  folder?: string
  width?: number
  height?: number
  size?: number
  uploaded_at?: string
}

export default function ImagePicker({ isOpen, onClose, onSelect, title = "Select an image" }: ImagePickerProps) {
  const [images, setImages] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchImages()
    }
  }, [isOpen])

  const fetchImages = async () => {
    setLoading(true)
    try {
      // Try the direct-list endpoint first, fall back to the list endpoint if that fails
      console.log("Attempting to fetch images from direct-list endpoint...")
      let response = await fetch("/api/gallery/direct-list")
      
      if (!response.ok) {
        console.log("Falling back to original gallery list endpoint...")
        response = await fetch("/api/gallery/list")
        if (!response.ok) {
          console.error("Both image endpoints failed")
          throw new Error("Failed to fetch images from both endpoints")
        }
      }
      
      const data = await response.json()
      console.log(`Successfully loaded ${data.images?.length || 0} images`)
      
      // Ensure we have valid image data
      if (!data.images || !Array.isArray(data.images)) {
        throw new Error("Invalid image data format")
      }
      
      // Process the images to ensure they all have required fields
      const processedImages = data.images.map((img: Partial<ImageItem>, index: number) => ({
        id: img.id || index + 1,
        url: img.url || '/placeholder.svg',
        title: img.title || `Image ${index + 1}`,
        altTag: img.altTag || img["alt-tag"] || img.title || `Image ${index + 1}`,
        "alt-tag": img["alt-tag"] || img.altTag || img.title || `Image ${index + 1}`,
        folder: img.folder || 'Unknown',
        size: img.size || 0,
        width: img.width || 0,
        height: img.height || 0,
        uploaded_at: img.uploaded_at || new Date().toISOString()
      }))
      
      setImages(processedImages)
    } catch (error) {
      console.error("Failed to fetch images, using fallback:", error);
      setImages([
        {
          id: 1,
          url: getBlobImage("logo"),
          title: "Logo White Fais",
          altTag: "FAIS Logo White",
          "alt-tag": "FAIS Logo White",
          folder: "logos"
        },
        {
          id: 2,
          url: getBlobImage("logo-black"),
          title: "Logo Fais Black",
          altTag: "FAIS Logo Black",
          "alt-tag": "FAIS Logo Black",
          folder: "logos"
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl)
  }

  const confirmSelection = () => {
    if (selectedImage) {
      onSelect(selectedImage)
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  const filteredImages = images.filter((image) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      image.title?.toLowerCase().includes(searchLower) ||
      image.altTag?.toLowerCase().includes(searchLower) ||
      image["alt-tag"]?.toLowerCase().includes(searchLower) ||
      image.folder?.toLowerCase().includes(searchLower)
    )
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close">
            <FiX size={24} />
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search images..."
                className="w-full px-4 py-2 pl-10 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <button
              onClick={fetchImages}
              className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
              title="Refresh"
            >
              <FiRefreshCw size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No images found</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                    selectedImage === image.url ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-md"
                  }`}
                  onClick={() => handleSelect(image.url)}
                >
                  <div className="aspect-square bg-gray-100 relative">
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={image.altTag || image.title}
                      className="w-full h-full object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={(e) => {
                        // TypeScript requires type assertion for onError event
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                    />
                    {selectedImage === image.url && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1 z-10">
                        <FiCheck size={16} />
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <div className="text-sm font-medium truncate">{image.title}</div>
                    <div className="text-xs text-gray-500 truncate">{image.folder || "Root"}</div>
                    <div className="mt-1 flex justify-between items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          copyToClipboard(image.url)
                        }}
                        className="text-xs text-blue-500 hover:text-blue-700"
                      >
                        {copiedUrl === image.url ? "Copied!" : "Copy URL"}
                      </button>
                      <span className="text-xs text-gray-400">{image.size ? `${image.size} KB` : "Unknown size"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 mr-2">
            Cancel
          </button>
          <button
            onClick={confirmSelection}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            disabled={!selectedImage}
          >
            Select Image
          </button>
        </div>
      </div>
    </div>
  )
}
