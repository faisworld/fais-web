import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const makeWebhookUrl = 'https://hook.eu2.make.com/rrwyl6u4kxhlplrdgtsrv6otjst6u90f'; // Replace with your Make.com webhook URL

    try {
      const response = await fetch(makeWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      });

      if (response.ok) {
        res.status(200).json({ success: true, message: 'Forwarded to Make.com webhook successfully' });
      } else {
        res.status(response.status).json({ success: false, message: 'Failed to forward to Make.com webhook' });
      }
    } catch (error) {
      console.error('Error forwarding to Make.com webhook:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
