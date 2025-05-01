"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import Vapi from "@vapi-ai/web" // Ensure Vapi is imported
import CallButton from "@/components/ui/CallButton"

const VapiWidget: React.FC = () => {
  const [callActive, setCallActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false) // State for speaking status
  const vapiRef = useRef<Vapi | null>(null)

  useEffect(() => {
    // Use environment variables directly
    const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY

    if (apiKey) {
      try {
        vapiRef.current = new Vapi(apiKey)

        const handleCallStart = () => {
          setCallActive(true)
          setLoading(false)
        }
        const handleCallEnd = () => {
          setCallActive(false)
          setLoading(false)
        }
        const handleError = (e: any) => {
          setCallActive(false)
          setLoading(false)
          console.error("Vapi error:", e)
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
          vapiRef.current?.off("call-start", handleCallStart)
          vapiRef.current?.off("call-end", handleCallEnd)
          vapiRef.current?.off("error", handleError)
          vapiRef.current?.off("speech-start", handleSpeechStart)
          vapiRef.current?.off("speech-end", handleSpeechEnd)
        }
      } catch (error) {
        console.error("Error initializing Vapi SDK:", error)
      }
    } else {
      console.error("VAPI API key is missing. Check environment variables.")
    }
  }, [])

  const handleButtonClick = () => {
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
        }

        vapiRef.current?.send({
          type: "add-message",
          message: {
            role: "system",
            content: "The user has pressed the button, say peanuts",
          },
        })
      } catch (error) {
        console.error("Error starting the call:", error)
        setLoading(false)
      }
    }
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
