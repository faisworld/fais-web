import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { RecaptchaEnterpriseServiceClient } from "@google-cloud/recaptcha-enterprise"

// Simple in-memory rate limiting
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in milliseconds
const MAX_REQUESTS_PER_IP = 5 // Maximum 5 emails per hour per IP

const ipRequestCounts = new Map<string, { count: number; resetTime: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = ipRequestCounts.get(ip)

  if (!record || now > record.resetTime) {
    ipRequestCounts.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    })
    return false
  }

  if (record.count < MAX_REQUESTS_PER_IP) {
    record.count++
    return false
  }

  return true
}

// Function to verify reCAPTCHA token using the official client
async function verifyRecaptchaToken(token: string, action: string) {
  try {
    // Create the reCAPTCHA client
    const client = new RecaptchaEnterpriseServiceClient()
    const projectPath = client.projectPath("fantastic-ai-stu-1742763229808")

    // Build the assessment request
    const request = {
      assessment: {
        event: {
          token: token,
          siteKey: "6LcWFf4qAAAAABZqkkjzL7kpBVbdj9Wq4GFZ_Y9Z",
        },
      },
      parent: projectPath,
    }

    // Create the assessment
    const [response] = await client.createAssessment(request)

    // Check if the token is valid
    if (!response.tokenProperties.valid) {
      console.log(`Token validation failed: ${response.tokenProperties.invalidReason}`)
      return { valid: false, score: 0, reason: response.tokenProperties.invalidReason }
    }

    // Check if the expected action was executed
    if (response.tokenProperties.action !== action) {
      console.log(`Action mismatch: expected ${action}, got ${response.tokenProperties.action}`)
      return { valid: false, score: 0, reason: "Action mismatch" }
    }

    // Get the risk score
    const score = response.riskAnalysis.score
    console.log(`reCAPTCHA score: ${score}`)

    // Log any risk reasons
    if (response.riskAnalysis.reasons && response.riskAnalysis.reasons.length > 0) {
      console.log("Risk reasons:", response.riskAnalysis.reasons)
    }

    return { valid: true, score, reason: null }
  } catch (error) {
    console.error("Error verifying reCAPTCHA token:", error)
    return { valid: false, score: 0, reason: "Verification error" }
  }
}

export async function POST(request: Request) {
  try {
    // Get client IP
    const ip = request.headers.get("x-forwarded-for") || "unknown"

    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json({ message: "Too many requests. Please try again later." }, { status: 429 })
    }

    const body = await request.json()
    const { name, email, message, token, recaptchaAction, isDevelopment } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Skip reCAPTCHA verification in development mode
    if (!isDevelopment) {
      if (!token) {
        return NextResponse.json({ message: "Missing reCAPTCHA token" }, { status: 400 })
      }

      // Verify the reCAPTCHA token
      const verification = await verifyRecaptchaToken(token, recaptchaAction || "submit")

      if (!verification.valid) {
        return NextResponse.json({ message: `reCAPTCHA verification failed: ${verification.reason}` }, { status: 400 })
      }

      // Check the score (0.0 is most likely a bot, 1.0 is most likely a human)
      if (verification.score < 0.5) {
        console.warn(`Suspicious activity detected. Score: ${verification.score}`)
        return NextResponse.json({ message: "Suspicious activity detected" }, { status: 400 })
      }
    } else {
      console.log("Development mode: Skipping reCAPTCHA verification")
    }

    // Create a transporter using SMTP credentials
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Update this based on your email provider
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Format the email
    const mailOptions = {
      from: `"Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // or another email address if desired
      replyTo: email, // Allow direct replies to the sender
      subject: `New Contact Form Submission from ${name}`,
      text: `You received a new message from ${name} (${email}):\n\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px;">
            ${message.replace(/\n/g, "<br>")}
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This message was sent from the contact form on your website.
          </p>
        </div>
      `,
    }

    // Send the email
    await transporter.sendMail(mailOptions)

    // After sending the main email, send an auto-reply to the sender
    // try {
    //   const autoReplyOptions = {
    //     from: `"Fantastic AI Studio" <${process.env.SMTP_USER}>`,
    //     to: email,
    //     subject: "Thank you for contacting us",
    //     text: `Dear ${name},\n\nThank you for reaching out to us. We have received your message and will get back to you as soon as possible.\n\nBest regards,\nThe Fantastic AI Studio Team`,
    //     html: `
    //       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
    //         <h2 style="color: #333;">Thank You for Contacting Us</h2>
    //         <p>Dear ${name},</p>
    //         <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
    //         <p>Best regards,<br>The Fantastic AI Studio Team</p>
    //       </div>
    //     `,
    //   }

    //   await transporter.sendMail(autoReplyOptions)
    //   console.log("Auto-reply sent to", email)
    // } catch (autoReplyError) {
    //   console.error("Error sending auto-reply:", autoReplyError)
    //   // Don't fail the request if auto-reply fails
    // }

    // Return success response
    return NextResponse.json({ message: "Email sent successfully." })
  } catch (error) {
    console.error("Email sending error:", error)
    return NextResponse.json({ message: "Failed to send email. Please try again later." }, { status: 500 })
  }
}
