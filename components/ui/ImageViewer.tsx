"use client"

import { useState, useEffect } from "react"
import { FiX, FiCopy, FiEdit, FiCheck, FiDownload } from "react-icons/fi"
import Image from "next/image"

interface ImageViewerProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  imageInfo?: {
    title?: string
    description?: string
    altTag?: string
    format?: string
    dimensions?: string
    size?: string
  }
  onEdit?: () => void
}

export default function ImageViewer({ isOpen, onClose, imageUrl, imageInfo = {}, onEdit }: ImageViewerProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  const copyToClipboard = () => {
    navigator.clipboard.writeText(imageUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadImage = () => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = imageInfo.title || "image"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-white rounded-lg shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold truncate">{imageInfo.title || "Image Viewer"}</h2>
          <div className="flex items-center space-x-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                title="Edit image"
              >
                <FiEdit size={20} />
              </button>
            )}
            <button
              onClick={copyToClipboard}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
              title="Copy image URL"
            >
              {copied ? <FiCheck size={20} /> : <FiCopy size={20} />}
            </button>
            <button
              onClick={downloadImage}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
              title="Download image"
            >
              <FiDownload size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-full"
              title="Close"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-100">
          <div className="relative w-full h-[calc(90vh-12rem)] flex items-center justify-center">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={imageInfo.altTag || "Image preview"}
              className="object-contain"
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
          </div>
        </div>
        </div>

        <div className="p-4 border-t bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="text-sm">{imageInfo.description || "No description available"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Format</h3>
                <p className="text-sm">{imageInfo.format || "Unknown"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Dimensions</h3>
                <p className="text-sm">{imageInfo.dimensions || "Unknown"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Alt Text</h3>
                <p className="text-sm">{imageInfo.altTag || "None"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Size</h3>
                <p className="text-sm">{imageInfo.size || "Unknown"}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-500 mr-2">Image URL:</span>
              <div className="flex-1 flex items-center">
                <input
                  type="text"
                  value={imageUrl}
                  readOnly
                  className="flex-1 text-sm p-2 border rounded-l-md bg-white"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-r-md border border-l-0"
                >
                  {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
