import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { Client } from 'pg';
import probe from 'probe-image-size';

export async function POST(req: NextRequest) {
  // Parse form data
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const title = formData.get('title') as string || file?.name;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  // Upload to Vercel Blob
  const { url } = await put(file.name, file, { access: 'public' });

  // Get image dimensions and size
  let width = null, height = null, size = null;
  try {
    // Convert File to Buffer for probe-image-size
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const info = probe.sync(buffer);
    if (info) {
      width = info.width;
      height = info.height;
    }
    size = buffer.length;
  } catch (err) {
    // fallback: size from file.size if available
    size = (file as any).size || null;
  }

  // Save metadata to Neon
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  await client.query(
    'INSERT INTO images (url, title, width, height, size) VALUES ($1, $2, $3, $4, $5)',
    [url, title, width, height, size]
  );
  await client.end();

  return NextResponse.json({ url, title, width, height, size });
}
