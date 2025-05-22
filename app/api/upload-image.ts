import { NextApiRequest, NextApiResponse } from 'next';
import { put } from '@vercel/blob';
import { Client } from '@neondatabase/serverless';
import formidable from 'formidable';
import fs from 'fs/promises';

export const config = {
    bodyParser: false, // Required for file uploads
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Parse incoming file using formidable
      const form = new formidable.IncomingForm();
      const [, files] = await form.parse(req);

      const file = files.file?.[0];
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }

      // Read file using fs
      const fileBuffer = await fs.readFile(file.filepath);

      // Upload file to Vercel Blob Storage
      const blobResult = await put(file.originalFilename || 'uploaded-file', fileBuffer, {
        access: 'public',
      });

      // Store metadata in Neon PostgreSQL
      const client = new Client(process.env.DATABASE_URL);
      await client.connect();
      await client.query(
        'INSERT INTO images (url, title, uploaded_at, size, dimension, altTag) VALUES ($1, $2, NOW(), $3, $4, $5)',
        [blobResult.url, file.originalFilename, file.size, null, 'image']
      );
      await client.end();

      // Return Blob URL
      res.status(200).json({ success: true, url: blobResult.url });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}