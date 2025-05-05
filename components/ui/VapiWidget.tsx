"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import Vapi from "@vapi-ai/web" // Ensure Vapi is imported
import CallButton from "@/components/ui/CallButton"

const VapiWidget: React.FC = () => {
  const [callActive, setCallActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false) // State for speaking status
  const [error, setError] = useState<string | null>(null)
  const vapiRef = useRef<Vapi | null>(null)

  useEffect(() => {
    // Use environment variables directly
    const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY

    if (!apiKey) {
      console.warn("VAPI API key is missing. Check environment variables.")
      setError("API key missing")
      return
    }

    try {
      vapiRef.current = new Vapi(apiKey)

      const handleCallStart = () => {
        setCallActive(true)
        setLoading(false)
        setError(null)
      }
      const handleCallEnd = () => {
        setCallActive(false)
        setLoading(false)
      }
      const handleError = (e: any) => {
        setCallActive(false)
        setLoading(false)

        if (e?.status === 401) {
          setError("Authentication failed")
          console.error("Vapi authentication error: Invalid API key or permissions")
        } else {
          setError("Connection error")
          // Print the full error object for debugging
          if (typeof e === "object") {
            console.error("Vapi error:", JSON.stringify(e, null, 2))
          } else {
            console.error("Vapi error:", e)
          }
        }
      }
      const handleSpeechStart = () => setIsSpeaking(true) // Use setIsSpeaking
      const handleSpeechEnd = () => setIsSpeaking(false) // Use setIsSpeaking

      vapiRef.current.on("call-start", handleCallStart)
      vapiRef.current.on("call-end", handleCallEnd)
      vapiRef.current.on("error", handleError)
      vapiRef.current.on("speech-start", handleSpeechStart)
      vapiRef.current.on("speech-end", handleSpeechEnd)

      // Cleanup
      return () => {
        if (vapiRef.current) {
          vapiRef.current.off("call-start", handleCallStart)
          vapiRef.current.off("call-end", handleCallEnd)
          vapiRef.current.off("error", handleError)
          vapiRef.current.off("speech-start", handleSpeechStart)
          vapiRef.current.off("speech-end", handleSpeechEnd)
        }
      }
    } catch (error) {
      console.error("Error initializing Vapi SDK:", error)
      setError("Initialization error")
    }
  }, [])

  const handleButtonClick = () => {
    if (error) {
      // If there's an error, show a message instead of trying to call
      console.warn("Cannot start call due to Vapi error:", error)
      return
    }

    if (callActive) {
      try {
        console.log("Stopping call")
        vapiRef.current?.stop()
      } catch (error) {
        console.error("Error stopping the call:", error)
      }
    } else {
      setLoading(true)
      try {
        console.log("Starting call with configured assistant ID from dashboard")
        // Use environment variable directly
        const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID
        if (assistantId) {
          vapiRef.current?.start(assistantId)
        } else {
          console.error("Assistant ID is missing.")
          setLoading(false)
          setError("Missing assistant ID")
        }
      } catch (error) {
        console.error("Error starting the call:", error)
        setLoading(false)
        setError("Call failed")
      }
    }
  }

  // If there's an error, show a disabled button with error state
  if (error) {
    return (
      <div className="flex flex-col items-center">
        <div
          className="px-8 rounded-full font-bold text-white text-lg shadow-lg transition-colors duration-200 
                    bg-gray-400 cursor-not-allowed opacity-70 ring-2 ring-offset-2 ring-gray-400/40
                    header-menu-links"
          title={`Vapi error: ${error}`}
        >
          <span className="flex items-center gap-2 text-lg">
            <span className="font-bold">fAIs</span>
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <CallButton isCalling={callActive} isSpeaking={isSpeaking} onClick={handleButtonClick} disabled={loading}>
        {loading ? "Connecting..." : callActive ? "Stop Call" : undefined}
      </CallButton>
    </div>
  )
}

export default VapiWidget
