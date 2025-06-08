"use client"

import React, { useEffect } from 'react'

export default function ElevenLabsWidget({ agentId = "GkOKedIUAelQwYORYU3j" }: { agentId?: string }) {
  useEffect(() => {
    // Load the ElevenLabs ConvAI widget script
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed'
    script.async = true
    script.type = 'text/javascript'
    document.body.appendChild(script)

    return () => {
      // Cleanup script on component unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])
  return (
    <>
      {React.createElement('elevenlabs-convai', { 'agent-id': agentId })}
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
      `}</style>
    </>
  )
}
