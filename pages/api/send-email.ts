import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

type Data = {
    message: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { name, email, message, token } = req.body;

    // Validate required fields (you can add more validation as needed)
    if (!name || !email || !message || !token) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // OPTIONAL: Validate the reCAPTCHA token here.
    // For example, you can call Google's reCAPTCHA verification endpoint using fetch.

    // Create a transporter using Gmail credentials from your .env.local file
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: `"Contact Form" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER, // or another email address if desired
        subject: "New Contact Form Submission",
        text: `You received a new message from ${name} (${email}):
        
${message}`,
        html: `<p>You received a new message from <strong>${name}</strong> (<em>${email}</em>)</p>
               <p>${message}</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: "Email sent successfully." });
    } catch (error) {
        console.error("Email sending error:", error);
        return res
            .status(500)
            .json({ message: "Failed to send email. Please try again later." });
    }
}