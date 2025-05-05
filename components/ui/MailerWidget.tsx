"use client"

import type React from "react"
import { type FC, useState } from "react"

declare global {
  interface Window {
    grecaptcha: any
  }
}

const MailerWidget: FC = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !message) {
      setStatus("error")
      setErrorMessage("Please fill in all fields")
      return
    }

    setStatus("loading")

    try {
      // Simple form submission without reCAPTCHA for now
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setStatus("success")
        setName("")
        setEmail("")
        setMessage("")
      } else {
        setStatus("error")
        setErrorMessage(result.message || "Failed to send message. Please try again.")
      }
    } catch (error) {
      console.error("Error:", error)
      setStatus("error")
      setErrorMessage("An error occurred. Please try again.")
    }
  }

  return (
    <div className="mb-16">
      <form onSubmit={handleSubmit} className="mailer-widget max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        {status === "success" && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
            Your message has been sent successfully! We'll get back to you soon.
          </div>
        )}

        {status === "error" && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">{errorMessage}</div>}

        <div className="mb-4">
          <input
            type="text"
            id="contact-name"
            name="contact-name"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={status === "loading"}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="name"
          />
        </div>

        <div className="mb-4">
          <input
            type="email"
            id="contact-email"
            name="contact-email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === "loading"}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="email"
          />
        </div>

        <div className="mb-4">
          <textarea
            id="contact-message"
            name="contact-message"
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            disabled={status === "loading"}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32"
          />
        </div>

        <button
          type="submit"
          id="contact-submit"
          name="contact-submit"
          disabled={status === "loading"}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {status === "loading" ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  )
}

export default MailerWidget
