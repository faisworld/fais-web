import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename') || 'uploaded-image';

  // Ensure request.body is not null
  if (!request.body) {
    return NextResponse.json({ error: 'No file provided in request body.' }, { status: 400 });
  }

  // Use the BLOB_READ_WRITE_TOKEN from environment if needed
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  // Upload the file to Vercel Blob
  const blob = await put(filename, request.body, {
    access: 'public',
    ...(token ? { token } : {}),
  });

  return NextResponse.json(blob);
}