import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
  }

  console.log('🔍 Debugging image URL:', imageUrl);

  try {
    // First, let's check if the URL is accessible
    const response = await fetch(imageUrl, {
      method: 'HEAD', // Just check headers first
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    console.log('🔍 HEAD response status:', response.status);
    console.log('🔍 HEAD response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      return NextResponse.json({
        accessible: false,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
    }

    // If HEAD works, try to fetch the actual image
    const imageResponse = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    console.log('🔍 GET response status:', imageResponse.status);
    console.log('🔍 GET response headers:', Object.fromEntries(imageResponse.headers.entries()));

    if (!imageResponse.ok) {
      return NextResponse.json({
        accessible: false,
        status: imageResponse.status,
        statusText: imageResponse.statusText,
        headers: Object.fromEntries(imageResponse.headers.entries())
      });
    }

    // Get content type and size info
    const contentType = imageResponse.headers.get('content-type');
    const contentLength = imageResponse.headers.get('content-length');

    return NextResponse.json({
      accessible: true,
      status: imageResponse.status,
      contentType,
      contentLength,
      headers: Object.fromEntries(imageResponse.headers.entries()),
      cors: {
        'access-control-allow-origin': imageResponse.headers.get('access-control-allow-origin'),
        'access-control-allow-credentials': imageResponse.headers.get('access-control-allow-credentials'),
        'access-control-allow-methods': imageResponse.headers.get('access-control-allow-methods')
      }
    });

  } catch (error) {
    console.error('🔍 Error checking image URL:', error);
    return NextResponse.json({
      accessible: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
