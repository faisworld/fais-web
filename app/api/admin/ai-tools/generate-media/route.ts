import { NextResponse, NextRequest } from 'next/server';
import { verifyAdminRequest } from '@/utils/admin-auth';

// Comment out unused placeholders to avoid build errors
// These are kept for reference but commented out to pass linting
/*
const PLACEHOLDER_IMAGES = [
  "https://picsum.photos/800/600",  // Use Lorem Picsum as it's reliable
  "https://picsum.photos/800/600?random=1",
  "https://picsum.photos/800/600?random=2",
];
const PLACEHOLDER_VIDEO_URL = "https://download.samplelib.com/mp4/sample-5s.mp4";
*/

export async function POST(request: NextRequest) {
  console.log("🔄 Processing media generation request");
  
  // Check admin authentication
  const authResult = await verifyAdminRequest(request);
  if (!authResult.success) {
    console.log("⛔ Authentication failed");
    return NextResponse.json({ error: authResult.message }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { mediaType, modelIdentifier, prompt, cameraMovements, imageUrl } = body;

    // Basic validation
    if (!mediaType || !modelIdentifier || !prompt) {
      console.log("⚠️ Missing required parameters");
      return NextResponse.json({ 
        error: 'Missing required parameters' 
      }, { status: 400 });
    }

    console.log(`📝 Request details: ${mediaType} generation using ${modelIdentifier}`);
    console.log(`📝 Prompt: ${prompt.substring(0, 50)}...`);

    // Check for correct API tokens
    if (!process.env.REPLICATE_API_TOKEN) {
      console.error('REPLICATE_API_TOKEN is not configured.');
      return NextResponse.json({ 
        error: 'API configuration error. Please contact an administrator.' 
      }, { status: 500 });
    }

    // Set up Replicate API call
    const replicateApiUrl = 'https://api.replicate.com/v1/predictions';
    
    interface ReplicateRequest {
      version: string;
      input: {
        prompt: string;
        camera_movements?: string;
        image?: string;
      };
    }
    
    const requestBody: ReplicateRequest = {
      version: modelIdentifier,
      input: {
        prompt,
      },
    };

    // Add camera movements if present
    if (cameraMovements) {
      requestBody.input.camera_movements = cameraMovements;
    }

    // Add image URL if present
    if (imageUrl) {
      requestBody.input.image = imageUrl;
    }
    
    let replicateResponse;
    try {
      replicateResponse = await fetch(replicateApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
    } catch (fetchError: unknown) {
      console.error('❌ Replicate API fetch error:', fetchError);
      return NextResponse.json({ 
        error: 'Failed to connect to AI service provider',
        message: fetchError instanceof Error ? fetchError.message : String(fetchError)
      }, { status: 500 });
    }

    if (!replicateResponse.ok) {
      const errorText = await replicateResponse.text();
      console.error('❌ Replicate API error:', replicateResponse.status, errorText);
      return NextResponse.json({ 
        error: 'Error from AI service provider',
        message: `Status: ${replicateResponse.status}, Body: ${errorText}`
      }, { status: replicateResponse.status });
    }

    const prediction = await replicateResponse.json();
    
    // Poll for the result
    let result = prediction;
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes with 5-second intervals
    
    while (result.status !== 'succeeded' && result.status !== 'failed' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      
      let checkResponse;
      try {
        checkResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
          headers: {
            'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (checkError: unknown) {
        console.error('❌ Replicate API check error:', checkError);
        return NextResponse.json({ 
          error: 'Failed to check prediction status',
          message: checkError instanceof Error ? checkError.message : String(checkError)
        }, { status: 500 });
      }
      
      if (!checkResponse.ok) {
        const checkErrorText = await checkResponse.text();
        console.error(`❌ Error checking prediction status: ${checkResponse.statusText}`, checkErrorText);
        return NextResponse.json({ 
          error: 'Error checking prediction status',
          message: `Status: ${checkResponse.statusText}, Body: ${checkErrorText}`
        }, { status: checkResponse.status });
      }
      
      result = await checkResponse.json();
      attempts++;
    }
    
    if (result.status === 'failed') {
      console.error('❌ Replicate prediction failed:', result.error);
      return NextResponse.json({ error: result.error || 'Generation failed' }, { status: 500 });
    }
    
    if (attempts >= maxAttempts) {
      console.error('❌ Replicate prediction timed out');
      return NextResponse.json({ error: 'Generation timed out' }, { status: 504 });
    }
    
    // Return the appropriate output based on media type
    if (mediaType === 'image') {
      console.log(`✅ Returning image: ${result.output}`);
      return NextResponse.json({ imageUrl: result.output });
    } else if (mediaType === 'video') {
      console.log(`✅ Returning video: ${result.output}`);
      return NextResponse.json({ videoUrl: result.output });
    } else {
      console.log("❌ Invalid media type");
      return NextResponse.json({ error: 'Invalid media type' }, { status: 400 });
    }

  } catch (error: unknown) {
    console.error('❌ Error in /api/admin/ai-tools/generate-media:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: 'Internal Server Error', message: errorMessage }, { status: 500 });
  }
}
