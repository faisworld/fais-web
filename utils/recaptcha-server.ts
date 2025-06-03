/**
 * Server-side reCAPTCHA Enterprise verification utilities
 * This module provides server-side reCAPTCHA token verification and assessment
 */

import { RecaptchaEnterpriseServiceClient } from "@google-cloud/recaptcha-enterprise"

// Server-side reCAPTCHA configuration
export const SERVER_RECAPTCHA_CONFIG = {
  PROJECT_ID: "fantastic-ai-stu-1742763229808",
  SITE_KEY: "6LcWFf4qAAAAABZqkkjzL7kpBVbdj9Wq4GFZ_Y9Z",
  SCORE_THRESHOLD: 0.5,
  ACTIONS: {
    CONTACT_FORM: "submit_contact_form",
    NEWSLETTER: "newsletter_signup",
    COMMENT: "submit_comment",
    LOGIN: "user_login",
    REGISTER: "user_register",
  } as const,
} as const

export type ServerRecaptchaAction = typeof SERVER_RECAPTCHA_CONFIG.ACTIONS[keyof typeof SERVER_RECAPTCHA_CONFIG.ACTIONS]

export interface RecaptchaVerificationResult {
  valid: boolean
  score: number
  reason?: string
  action?: string | null
  hostname?: string | null
  challengeTimestamp?: string | null
}

export interface RecaptchaAssessmentOptions {
  expectedAction?: ServerRecaptchaAction
  minimumScore?: number
  expectedHostname?: string
  timeoutMs?: number
}

/**
 * Verifies a reCAPTCHA Enterprise token and returns assessment results
 * @param token The reCAPTCHA token to verify
 * @param options Verification options
 * @returns Promise resolving to verification result
 */
export async function verifyRecaptchaToken(
  token: string,
  options: RecaptchaAssessmentOptions = {}
): Promise<RecaptchaVerificationResult> {
  const {
    expectedAction,
    minimumScore = SERVER_RECAPTCHA_CONFIG.SCORE_THRESHOLD,
    expectedHostname,
    timeoutMs = 10000,
  } = options

  try {
    // Create the reCAPTCHA client with timeout
    const client = new RecaptchaEnterpriseServiceClient({
      // Add timeout configuration
      libName: 'fais-web',
      libVersion: '1.0.0',
    })
    
    const projectPath = client.projectPath(SERVER_RECAPTCHA_CONFIG.PROJECT_ID)

    // Build the assessment request
    const request = {
      assessment: {
        event: {
          token: token,
          siteKey: SERVER_RECAPTCHA_CONFIG.SITE_KEY,
          expectedAction: expectedAction,
        },
      },
      parent: projectPath,
    }

    // console.log("Creating reCAPTCHA assessment...")

    // Create the assessment with timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("reCAPTCHA verification timeout")), timeoutMs)
    })

    const [response] = await Promise.race([
      client.createAssessment(request),
      timeoutPromise,
    ])
    
    // Extract token properties
    const tokenProperties = response?.tokenProperties
    const riskAnalysis = response?.riskAnalysis    // Check if the token is valid
    if (!tokenProperties?.valid) {
      const reason = String(tokenProperties?.invalidReason || "Unknown reason")
      // console.log(`reCAPTCHA token validation failed: ${reason}`)
      return {
        valid: false,
        score: 0,
        reason,
        action: tokenProperties?.action || null,
        hostname: tokenProperties?.hostname || null,
        challengeTimestamp: tokenProperties?.createTime?.seconds 
          ? new Date(Number(tokenProperties.createTime.seconds) * 1000).toISOString()
          : null,
      }
    }    // Check if the expected action was executed
    if (expectedAction && tokenProperties.action !== expectedAction) {
      const actualAction = tokenProperties.action || "unknown"
      // console.log(`reCAPTCHA action mismatch: expected ${expectedAction}, got ${actualAction}`)
      return {
        valid: false,
        score: 0,
        reason: "Action mismatch",
        action: actualAction,
        hostname: tokenProperties.hostname || null,
        challengeTimestamp: tokenProperties.createTime?.seconds 
          ? new Date(Number(tokenProperties.createTime.seconds) * 1000).toISOString()
          : null,
      }
    }

    // Check hostname if specified
    if (expectedHostname && tokenProperties.hostname !== expectedHostname) {
      // console.log(`reCAPTCHA hostname mismatch: expected ${expectedHostname}, got ${tokenProperties.hostname}`)
      return {
        valid: false,
        score: 0,
        reason: "Hostname mismatch",
        action: tokenProperties.action || null,
        hostname: tokenProperties.hostname || null,
        challengeTimestamp: tokenProperties.createTime?.seconds 
          ? new Date(Number(tokenProperties.createTime.seconds) * 1000).toISOString()
          : null,
      }
    }

    // Get the risk score
    const score = riskAnalysis?.score || 0
    // console.log(`reCAPTCHA assessment complete - Score: ${score}, Action: ${tokenProperties.action}`)

    // Log any risk reasons
    const reasons = riskAnalysis?.reasons
    if (reasons && reasons.length > 0) {
      // console.log("Risk analysis reasons:", reasons)
    }

    // Check if score meets minimum threshold
    const meetsThreshold = score >= minimumScore
    if (!meetsThreshold) {
      // console.warn(`reCAPTCHA score ${score} below threshold ${minimumScore}`)
    }    return {
      valid: meetsThreshold,
      score,
      reason: meetsThreshold ? undefined : "Score below threshold",
      action: tokenProperties.action || null,
      hostname: tokenProperties.hostname || null,
      challengeTimestamp: tokenProperties.createTime?.seconds 
        ? new Date(Number(tokenProperties.createTime.seconds) * 1000).toISOString()
        : null,
    }

  } catch (error) {
    // console.error("Error verifying reCAPTCHA token:", error)
    
    // Determine if this is a network/timeout error or validation error
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const isNetworkError = errorMessage.includes("timeout") || 
                          errorMessage.includes("network") || 
                          errorMessage.includes("ENOTFOUND") ||
                          errorMessage.includes("ECONNREFUSED")

    return {
      valid: false,
      score: 0,
      reason: isNetworkError ? "Network error during verification" : "Verification error",
    }
  }
}

/**
 * Enhanced verification with additional security checks
 * @param token The reCAPTCHA token to verify
 * @param clientIp Client IP address for additional validation
 * @param userAgent User agent string for additional validation
 * @param options Verification options
 * @returns Promise resolving to verification result
 */
export async function verifyRecaptchaTokenEnhanced(
  token: string,
  clientIp: string,
  userAgent: string,
  options: RecaptchaAssessmentOptions = {}
): Promise<RecaptchaVerificationResult & { 
  ipValid: boolean
  userAgentValid: boolean 
}> {
  const baseResult = await verifyRecaptchaToken(token, options)
  
  // Basic IP validation (not empty, not localhost in production)
  const ipValid = validateClientIp(clientIp)
  
  // Basic user agent validation (not empty, looks like a real browser)
  const userAgentValid = validateUserAgent(userAgent)
  
  const enhancedValid = baseResult.valid && ipValid && userAgentValid
    if (!enhancedValid && baseResult.valid) {
    // console.warn("reCAPTCHA token valid but failed enhanced checks", {
    //   ipValid,
    //   userAgentValid,
    //   clientIp: clientIp.substring(0, 8) + "...", // Log partial IP for privacy
    //   userAgent: userAgent.substring(0, 50) + "...", // Log partial UA for privacy
    // })
  }
  
  return {
    ...baseResult,
    valid: enhancedValid,
    ipValid,
    userAgentValid,
    reason: enhancedValid ? baseResult.reason : "Enhanced validation failed",
  }
}

/**
 * Validates client IP address
 * @param ip Client IP address
 * @returns boolean indicating if IP is valid
 */
function validateClientIp(ip: string): boolean {
  if (!ip || ip === "unknown") return false
  
  // In production, reject localhost/private IPs
  if (process.env.NODE_ENV === "production") {
    // Reject localhost and private ranges
    if (ip.startsWith("127.") || 
        ip.startsWith("192.168.") || 
        ip.startsWith("10.") || 
        ip.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./) ||
        ip === "::1") {
      return false
    }
  }
  
  return true
}

/**
 * Validates user agent string
 * @param userAgent User agent string
 * @returns boolean indicating if user agent looks legitimate
 */
function validateUserAgent(userAgent: string): boolean {
  if (!userAgent || userAgent.length < 10) return false
  
  // Check for common bot/suspicious patterns
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /nodejs/i,
  ]
  
  // Allow legitimate browser user agents
  const legitimatePatterns = [
    /Mozilla/,
    /Chrome/,
    /Safari/,
    /Firefox/,
    /Edge/,
    /Opera/,
  ]
  
  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(userAgent))
  const isLegitimate = legitimatePatterns.some(pattern => pattern.test(userAgent))
  
  return !isSuspicious && isLegitimate
}

/**
 * Validates the server-side reCAPTCHA configuration
 * @returns boolean indicating if configuration is valid
 */
export function validateServerRecaptchaConfig(): boolean {
  const requiredEnvVars = ["GOOGLE_APPLICATION_CREDENTIALS"]
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  )

  if (missingVars.length > 0) {
    // console.error("Missing reCAPTCHA server environment variables:", missingVars)
    return false
  }

  return true
}

/**
 * Creates a reCAPTCHA assessment result for development/testing
 * @param score Mock score to return
 * @param action Mock action
 * @returns Mock verification result
 */
export function createMockRecaptchaResult(
  score: number = 0.9,
  action: ServerRecaptchaAction = SERVER_RECAPTCHA_CONFIG.ACTIONS.CONTACT_FORM
): RecaptchaVerificationResult {
  return {
    valid: score >= SERVER_RECAPTCHA_CONFIG.SCORE_THRESHOLD,
    score,
    action,
    hostname: "localhost",
    challengeTimestamp: new Date().toISOString(),
  }
}
