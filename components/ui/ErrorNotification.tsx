"use client"

import { useState, useEffect } from "react"
import { FiAlertCircle, FiX } from "react-icons/fi"

type ErrorNotificationProps = {
  message: string
  type?: "error" | "warning" | "info"
  duration?: number // in milliseconds, 0 means it won't auto-dismiss
  onClose?: () => void
}

export default function ErrorNotification({
  message,
  type = "error",
  duration = 5000,
  onClose,
}: ErrorNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        if (onClose) onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) onClose()
  }

  if (!isVisible) return null

  const bgColor =
    type === "error"
      ? "bg-red-50 border-red-200 text-red-700"
      : type === "warning"
        ? "bg-yellow-50 border-yellow-200 text-yellow-700"
        : "bg-blue-50 border-blue-200 text-blue-700"

  return (
    <div className={`fixed top-24 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg border ${bgColor} animate-fade-in`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <FiAlertCircle className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            type="button"
            className={`inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              type === "error"
                ? "focus:ring-red-500"
                : type === "warning"
                  ? "focus:ring-yellow-500"
                  : "focus:ring-blue-500"
            }`}
            onClick={handleClose}
          >
            <span className="sr-only">Close</span>
            <FiX className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
