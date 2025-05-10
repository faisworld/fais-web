"use client"

import { useEffect, useRef } from "react"

export default function ElevenLabsWidget({ agentId }: { agentId: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)
  
  useEffect(() => {
    if (initialized.current || !containerRef.current) return
    initialized.current = true

    // Check if the script is already loaded
    const existingScript = document.querySelector('script[src="https://elevenlabs.io/convai-widget/index.js"]')
      // Function to create widget after script is loaded
    const createWidget = () => {
      if (!containerRef.current) return
      
      // Only add the widget if container is empty
      if (containerRef.current.childElementCount === 0) {
        try {
          // Check if the custom element is already defined
          if (!customElements.get('elevenlabs-convai')) {
            console.log('ElevenLabs widget custom element not yet defined, waiting...')
            // If not defined yet, try again after another delay
            setTimeout(createWidget, 500)
            return
          }
          
          // Create the widget element
          const widget = document.createElement('elevenlabs-convai')
          widget.setAttribute('agent-id', agentId)
          
          // Add it to the container
          containerRef.current.appendChild(widget)
          console.log('ElevenLabs widget created successfully')
        } catch (error) {
          console.error('Error creating ElevenLabs widget:', error)
        }
      } else {
        console.log('ElevenLabs widget container already has elements, skipping creation')
      }
    }
      // If script is already loaded, just create the widget
    if (existingScript) {
      console.log('ElevenLabs script already loaded, creating widget with delay')
      // Add a small delay to ensure everything is ready
      setTimeout(createWidget, 300)
    } else {
      console.log('Loading ElevenLabs script...')
      // Otherwise load the script first
      const script = document.createElement('script')
      script.src = 'https://elevenlabs.io/convai-widget/index.js'
      script.async = true
      script.type = 'text/javascript'
      script.onload = () => {
        console.log('ElevenLabs script loaded successfully')
        setTimeout(createWidget, 300)
      }
      script.onerror = (error) => {
        console.error('Error loading ElevenLabs script:', error)
      }
      document.body.appendChild(script)
    }    // Cleanup function
    return () => {
      console.log('Cleaning up ElevenLabs widget')
      initialized.current = false
      
      // Store a reference to the current container before cleanup
      const currentContainer = containerRef.current
      
      // Don't remove the script on cleanup as it might be used by other instances
      // But clear the container if it still exists
      if (currentContainer) {
        // Remove all child elements safely
        while (currentContainer.firstChild) {
          currentContainer.removeChild(currentContainer.firstChild)
        }
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
