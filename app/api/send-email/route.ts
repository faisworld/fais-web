import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { 
  verifyRecaptchaTokenEnhanced, 
  SERVER_RECAPTCHA_CONFIG
} from "@/utils/recaptcha-server"

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

// Handle GET requests (for when someone visits the URL directly)
export async function GET() {
  return NextResponse.json({ 
    message: "Send Email API is working. Use POST method to send emails." 
  }, { status: 200 })
}

export async function POST(request: Request) {
  console.log('POST /api/send-email - Request received') // Debug log
  
  try {
    // Get client IP
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    console.log(`Request from IP: ${ip}`) // Debug log

    // Check rate limit
    if (isRateLimited(ip)) {
      console.log(`Rate limited: ${ip}`) // Debug log
      return NextResponse.json({ message: "Too many requests. Please try again later." }, { status: 429 })
    }

    const body = await request.json()
    console.log('Request body received:', { name: body.name, email: body.email, hasMessage: !!body.message }) // Debug log
    
    const { name, email, message, recaptchaToken, isDevelopment } = body

    // Validate required fields
    if (!name || !email || !message) {
      console.log('Missing required fields') // Debug log
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check environment variables
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('Missing SMTP environment variables')
      return NextResponse.json({ message: "Server configuration error" }, { status: 500 })
    }
    console.log('SMTP credentials configured') // Debug log

    // Skip reCAPTCHA verification in development mode
    const isDevEnvironment = process.env.NODE_ENV === 'development' || isDevelopment
    console.log(`Environment: ${process.env.NODE_ENV}, isDevelopment flag: ${isDevelopment}`)
    
    if (!isDevEnvironment) {
      // Allow submission with missing token but log it
      if (!recaptchaToken) {
        console.warn("Missing reCAPTCHA token in request - proceeding anyway", { ip })
      } else {
        console.log('Verifying reCAPTCHA token...') // Debug log
        // Get client IP and user agent for enhanced verification
        const userAgent = request.headers.get("user-agent") || "unknown"
        
        // Verify the reCAPTCHA token with enhanced security
        const verification = await verifyRecaptchaTokenEnhanced(
          recaptchaToken, 
          ip, 
          userAgent,
          { 
            expectedAction: SERVER_RECAPTCHA_CONFIG.ACTIONS.CONTACT_FORM,
            minimumScore: 0.5 
          }
        )

        if (!verification.valid) {
          console.warn(`reCAPTCHA verification failed: ${verification.reason}`)
          // We're not blocking the request, just logging the warning
        } else if (verification.score < 0.5) {
          console.warn(`Suspicious activity detected. Score: ${verification.score}`)
          // We're not blocking the request, just logging the warning
        } else {
          console.log(`reCAPTCHA verified successfully. Score: ${verification.score}`) // Debug log
        }
      }
    } else {
      console.log("Development mode: Skipping reCAPTCHA verification")
    }

    console.log('Creating email transporter...') // Debug log
    // Create a transporter using SMTP credentials
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Test the connection
    try {
      await transporter.verify()
      console.log('SMTP connection verified') // Debug log
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError)
      return NextResponse.json({ message: "Email service configuration error" }, { status: 500 })
    }

    // Create dynamic subject from first 4-5 words of message
    const messageWords = message.trim().split(/\s+/)
    const titleWords = messageWords.slice(0, Math.min(5, messageWords.length))
    const dynamicTitle = titleWords.join(' ')
    const subject = dynamicTitle.length > 0 ? `${dynamicTitle}...` : `Message from ${name}`

    // Format the email
    const mailOptions = {
      from: `"Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: `"${name}" <${email}>`, // Now shows as "Jon Doe <johndoe@gmail.com>"
      subject: subject,
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

    console.log('Sending email...') // Debug log
    // Send the email
    await transporter.sendMail(mailOptions)
    console.log('Email sent successfully') // Debug log

    // Return success response
    return NextResponse.json({ message: "Email sent successfully." })
  } catch (error) {
    console.error("Email sending error:", error)
    
    // More specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Invalid login')) {
        return NextResponse.json({ message: "Email authentication failed. Please check server configuration." }, { status: 500 })
      } else if (error.message.includes('ENOTFOUND')) {
        return NextResponse.json({ message: "Unable to connect to email server." }, { status: 500 })
      }
    }
    
    return NextResponse.json({ message: "Failed to send email. Please try again later." }, { status: 500 })
  }
}