import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

export async function PATCH(req: NextRequest) {
  try {
    const { id, title, alt } = await req.json();
    if (!id || (!title && !alt)) {
      return NextResponse.json({ error: 'Missing image id or fields' }, { status: 400 });
    }
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    if (title) {
      await client.query(`UPDATE images SET title = $1 WHERE id = $2`, [title, id]);
    }
    if (alt) {
      await client.query(`UPDATE images SET alt = $1 WHERE id = $2`, [alt, id]);
    }
    await client.end();
    return NextResponse.json({ success: true, message: 'Image updated.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update image', details: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing image id' }, { status: 400 });
    }
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    await client.query(`DELETE FROM images WHERE id = $1`, [id]);
    await client.end();
    return NextResponse.json({ success: true, message: 'Image deleted.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete image', details: String(err) }, { status: 500 });
  }
}
