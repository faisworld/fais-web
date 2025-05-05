import nodemailer from "nodemailer"

// Create a transporter using your SMTP credentials
const transporter = nodemailer.createTransport({
  host: "smtp.your-provider.com", // Replace with your SMTP host
  port: 587, // Common SMTP port, adjust if needed
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface EmailOptions {
  to: string | string[]
  subject: string
  text?: string
  html?: string
}

/**
 * Send an email using the configured SMTP transporter
 */
export async function sendEmail({ to, subject, text, html }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"fAis Studio" <${process.env.SMTP_USER}>`,
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      text,
      html,
    })

    console.log("Message sent: %s", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error }
  }
}

/**
 * Send a contact form submission notification
 */
export async function sendContactFormNotification(formData: {
  name: string
  email: string
  message: string
}) {
  const { name, email, message } = formData

  return sendEmail({
    to: process.env.SMTP_USER!, // Send to your own email
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `,
  })
}
