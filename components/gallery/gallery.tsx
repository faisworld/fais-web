"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { FiX } from "react-icons/fi"
import { handleImageError } from "@/utils/image-utils"

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
            </div>
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{image.title}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
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
            <div className="relative h-[80vh] w-auto">
              <Image
                src={getValidImageUrl(currentImage.url) || "/placeholder.svg"}
                alt={getAltText(currentImage)}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>
            <div className="mt-2 p-2 bg-white rounded-md">
              <p className="text-gray-800">{currentImage.title}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
