"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { FiX, FiCopy, FiEdit2, FiExternalLink, FiCheck } from "react-icons/fi"
import { handleImageError } from "@/utils/image-utils"
import { useRouter } from "next/navigation"

type ImageItem = {
  id: number
  url: string
  title: string
  "alt-tag"?: string
  altTag?: string
  width?: number
  height?: number
  folder?: string
}

export function Gallery() {
  const [images, setImages] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [copiedImageId, setCopiedImageId] = useState<number | null>(null)
  const router = useRouter()

  // Fetch images from API
  useEffect(() => {
    async function fetchImages() {
      try {
        setLoading(true)
        const response = await fetch("/api/gallery/list")

        if (!response.ok) {
          throw new Error(`Failed to fetch images: ${response.status}`)
        }

        const data = await response.json()

        // Validate and filter out images with invalid URLs
        const validImages = (data.images || []).filter((img: ImageItem) => {
          return (
            img &&
            img.url &&
            (img.url.startsWith("http://") || img.url.startsWith("https://") || img.url.startsWith("/"))
          )
        })

        setImages(validImages)
      } catch (err) {
        console.error("Error fetching images:", err)
        setError("Failed to load images. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [])

  const openModal = (id: number) => {
    setSelectedImage(id)
    document.body.style.overflow = "hidden"
  }

  const closeModal = () => {
    setSelectedImage(null)
    document.body.style.overflow = "auto"
  }

  const currentImage = images.find((img) => img.id === selectedImage)

  // Helper function to get alt text from different possible property names
  const getAltText = (image: ImageItem) => {
    return image.altTag || image["alt-tag"] || image.title || "Image"
  }

  // Helper function to ensure valid image URL
  const getValidImageUrl = (url: string | undefined) => {
    if (!url) return "/placeholder.svg"

    // Check if URL is valid
    try {
      // For relative URLs, ensure they start with /
      if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("/")) {
        return `/placeholder.svg`
      }
      return url
    } catch (e) {
      return "/placeholder.svg"
    }
  }

  // Copy image URL to clipboard
  const copyImageUrl = (url: string, id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(url)
    setCopiedImageId(id)
    setTimeout(() => setCopiedImageId(null), 2000)
  }

  // Navigate to edit page
  const navigateToEdit = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/gallery/${id}`)
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

  if (images.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-medium text-gray-600 mb-2">No images found</h3>
        <p className="text-gray-500">Upload images using the admin interface.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.id} className="flex flex-col">
            <div
              className="relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer group"
              onClick={() => openModal(image.id)}
            >
              <Image
                src={getValidImageUrl(image.url) || "/placeholder.svg"}
                alt={getAltText(image)}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                onError={(e) => handleImageError(e as any)}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

              {/* Quick action buttons */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                <button
                  onClick={(e) => copyImageUrl(image.url, image.id, e)}
                  className="bg-white/80 hover:bg-white p-1.5 rounded-full shadow-md text-gray-700"
                  title="Copy image URL"
                >
                  {copiedImageId === image.id ? <FiCheck size={16} /> : <FiCopy size={16} />}
                </button>
                <button
                  onClick={(e) => navigateToEdit(image.id, e)}
                  className="bg-white/80 hover:bg-white p-1.5 rounded-full shadow-md text-gray-700"
                  title="Edit image"
                >
                  <FiEdit2 size={16} />
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{image.title}</p>
          </div>
        ))}
      </div>

      {/* Enhanced Modal */}
      {selectedImage !== null && currentImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={closeModal}>
          <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeModal}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 focus:outline-none"
              aria-label="Close modal"
            >
              <FiX className="h-8 w-8" />
            </button>

            {/* Action buttons */}
            <div className="absolute top-2 right-2 flex gap-2 z-10">
              <button
                onClick={() => navigator.clipboard.writeText(currentImage.url)}
                className="bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-gray-700"
                title="Copy image URL"
              >
                <FiCopy size={18} />
              </button>
              <button
                onClick={() => router.push(`/gallery/${currentImage.id}`)}
                className="bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-gray-700"
                title="Edit image"
              >
                <FiEdit2 size={18} />
              </button>
              <a
                href={currentImage.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-gray-700"
                title="Open original image"
              >
                <FiExternalLink size={18} />
              </a>
            </div>

            <div className="relative h-[80vh] w-auto">
              <Image
                src={getValidImageUrl(currentImage.url) || "/placeholder.svg"}
                alt={getAltText(currentImage)}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>
            <div className="mt-2 p-3 bg-white rounded-md">
              <p className="text-gray-800 font-medium">{currentImage.title}</p>
              <p className="text-gray-500 text-sm mt-1">Alt text: {getAltText(currentImage)}</p>
              {currentImage.folder && <p className="text-gray-500 text-sm">Folder: {currentImage.folder}</p>}
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <span className="truncate mr-2">{currentImage.url}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(currentImage.url)
                    alert("URL copied to clipboard!")
                  }}
                  className="text-blue-500 hover:text-blue-700 flex-shrink-0"
                >
                  <FiCopy size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
