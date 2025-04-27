import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@neondatabase/serverless';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const client = new Client(process.env.DATABASE_URL);
      await client.connect();
      const result = await client.query(
        'SELECT id, url, title, uploaded_at, size, dimension, "alt-tag" FROM images ORDER BY uploaded_at DESC'
      );
      await client.end();

      res.status(200).json({ images: result.rows });
    } catch (error) {
      console.error('Gallery list error:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}