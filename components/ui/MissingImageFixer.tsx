"use client"

import { useState, useEffect } from "react"
import { FiX } from "react-icons/fi"
import { blobImages } from "@/utils/image-utils"

export default function MissingImageFixer() {
  const [isOpen, setIsOpen] = useState(false)
  const [updatedImages, setUpdatedImages] = useState<string[]>([])

  // Check for missing images
  useEffect(() => {
    const missingImages = Object.keys(blobImages).filter((key) => {
      const url = blobImages[key]
      return url.includes("placeholder.svg") || url.includes("undefined")
    })

    if (missingImages.length > 0) {
      setIsOpen(true)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleUpdateCode = () => {
    // Logic to update code would go here
    console.log("Updated images:", updatedImages)
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Fix Missing Images</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>

        <div className="p-4">
          {Object.keys(blobImages).map((key) => {
            const url = blobImages[key]
            const isMissing = url.includes("placeholder.svg") || url.includes("undefined")

            if (!isMissing) return null

            return (
              <div key={key} className="mb-6 p-4 border rounded-md bg-gray-50">
                <h3 className="text-lg font-medium mb-2">{key}</h3>
                <p className="text-sm text-gray-600 mb-2">{key.replace(/-/g, " ")} image</p>
                <input
                  type="text"
                  className="w-full p-2 border rounded mb-2 text-sm font-mono"
                  value={url}
                  onChange={(e) => {
                    // Update the URL in the state
                    setUpdatedImages([...updatedImages, key])
                  }}
                />
              </div>
            )
          })}
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <button onClick={handleClose} className="px-4 py-2 border rounded">
            close
          </button>
          <button
            onClick={handleUpdateCode}
            className="px-4 py-2 bg-black text-white rounded"
            disabled={updatedImages.length === 0}
          >
            copy update code
          </button>
        </div>
      </div>
    </div>
  )
}
