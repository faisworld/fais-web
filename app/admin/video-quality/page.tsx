import VideoQualityMonitor from '@/components/admin/VideoQualityMonitor'

export default function VideoQualityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Quality Analysis</h1>
          <p className="text-gray-600">
            Monitor and analyze the quality of carousel videos to optimize user experience.
          </p>
        </div>
        
        <VideoQualityMonitor />
        
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Video Quality Guidelines</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Recommended Specifications</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Resolution: 1920×1080 (Full HD)</li>
                <li>• Aspect Ratio: 16:9</li>
                <li>• Format: MP4 (H.264)</li>
                <li>• Bitrate: 2-5 Mbps</li>
                <li>• Frame Rate: 30fps</li>
                <li>• Duration: 10-30 seconds</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Quality Optimization Tips</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Maintain consistent color grading</li>
                <li>• Apply slight contrast enhancement</li>
                <li>• Ensure proper brightness levels</li>
                <li>• Optimize file size for web delivery</li>
                <li>• Test on multiple screen sizes</li>
                <li>• Use lossless compression when possible</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
