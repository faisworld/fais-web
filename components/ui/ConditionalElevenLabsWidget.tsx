"use client"

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function ConditionalElevenLabsWidget() {
  const pathname = usePathname()
  
  // List of pages where the global FAIS widget should NOT appear
  const excludePaths = [
    '/kvitka-poloniny',
    '/admin',
  ]
  
  // Check if current path should exclude the global widget
  const shouldExclude = excludePaths.some(path => pathname.startsWith(path))
  
  useEffect(() => {
    // If we're on an excluded path, continuously remove any global widgets that might appear
    if (shouldExclude) {
      const cleanupInterval = setInterval(() => {
        const globalWidgets = document.querySelectorAll('elevenlabs-convai[agent-id="GkOKedIUAelQwYORYU3j"]');
        if (globalWidgets.length > 0) {
          console.log(`ConditionalElevenLabsWidget: Removing ${globalWidgets.length} global widgets from excluded path:`, pathname);
          globalWidgets.forEach(widget => widget.remove());
        }
      }, 500);
      
      return () => clearInterval(cleanupInterval);
    }
  }, [shouldExclude, pathname]);
  
  if (shouldExclude) {
    console.log('ConditionalElevenLabsWidget: Excluding global FAIS widget from path:', pathname);
    return null
  }
  
  // Show the global FAIS widget on all other pages
  console.log('ConditionalElevenLabsWidget: Loading global FAIS widget for path:', pathname);
  return (
    <>
      {/* ElevenLabs Convai Widget v3 - Global FAIS Widget */}
      <div dangerouslySetInnerHTML={{
        __html: '<elevenlabs-convai agent-id="GkOKedIUAelQwYORYU3j"></elevenlabs-convai>'
      }} />
      
      {/* ElevenLabs Widget Script - Global */}
      <script src='https://unpkg.com/@elevenlabs/convai-widget-embed' async type="text/javascript"></script>
    </>
  )
}
