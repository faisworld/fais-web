"use client"

import { useState, useEffect } from "react"
import { FiX, FiCheck, FiSearch } from "react-icons/fi"
import { handleImageError } from "@/utils/image-utils"

type ImageItem = {
  id: number
  url: string
  title: string
  "alt-tag"?: string
  altTag?: string
  folder?: string
}

type ImagePickerProps = {
  isOpen: boolean
  onClose: () => void
  onSelect: (imageUrl: string) => void
  title?: string
}

export default function ImagePicker({ isOpen, onClose, onSelect, title = "Select an Image" }: ImagePickerProps) {
  const [images, setImages] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [folders, setFolders] = useState<string[]>([])
  const [activeFolder, setActiveFolder] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchImages()
    }
  }, [isOpen])

  async function fetchImages() {
    try {
      setLoading(true)
      const response = await fetch("/api/gallery/list")

      if (!response.ok) {
        throw new Error(`Failed to fetch images: ${response.status}`)
      }

      const data = await response.json()
      setImages(data.images || [])

      // Extract unique folders
      const uniqueFolders = Array.from(
        new Set(data.images.filter((img: ImageItem) => img.folder).map((img: ImageItem) => img.folder)),
      ) as string[]
      setFolders(uniqueFolders)
    } catch (err) {
      console.error("Error fetching images:", err)
      setError("Failed to load images. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const filteredImages = images
    .filter((img) => (activeFolder ? img.folder === activeFolder : true))
    .filter((img) => {
      if (!searchTerm) return true
      const searchLower = searchTerm.toLowerCase()
      return (
        img.title?.toLowerCase().includes(searchLower) ||
        img.folder?.toLowerCase().includes(searchLower) ||
        img["alt-tag"]?.toLowerCase().includes(searchLower) ||
        img.altTag?.toLowerCase().includes(searchLower)
      )
    })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>

        {/* Search and filters */}
        <div className="p-4 border-b">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search images..."
                className="w-full pl-10 pr-4 py-2 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFolder(null)}
                className={`px-3 py-1 rounded-full text-sm ${
                  activeFolder === null
                    ? "bg-blue-100 text-blue-800 font-medium"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {folders.map((folder) => (
                <button
                  key={folder}
                  onClick={() => setActiveFolder(folder)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    activeFolder === folder
                      ? "bg-blue-100 text-blue-800 font-medium"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {folder}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Image grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium text-gray-600 mb-2">No images found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                  onClick={() => onSelect(image.url)}
                >
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={image.altTag || image["alt-tag"] || image.title || "Image"}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white rounded-full p-2">
                      <FiCheck className="text-green-600" size={20} />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-white text-sm truncate">{image.title}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 mr-2">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
