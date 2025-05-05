export function getContactFormTemplate(name: string, email: string, message: string) {
  return `
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
  `
}

export function getAutoReplyTemplate(name: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
      <h2 style="color: #333;">Thank You for Contacting Us</h2>
      <p>Dear ${name},</p>
      <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
      <p>Best regards,<br>The Fantastic AI Studio Team</p>
    </div>
  `
}
