import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/utils/admin-auth';

// The placeholder URLs for local development
const PLACEHOLDER_VIDEO_URL = "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/sample/placeholder-video.mp4";
const PLACEHOLDER_IMAGE_URL = "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/sample/placeholder-image.jpg";

export async function POST(request: Request) {
  // Check admin authentication
  const authResult = await checkAdminAuth(request);
  if (!authResult.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { mediaType, modelIdentifier, prompt } = body;

    // Basic validation
    if (!mediaType || !modelIdentifier || !prompt) {
      return NextResponse.json({ 
        error: 'Missing required parameters' 
      }, { status: 400 });
    }

    // Always use mock responses for local development
    // This ensures the app works even without API keys configured
    console.log('Using mock response for media generation');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return appropriate mock response based on media type
    if (mediaType === 'image') {
      return NextResponse.json({ 
        imageUrl: PLACEHOLDER_IMAGE_URL
      });
    } else if (mediaType === 'video') {
      return NextResponse.json({ 
        videoUrl: PLACEHOLDER_VIDEO_URL
      });
    } else {
      return NextResponse.json({ error: 'Invalid media type specified' }, { status: 400 });
    }
  } catch (error: unknown) {
    console.error('Error in /api/admin/ai-tools/generate-media:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: 'Internal Server Error', message: errorMessage }, { status: 500 });
  }
}
