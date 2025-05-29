/**
 * reCAPTCHA Enterprise utility functions for dynamic token generation and management
 * This utility provides a centralized approach to handle reCAPTCHA across the application
 */

// reCAPTCHA Enterprise configuration
export const RECAPTCHA_CONFIG = {
  SITE_KEY: "6LcWFf4qAAAAABZqkkjzL7kpBVbdj9Wq4GFZ_Y9Z",
  SCRIPT_URL: "https://www.google.com/recaptcha/enterprise.js",
  PROJECT_ID: "fantastic-ai-stu-1742763229808",
  SCORE_THRESHOLD: 0.5,
  ACTIONS: {
    CONTACT_FORM: "submit_contact_form",
    NEWSLETTER: "newsletter_signup",
    COMMENT: "submit_comment",
    LOGIN: "user_login",
    REGISTER: "user_register",
  } as const,
} as const

export type RecaptchaAction = typeof RECAPTCHA_CONFIG.ACTIONS[keyof typeof RECAPTCHA_CONFIG.ACTIONS]

export interface RecaptchaResult {
  success: boolean
  token?: string
  error?: string
}

export interface RecaptchaVerificationResult {
  valid: boolean
  score: number
  reason?: string
}

/**
 * Loads the reCAPTCHA Enterprise script dynamically
 * @param onLoad Optional callback when script loads successfully
 * @param onError Optional callback when script fails to load
 * @returns Promise that resolves when script is loaded
 */
export function loadRecaptchaScript(
  onLoad?: () => void,
  onError?: (error: Error) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const scriptId = "recaptcha-enterprise-script"
    
    // Check if script is already loaded
    if (document.getElementById(scriptId)) {
      if (window.grecaptcha?.enterprise) {
        resolve()
        onLoad?.()
        return
      }
    }

    // Remove existing script if it exists but failed to load properly
    const existingScript = document.getElementById(scriptId)
    if (existingScript) {
      existingScript.remove()
    }

    const script = document.createElement("script")
    script.id = scriptId
    script.src = `${RECAPTCHA_CONFIG.SCRIPT_URL}?render=${RECAPTCHA_CONFIG.SITE_KEY}`
    script.async = true
    script.defer = true

    script.onload = () => {
      console.log("reCAPTCHA Enterprise script loaded successfully")
      resolve()
      onLoad?.()
    }

    script.onerror = (error) => {
      const err = new Error("Failed to load reCAPTCHA script")
      console.error("Error loading reCAPTCHA script:", error)
      reject(err)
      onError?.(err)
    }

    document.head.appendChild(script)
  })
}

/**
 * Waits for reCAPTCHA to be ready and available
 * @param timeoutMs Maximum time to wait in milliseconds (default: 10000)
 * @returns Promise that resolves when reCAPTCHA is ready
 */
export function waitForRecaptchaReady(timeoutMs: number = 10000): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()

    const checkRecaptcha = () => {
      if (window.grecaptcha?.enterprise) {
        window.grecaptcha.enterprise.ready(() => {
          console.log("reCAPTCHA Enterprise is ready")
          resolve()
        })
        return
      }

      // Check for timeout
      if (Date.now() - startTime > timeoutMs) {
        reject(new Error("reCAPTCHA ready timeout"))
        return
      }

      // Continue checking
      setTimeout(checkRecaptcha, 100)
    }

    checkRecaptcha()
  })
}

/**
 * Generates a reCAPTCHA token for the specified action
 * @param action The action identifier for this token
 * @param options Additional options
 * @returns Promise resolving to RecaptchaResult
 */
export async function generateRecaptchaToken(
  action: RecaptchaAction,
  options: {
    waitForReady?: boolean
    timeout?: number
    fallbackOnError?: boolean
  } = {}
): Promise<RecaptchaResult> {
  const {
    waitForReady = true,
    timeout = 10000,
    fallbackOnError = true
  } = options

  try {
    // Wait for reCAPTCHA to be ready if requested
    if (waitForReady) {
      await waitForRecaptchaReady(timeout)
    }

    // Check if reCAPTCHA is available
    if (!window.grecaptcha?.enterprise) {
      throw new Error("reCAPTCHA Enterprise not available")
    }

    console.log(`Generating reCAPTCHA token for action: ${action}`)
    
    const token = await window.grecaptcha.enterprise.execute(RECAPTCHA_CONFIG.SITE_KEY, {
      action,
    })

    if (!token) {
      throw new Error("Failed to generate reCAPTCHA token")
    }

    console.log("reCAPTCHA token generated successfully")
    return {
      success: true,
      token,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("reCAPTCHA token generation error:", errorMessage)

    if (fallbackOnError) {
      console.warn("Proceeding without reCAPTCHA token due to error")
      return {
        success: false,
        error: errorMessage,
      }
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * React hook for managing reCAPTCHA state and token generation
 * @param autoLoad Whether to automatically load the reCAPTCHA script
 * @returns Object with reCAPTCHA state and utility functions
 */
export function useRecaptcha(autoLoad: boolean = true) {
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!autoLoad) return

    setIsLoading(true)
    setError(null)

    loadRecaptchaScript(
      () => {
        waitForRecaptchaReady()
          .then(() => {
            setIsReady(true)
            setIsLoading(false)
          })
          .catch((err) => {
            setError(err.message)
            setIsLoading(false)
          })
      },
      (err) => {
        setError(err.message)
        setIsLoading(false)
      }
    )
  }, [autoLoad])

  const generateToken = useCallback(
    (action: RecaptchaAction) => generateRecaptchaToken(action, { waitForReady: false }),
    []
  )

  return {
    isReady,
    isLoading,
    error,
    generateToken,
    loadScript: loadRecaptchaScript,
    waitForReady: waitForRecaptchaReady,
  }
}

/**
 * Cleanup function to remove reCAPTCHA script and reset state
 */
export function cleanupRecaptcha(): void {
  const script = document.getElementById("recaptcha-enterprise-script")
  if (script) {
    script.remove()
  }
  
  // Note: We don't delete window.grecaptcha as it might be used by other components
  console.log("reCAPTCHA script cleanup completed")
}

/**
 * Validates reCAPTCHA configuration
 * @returns boolean indicating if configuration is valid
 */
export function validateRecaptchaConfig(): boolean {
  const requiredEnvVars = ["RECAPTCHA_SECRET_KEY"]
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  )

  if (missingVars.length > 0) {
    console.error("Missing reCAPTCHA environment variables:", missingVars)
    return false
  }

  return true
}

// Import useState, useEffect, useCallback for the hook
import { useState, useEffect, useCallback } from 'react'
