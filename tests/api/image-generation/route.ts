import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('🧪 AI Image Generation Test Endpoint');
  
  try {
    const body = await request.json();
    console.log('📤 Test request received:', body);

    // Default test parameters
    const testRequest = {
      mediaType: "image",
      modelIdentifier: "nvidia/sana",
      prompt: body.prompt || "A beautiful sunset over mountains, digital art style",
      modelVariant: "1600M-1024px",
      width: 1024,
      height: 1024,
      numInferenceSteps: 20,
      guidanceScale: 5.0,
      ...body // Allow overriding defaults
    };

    console.log('🔄 Forwarding to generation API with:', testRequest);

    // Forward to the actual generation API
    const response = await fetch(`${process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : ''}/api/admin/ai-tools/generate-media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRequest),
    });

    console.log('📡 Generation API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Generation API error:', errorText);
      return NextResponse.json({ 
        error: `Generation API error: ${response.status}`,
        details: errorText 
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('✅ Generation successful:', data);

    // Test the image accessibility
    if (data.imageUrl) {
      console.log('🔍 Testing image accessibility...');
      try {
        const imageCheckResponse = await fetch(data.imageUrl, { 
          method: 'HEAD',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        const accessibility = {
          accessible: imageCheckResponse.ok,
          status: imageCheckResponse.status,
          contentType: imageCheckResponse.headers.get('content-type'),
          contentLength: imageCheckResponse.headers.get('content-length'),
          cors: imageCheckResponse.headers.get('access-control-allow-origin')
        };
        
        console.log('🖼️ Image accessibility check:', accessibility);
        
        return NextResponse.json({
          ...data,
          imageAccessibility: accessibility,
          testSuccess: true
        });
      } catch (imageError) {
        console.error('❌ Image accessibility test failed:', imageError);
        return NextResponse.json({
          ...data,
          imageAccessibility: { error: imageError instanceof Error ? imageError.message : String(imageError) },
          testSuccess: true
        });
      }
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Test endpoint error:', error);
    return NextResponse.json({ 
      error: 'Test endpoint error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
