import { Client } from 'pg';
// Use require for probe-image-size and node-fetch
const probe = require('probe-image-size');
const fetch = require('node-fetch');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const res = await client.query('SELECT id, url FROM images');
  const images = res.rows;

  for (const img of images) {
    try {
      const response = await fetch(img.url);
      if (!response.ok) {
        console.error(`Failed to fetch ${img.url}: ${response.statusText}`);
        continue;
      }
      const buffer = Buffer.from(await response.arrayBuffer());
      const info = probe.sync(buffer);
      if (!info) {
        console.error(`Could not probe image: ${img.url}`);
        continue;
      }
      const width = info.width;
      const height = info.height;
      const size = buffer.length;

      await client.query(
        'UPDATE images SET width = $1, height = $2, size = $3 WHERE id = $4',
        [width, height, size, img.id]
      );
      console.log(`Updated image ${img.id}: ${width}x${height}, ${size} bytes`);
    } catch (err) {
      console.error(`Error processing ${img.url}:`, err);
    }
  }

  await client.end();
  console.log('Batch update complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
