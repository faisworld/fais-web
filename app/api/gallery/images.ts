import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@neondatabase/serverless';
// import { del } from '@vercel/blob'; // Uncomment if you want to delete from Blob Storage

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    const { id, title, alt, description } = req.body;
    if (!id) return res.status(400).json({ error: 'Image id required.' });

    const client = new Client(process.env.DATABASE_URL);
    await client.connect();
    await client.query(
      'UPDATE images SET title = $1, alt = $2, description = $3 WHERE id = $4',
      [title, alt, description, id]
    );
    await client.end();

    res.status(200).json({ message: 'Image metadata updated.' });
    return;
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Image id required.' });

    const client = new Client(process.env.DATABASE_URL);
    await client.connect();

    // Optionally: fetch image URL before deleting
    // const result = await client.query('SELECT url FROM images WHERE id = $1', [id]);
    // const url = result.rows[0]?.url;

    await client.query('DELETE FROM images WHERE id = $1', [id]);
    await client.end();

    // Optionally: delete from Blob Storage
    // if (url) await del(url);

    res.status(200).json({ message: 'Image deleted.' });
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}