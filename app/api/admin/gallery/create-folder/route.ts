import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { checkAdminAuth } from "@/utils/auth-compat";

export async function POST(request: Request) {
  try {
    // Verify admin authentication
    const authResult = await checkAdminAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, parent } = await request.json();
    
    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
    }
    
    // Validate folder name
    const sanitizedName = name.trim().replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
    
    // Create folder path
    let folderPath;
    
    // Handle default top-level folders specially
    const defaultFolders = ['images', 'carousel', 'videos'];
    
    if (!parent && defaultFolders.includes(sanitizedName)) {
      folderPath = `${sanitizedName}/.folder`;
    } else if (parent) {
      folderPath = `${parent}/${sanitizedName}/.folder`;
    } else {
      // For other new top-level folders, place them in 'images' by default
      folderPath = `images/${sanitizedName}/.folder`;
    }

    // Create empty file to represent the folder
    // This is needed because Vercel Blob doesn't have explicit folder support
    const result = await put(folderPath, new Blob(['']), {
      access: 'public',
      contentType: 'application/octet-stream',
    });

    console.log(`Created folder marker at ${result.url}`);

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
