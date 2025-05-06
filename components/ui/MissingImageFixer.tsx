"use client"

import { useState, useEffect } from "react"
import { FiImage, FiEdit, FiX, FiCopy, FiCheck } from "react-icons/fi"
import ImagePicker from "./ImagePicker"
import { getBlobImage } from "@/utils/image-utils"

type MissingImage = {
  key: string
  description: string
  currentUrl?: string
}

export default function MissingImageFixer() {
  const [isOpen, setIsOpen] = useState(false)
  const [showImagePicker, setShowImagePicker] = useState(false)
  const [selectedImageKey, setSelectedImageKey] = useState<string | null>(null)
  const [updatedImages, setUpdatedImages] = useState<Record<string, string>>({})
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // List of images that might be missing
  const potentialMissingImages: MissingImage[] = [
    {
      key: "pioneering-digital-transformation",
      description: "Main hero carousel image for digital transformation",
      currentUrl: getBlobImage("pioneering-digital-transformation"),
    },
    {
      key: "innovating-future",
      description: "Hero carousel image for innovation",
      currentUrl: getBlobImage("innovating-future"),
    },
    {
      key: "shaping-sota-technologies",
      description: "Hero carousel image for technologies",
      currentUrl: getBlobImage("shaping-sota-technologies"),
    },
    {
      key: "ai-solutions",
      description: "AI Solutions section image",
      currentUrl: getBlobImage("ai-solutions"),
    },
    {
      key: "blockchain-solutions",
      description: "Blockchain Solutions section image",
      currentUrl: getBlobImage("blockchain-solutions"),
    },
    {
      key: "mev-staking",
      description: "MEV Staking project image",
      currentUrl: getBlobImage("mev-staking"),
    },
    {
      key: "web3-gaming",
      description: "Web3 Gaming project image",
      currentUrl: getBlobImage("web3-gaming"),
    },
    {
      key: "nft-marketplace",
      description: "NFT Marketplace project image",
      currentUrl: getBlobImage("nft-marketplace"),
    },
    {
      key: "ai-services",
      description: "AI Services project image",
      currentUrl: getBlobImage("ai-services"),
    },
    {
      key: "payment-systems",
      description: "Payment Systems project image",
      currentUrl: getBlobImage("payment-systems"),
    },
    {
      key: "ceo-portrait",
      description: "CEO portrait image for Quote Section",
      currentUrl: getBlobImage("ceo-portrait"),
    },
  ]

  // Force refresh of image URLs when component opens
  useEffect(() => {
    if (isOpen) {
      setRefreshTrigger((prev) => prev + 1)
    }
  }, [isOpen])

  // Check if an image is a placeholder
  const isPlaceholder = (url: string) => {
    return (
      !url ||
      url.includes("/placeholder.svg") ||
      url.includes("?query=") ||
      !url.includes("vercel-storage.com") ||
      url === ""
    )
  }

  // Handle image selection from the picker
  const handleImageSelect = (imageUrl: string) => {
    if (selectedImageKey) {
      setUpdatedImages((prev) => ({
        ...prev,
        [selectedImageKey]: imageUrl,
      }))
      setShowImagePicker(false)
      setSelectedImageKey(null)
    }
  }

  // Copy URL to clipboard
  const copyToClipboard = (url: string, key: string) => {
    navigator.clipboard.writeText(url)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  // Generate code to update the blobImages object
  const generateUpdateCode = () => {
    const codeLines = Object.entries(updatedImages).map(([key, url]) => {
      return `  "${key}": "${url}",`
    })

    return `// Update these lines in utils/image-utils.ts\n// in the blobImages object:\n\n${codeLines.join("\n")}`
  }

  // Copy the update code to clipboard
  const copyUpdateCode = () => {
    const code = generateUpdateCode()
    navigator.clipboard.writeText(code)
    alert("Code copied to clipboard!")
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700"
        title="Fix Missing Images"
      >
        <FiImage size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Fix Missing Images</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700" aria-label="Close">
                <FiX size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <p className="mb-4 text-gray-600">
                Click on any image to select a replacement from your gallery. You can replace any image, not just
                missing ones.
              </p>

              <div className="space-y-4">
                {potentialMissingImages.map((image) => {
                  const currentUrl = updatedImages[image.key] || image.currentUrl || "/placeholder.svg"
                  const isMissing = isPlaceholder(currentUrl)

                  return (
                    <div
                      key={image.key}
                      className={`border rounded-lg overflow-hidden ${
                        isMissing ? "border-orange-300 bg-orange-50" : "border-green-300 bg-green-50"
                      }`}
                    >
                      <div className="flex items-center p-4">
                        <div
                          className="w-16 h-16 bg-gray-100 rounded overflow-hidden mr-4 flex-shrink-0 cursor-pointer"
                          onClick={() => {
                            setSelectedImageKey(image.key)
                            setShowImagePicker(true)
                          }}
                        >
                          <img
                            src={`${currentUrl}?t=${refreshTrigger}`}
                            alt={image.description}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg"
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{image.key}</h3>
                          <p className="text-sm text-gray-600">{image.description}</p>
                          <div className="mt-1 text-xs text-gray-500 truncate flex items-center">
                            <span className="truncate mr-2">{currentUrl}</span>
                            <button
                              onClick={() => copyToClipboard(currentUrl, image.key)}
                              className="text-blue-500 hover:text-blue-700 flex-shrink-0"
                              title="Copy URL"
                            >
                              {copiedKey === image.key ? <FiCheck size={16} /> : <FiCopy size={16} />}
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedImageKey(image.key)
                            setShowImagePicker(true)
                          }}
                          className="ml-2 p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Select image"
                          aria-label={`Select image for ${image.description}`}
                        >
                          <FiEdit size={20} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="p-4 border-t flex justify-between">
              <div className="text-sm text-gray-600">{Object.keys(updatedImages).length} image(s) updated</div>
              <div>
                <button
                  onClick={copyUpdateCode}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                  disabled={Object.keys(updatedImages).length === 0}
                >
                  Copy Update Code
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="ml-2 px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showImagePicker && (
        <ImagePicker
          isOpen={showImagePicker}
          onClose={() => setShowImagePicker(false)}
          onSelect={handleImageSelect}
          title={`Select image for: ${selectedImageKey}`}
        />
      )}
    </>
  )
}
