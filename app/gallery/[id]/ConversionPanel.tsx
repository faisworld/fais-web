"use client"

import { useState, useRef } from "react"
import { FiDownload, FiServer, FiMonitor, FiSliders } from "react-icons/fi"

interface ConversionPanelProps {
  imageUrl: string
  imageAlt: string
}

export default function ConversionPanel({ imageUrl, imageAlt }: ConversionPanelProps) {
  const [convertedImageUrl, setConvertedImageUrl] = useState<string | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [quality, setQuality] = useState(85)
  const [error, setError] = useState<string | null>(null)
  const [method, setMethod] = useState<"server" | "browser">("server")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Server-side conversion
  const convertOnServer = async () => {
    try {
      setIsConverting(true)
      setError(null)

      const response = await fetch(`/api/convert-image?url=${encodeURIComponent(imageUrl)}&quality=${quality}`)

      if (!response.ok) {
        throw new Error(`Server conversion failed: ${response.status} ${response.statusText}`)
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setConvertedImageUrl(url)
    } catch (err) {
      console.error("Error converting image on server:", err)
      setError(`Failed to convert image on server. ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsConverting(false)
    }
  }

  // Browser-side conversion
  const convertInBrowser = async () => {
    try {
      setIsConverting(true)
      setError(null)

      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        const canvas = canvasRef.current
        if (!canvas) {
          setError("Canvas not available")
          setIsConverting(false)
          return
        }

        // Set canvas dimensions to match image
        canvas.width = img.width
        canvas.height = img.height

        // Draw image to canvas
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          setError("Canvas context not available")
          setIsConverting(false)
          return
        }

        // Draw image on canvas
        ctx.drawImage(img, 0, 0)

        // Convert to JPEG
        const jpegUrl = canvas.toDataURL("image/jpeg", quality / 100)
        setConvertedImageUrl(jpegUrl)
        setIsConverting(false)
      }

      img.onerror = () => {
        setError("Failed to load image for browser conversion. Try server conversion instead.")
        setIsConverting(false)
      }

      // Start loading the image
      img.src = imageUrl
    } catch (err) {
      console.error("Error converting image in browser:", err)
      setError(`Failed to convert image in browser. ${err instanceof Error ? err.message : String(err)}`)
      setIsConverting(false)
    }
  }

  // Handle conversion based on selected method
  const handleConvert = () => {
    if (method === "server") {
      convertOnServer()
    } else {
      convertInBrowser()
    }
  }

  // Download the converted image
  const downloadImage = () => {
    if (!convertedImageUrl) return

    const link = document.createElement("a")
    link.href = convertedImageUrl
    link.download = `converted-${new Date().getTime()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-medium mb-4">Convert to JPEG</h3>

      {/* Conversion options */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="quality-slider" className="text-sm font-medium text-gray-700 flex items-center">
            <FiSliders className="mr-2" /> Quality: {quality}%
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMethod("server")}
              className={`px-2 py-1 text-xs rounded-md flex items-center ${
                method === "server" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
              }`}
              title="Better quality, uses server"
            >
              <FiServer className="mr-1" /> Server
            </button>
            <button
              type="button"
              onClick={() => setMethod("browser")}
              className={`px-2 py-1 text-xs rounded-md flex items-center ${
                method === "browser" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
              }`}
              title="Faster, converts in your browser"
            >
              <FiMonitor className="mr-1" /> Browser
            </button>
          </div>
        </div>
        <input
          id="quality-slider"
          type="range"
          min="10"
          max="100"
          value={quality}
          onChange={(e) => setQuality(Number.parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Action buttons */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleConvert}
          disabled={isConverting}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
        >
          {isConverting ? (
            <>
              <span className="mr-2">Converting...</span>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </>
          ) : (
            <>Convert to JPEG</>
          )}
        </button>

        {convertedImageUrl && (
          <button
            onClick={downloadImage}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
          >
            <FiDownload className="mr-2" /> Download JPEG
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm mb-4">
          {error}
          {method === "server" ? (
            <button
              onClick={() => {
                setMethod("browser")
                setError(null)
              }}
              className="text-red-700 underline ml-2"
            >
              Try browser conversion instead
            </button>
          ) : (
            <button
              onClick={() => {
                setMethod("server")
                setError(null)
              }}
              className="text-red-700 underline ml-2"
            >
              Try server conversion instead
            </button>
          )}
        </div>
      )}

      {/* Preview */}
      {convertedImageUrl && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <img
              src={convertedImageUrl || "/placeholder.svg"}
              alt={`Converted ${imageAlt}`}
              className="w-full h-auto"
            />
          </div>
        </div>
      )}

      {/* Hidden canvas for browser conversion */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  )
}
