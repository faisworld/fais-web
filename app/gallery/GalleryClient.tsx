"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { FiTrash2, FiEdit2, FiPlus, FiX, FiFolder, FiImage, FiUpload } from "react-icons/fi"
import { useRouter } from "next/navigation"
import { handleImageError, getPlaceholderImage } from "@/utils/image-utils"
import BatchUploadModal from "@/components/gallery/BatchUploadModal"

type Folder = { name: string; id: number }
type ImageItem = {
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

export default function GalleryClient({ photos = [] }: { photos?: ImageItem[] }) {
  const [images, setImages] = useState<ImageItem[]>(photos)
  const [folders, setFolders] = useState<Folder[]>([])
  const [activeFolder, setActiveFolder] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showBatchUpload, setShowBatchUpload] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Fetch images and folders from API
  async function fetchImagesAndFolders() {
    try {
      setLoading(true)

      // Fetch images
      const imgRes = await fetch("/api/gallery/list")
      if (!imgRes.ok) throw new Error("Failed to fetch images")
      const imgData = await imgRes.json()
      console.log("Received images:", imgData.images)
      setImages(imgData.images || [])

      // Fetch folders
      const folderRes = await fetch("/api/gallery/folders")
      if (!folderRes.ok) throw new Error("Failed to fetch folders")
      const folderData = await folderRes.json()
      setFolders(folderData.folders || [])

      // Extract unique folders from images if no folders were returned
      if (!folderData.folders || folderData.folders.length === 0) {
        const folderSet = new Set<string>()
        ;(imgData.images || []).forEach((img: any) => {
          if (img.folder) folderSet.add(img.folder)
        })
        setFolders(Array.from(folderSet).map((name, id) => ({ name, id })))
      }
    } catch (err: any) {
      setMessage(err.message || "Failed to load gallery data.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImagesAndFolders()
  }, [])

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  async function handleDeleteImage(id: number) {
    if (!window.confirm("Delete this image?")) return

    try {
      setMessage("Deleting...")
      const res = await fetch("/api/gallery/images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete image")
      }

      setMessage(data.message || "Image deleted successfully")
      await fetchImagesAndFolders()
    } catch (err: any) {
      setMessage(err.message || "Error deleting image")
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement> | React.FormEvent) {
    e.preventDefault()

    // If this is a form submission and not a file input change event
    if (!("target" in e && "files" in e.target)) {
      return
    }

    const file = e.target.files?.[0]
    if (!file) return setMessage("No file selected.")

    try {
      setIsUploading(true)
      setUploadProgress(0)
      setMessage("Uploading to Blob storage...")

      const formData = new FormData()
      formData.append("file", file)

      // Add folder if active
      if (activeFolder) {
        formData.append("folder", activeFolder)
      }

      // Try to get image dimensions client-side
      let width, height
      if (file.type.startsWith("image/")) {
        try {
          const dimensions = await getImageDimensions(file)
          if (dimensions) {
            width = dimensions.width
            height = dimensions.height
            formData.append("width", width.toString())
            formData.append("height", height.toString())
          }
        } catch (err) {
          console.warn("Could not determine image dimensions client-side:", err)
        }
      }

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 10
          return newProgress > 90 ? 90 : newProgress
        })
      }, 300)

      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Upload failed")
      }

      setMessage(`Upload successful! Image stored in Blob storage.`)
      await fetchImagesAndFolders()
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (err: any) {
      setMessage(err.message || "Upload failed.")
    } finally {
      setIsUploading(false)
      // Reset progress after a delay
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  // Helper function to get image dimensions client-side
  const getImageDimensions = (file: File): Promise<{ width: number; height: number } | null> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
        URL.revokeObjectURL(img.src)
      }
      img.onerror = () => {
        reject(new Error("Failed to load image"))
        URL.revokeObjectURL(img.src)
      }
      img.src = URL.createObjectURL(file)
    })
  }

  // Format file size
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size"
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown date"
    return new Date(dateString).toLocaleDateString()
  }

  // Get blob filename from URL
  const getBlobFilename = (url: string) => {
    try {
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split("/")
      return pathParts[pathParts.length - 1]
    } catch (e) {
      return url
    }
  }

  const filteredImages = activeFolder ? images.filter((img) => img.folder === activeFolder) : images

  return (
    <div className="relative">
      {/* Folder Filter */}
      <div className="mb-6 flex flex-wrap justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFolder("")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFolder === "" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
          >
            All
          </button>
          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => setActiveFolder(folder.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFolder === folder.name ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }`}
            >
              {folder.name}
            </button>
          ))}
        </div>

        {/* Batch upload button */}
        <button
          onClick={() => setShowBatchUpload(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
        >
          <FiUpload size={16} /> Batch Upload
        </button>
      </div>

      {/* Upload Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <input
          id="gallery-upload"
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
          disabled={isUploading}
        />
        <label
          htmlFor="gallery-upload"
          className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg cursor-pointer transition-colors ${
            isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
          title="Add Image to Blob Storage"
        >
          {isUploading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FiPlus size={28} className="text-white" />
          )}
        </label>
      </div>

      {/* Upload Progress Bar */}
      {uploadProgress > 0 && (
        <div className="fixed bottom-24 right-8 w-64 bg-white rounded-lg shadow-lg p-3 z-50">
          <div className="text-sm font-medium mb-1">Uploading to Blob Storage...</div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <div className="text-xs text-right mt-1">{Math.round(uploadProgress)}%</div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {filteredImages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <p className="text-xl mb-4">No images found in Blob storage</p>
              <p className="text-sm">
                {activeFolder ? `No images in the "${activeFolder}" folder` : "Upload images using the + button"}
              </p>
            </div>
          )}

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((img: ImageItem) => (
              <div
                key={img.id}
                className="group relative bg-white rounded-xl shadow hover:shadow-xl transition-shadow overflow-hidden flex flex-col"
              >
                {/* Image with overlay icons */}
                <div className="relative aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full relative">
                    <img
                      src={img.url || getPlaceholderImage(img.title || "Image")}
                      alt={img.altTag || img["alt-tag"] || img.title}
                      title={img.title}
                      className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
                      style={{ aspectRatio: "4/3" }}
                      draggable={false}
                      onError={handleImageError}
                    />
                  </div>

                  {/* Overlay icons, visible on hover */}
                  <div className="absolute inset-0 flex items-start justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-gradient-to-t from-black/40 via-black/10 to-transparent">
                    <button
                      className="bg-white/80 hover:bg-red-100 text-red-600 rounded-full p-2 shadow border border-red-200 mr-2"
                      title="Delete from Blob Storage"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteImage(img.id)
                      }}
                    >
                      <FiTrash2 size={20} />
                    </button>
                    <button
                      className="bg-white/80 hover:bg-blue-100 text-blue-600 rounded-full p-2 shadow border border-blue-200"
                      title="Edit Blob Metadata"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/gallery/${img.id}`)
                      }}
                    >
                      <FiEdit2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Image info */}
                <div className="p-3 flex flex-col gap-1">
                  <div className="font-semibold text-gray-800 truncate">{img.title}</div>
                  <div className="text-xs text-gray-500 truncate">Alt: {img.altTag || img["alt-tag"] || img.title}</div>

                  {/* Blob Storage Info */}
                  <div className="text-xs text-gray-500 truncate flex items-center gap-1">
                    <FiImage className="shrink-0" size={12} />
                    <span className="font-mono truncate">{getBlobFilename(img.url)}</span>
                  </div>

                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>
                      {typeof img.width === "number" && typeof img.height === "number"
                        ? `${img.width} × ${img.height} px`
                        : "Dimensions: N/A"}
                    </span>
                    <span>{formatFileSize(img.size)}</span>
                  </div>

                  {img.uploaded_at && (
                    <div className="text-xs text-gray-500">Uploaded: {formatDate(img.uploaded_at)}</div>
                  )}

                  {img.folder && (
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <FiFolder className="shrink-0" size={12} />
                      <span className="bg-gray-100 px-2 py-0.5 rounded">{img.folder}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Toast Message */}
      {message && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-300 px-4 py-2 rounded-md shadow-md flex items-center gap-2">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="text-gray-500 hover:text-gray-700">
            <FiX size={18} />
          </button>
        </div>
      )}

      {/* Batch Upload Modal */}
      {showBatchUpload && (
        <BatchUploadModal
          folders={folders}
          onClose={() => setShowBatchUpload(false)}
          onSuccess={() => {
            setShowBatchUpload(false)
            fetchImagesAndFolders()
            setMessage("Batch upload completed successfully!")
          }}
        />
      )}
    </div>
  )
}
