import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // TODO: Actually create folder in DB or storage
  return NextResponse.json({ message: 'Folder created.' });
}

export async function DELETE(request: Request) {
  // TODO: Actually delete folder in DB or storage
  return NextResponse.json({ message: 'Folder deleted.' });
}

export async function PATCH(request: Request) {
  // TODO: Actually rename folder in DB or storage
  return NextResponse.json({ message: 'Folder renamed.' });
}
