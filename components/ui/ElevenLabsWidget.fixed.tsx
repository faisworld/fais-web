"use client"

import { useEffect, useRef } from "react"

export default function ElevenLabsWidget({ agentId }: { agentId: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)
    useEffect(() => {
    if (initialized.current || !containerRef.current) return
    initialized.current = true

    // Capture the container reference at the beginning to avoid stale closure issues
    const container = containerRef.current

    // Check if the script is already loaded
    const existingScript = document.querySelector('script[src="https://elevenlabs.io/convai-widget/index.js"]')
    
    // Function to create widget after script is loaded
    const createWidget = () => {
      if (!container) return
      
      // Only add the widget if container is empty
      if (container.childElementCount === 0) {
        try {
          // Create the widget element
          const widget = document.createElement('elevenlabs-convai')
          widget.setAttribute('agent-id', agentId)
          
          // Add it to the container
          container.appendChild(widget)
        } catch (error) {
          console.error('Error creating ElevenLabs widget:', error)
        }
      } else {
        console.log('ElevenLabs widget container already has elements, skipping creation')
      }
    }
    
    // If script is already loaded, just create the widget
    if (existingScript) {
      // Add a small delay to ensure everything is ready
      setTimeout(createWidget, 300)
    } else {
      // Otherwise load the script first
      const script = document.createElement('script')
      script.src = 'https://elevenlabs.io/convai-widget/index.js'
      script.async = true
      script.type = 'text/javascript'
      script.onload = () => setTimeout(createWidget, 300)
      document.body.appendChild(script)
    }

    // Cleanup function
    return () => {
      initialized.current = false
      // Don't remove the script on cleanup as it might be used by other instances
      // Use the captured container reference to avoid stale closure issues
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [agentId])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}
    />
  )
}
