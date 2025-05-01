"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { FiFolder, FiFolderPlus, FiUpload, FiX, FiEdit2, FiTrash2 } from "react-icons/fi"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { handleImageError } from "@/utils/image-utils"

type ImageItem = {
  id: number
  url: string
  title: string
  "alt-tag"?: string
  altTag?: string
  width?: number
  height?: number
  size?: number
  folder?: string
  uploaded_at?: string
}

type Folder = {
  name: string
  id: number
}

export default function GalleryLayout() {
  const [images, setImages] = useState<ImageItem[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [activeFolder, setActiveFolder] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showNewFolderModal, setShowNewFolderModal] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadFolder, setUploadFolder] = useState<string>("")
  const [uploadTitle, setUploadTitle] = useState("")
  const [uploadAlt, setUploadAlt] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  const router = useRouter()

  // Fetch images and folders
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Fetch images
        const imagesRes = await fetch("/api/gallery/list")
        if (!imagesRes.ok) throw new Error(`Failed to fetch images: ${imagesRes.status}`)
        const imagesData = await imagesRes.json()

        // Fetch folders
        const foldersRes = await fetch("/api/gallery/folders")
        if (!foldersRes.ok) throw new Error(`Failed to fetch folders: ${foldersRes.status}`)
        const foldersData = await foldersRes.json()

        // Filter valid images
        const validImages = (imagesData.images || []).filter((img: ImageItem) => {
          return (
            img &&
            img.url &&
            (img.url.startsWith("http://") || img.url.startsWith("https://") || img.url.startsWith("/"))
          )
        })

        setImages(validImages)
        setFolders(foldersData.folders || [])
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load gallery data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter images by active folder
  const filteredImages = activeFolder ? images.filter((img) => img.folder === activeFolder) : images

  // Helper function to get alt text
  const getAltText = (image: ImageItem) => {
    return image.altTag || image["alt-tag"] || image.title || "Image"
  }

  // Helper function to ensure valid image URL
  const getValidImageUrl = (url: string | undefined) => {
    if (!url) return "/placeholder.svg"

    try {
      if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("/")) {
        return `/placeholder.svg`
      }
      return url
    } catch (e) {
      return "/placeholder.svg"
    }
  }

  // Format file size
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size"
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  // Handle image deletion
  const handleDeleteImage = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return

    try {
      const res = await fetch("/api/gallery/images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) throw new Error("Failed to delete image")

      // Remove image from state
      setImages(images.filter((img) => img.id !== id))
      setMessage({ text: "Image deleted successfully", type: "success" })

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      console.error("Error deleting image:", err)
      setMessage({ text: "Failed to delete image", type: "error" })
    }
  }

  // Handle folder creation
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      setMessage({ text: "Folder name cannot be empty", type: "error" })
      return
    }

    try {
      const res = await fetch("/api/gallery/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: newFolderName.trim() }),
      })

      if (!res.ok) throw new Error("Failed to create folder")

      const data = await res.json()

      // Add new folder to state
      setFolders([...folders, { name: newFolderName.trim(), id: data.id || folders.length + 1 }])
      setMessage({ text: "Folder created successfully", type: "success" })
      setShowNewFolderModal(false)
      setNewFolderName("")

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      console.error("Error creating folder:", err)
      setMessage({ text: "Failed to create folder", type: "error" })
    }
  }

  // Handle file upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!uploadFile) {
      setMessage({ text: "Please select a file to upload", type: "error" })
      return
    }

    try {
      setIsUploading(true)

      const formData = new FormData()
      formData.append("file", uploadFile)
      if (uploadFolder) formData.append("folder", uploadFolder)
      if (uploadTitle) formData.append("title", uploadTitle)
      if (uploadAlt) formData.append("alt", uploadAlt)

      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Failed to upload image")

      const data = await res.json()

      // Add new image to state
      if (data.url) {
        const newImage: ImageItem = {
          id: data.id || Date.now(),
          url: data.url,
          title: uploadTitle || uploadFile.name,
          "alt-tag": uploadAlt || uploadTitle || uploadFile.name,
          size: uploadFile.size,
          folder: uploadFolder || null,
          uploaded_at: new Date().toISOString(),
        }

        setImages([newImage, ...images])
      }

      setMessage({ text: "Image uploaded successfully", type: "success" })
      setShowUploadModal(false)
      resetUploadForm()

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      console.error("Error uploading image:", err)
      setMessage({ text: "Failed to upload image", type: "error" })
    } finally {
      setIsUploading(false)
    }
  }

  // Reset upload form
  const resetUploadForm = () => {
    setUploadFile(null)
    setUploadFolder("")
    setUploadTitle("")
    setUploadAlt("")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Folders</h3>
          <button
            onClick={() => setShowNewFolderModal(true)}
            className="text-gray-600 hover:text-gray-900"
            title="Create new folder"
          >
            <FiFolderPlus size={20} />
          </button>
        </div>

        <div className="space-y-1">
          <button
            onClick={() => setActiveFolder(null)}
            className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2 ${
              activeFolder === null ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
            }`}
          >
            <FiFolder /> All Images
          </button>

          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => setActiveFolder(folder.name)}
              className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2 ${
                activeFolder === folder.name ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
              }`}
            >
              <FiFolder /> {folder.name}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn w-full flex items-center justify-center gap-2"
          >
            <FiUpload /> Upload Image
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Gallery Header */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{activeFolder ? `Folder: ${activeFolder}` : "All Images"}</h2>
          <div className="text-sm text-gray-500">
            {filteredImages.length} {filteredImages.length === 1 ? "image" : "images"}
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium text-gray-600 mb-2">No images found</h3>
            <p className="text-gray-500">
              {activeFolder
                ? `This folder is empty. Upload images to the "${activeFolder}" folder.`
                : "Upload images using the button in the sidebar."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <div key={image.id} className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden group">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={getValidImageUrl(image.url) || "/placeholder.svg"}
                    alt={getAltText(image)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    onError={(e) => handleImageError(e as any)}
                  />

                  {/* Hover overlay with actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        router.push(`/gallery/${image.id}`)
                      }}
                      className="bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow"
                      title="Edit image"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteImage(image.id)
                      }}
                      className="bg-white/90 hover:bg-white text-red-600 rounded-full p-2 shadow"
                      title="Delete image"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Image info */}
                <div className="p-3 flex flex-col gap-1">
                  <div className="font-medium text-gray-800 truncate">{image.title}</div>
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>{formatFileSize(image.size)}</span>
                    <span>{image.width && image.height ? `${image.width}×${image.height}` : ""}</span>
                  </div>
                  {image.folder && (
                    <div className="text-xs text-gray-500 mt-1">
                      Folder: <span className="bg-gray-100 px-1.5 py-0.5 rounded">{image.folder}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Create New Folder</h3>
            <div className="mb-4">
              <label htmlFor="folder-name" className="block text-sm font-medium text-gray-700 mb-1">
                Folder Name
              </label>
              <input
                type="text"
                id="folder-name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="btn bg-gray-200 hover:bg-gray-300 text-gray-800"
                onClick={() => {
                  setShowNewFolderModal(false)
                  setNewFolderName("")
                }}
              >
                Cancel
              </button>
              <button className="btn" onClick={handleCreateFolder}>
                Create Folder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Upload Image</h3>
            <form onSubmit={handleUpload}>
              <div className="mb-4">
                <label htmlFor="image-file" className="block text-sm font-medium text-gray-700 mb-1">
                  Image File
                </label>
                <input
                  type="file"
                  id="image-file"
                  accept="image/*"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="image-title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="image-title"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Image title"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="image-alt" className="block text-sm font-medium text-gray-700 mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  id="image-alt"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  value={uploadAlt}
                  onChange={(e) => setUploadAlt(e.target.value)}
                  placeholder="Image alt text"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="image-folder" className="block text-sm font-medium text-gray-700 mb-1">
                  Folder
                </label>
                <select
                  id="image-folder"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  value={uploadFolder}
                  onChange={(e) => setUploadFolder(e.target.value)}
                >
                  <option value="">No folder</option>
                  {folders.map((folder) => (
                    <option key={folder.id} value={folder.name}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="btn bg-gray-200 hover:bg-gray-300 text-gray-800"
                  onClick={() => {
                    setShowUploadModal(false)
                    resetUploadForm()
                  }}
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn" disabled={isUploading || !uploadFile}>
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Message */}
      {message && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-lg flex items-center gap-2 ${
            message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-current">
            <FiX size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
