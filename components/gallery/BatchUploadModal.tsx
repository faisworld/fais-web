"use client"

import type React from "react"

import { useState, useRef } from "react"
import { FiX, FiUpload, FiImage, FiCheck, FiAlertCircle } from "react-icons/fi"

type Folder = { name: string; id: number }

type BatchUploadModalProps = {
  folders: Folder[]
  onClose: () => void
  onSuccess: () => void
}

type UploadStatus = {
  file: File
  status: "pending" | "uploading" | "success" | "error"
  progress: number
  message?: string
  url?: string
  dimensions?: { width: number; height: number }
}

export default function BatchUploadModal({ folders, onClose, onSuccess }: BatchUploadModalProps) {
  const [selectedFolder, setSelectedFolder] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])

      // Initialize upload statuses for new files
      setUploadStatuses((prevUploadStatuses) => [
        ...prevUploadStatuses,
        ...newFiles.map((file) => ({
          file,
          status: "pending" as const,
          progress: 0,
        })),
      ])

      // Try to get dimensions for image files
      newFiles.forEach((file, idx) => {
        if (file.type.startsWith("image/")) {
          const img = new Image()
          const objectUrl = URL.createObjectURL(file)

          img.onload = () => {
            setUploadStatuses((prevUploadStatuses) =>
              prevUploadStatuses.map((status, i) =>
                i === uploadStatuses.length + idx
                  ? { ...status, dimensions: { width: img.width, height: img.height } }
                  : status,
              ),
            )
            URL.revokeObjectURL(objectUrl)
          }

          img.src = objectUrl
        }
      })
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setUploadStatuses((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadFile = async (file: File, index: number) => {
    try {
      // Update status to uploading
      setUploadStatuses((prev) =>
        prev.map((status, i) => (i === index ? { ...status, status: "uploading", progress: 0 } : status)),
      )

      const formData = new FormData()
      formData.append("file", file)

      if (selectedFolder) {
        formData.append("folder", selectedFolder)
      }

      // Default title to filename without extension
      const title = file.name.split(".").slice(0, -1).join(".")
      formData.append("title", title)

      // Add dimensions if available
      const status = uploadStatuses[index]
      if (status.dimensions) {
        formData.append("width", status.dimensions.width.toString())
        formData.append("height", status.dimensions.height.toString())
      }

      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Upload failed")
      }

      const data = await res.json()

      // Update status to success
      setUploadStatuses((prev) =>
        prev.map((status, i) =>
          i === index
            ? { ...status, status: "success", progress: 100, message: "Uploaded successfully", url: data.url }
            : status,
        ),
      )

      return true
    } catch (error) {
      console.error(`Error uploading ${file.name}:`, error)

      // Update status to error
      setUploadStatuses((prev) =>
        prev.map((status, i) =>
          i === index
            ? {
                ...status,
                status: "error",
                progress: 0,
                message: error instanceof Error ? error.message : "Upload failed",
              }
            : status,
        ),
      )

      return false
    }
  }

  const handleBatchUpload = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    let successCount = 0

    // Process files sequentially to avoid overwhelming the server
    for (let i = 0; i < files.length; i++) {
      // Simulate progress updates for better UX
      const progressInterval = setInterval(() => {
        setUploadStatuses((prev) =>
          prev.map((status, idx) => {
            if (idx === i && status.status === "uploading" && status.progress < 90) {
              return { ...status, progress: status.progress + Math.random() * 10 }
            }
            return status
          }),
        )
      }, 300)

      const success = await uploadFile(files[i], i)
      clearInterval(progressInterval)

      if (success) {
        successCount++
      }

      // Update overall progress
      setOverallProgress(Math.round(((i + 1) / files.length) * 100))
    }

    setIsUploading(false)

    if (successCount === files.length) {
      // All uploads successful
      setTimeout(() => {
        onSuccess()
      }, 1500)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Batch Upload Images</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" disabled={isUploading}>
            <FiX size={24} />
          </button>
        </div>

        {/* Folder selection */}
        <div className="mb-6">
          <label htmlFor="folder-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Folder (Optional)
          </label>
          <select
            id="folder-select"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            disabled={isUploading}
          >
            <option value="">No folder</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.name}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>

        {/* File selection */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Select Images</label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-gray-700 hover:text-gray-900"
              disabled={isUploading}
            >
              Add More Files
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            disabled={isUploading}
          />

          {files.length === 0 ? (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50"
              onClick={() => fileInputRef.current?.click()}
            >
              <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Click to select files or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-60 overflow-y-auto">
                {uploadStatuses.map((status, index) => (
                  <div key={index} className="flex items-center p-3 border-b border-gray-200 last:border-b-0">
                    <div className="flex-shrink-0 mr-3">
                      {status.status === "pending" && <FiImage className="text-gray-400" size={24} />}                      {status.status === "uploading" && (
                        <div className="w-6 h-6 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                      )}
                      {status.status === "success" && <FiCheck className="text-green-500" size={24} />}
                      {status.status === "error" && <FiAlertCircle className="text-red-500" size={24} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{status.file.name}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>{formatFileSize(status.file.size)}</span>
                        {status.dimensions && (
                          <span className="ml-2">
                            {status.dimensions.width} × {status.dimensions.height} px
                          </span>
                        )}
                      </div>
                      {status.status === "uploading" && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-gray-600 h-1.5 rounded-full"
                            style={{ width: `${status.progress}%` }}
                          ></div>
                        </div>
                      )}
                      {status.message && (
                        <p className={`text-xs mt-1 ${status.status === "error" ? "text-red-500" : "text-green-500"}`}>
                          {status.message}
                        </p>
                      )}
                    </div>
                    {!isUploading && status.status !== "uploading" && (
                      <button onClick={() => removeFile(index)} className="ml-2 text-gray-400 hover:text-gray-600">
                        <FiX size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Overall progress */}
        {isUploading && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-700 mb-1">
              <span>Overall Progress</span>
              <span>{overallProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-gray-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleBatchUpload}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400"
            disabled={isUploading || files.length === 0}
          >
            {isUploading ? `Uploading (${overallProgress}%)` : `Upload ${files.length} Files`}
          </button>
        </div>
      </div>
    </div>
  )
}
