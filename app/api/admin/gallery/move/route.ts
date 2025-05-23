import { NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';
import { checkAdminAuth } from '@/utils/admin-auth';

export async function POST(request: Request) {
  try {
    // Verify admin authentication
    const authResult = await checkAdminAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sourceUrl, targetFolder } = await request.json();
    
    if (!sourceUrl) {
      return NextResponse.json({ error: 'Source file URL is required' }, { status: 400 });
    }

    // Fetch the file content from source URL
    const fileResponse = await fetch(sourceUrl);
    if (!fileResponse.ok) {
      return NextResponse.json({ 
        error: `Failed to fetch source file: ${fileResponse.statusText}` 
      }, { status: 400 });
    }
    
    // Get the file content as blob
    const fileBlob = await fileResponse.blob();
    
    // Extract filename from URL
    const urlParts = sourceUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    
    // Create target path with folder
    const targetPath = targetFolder ? `${targetFolder}/${filename}` : filename;
    
    // Upload to new location
    const { url } = await put(targetPath, fileBlob, {
      access: 'public',
      contentType: fileBlob.type,
    });
    
    // Delete the original file (only if new upload worked and paths are different)
    if (url && sourceUrl !== url) {
      try {
        await del(sourceUrl);
      } catch (deleteError) {
        console.error('Error deleting original file:', deleteError);
        // Continue anyway since the file was copied successfully
      }
    }

    return NextResponse.json({ 
      success: true,
      oldUrl: sourceUrl,
      newUrl: url
    });
  } catch (error) {
    console.error('Error moving file:', error);
    return NextResponse.json({ 
      error: 'Failed to move file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
