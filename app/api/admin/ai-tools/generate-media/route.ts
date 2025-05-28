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

// Model version mapping - Replicate uses format: model-name:version-hash
const MODEL_VERSIONS: Record<string, string> = {
  'nvidia/sana': 'nvidia/sana:c6b5d2b7459910fec94432e9e1203c3cdce92d6db20f714f1355747990b52fa6',
  'google/imagen-3-fast': 'google/imagen-3-fast', // Keep as working version
  'minimax/image-01': 'minimax/image-01', // Keep as working version
  // Video models
  'google/veo-2': 'google/veo-2',
  'minimax/video-01-director': 'minimax/video-01-director',
  'minimax/video-01': 'minimax/video-01',
};

// Helper function to convert aspect ratio to standard dimensions
function getStandardDimensions(aspectRatio: string): { width: number; height: number } {
  switch (aspectRatio) {
    case "16:9":
      return { width: 1024, height: 576 };
    case "1:1":
      return { width: 1024, height: 1024 };
    case "4:3":
      return { width: 1024, height: 768 };
    case "3:2":
      return { width: 1024, height: 683 };
    case "9:16":
      return { width: 576, height: 1024 };
    default:
      return { width: 1024, height: 1024 };
  }
}

export async function POST(request: NextRequest) {
  console.log("🔄 Processing media generation request");
  
  // Check admin authentication
  const authResult = await verifyAdminRequest(request);
  if (!authResult.success) {
    console.log("⛔ Authentication failed");
    return NextResponse.json({ error: authResult.message }, { status: 403 });
  }
  try {    const body = await request.json();    const { 
      mediaType, 
      modelIdentifier, 
      prompt, 
      negativePrompt,
      width,
      height,
      aspectRatio,
      modelVariant,
      numInferenceSteps,
      guidanceScale,
      pagGuidanceScale,
      seed,
      cameraMovements, 
      imageUrl,
      // Video generation specific parameters
      durationSeconds,
      first_frame_image,
      subject_reference,
      // Minimax Image 01 specific parameters
      aspect_ratio,
      number_of_images,
      prompt_optimizer,
      // Google Imagen 3 Fast specific parameters  
      safety_filter_level
    } = body;

    // Basic validation
    if (!mediaType || !modelIdentifier || !prompt) {
      console.log("⚠️ Missing required parameters");
      return NextResponse.json({ 
        error: 'Missing required parameters' 
      }, { status: 400 });
    }

    // Get the actual model version string for Replicate
    const modelVersion = MODEL_VERSIONS[modelIdentifier];
    if (!modelVersion) {
      console.log(`⚠️ Unsupported model: ${modelIdentifier}`);
      return NextResponse.json({ 
        error: `Unsupported model: ${modelIdentifier}. Available models: ${Object.keys(MODEL_VERSIONS).join(', ')}` 
      }, { status: 400 });
    }

    console.log(`📝 Request details: ${mediaType} generation using ${modelIdentifier} (version: ${modelVersion})`);
    console.log(`📝 Prompt: ${prompt.substring(0, 50)}...`);

    // Check for correct API tokens
    if (!process.env.REPLICATE_API_TOKEN) {
      console.error('REPLICATE_API_TOKEN is not configured.');
      return NextResponse.json({ 
        error: 'API configuration error. Please contact an administrator.' 
      }, { status: 500 });
    }

    // Set up Replicate API call
    const replicateApiUrl = 'https://api.replicate.com/v1/predictions';    interface ReplicateRequest {
      version: string;
      input: {
        prompt: string;
        negative_prompt?: string;
        width?: number;
        height?: number;
        model_variant?: string;
        num_inference_steps?: number;
        guidance_scale?: number;
        pag_guidance_scale?: number;
        seed?: number;
        camera_movements?: string;
        image?: string;
        // Video specific parameters
        duration_seconds?: number;
        first_frame_image?: string;
        // Minimax Image 01 specific
        aspect_ratio?: string;
        number_of_images?: number;
        prompt_optimizer?: boolean;
        subject_reference?: string;
        // Google Imagen 3 Fast specific
        safety_filter_level?: string;
      };
    }const requestBody: ReplicateRequest = {
      version: modelVersion, // Use the actual version hash
      input: {
        prompt,
      },
    };    // Add model-specific parameters based on the model type
    if (modelIdentifier === 'nvidia/sana') {
      // Nvidia Sana specific parameters
      if (negativePrompt) requestBody.input.negative_prompt = negativePrompt;
      if (width) requestBody.input.width = width;
      if (height) requestBody.input.height = height;
      if (modelVariant) requestBody.input.model_variant = modelVariant;
      if (numInferenceSteps) requestBody.input.num_inference_steps = numInferenceSteps;
      if (guidanceScale) requestBody.input.guidance_scale = guidanceScale;
      if (pagGuidanceScale) requestBody.input.pag_guidance_scale = pagGuidanceScale;
      if (seed) requestBody.input.seed = seed;
    } else if (modelIdentifier === 'minimax/image-01') {
      // Minimax Image 01 specific parameters
      if (aspect_ratio) requestBody.input.aspect_ratio = aspect_ratio;
      if (number_of_images !== undefined) requestBody.input.number_of_images = number_of_images;
      if (prompt_optimizer !== undefined) requestBody.input.prompt_optimizer = prompt_optimizer;
      if (subject_reference) requestBody.input.subject_reference = subject_reference;    } else if (modelIdentifier === 'google/imagen-3-fast') {
      // Google Imagen 3 Fast specific parameters  
      if (aspect_ratio) requestBody.input.aspect_ratio = aspect_ratio;
      if (safety_filter_level) requestBody.input.safety_filter_level = safety_filter_level;
    } else if (modelIdentifier === 'google/veo-2') {
      // Google Veo 2 specific parameters
      if (seed) requestBody.input.seed = seed;
      if (first_frame_image) requestBody.input.first_frame_image = first_frame_image;
      if (durationSeconds) requestBody.input.duration_seconds = durationSeconds;
    } else if (modelIdentifier === 'minimax/video-01-director') {
      // Minimax Video 01 Director specific parameters
      if (prompt_optimizer !== undefined) requestBody.input.prompt_optimizer = prompt_optimizer;
      if (first_frame_image) requestBody.input.first_frame_image = first_frame_image;
      if (cameraMovements) requestBody.input.camera_movements = cameraMovements;
      if (durationSeconds) requestBody.input.duration_seconds = durationSeconds;
    } else if (modelIdentifier === 'minimax/video-01') {
      // Minimax Video 01 specific parameters
      if (prompt_optimizer !== undefined) requestBody.input.prompt_optimizer = prompt_optimizer;
      if (first_frame_image) requestBody.input.first_frame_image = first_frame_image;
      if (subject_reference) requestBody.input.subject_reference = subject_reference;
      if (imageUrl) requestBody.input.image = imageUrl;
      if (durationSeconds) requestBody.input.duration_seconds = durationSeconds;
    } else {
      // For other models, use legacy aspectRatio if provided
      if (aspectRatio) {
        // Convert aspectRatio to width/height for models that support it
        const dimensions = getStandardDimensions(aspectRatio);
        requestBody.input.width = dimensions.width;
        requestBody.input.height = dimensions.height;
      }
    }

    // Add camera movements if present (for video models)
    if (cameraMovements) {
      requestBody.input.camera_movements = cameraMovements;
    }

    // Add image URL if present (for image-to-image models)
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
