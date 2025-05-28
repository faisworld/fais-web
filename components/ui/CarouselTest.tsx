'use client'

import { getBlobImage } from '@/utils/media-utils'
import CarouselVideoPlayer from '@/components/ui/CarouselVideoPlayer'

export default function CarouselTest() {
  const videos = [
    'pioneering-digital-transformation',
    'innovating-future', 
    'shaping-sota-technologies'
  ]

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Carousel Video Test</h1>
      
      {videos.map((videoKey, index) => {
        const mediaUrl = getBlobImage(videoKey)
        
        return (
          <div key={videoKey} className="mb-8 p-4 border rounded-lg bg-white">
            <h2 className="text-lg font-semibold mb-4">{videoKey}</h2>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Key: {videoKey}</p>
              <p className="text-sm text-gray-600 mb-2">URL: {mediaUrl}</p>
            </div>
            
            <div className="w-full max-w-md h-48 bg-black rounded-lg overflow-hidden relative">
              <CarouselVideoPlayer
                src={mediaUrl}
                isActive={true}
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
