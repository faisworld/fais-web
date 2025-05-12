import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  generateArticleImageTool,
  GenerateArticleImageParameters
} from '@/utils/o3-assistant-tools/generateArticleImageTool';
import {
  generateArticleVideoTool,
  videoParamsSchema
} from '@/utils/o3-assistant-tools/generateArticleVideoTool';

// Define a schema for the incoming request body from MediaGenerationWidget.tsx
const apiRequestBodySchema = z.object({
  mediaType: z.enum(['image', 'video']),
  modelIdentifier: z.string().min(1, "Model identifier cannot be empty"), // Full model ID with version
  prompt: z.string().min(1, "Prompt cannot be empty"),
  negativePrompt: z.string().optional(),
  aspectRatio: z.string().optional(), // For image, e.g., "16:9"
  duration: z.number().positive().optional(), // For video (in seconds), sent by widget
  cameraMovements: z.array(z.string()).max(3).optional() // For minimax/video-01-director
    .describe("Array of up to 3 camera movement strings. E.g. ['Pan left', 'Zoom in']"),
  imageUrl: z.string().url().optional() // For minimax/video-01 (image-to-video)
    .describe("URL of an image to use as a reference for image-to-video generation."),
  // fps: z.number().int().positive().optional(), // Widget doesn't send this yet, tool has defaults
}).catchall(z.any());

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedRequest = apiRequestBodySchema.safeParse(body);

    if (!parsedRequest.success) {
      console.error("Invalid request body:", parsedRequest.error.format());
      return NextResponse.json({ error: 'Invalid request body', details: parsedRequest.error.format() }, { status: 400 });
    }

    const {
      mediaType,
      modelIdentifier,
      prompt,
      negativePrompt,
      aspectRatio, 
      duration,    
      cameraMovements, // New field from widget
      imageUrl,        // New field from widget
      ...otherParams 
    } = parsedRequest.data;

    if (!process.env.REPLICATE_API_TOKEN) {
        console.error('REPLICATE_API_TOKEN is not configured.');
        return NextResponse.json({ error: 'Replicate API token is not configured.' }, { status: 500 });
    }    if (mediaType === 'image') {
      const validatedImageParams = GenerateArticleImageParameters.safeParse({
        prompt,
        aspectRatio, // Use camelCase key since the ImageTool expects camelCase
        modelIdentifier, // Use camelCase key
        negativePrompt,
        ...otherParams // Passes any other params in camelCase
      });      if (!validatedImageParams.success) {
        console.error("Invalid image params:", validatedImageParams.error.format());
        return NextResponse.json({ error: 'Invalid parameters for image generation tool', details: validatedImageParams.error.format() }, { status: 400 });
      }      const result = await generateArticleImageTool.execute(validatedImageParams.data, {
        toolCallId: "image-generation-" + Date.now(),
        messages: [] // No messages needed for direct API call
      });
      return NextResponse.json(result);

    } else if (mediaType === 'video') {
      const videoToolInput = {
        model_identifier: modelIdentifier,
        prompt,
        negative_prompt: negativePrompt,
        duration_seconds: duration, 
        aspect_ratio: aspectRatio, // Pass aspectRatio to video tool as well, if provided
        camera_movements: cameraMovements, // Pass to tool (expects snake_case)
        image_url: imageUrl,             // Pass to tool (expects snake_case)
        ...otherParams // Passes fps if it were in otherParams and schema allows
      };

      const validatedVideoParams = videoParamsSchema.safeParse(videoToolInput);      if (!validatedVideoParams.success) {
        console.error("Invalid video params:", validatedVideoParams.error.format());
        return NextResponse.json({ error: 'Invalid parameters for video generation tool', details: validatedVideoParams.error.format() }, { status: 400 });
      }      const result = await generateArticleVideoTool.execute(validatedVideoParams.data, {
        toolCallId: "video-generation-" + Date.now(),
        messages: [] // No messages needed for direct API call
      });
      return NextResponse.json(result);
    } else {
      return NextResponse.json({ error: 'Invalid media type specified. Must be "image" or "video".' }, { status: 400 });
    }

  } catch (error: unknown) {
    console.error('Error in /api/generate-media:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    // Consider more specific error handling based on error source (Replicate, Blob, etc.)
    return NextResponse.json({ error: 'Internal Server Error', message: errorMessage }, { status: 500 });
  }
}
