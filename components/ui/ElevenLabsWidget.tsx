"use client"

import React, { useEffect, useRef } from 'react'

export default function ElevenLabsWidget({ agentId = "GkOKedIUAelQwYORYU3j" }: { agentId?: string }) {
  const initialized = useRef(false)
  const widgetRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Prevent multiple initializations
    if (initialized.current) return
    initialized.current = true

    // Check if script is already loaded
    const existingScript = document.querySelector('script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]')
    
    const initializeWidget = () => {
      // Clean up any existing widget first
      if (widgetRef.current && widgetRef.current.parentNode) {
        widgetRef.current.parentNode.removeChild(widgetRef.current)
      }
      
      // Create new widget element
      const widget = document.createElement('elevenlabs-convai') as HTMLElement
      widget.setAttribute('agent-id', agentId)
      widgetRef.current = widget
      document.body.appendChild(widget)
    }

    if (existingScript) {
      // Script already loaded, initialize widget
      setTimeout(initializeWidget, 100)
    } else {
      // Load script first, then initialize widget
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed'
      script.async = true
      script.type = 'text/javascript'
      script.onload = () => setTimeout(initializeWidget, 100)
      script.onerror = (error) => console.error('Failed to load ElevenLabs widget script:', error)
      document.body.appendChild(script)
    }    return () => {
      // Cleanup widget on unmount (but keep script for other instances)
      if (widgetRef.current && widgetRef.current.parentNode) {
        widgetRef.current.parentNode.removeChild(widgetRef.current)
      }
      initialized.current = false
    }
  }, [agentId])

  return (
    <>
      <style jsx global>{`
        /* Hide ElevenLabs signature */
        elevenlabs-convai::part(signature),
        elevenlabs-convai .elevenlabs-signature,
        elevenlabs-convai [data-testid="signature"],
        elevenlabs-convai .signature,
        .elevenlabs-widget-signature {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          width: 0 !important;
          overflow: hidden !important;
        }
        
        /* Additional hiding for any signature elements */
        elevenlabs-convai *[class*="signature"],
        elevenlabs-convai *[id*="signature"],
        elevenlabs-convai *[data-*="signature"] {
          display: none !important;
        }

        /* Widget positioning and styling */
        elevenlabs-convai {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
        }
      `}</style>
    </>
  )
}
