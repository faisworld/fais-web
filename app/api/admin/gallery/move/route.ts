import { NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';
import { checkAdminAuth } from "@/utils/auth-compat";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    // Verify admin authentication
    const authResult = await checkAdminAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }

    const { sourceUrl, targetFolder, filename: customFilename } = await request.json();
    
    if (!sourceUrl || !targetFolder) {
      return NextResponse.json({ 
        error: 'Source file URL and target folder are required' 
      }, { status: 400, headers: corsHeaders });
    }

    console.log(`Moving file from ${sourceUrl} to folder: ${targetFolder}`);

    // Fetch the file content from source URL
    const fileResponse = await fetch(sourceUrl);
    if (!fileResponse.ok) {
      return NextResponse.json({ 
        error: `Failed to fetch source file: ${fileResponse.statusText}` 
      }, { status: 400, headers: corsHeaders });
    }
    
    // Get the file content as arrayBuffer for better handling
    const fileBuffer = await fileResponse.arrayBuffer();
    const contentType = fileResponse.headers.get('content-type') || 'application/octet-stream';
    
    // Extract filename from URL or use custom filename
    const urlParts = sourceUrl.split('/');
    const originalFilename = urlParts[urlParts.length - 1];
    const finalFilename = customFilename || originalFilename;
    
    // Ensure target folder doesn't start or end with slash for consistency
    const cleanTargetFolder = targetFolder.replace(/^\/+|\/+$/g, '');
    const targetPath = `${cleanTargetFolder}/${finalFilename}`;
    
    console.log(`Target path: ${targetPath}`);
    
    // Upload to new location
    const { url } = await put(targetPath, fileBuffer, {
      access: 'public',
      contentType,
    });
    
    // Delete the original file (only if new upload worked and paths are different)
    if (url && sourceUrl !== url) {
      try {
        await del(sourceUrl);
        console.log(`Successfully deleted original file: ${sourceUrl}`);
      } catch (deleteError) {
        console.error('Error deleting original file:', deleteError);
        // Continue anyway since the file was copied successfully
      }
    }

    return NextResponse.json({
      success: true,
      message: 'File moved successfully',
      oldUrl: sourceUrl,
      newUrl: url,
      targetPath
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error moving file:', error);
    return NextResponse.json({ 
      error: 'Failed to move file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500, headers: corsHeaders });
  }
}
