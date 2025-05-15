import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { checkAdminAuth } from '@/utils/admin-auth';

export async function POST(request: Request) {
  try {
    // Verify admin authentication
    const authResult = await checkAdminAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, parent } = await request.json();
    
    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
    }

    // Create folder path
    const folderPath = parent ? `${parent}/${name}/.folder` : `${name}/.folder`;

    // Create empty file to represent the folder
    // This is needed because Vercel Blob doesn't have explicit folder support
    await put(folderPath, new Blob(['']), {
      access: 'public',
      contentType: 'application/octet-stream',
    });

    return NextResponse.json({ 
      success: true,
      folder: folderPath.replace('/.folder', '')
    });
  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json({ 
      error: 'Failed to create folder',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
