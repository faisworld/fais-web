// filepath: c:\Users\solar\Projects\fais-web\components\admin/VideoQualityMonitor.tsx
'use client'

import { useState, useEffect } from 'react'
import { carouselVideoConfigs, analyzeVideoQuality } from '@/utils/video-config'

interface VideoAnalysis {
  key: string
  name: string
  naturalWidth?: number
  naturalHeight?: number
  qualityAnalysis?: ReturnType<typeof analyzeVideoQuality>
  loadError?: string
}

export default function VideoQualityMonitor() {
  const [analyses, setAnalyses] = useState<VideoAnalysis[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    analyzeAllVideos()
  }, [])

  const analyzeAllVideos = async () => {
    setLoading(true)
    const results: VideoAnalysis[] = []

    for (const config of carouselVideoConfigs) {
      try {
        const analysis = await analyzeVideo(config)
        results.push(analysis)
      } catch (error) {
        results.push({
          key: config.key,
          name: config.name,
          loadError: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    setAnalyses(results)
    setLoading(false)
  }

  const analyzeVideo = (config: typeof carouselVideoConfigs[0]): Promise<VideoAnalysis> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      video.crossOrigin = 'anonymous'
      video.muted = true

      video.addEventListener('loadedmetadata', () => {
        const containerWidth = window.innerWidth
        const containerHeight = window.innerHeight
        
        const qualityAnalysis = analyzeVideoQuality(
          video.videoWidth,
          video.videoHeight,
          containerWidth,
          containerHeight
        )

        resolve({
          key: config.key,
          name: config.name,
          naturalWidth: video.videoWidth,
          naturalHeight: video.videoHeight,
          qualityAnalysis
        })
      })

      video.addEventListener('error', () => {
        reject(new Error(`Failed to load video: ${config.url}`))
      })

      // Set a timeout to prevent hanging
      setTimeout(() => {
        reject(new Error('Video load timeout'))
      }, 10000)

      video.src = config.url
    })
  }

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Analyzing Video Quality...</h3>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading video metadata...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Carousel Video Quality Analysis</h3>
      
      <div className="space-y-4">
        {analyses.map((analysis) => (
          <div 
            key={analysis.key} 
            className={`p-4 rounded-lg border ${
              analysis.loadError 
                ? 'border-red-200 bg-red-50' 
                : analysis.qualityAnalysis?.qualityLevel === 'good'
                ? 'border-green-200 bg-green-50'
                : analysis.qualityAnalysis?.qualityLevel === 'medium'
                ? 'border-yellow-200 bg-yellow-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">{analysis.name}</h4>
              {analysis.qualityAnalysis && (
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  analysis.qualityAnalysis.qualityLevel === 'good' 
                    ? 'bg-green-100 text-green-800'
                    : analysis.qualityAnalysis.qualityLevel === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {analysis.qualityAnalysis.qualityLevel.toUpperCase()}
                </span>
              )}
            </div>

            {analysis.loadError ? (
              <p className="text-red-600 text-sm">{analysis.loadError}</p>
            ) : (
              <div className="text-sm space-y-1">
                <p><strong>Resolution:</strong> {analysis.naturalWidth} × {analysis.naturalHeight}</p>
                <p><strong>Aspect Ratio:</strong> {analysis.qualityAnalysis?.videoAspectRatio.toFixed(2)}:1</p>
                <p><strong>Container:</strong> {window.innerWidth} × {window.innerHeight} ({analysis.qualityAnalysis?.containerAspectRatio.toFixed(2)}:1)</p>
                <p><strong>Content Cropped:</strong> {analysis.qualityAnalysis?.cropPercentage}%</p>
                <p><strong>Recommendation:</strong> {analysis.qualityAnalysis?.recommendation}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Quick Fixes:</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Videos with poor quality should be re-encoded to 1920×1080 (16:9 aspect ratio)</li>
          <li>Consider using object-fit: contain for videos with significant aspect ratio differences</li>
          <li>Apply consistent color grading and brightness across all carousel videos</li>
          <li>Optimize file sizes while maintaining quality for faster loading</li>
        </ul>
      </div>
      
      <button 
        onClick={analyzeAllVideos}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Re-analyze Videos
      </button>
    </div>
  )
}
