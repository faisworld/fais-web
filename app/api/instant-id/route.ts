import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { checkAdminAuth } from "@/utils/auth-compat";
import { uploadMediaWithMetadata } from '@/utils/media-database-sync';

export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await checkAdminAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { image, prompt } = await req.json();
    
    if (!image || !prompt) {
      return NextResponse.json({ error: 'Image and prompt are required' }, { status: 400 });
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN!,
    });

    // Generate the image using Replicate
    const output = await replicate.run(
      "zsxkib/instant-id:2e4785a4d80dadf580077b2244c8d7c05d8e3faac04a04c02d8e099dd2876789",
      {
        input: {
          image,
          width: 640,
          height: 640,
          prompt,
          sdxl_weights: "protovision-xl-high-fidel",
          guidance_scale: 5,
          negative_prompt: "(lowres, low quality, worst quality:1.2), (text:1.2), watermark, painting, drawing, illustration, glitch, deformed, mutated, cross-eyed, ugly, disfigured",
          ip_adapter_scale: 0.8,
          num_inference_steps: 30,
          disable_safety_checker: false,
          controlnet_conditioning_scale: 0.8,
        }
      }
    );

    // Get the generated image URL
    const imageUrl = Array.isArray(output) ? output[0] : output;
    
    if (!imageUrl) {
      throw new Error('No image was generated');
    }

    // Download the generated image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error('Failed to download generated image');
    }
    
    const arrayBuffer = await response.arrayBuffer();
    
    // Create a File object from the downloaded image
    const generatedFile = new File(
      [arrayBuffer], 
      `instantid-${Date.now()}.webp`, 
      { type: 'image/webp' }
    );    // Upload to blob storage and save to database using our standardized function
    const result = await uploadMediaWithMetadata(generatedFile, {
      filename: generatedFile.name,
      folder: 'instant-id',
      category: 'image',
      altText: `InstantID generated image: ${prompt}`,
      title: `InstantID: ${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}`,
    });

    return NextResponse.json({ 
      success: true,
      url: result.url,
      databaseId: result.databaseId,
      prompt,
      timestamp: new Date().toISOString()
    });

  } catch (error: unknown) {
    console.error('❌ InstantID generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
