import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { Client } from 'pg';

export async function POST(req: NextRequest) {
  try {
    const { folder } = await req.json();
    if (!folder) {
      return NextResponse.json({ error: 'Missing folder name' }, { status: 400 });
    }
    // Upload a placeholder file to create the folder in blob storage
    const fileName = `${folder.replace(/\/$/, '')}/.keep`;
    await put(fileName, new Blob(['placeholder']), { access: 'public' });
    return NextResponse.json({ success: true, message: 'Folder created.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create folder', details: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { oldName, newName } = await req.json();
    if (!oldName || !newName) {
      return NextResponse.json({ error: 'Missing folder names' }, { status: 400 });
    }
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    await client.query(
      `UPDATE images SET folder = regexp_replace(folder, $1, $2) WHERE folder LIKE $3`,
      [oldName, newName, `${oldName}%`]
    );
    await client.end();
    return NextResponse.json({ success: true, message: 'Folder renamed.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to rename folder', details: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { folder } = await req.json();
    if (!folder) {
      return NextResponse.json({ error: 'Missing folder name' }, { status: 400 });
    }
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    await client.query(
      `DELETE FROM images WHERE folder = $1 OR folder LIKE $2`,
      [folder, `${folder}/%`]
    );
    await client.end();
    return NextResponse.json({ success: true, message: 'Folder and its images deleted.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete folder', details: String(err) }, { status: 500 });
  }
}
