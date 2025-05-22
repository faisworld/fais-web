// app/api/admin/media/metadata/route.ts
import { NextResponse } from 'next/server';
// Import commented out as it's not currently used, but keeping for potential future use
// import { checkAdminAuth } from '@/utils/admin-auth';
import probe from 'probe-image-size';
import fetch from 'node-fetch';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const type = searchParams.get('type') || 'image';
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter required' }, { status: 400 });
  }
  
  try {
    // Get headers for file size
    const headRes = await fetch(url, { method: 'HEAD' });
    const fileSize = formatSize(Number(headRes.headers.get('content-length') || '0'));
    
    if (type === 'image') {
      const result = await probe(url);
      return NextResponse.json({
        width: result.width,
        height: result.height,
        extension: result.type,
        fileSize,
        quality: result.type === 'jpg' ? result.quality : undefined
      });
    }
    
    if (type === 'video') {
      // In a full implementation, you'd use ffprobe
      // Here we just return basic info
      return NextResponse.json({
        width: 1920, // Default/placeholder values
        height: 1080,
        extension: url.split('.').pop() || 'mp4',
        fileSize
      });
    }
    
    return NextResponse.json({ error: 'Unsupported media type' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching media metadata:', error);
    return NextResponse.json({ error: 'Failed to get metadata' }, { status: 500 });
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}