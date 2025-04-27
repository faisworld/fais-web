import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@neondatabase/serverless';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new Client(process.env.DATABASE_URL);
  await client.connect();

  if (req.method === 'POST') {
    // Create folder
    const { folder } = req.body;
    if (!folder) {
      await client.end();
      return res.status(400).json({ error: 'Folder name required.' });
    }
    await client.query('INSERT INTO folders (name) VALUES ($1)', [folder]);
    await client.end();
    return res.status(200).json({ message: 'Folder created.' });
  }

  if (req.method === 'DELETE') {
    // Delete folder
    const { folder } = req.body;
    if (!folder) {
      await client.end();
      return res.status(400).json({ error: 'Folder name required.' });
    }
    await client.query('DELETE FROM folders WHERE name = $1', [folder]);
    await client.end();
    return res.status(200).json({ message: 'Folder deleted.' });
  }

  await client.end();
  res.setHeader('Allow', ['POST', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}