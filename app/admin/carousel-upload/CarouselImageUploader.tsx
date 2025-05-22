'use client'

import type React from 'react'

import { useState, useRef } from 'react'
import { FiUpload, FiCheck, FiAlertCircle, FiCopy } from 'react-icons/fi'
import { uploadToBlob } from '@/utils/blob-upload'

type CarouselSlot = {
  key: string
  title: string
  description: string
}

type UploadStatus = {
  isUploading: boolean
  progress: number
  error: string | null
  success: boolean
  url: string | null
}

export default function CarouselImageUploader() {
  const carouselSlots: CarouselSlot[] = [
    {
      key: 'pioneering-digital-transformation',
      title: 'Pioneering Digital Transformation',
      description: 'Main hero image for digital transformation slide',
    },
    {
      key: 'innovating-future',
      title: 'Innovating the Future',
      description: 'Hero image for innovation slide',
    },
    {
      key: 'shaping-sota-technologies',
      title: 'Shaping SOTA Technologies',
      description: 'Hero image for technologies slide',
    },
  ]

  const [uploadStatus, setUploadStatus] = useState<Record<string, UploadStatus>>({})
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, slot: CarouselSlot) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Initialize upload status
    setUploadStatus((prev) => ({
      ...prev,
      [slot.key]: {
        isUploading: true,
        progress: 0,
        error: null,
        success: false,
        url: null,
      },
    }))

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadStatus((prev) => {
        const current = prev[slot.key]
        if (current && current.isUploading && current.progress < 90) {
          return {
            ...prev,
            [slot.key]: {
              ...current,
              progress: current.progress + Math.random() * 10,
            },
          }
        }
        return prev
      })
    }, 300)

    try {
      // Upload to Blob Store
      const result = await uploadToBlob(file, {
        folder: 'carousel',
        prefix: `${slot.key}-`,
      })

      clearInterval(progressInterval)

      if (result.success && result.url) {
        setUploadStatus((prev) => ({
          ...prev,
          [slot.key]: {
            isUploading: false,
            progress: 100,
            error: null,
            success: true,
            url: result.url,
          },
        }))

        // Clear the file input
        if (fileInputRefs.current[slot.key]) {
          fileInputRefs.current[slot.key]!.value = ''
        }
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error) {
      clearInterval(progressInterval)
      setUploadStatus((prev) => ({
        ...prev,
        [slot.key]: {
          isUploading: false,
          progress: 0,
          error: error instanceof Error ? error.message : 'Upload failed',
          success: false,
          url: null,
        },
      }))
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const copyBlobImagesCode = () => {
    const updatedBlobImages = carouselSlots
      .map((slot) => {
        const status = uploadStatus[slot.key]
        if (status?.success && status.url) {
          return `  '${slot.key}': '${status.url}',`
        }
        return null
      })
      .filter(Boolean)
      .join('\n')

    if (updatedBlobImages) {
      const codeSnippet = `// Update these lines in utils/media-utils.ts\n// in the blobImages object:\n\n${updatedBlobImages}`
      navigator.clipboard.writeText(codeSnippet)
      alert('Code copied to clipboard!')
    } else {
      alert('No images have been uploaded yet.')
    }
  }

  return (
    <div className='bg-white rounded-lg shadow-lg p-6'>
      <p className='mb-6 text-gray-600'>
        Upload images for the homepage carousel. Recommended size: 1920x1080px (16:9 ratio) or 1440x900px.
      </p>

      <div className='space-y-8'>
        {carouselSlots.map((slot) => {
          const status = uploadStatus[slot.key] || {
            isUploading: false,
            progress: 0,
            error: null,
            success: false,
            url: null,
          }

          return (
            <div key={slot.key} className='border rounded-lg p-4'>
              <h3 className='text-lg font-semibold mb-2'>{slot.title}</h3>
              <p className='text-sm text-gray-500 mb-4'>{slot.description}</p>

              <div className='flex flex-col md:flex-row gap-4'>
                <div className='flex-1'>
                  <input
                    type='file'
                    id={`file-${slot.key}`}
                    accept='image/*'
                    className='hidden'
                    onChange={(e) => handleFileSelect(e, slot)}
                    ref={(el) => { fileInputRefs.current[slot.key] = el }}
                    disabled={status.isUploading}
                  />

                  <label
                    htmlFor={`file-${slot.key}`}
                    className={`flex items-center justify-center gap-2 w-full py-3 px-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      status.isUploading
                        ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                        : status.success
                          ? 'bg-green-50 border-green-300 hover:bg-green-100'
                          : status.error
                            ? 'bg-red-50 border-red-300 hover:bg-red-100'
                            : 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                    }`}
                  >
                    {status.isUploading ? (
                      <div className='flex items-center gap-2'>
                        <div className='w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
                        <span>Uploading...</span>
                      </div>
                    ) : status.success ? (
                      <div className='flex items-center gap-2 text-green-600'>
                        <FiCheck size={20} />
                        <span>Upload successful</span>
                      </div>
                    ) : status.error ? (
                      <div className='flex items-center gap-2 text-red-600'>
                        <FiAlertCircle size={20} />
                        <span>Error: {status.error}</span>
                      </div>
                    ) : (
                      <div className='flex items-center gap-2 text-blue-600'>
                        <FiUpload size={20} />
                        <span>Select image for {slot.title}</span>
                      </div>
                    )}
                  </label>

                  {status.isUploading && (
                    <div className='mt-2'>
                      <div className='w-full bg-gray-200 rounded-full h-2.5'>
                        <div
                          className='bg-blue-600 h-2.5 rounded-full transition-all duration-300'
                          style={{ width: `${status.progress}%` }}
                        ></div>
                      </div>
                      <div className='text-xs text-right mt-1'>{Math.round(status.progress)}%</div>
                    </div>
                  )}
                </div>

                {status.success && status.url && (
                  <div className='flex-1'>
                    <div className='relative aspect-video bg-gray-100 rounded-lg overflow-hidden'>
                      <img
                        src={status.url || '/placeholder.svg'}
                        alt={slot.title}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div className='mt-2 flex items-center gap-2'>
                      <input
                        type='text'
                        value={status.url}
                        readOnly
                        className='flex-1 text-xs border rounded-md px-2 py-1 bg-gray-50'
                      />
                      <button
                        onClick={() => copyToClipboard(status.url!)}
                        className='p-1 text-gray-500 hover:text-gray-700'
                        title='Copy URL'
                      >
                        <FiCopy size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className='mt-8 border-t pt-6'>
        <h3 className='text-lg font-semibold mb-4'>Update Image Utils</h3>
        <p className='text-sm text-gray-600 mb-4'>
          After uploading all images, click the button below to copy the code you need to update in your{' '}
          <code>utils/media-utils.ts</code> file.
        </p>
        <button
          onClick={copyBlobImagesCode}
          className='px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center gap-2'
        >
          <FiCopy size={16} />
          Copy Code for blobImages
        </button>
      </div>
    </div>
  )
}
