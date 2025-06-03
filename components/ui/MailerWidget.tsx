"use client"

import type React from "react"
import { type FC, useState } from "react"
import Button from "@/components/ui/Button"
import { useRecaptcha, RECAPTCHA_CONFIG } from "@/utils/recaptcha"
import { track } from '@vercel/analytics';

const MailerWidget: FC = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  
  // Use the new reCAPTCHA hook
  const { isReady: recaptchaReady, generateToken } = useRecaptcha()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Track form submission attempt
    track('contact_form_submit_attempt', {
      timestamp: new Date().toISOString(),
      has_name: !!name,
      has_email: !!email,
      has_message: !!message
    });

    if (!name || !email || !message) {
      setStatus("error")
      setErrorMessage("Please fill in all fields")
      
      // Track validation error
      track('contact_form_validation_error', {
        timestamp: new Date().toISOString(),
        error: 'missing_fields'
      });
      return
    }

    setStatus("loading")

    try {
      let recaptchaToken = ""
      
      // Get reCAPTCHA token using the new utility
      if (recaptchaReady) {
        const tokenResult = await generateToken(RECAPTCHA_CONFIG.ACTIONS.CONTACT_FORM)
        if (tokenResult.success && tokenResult.token) {
          recaptchaToken = tokenResult.token
          // console.log("reCAPTCHA token acquired successfully")
        } else {
          // console.warn("reCAPTCHA token generation failed:", tokenResult.error)
        }
      } else {
        // console.warn("reCAPTCHA not ready, proceeding without token")
      }

      // Submit form with or without token
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          recaptchaToken,
        }),
      })

      if (response.ok) {
        setStatus("success")
        setName("")
        setEmail("")
        setMessage("")
        setErrorMessage("")
        
        // Track successful form submission
        track('contact_form_submit_success', {
          timestamp: new Date().toISOString(),
          has_recaptcha: !!recaptchaToken
        });
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to send message")
      }
    } catch (error) {
      // console.error("Error sending message:", error)
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to send message")
      
      // Track form submission error
      track('contact_form_submit_error', {
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'unknown_error'
      });
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {status === "success" && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md border border-green-200">
            Your message has been sent successfully! We&apos;ll get back to you soon.
          </div>
        )}

        {status === "error" && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
            {errorMessage}
          </div>
        )}

        <div className="mb-5">
          <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1 lowercase">
            name
          </label>
          <input
            type="text"
            id="contact-name"
            name="contact-name"
            placeholder="your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={status === "loading"}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white"
            autoComplete="name"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1 lowercase">
            email
          </label>
          <input
            type="email"
            id="contact-email"
            name="contact-email"
            placeholder="your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === "loading"}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white"
            autoComplete="email"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1 lowercase">
            message
          </label>
          <textarea
            id="contact-message"
            name="contact-message"
            placeholder="your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            disabled={status === "loading"}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none h-48 bg-white"
          />
        </div>

        <Button
          type="submit"
          id="contact-submit"
          size="lg"
          disabled={status === "loading"}
          className="w-full"
        >
          {status === "loading" ? (
            <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-2 mr-4 h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              sending...
            </span>
          ) : (
            "send message"
          )}
        </Button>
      </form>
    </div>
  )
}

export default MailerWidget
