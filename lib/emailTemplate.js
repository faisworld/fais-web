export function generateEmailTemplate(data) {
  const { name, email, message } = data;
  
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #ffffff; border: 1px solid #eee; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Contact Form Submission</h1>
        </div>
        <div class="content">
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
        <div class="footer">
          <p>This email was sent from the contact form on Fantastic AI Studio website</p>
          <p>&copy; ${new Date().getFullYear()} Fantastic AI Studio</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const textTemplate = `
New Contact Form Submission

From: ${name} (${email})

Message:
${message}

---
This email was sent from the contact form on Fantastic AI Studio website
© ${new Date().getFullYear()} Fantastic AI Studio
  `;
  
  return { html: htmlTemplate, text: textTemplate };
}