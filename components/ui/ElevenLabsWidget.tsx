"use client"

import React, { useEffect, useRef, useState } from 'react'

export default function ElevenLabsWidget({ agentId = "GkOKedIUAelQwYORYU3j" }: { agentId?: string }) {
  const initialized = useRef(false)
  const widgetRef = useRef<HTMLElement | null>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const retryCount = useRef(0)
  const maxRetries = 3

  useEffect(() => {
    // Prevent multiple initializations
    if (initialized.current) return
    initialized.current = true

    // Check if script is already loaded
    const existingScript = document.querySelector('script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]')
    
    const initializeWidget = async () => {
      try {
        // Clean up any existing widget first
        if (widgetRef.current && widgetRef.current.parentNode) {
          widgetRef.current.parentNode.removeChild(widgetRef.current)
          widgetRef.current = null
        }

        // Wait for custom elements to be defined
        if (!customElements.get('elevenlabs-convai')) {
          console.log('Waiting for ElevenLabs custom elements to be defined...')
          setTimeout(initializeWidget, 500)
          return
        }

        // Validate agent ID format
        if (!agentId || agentId.length < 10) {
          throw new Error(`Invalid agent ID: ${agentId}`)
        }

        console.log(`Initializing ElevenLabs widget with agent ID: ${agentId}`)
        
        // Create new widget element with error handling
        const widget = document.createElement('elevenlabs-convai') as HTMLElement
        widget.setAttribute('agent-id', agentId)
          // Add error event listeners
        widget.addEventListener('error', (event: Event) => {
          const customEvent = event as CustomEvent
          console.error('ElevenLabs widget error:', event)
          setError(`Widget error: ${customEvent.detail || 'Unknown error'}`)
          
          // Retry logic
          if (retryCount.current < maxRetries) {
            retryCount.current++
            console.log(`Retrying widget initialization (attempt ${retryCount.current}/${maxRetries})...`)
            setTimeout(initializeWidget, 2000 * retryCount.current)
          }
        })

        widget.addEventListener('ready', () => {
          console.log('ElevenLabs widget ready')
          setError(null)
          retryCount.current = 0
        })

        widget.addEventListener('config-error', (event: Event) => {
          const customEvent = event as CustomEvent
          console.error('ElevenLabs config error:', event)
          setError(`Config error for agent ${agentId}: ${customEvent.detail || 'Cannot fetch agent configuration'}`)
        })

        widgetRef.current = widget
        document.body.appendChild(widget)
        
      } catch (error) {
        console.error('Failed to initialize ElevenLabs widget:', error)
        setError(`Initialization error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    const loadScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (existingScript) {
          resolve()
          return
        }

        const script = document.createElement('script')
        script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed'
        script.async = true
        script.type = 'text/javascript'
        
        script.onload = () => {
          console.log('ElevenLabs script loaded successfully')
          scriptRef.current = script
          resolve()
        }
        
        script.onerror = (error) => {
          console.error('Failed to load ElevenLabs widget script:', error)
          setError('Failed to load ElevenLabs script')
          reject(error)
        }
        
        document.head.appendChild(script)
      })
    }

    // Load script and initialize widget
    if (existingScript) {
      setTimeout(initializeWidget, 100)
    } else {
      loadScript()
        .then(() => setTimeout(initializeWidget, 100))
        .catch((error) => {
          console.error('Script loading failed:', error)
          setError('Failed to load widget script')
        })
    }

    return () => {
      // Cleanup widget on unmount
      if (widgetRef.current && widgetRef.current.parentNode) {
        widgetRef.current.parentNode.removeChild(widgetRef.current)
        widgetRef.current = null
      }
      initialized.current = false
      retryCount.current = 0
      setError(null)
    }  }, [agentId])

  // Show error message if widget fails to load
  if (error) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: '#ff4444',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        maxWidth: '250px',
        zIndex: 9999
      }}>
        ElevenLabs Widget Error: {error}
      </div>
    )
  }

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
