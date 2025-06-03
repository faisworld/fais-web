'use client'

export default function VideoDebugger() {
  const videos = [
    {
      name: 'pioneering-digital-transformation',
      url: 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/carousel/carousel-video-pioneering-digital-transformation.mp4'
    },
    {
      name: 'innovating-future', 
      url: 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/carousel/carousel-video-innovating-the-future.mp4'
    },
    {
      name: 'shaping-sota-technologies',
      url: 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/carousel/carousel-video-shaping-sota-technologies.mp4'
    }
  ]

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Video Debugger</h1>
      
      {videos.map((video) => (
        <div key={video.name} className="mb-8 p-4 border rounded-lg bg-white">
          <h2 className="text-lg font-semibold mb-4">{video.name}</h2>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">URL: {video.url}</p>
          </div>
          
          <div className="w-full max-w-md h-48 bg-black rounded-lg overflow-hidden">            <video
              src={video.url}
              className="w-full h-full object-cover"
              controls
              muted
              preload="metadata"              onLoadStart={() => {/* console.log(`${video.name}: Load started`) */}}
              onLoadedData={() => {/* console.log(`${video.name}: Data loaded`) */}}
              onError={() => {/* console.error(`${video.name}: Error`, e) */}}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
