import { list } from '@vercel/blob';
import { Client } from 'pg';

// Load environment variables (DATABASE_URL, VERCEL_BLOB_READ_WRITE_TOKEN)
import 'dotenv/config';

async function main() {
  // List all blobs in your Vercel Blob store
  const blobs = await list();
  if (!blobs.blobs || blobs.blobs.length === 0) {
    console.log('No blobs found.');
    return;
  }

  // Connect to Neon (PostgreSQL)
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();

  for (const blob of blobs.blobs) {
    const url = blob.url;
    const title = blob.pathname.split('/').pop() || blob.pathname; // Use filename as title

    // Check if already exists to avoid duplicates
    const exists = await client.query('SELECT 1 FROM images WHERE url = $1', [url]);
    if (exists.rowCount === 0) {
      await client.query(
        'INSERT INTO images (url, title) VALUES ($1, $2)',
        [url, title]
      );
      console.log(`Inserted: ${title}`);
    } else {
      console.log(`Already exists: ${title}`);
    }
  }

  await client.end();
  console.log('Import complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
