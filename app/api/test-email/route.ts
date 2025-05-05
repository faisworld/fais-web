import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function GET() {
  // Only allow this in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ message: "This endpoint is only available in development mode" }, { status: 403 })
  }

  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Update based on your provider
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Send a test email
    const info = await transporter.sendMail({
      from: `"Email Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: "Test Email from Your Website",
      text: "This is a test email to verify that your email configuration is working correctly.",
      html: "<b>This is a test email to verify that your email configuration is working correctly.</b>",
    })

    return NextResponse.json({
      message: "Test email sent successfully",
      messageId: info.messageId,
    })
  } catch (error) {
    console.error("Test email error:", error)
    return NextResponse.json(
      {
        message: "Failed to send test email",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
