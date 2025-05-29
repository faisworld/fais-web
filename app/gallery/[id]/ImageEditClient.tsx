"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  FiArrowLeft,
  FiSave,
  FiEdit2,
  FiX,
  FiCopy,
  FiDownload,
  FiImage,
  FiFolder,
  FiCalendar,
  FiInfo,
} from "react-icons/fi"
import { handleImageError, getPlaceholderImage } from "@/utils/media-utils"
import ConversionPanel from "./ConversionPanel"

type ImageData = {
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
  description?: string
  format?: string
}

// Define a type for the updateData object
type UpdateData = {
  id: number
  title: string
  alt?: string
  folder?: string
  description?: string
}

export default function ImageEditClient({ img, alt }: { img: ImageData; alt: string }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(img.title || "")
  const [altText, setAltText] = useState(img.altTag || img["alt-tag"] || alt || "")
  const [folder, setFolder] = useState(img.folder || "")
  const [description, setDescription] = useState(img.description || "")
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showResizeOptions, setShowResizeOptions] = useState(false)
  const [newWidth, setNewWidth] = useState(img.width?.toString() || "")
  const [newHeight, setNewHeight] = useState(img.height?.toString() || "")
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const originalAspectRatio = useRef(img.width && img.height ? img.width / img.height : null)
  const router = useRouter()

  console.log("ImageEditClient received image data:", img)

  // Check if the description field exists in the database
  const hasDescriptionField = "description" in img

  async function handleSave() {
    setMessage(null)
    setIsLoading(true)

    try {
      // Only include fields that exist in the database
      const updateData: UpdateData = {
        id: img.id,
        title,
      }

      // Only include these fields if they exist in the image object
      if ("altTag" in img || "alt-tag" in img) {
        updateData.alt = altText
      }

      if ("folder" in img) {
        updateData.folder = folder
      }

      if (hasDescriptionField) {
        updateData.description = description
      }

      console.log("Sending update with:", updateData)

      const res = await fetch("/api/gallery/images", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify(updateData),
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error(`Error updating image: ${res.status}. Response: ${errorText}`)
        throw new Error(`Failed to update image: ${res.status}`)
      }

      const data = await res.json()

      if (res.ok) {
        setMessage({ text: data.message || "Image metadata saved successfully!", type: "success" })
        setEditing(false)
        // If the server returns updated image data, use it to update our state
        if (data.image) {
          setTitle(data.image.title || "")
          setAltText(data.image.altTag || data.image["alt-tag"] || "")
          setFolder(data.image.folder || "")
          if (data.image.description !== undefined) {
            setDescription(data.image.description || "")
          }
        }
      } else {
        setMessage({ text: data.error || "Failed to save.", type: "error" })
      }
    } catch (err) {
      console.error("Error saving image metadata:", err)
      setMessage({
        text: err instanceof Error ? err.message : "An error occurred while saving.",
        type: "error",
      })
    } finally {
      setIsLoading(false)
      // Don't clear message automatically - let user dismiss it
    }
  }

  function handleCancel() {
    setEditing(false)
    setTitle(img.title || "")
    setAltText(img.altTag || img["alt-tag"] || alt || "")
    setFolder(img.folder || "")
    setDescription(img.description || "")
  }

  function handleWidthChange(value: string) {
    setNewWidth(value)
    if (maintainAspectRatio && originalAspectRatio.current && value) {
      const calculatedHeight = Math.round(Number.parseInt(value) / originalAspectRatio.current)
      setNewHeight(calculatedHeight.toString())
    }
  }

  function handleHeightChange(value: string) {
    setNewHeight(value)
    if (maintainAspectRatio && originalAspectRatio.current && value) {
      const calculatedWidth = Math.round(Number.parseInt(value) * originalAspectRatio.current)
      setNewWidth(calculatedWidth.toString())
    }
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
    try {
      return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString()
    } catch {
      return "Invalid date"
    }
  }

  // Get blob filename from URL
  const getBlobFilename = (url: string) => {
    try {
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split("/")
      return pathParts[pathParts.length - 1]
    } catch {
      return url
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header with back button */}
      <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
        <button onClick={() => router.push("/gallery")} className="btn flex items-center gap-2">
          <FiArrowLeft /> Back to Gallery
        </button>
        {message && (
          <div
            className={`px-4 py-2 rounded-md text-sm flex items-center gap-2 ${
              message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="text-current" aria-label="Dismiss message">
              <FiX size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col md:flex-row gap-8">
        {/* Image column */}
        <div className="flex-1 flex flex-col items-center">
          <div className="bg-gray-100 rounded-lg p-2 w-full max-w-md h-[400px] flex items-center justify-center relative">
            <Image
              src={img.url || getPlaceholderImage(img.title || "Image")}
              alt={altText}
              title={title}
              layout="fill"
              objectFit="contain"
              className="max-w-full max-h-full"
              onError={handleImageError}
              priority
            />
          </div>

          <div className="mt-4 flex gap-2 w-full max-w-md">
            <button
              className="btn flex-1 flex items-center justify-center gap-2"
              onClick={() => setShowResizeOptions(!showResizeOptions)}
            >
              <FiEdit2 size={16} /> Resize
            </button>
            <a
              href={img.url}
              download
              className="btn flex-1 flex items-center justify-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiDownload size={16} /> Download
            </a>
            <a
              href={`/api/convert-image?id=${img.id}`}
              download={`image-${img.id}.jpg`}
              className="btn flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiDownload size={16} /> As JPEG
            </a>
          </div>

          {/* Blob Storage Info */}
          <div className="mt-4 p-4 border border-gray-200 rounded-lg w-full max-w-md bg-gray-50">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <FiInfo size={16} /> Blob Storage Information
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <FiImage className="mt-1 shrink-0" size={14} />
                <div>
                  <div className="font-medium">Filename:</div>
                  <div className="font-mono text-xs break-all">{getBlobFilename(img.url)}</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <FiCalendar className="mt-1 shrink-0" size={14} />
                <div>
                  <div className="font-medium">Uploaded:</div>
                  <div>{formatDate(img.uploaded_at)}</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <FiFolder className="mt-1 shrink-0" size={14} />
                <div>
                  <div className="font-medium">Storage Path:</div>
                  <div className="font-mono text-xs break-all">{img.url.split("/").slice(3, -1).join("/")}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Conversion Panel */}
          <ConversionPanel imageUrl={img.url} imageAlt={altText} />

          {/* Resize options */}
          {showResizeOptions && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg w-full max-w-md">
              <h3 className="font-medium mb-3">Resize Image</h3>
              <div className="flex gap-4 mb-3">
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">Width (px)</label>
                  <input
                    type="number"
                    className="w-full border rounded-md px-3 py-2"
                    value={newWidth}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    min="1"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">Height (px)</label>
                  <input
                    type="number"
                    className="w-full border rounded-md px-3 py-2"
                    value={newHeight}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    min="1"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={maintainAspectRatio}
                    onChange={() => setMaintainAspectRatio(!maintainAspectRatio)}
                  />
                  <span className="text-sm">Maintain aspect ratio</span>
                </label>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  className="btn bg-gray-200 hover:bg-gray-300 text-gray-800"
                  onClick={() => setShowResizeOptions(false)}
                >
                  Cancel
                </button>
                <button className="btn">Apply Resize</button>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Note: Image resizing is currently a placeholder. This functionality would require server-side image
                processing.
              </p>
            </div>
          )}
        </div>

        {/* Info column */}
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <label htmlFor="image-title" className="font-medium text-gray-700 block mb-1">
              Title:
            </label>
            <input
              id="image-title"
              type="text"
              className={`w-full border rounded-md px-3 py-2 ${
                editing ? "border-gray-400 bg-white" : "bg-gray-50 border-gray-200"
              }`}
              value={title}
              disabled={!editing}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="image-alt" className="font-medium text-gray-700 block mb-1">
              ALT Text:
            </label>
            <input
              id="image-alt"
              type="text"
              className={`w-full border rounded-md px-3 py-2 ${
                editing ? "border-gray-400 bg-white" : "bg-gray-50 border-gray-200"
              }`}
              value={altText}
              disabled={!editing}
              onChange={(e) => setAltText(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="image-folder" className="font-medium text-gray-700 block mb-1">
              Folder:
            </label>
            <input
              id="image-folder"
              type="text"
              className={`w-full border rounded-md px-3 py-2 ${
                editing ? "border-gray-400 bg-white" : "bg-gray-50 border-gray-200"
              }`}
              value={folder}
              disabled={!editing}
              onChange={(e) => setFolder(e.target.value)}
            />
          </div>

          {/* Only show description field if it exists in the database */}
          {hasDescriptionField && (
            <div>
              <label htmlFor="image-description" className="font-medium text-gray-700 block mb-1">
                Description:
              </label>
              <textarea
                id="image-description"
                className={`w-full border rounded-md px-3 py-2 min-h-[100px] ${
                  editing ? "border-gray-400 bg-white" : "bg-gray-50 border-gray-200"
                }`}
                value={description}
                disabled={!editing}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="font-medium text-gray-700 block mb-1">Dimensions:</label>
            {img.width && img.height ? (
              <div className="flex items-center">
                <span className="text-gray-600 font-mono">
                  {img.width} × {img.height} pixels
                </span>
              </div>
            ) : (
              <span className="text-gray-400 italic">Width × Height info not available</span>
            )}
          </div>

          <div>
            <label className="font-medium text-gray-700 block mb-1">File size:</label>
            <span className="text-gray-600">{formatFileSize(img.size)}</span>
          </div>

          {img.format && (
            <div>
              <label className="font-medium text-gray-700 block mb-1">Format:</label>
              <span className="text-gray-600 uppercase">{img.format}</span>
            </div>
          )}

          <div>
            <label className="font-medium text-gray-700 block mb-1">Image URL:</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="flex-1 border border-gray-200 bg-gray-50 rounded-md px-3 py-2 font-mono text-sm"
                value={img.url}
                readOnly
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(img.url)
                  setMessage({ text: "URL copied to clipboard!", type: "success" })
                }}
                className="btn flex items-center gap-1"
              >
                <FiCopy size={16} /> Copy
              </button>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            {!editing ? (
              <button className="btn flex items-center gap-2" onClick={() => setEditing(true)}>
                <FiEdit2 /> Edit Metadata
              </button>
            ) : (
              <>
                <button className="btn flex items-center gap-2" onClick={handleSave} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave /> Save Changes
                    </>
                  )}
                </button>
                <button
                  className="btn bg-gray-200 hover:bg-gray-300 text-gray-700"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
