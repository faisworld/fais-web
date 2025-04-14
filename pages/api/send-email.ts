import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';

async function createAssessment({
    projectID = process.env.GOOGLE_CLOUD_PROJECT_ID || "fantastic-ai-stu-1742763229808",
    recaptchaKey = process.env.RECAPTCHA_SITE_KEY || "6LcWFf4qAAAAABZqkkjzL7kpBVbdj9Wq4GFZ_Y9Z",
    token,
    recaptchaAction,
}: {
    projectID?: string;
    recaptchaKey?: string;
    token: string;
    recaptchaAction: string;
}): Promise<number | null> {
    const client = new RecaptchaEnterpriseServiceClient();
    const projectPath = client.projectPath(projectID);

    const request: { assessment: { event: { token: string; siteKey: string } } } = {
        assessment: {
            event: {
                token: token,
                siteKey: recaptchaKey,
            },
        },
    };

    const [response] = await client.createAssessment({ parent: projectPath, assessment: request.assessment });

    if (!response.tokenProperties?.valid) {
        console.log(`The CreateAssessment call failed because the token was: ${response.tokenProperties?.invalidReason}`);
        return null;
    }

    if (response.tokenProperties?.action === recaptchaAction) {
        if (response.riskAnalysis?.score !== undefined) {
            console.log(`The reCAPTCHA score is: ${response.riskAnalysis.score}`);
        }
        response.riskAnalysis?.reasons?.forEach((reason) => {
            console.log(reason);
        });

        return response.riskAnalysis?.score ?? null;
    } else {
        console.log("The action attribute in your reCAPTCHA tag does not match the action you are expecting to score");
        return null;
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { name, email, message, token, recaptchaAction = 'submit' } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    // Validate reCAPTCHA token
    if (!token) {
        return res.status(400).json({ message: 'reCAPTCHA token is required' });
    }

    try {
        // Verify the reCAPTCHA token
        const score = await createAssessment({
            token,
            recaptchaAction,
        });

        // If the token is invalid or the score is too low (potential bot)
        if (score === null) {
            return res.status(400).json({ message: 'reCAPTCHA verification failed' });
        }

        if (score < 0.5) {
            console.log(`Low reCAPTCHA score: ${score}. Possible bot activity.`);
            return res.status(400).json({ message: 'reCAPTCHA verification failed. Please try again.' });
        }

        // Create email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Send the email
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.SMTP_USER,
            subject: `New message from ${name}`,
            text: `You have received a new message from ${name} (${email}):\n\n${message}\n\nreCAPTCHA score: ${score}`,
        });

        // Return success response
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}