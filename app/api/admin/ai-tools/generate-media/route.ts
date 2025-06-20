import { NextResponse, NextRequest } from 'next/server';
import { verifyAdminRequest } from '@/utils/admin-auth';
import { uploadMediaWithMetadata } from '@/utils/media-database-sync';

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
// Using only the best quality models
const MODEL_VERSIONS: Record<string, string> = {
  // Premium image models
  'google/imagen-4': 'google/imagen-4',
  'black-forest-labs/flux-schnell': 'black-forest-labs/flux-schnell:bf2f5def8827b4b80ce27032c8ceea62b76b4436745c0a3ab7e8e6f3f0f20e0c',
  'black-forest-labs/flux-1.1-pro': 'black-forest-labs/flux-1.1-pro',
  // Add fallback models
  'flux-dev': 'black-forest-labs/flux-dev',
  
  // Video models (keeping existing ones that might work)
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
  
  // Check required environment variables
  if (!process.env.REPLICATE_API_TOKEN) {
    console.error("❌ Missing REPLICATE_API_TOKEN");
    return NextResponse.json({ error: 'Server misconfigured: Missing REPLICATE_API_TOKEN' }, { status: 500 });
  }
  
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("❌ Missing BLOB_READ_WRITE_TOKEN");
    return NextResponse.json({ error: 'Server misconfigured: Missing BLOB_READ_WRITE_TOKEN' }, { status: 500 });
  }
  
  // Check admin authentication
  const authResult = await verifyAdminRequest(request);
  if (!authResult.success) {
    console.log("⛔ Authentication failed");
    return NextResponse.json({ error: authResult.message }, { status: 403 });
  }  try {    const body = await request.json();    const { 
      mediaType, 
      modelIdentifier, 
      prompt, 
      negativePrompt,
      aspectRatio,
      seed,
      cameraMovements, 
      imageUrl,
      // Storage folder - defaults to article-images for backward compatibility
      folder,
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
    if (modelIdentifier === 'black-forest-labs/flux-1.1-pro' || modelIdentifier === 'black-forest-labs/flux-schnell') {
      // Flux models specific parameters
      if (aspect_ratio) requestBody.input.aspect_ratio = aspect_ratio;
      if (negativePrompt) requestBody.input.negative_prompt = negativePrompt;
    } else if (modelIdentifier === 'google/imagen-4') {
      // Google Imagen 4 specific parameters
      if (aspectRatio || aspect_ratio) requestBody.input.aspect_ratio = aspectRatio || aspect_ratio;
      if (safety_filter_level) requestBody.input.safety_filter_level = safety_filter_level;
      if (number_of_images) requestBody.input.number_of_images = number_of_images;
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
    }    if (attempts >= maxAttempts) {
      console.error('❌ Replicate prediction timed out');
      return NextResponse.json({ error: 'Generation timed out' }, { status: 504 });
    }
      // Return the appropriate output based on media type
    if (mediaType === 'image') {
      // Handle multiple images for models like Minimax Image 01
      if (Array.isArray(result.output)) {
        // Limit output to requested number of images (up to 9)
        const requestedCount = number_of_images ? Math.min(number_of_images, 9) : result.output.length;
        const limitedOutput = result.output.slice(0, requestedCount);
        
        // Upload to Vercel Blob storage
        const uploadedImages = [];
        for (let i = 0; i < limitedOutput.length; i++) {
          try {              const imageResponse = await fetch(limitedOutput[i]);
              if (imageResponse.ok) {
                const imageBuffer = await imageResponse.arrayBuffer();
                const contentType = imageResponse.headers.get('content-type') || 'image/png';
                const extension = contentType.split('/')[1] || 'png';
                const modelNameForFile = modelIdentifier.replace(/[\/\:]/g, '-');              
                const filename = `${modelNameForFile}-${Date.now()}-${i}.${extension}`;
                
                // Convert ArrayBuffer to Blob
                const blob = new Blob([imageBuffer], { type: contentType });
                const file = new File([blob], filename, { type: contentType });
                
                const uploadResult = await uploadMediaWithMetadata(file, {
                  filename: filename,
                  folder: 'article-images',
                  category: 'ai-generated-image',
                  altText: `AI generated image: ${prompt.substring(0, 50)}... | Generated with ${modelIdentifier}`,
                  title: `${modelNameForFile}-${Date.now()}-${i}`,
                });
                
                uploadedImages.push(uploadResult.url);
              } else {
                uploadedImages.push(limitedOutput[i]); // Fallback to original URL
              }
          } catch (uploadError) {
            console.warn(`Error uploading image ${i}:`, uploadError);
            uploadedImages.push(limitedOutput[i]); // Fallback to original URL
          }
        }
          console.log(`✅ Returning ${uploadedImages.length} images: ${uploadedImages}`);
        return NextResponse.json({ 
          success: true,
          url: uploadedImages[0], // Primary image for backward compatibility
          imageUrl: uploadedImages[0], // Primary image for backward compatibility
          imageUrls: uploadedImages,   // All images
          count: uploadedImages.length 
        });      } else {
        // Single image
        try {
          const imageResponse = await fetch(result.output);
          if (imageResponse.ok) {
            const imageBuffer = await imageResponse.arrayBuffer();
            const contentType = imageResponse.headers.get('content-type') || 'image/png';
            const extension = contentType.split('/')[1] || 'png';
            const modelNameForFile = modelIdentifier.replace(/[\/\:]/g, '-');
            const filename = `${modelNameForFile}-${Date.now()}.${extension}`;              
            
            // Convert ArrayBuffer to Blob then File
            const blob = new Blob([imageBuffer], { type: contentType });
            const file = new File([blob], filename, { type: contentType });
            
            const uploadResult = await uploadMediaWithMetadata(file, {
              filename: filename,
              folder: folder || 'article-images', // Default to article-images for backward compatibility
              category: 'ai-generated-image',
              altText: `AI generated image: ${prompt.substring(0, 50)}... | Generated with ${modelIdentifier}`,
              title: `${modelNameForFile}-${Date.now()}`,
            });
            
            console.log(`✅ Returning single image: ${uploadResult.url}`);
            return NextResponse.json({ 
              success: true,
              url: uploadResult.url,
              imageUrl: uploadResult.url,
              imageUrls: [uploadResult.url],
              count: 1
            });
          }
        } catch (uploadError) {
          console.warn('Error uploading image:', uploadError);
        }
        
        // Fallback to original URL if upload fails
        console.log(`✅ Returning single image (fallback): ${result.output}`);        
        return NextResponse.json({ 
          success: true,
          url: result.output,
          imageUrl: result.output,
          imageUrls: [result.output],
          count: 1
        });
      }
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

// Add HEAD handler for preflight requests
export async function HEAD() {
  console.log("📡 HEAD request received for generate-media");
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'POST, HEAD, OPTIONS',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Add OPTIONS handler for CORS preflight
export async function OPTIONS() {
  console.log("📡 OPTIONS request received for generate-media");
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'POST, HEAD, OPTIONS',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Add GET handler that returns method information
export async function GET() {
  console.log("📡 GET request received for generate-media");
  return NextResponse.json({
    message: 'Image generation API endpoint',
    methods: ['POST'],
    description: 'Use POST with image generation parameters to generate images'
  }, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}
