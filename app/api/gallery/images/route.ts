import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';
import { put, del } from '@vercel/blob';

export async function POST(req: NextRequest) {
  // Handle image upload
  // ...parse multipart/form-data, upload to blob, insert metadata into DB...
}

export async function PATCH(req: NextRequest) {
  // Handle image metadata update (title, alt)
  // ...parse JSON, update DB...
}

export async function DELETE(req: NextRequest) {
  // Handle image deletion
  // ...delete from blob, remove from DB...
}
