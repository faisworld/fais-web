// filepath: c:\\Users\\solar\\Projects\\fais-web\\utils\\o3-assistant-tools\\generateArticleVideoTool.ts
import { tool } from 'ai';
import { z, ZodType } from 'zod';
import Replicate from 'replicate';
import { uploadToBlob } from '../blob-upload';

// Define specific model identifiers with versions
const MODEL_GOOGLE_VEO_2 = "google/veo-2:tjqhsk4eddrma0cn7w38c91tq8";
const MODEL_MINIMAX_VIDEO_01_DIRECTOR = "minimax/video-01-director:654gq25cfxrmc0cmyjev7cz4rg";
const MODEL_MINIMAX_VIDEO_01 = "minimax/video-01:15eyanar9xrg80ckd3ytdz0hhr";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Renamed from GenerateArticleVideoParameters and updated to snake_case
export const videoParamsSchema = z.object({
  model_identifier: z.enum([MODEL_GOOGLE_VEO_2, MODEL_MINIMAX_VIDEO_01_DIRECTOR, MODEL_MINIMAX_VIDEO_01])
    .describe('The Replicate video model identifier (owner/name:version).'),
  prompt: z.string().min(1).describe('A detailed prompt for the video generation model.'),
  negative_prompt: z.string().optional().describe('Optional negative prompt for the video generation.'),
  duration_seconds: z.number().positive().optional().describe('Optional duration of the video in seconds. Model-specific.'),
  fps: z.number().int().positive().optional().describe('Optional frames per second for the video. Model-specific.'),
  aspect_ratio: z.string().regex(/^\d+:\d+$/).optional().describe('Optional aspect ratio for the video (e.g., "16:9"). Model-specific.'),
  camera_movements: z.array(z.string()).max(3).optional()
    .describe('For minimax/video-01-director: An array of up to 3 camera movement strings (e.g., ["Pan left", "Zoom in"]). These will be prepended to the prompt.'),
  image_url: z.string().url().optional()
    .describe('For minimax/video-01: URL of an image to use as a reference for image-to-video generation.'),
  // New model-specific parameters
  seed: z.number().int().optional().describe('Optional seed for reproducible results (Google Veo 2).'),
  prompt_optimizer: z.boolean().optional().describe('Optional prompt optimizer for Minimax models.'),
  first_frame_image: z.string().url().optional().describe('Optional URL of image to use as first frame.'),
  subject_reference: z.string().url().optional().describe('Optional subject reference image URL (Minimax Video 01).'),
});

interface VideoModelInput {
  prompt: string;
  negative_prompt?: string;
  duration?: number; // Replicate models usually take 'duration' in seconds
  fps?: number;
  aspect_ratio?: string;
  image_url?: string; // For minimax/video-01
  // New model-specific parameters
  seed?: number;
  prompt_optimizer?: boolean;
  first_frame_image?: string;
  subject_reference?: string;
  // Allow other properties that Replicate might accept for specific models.
  // These are validated by Replicate itself.
  [key: string]: unknown; 
}

async function generateArticleVideoLogic(
  params: z.infer<typeof videoParamsSchema>
): Promise<{ videoUrl: string; videoAlt: string; thumbnailUrl?: string }> {  const {
    model_identifier,
    prompt,
    negative_prompt,
    duration_seconds,
    fps,
    aspect_ratio,
    camera_movements,
    image_url,
    seed,
    prompt_optimizer,
    first_frame_image,
    subject_reference
  } = params;

  let finalPrompt = prompt;
  // For minimax/video-01-director, prepend camera movements to the prompt
  if (model_identifier === MODEL_MINIMAX_VIDEO_01_DIRECTOR && camera_movements && camera_movements.length > 0) {
    const movementsString = `[${camera_movements.join(', ')}]`;
    finalPrompt = `${movementsString} ${prompt}`;
  }
  
  console.log(`Generating video with Replicate model: ${model_identifier}, Prompt: \"${finalPrompt}\"...`);

  const modelInput: VideoModelInput = {
    prompt: finalPrompt,
  };
  if (duration_seconds) modelInput.duration = duration_seconds;
  if (fps) modelInput.fps = fps;
  if (negative_prompt) modelInput.negative_prompt = negative_prompt;
  if (aspect_ratio) modelInput.aspect_ratio = aspect_ratio; // Use from params if provided

  // Add common video-specific parameters
  if (first_frame_image) modelInput.first_frame_image = first_frame_image;

  const modelName = model_identifier.split(':')[0];
  // Model-specific input adaptations & defaults if not provided in params
  switch (modelName) {
    case 'google/veo-2':
      if (!modelInput.aspect_ratio) modelInput.aspect_ratio = "16:9"; // Default if not set
      if (seed) modelInput.seed = seed; // Google Veo 2 supports seed
      // Add any other specific defaults or transformations for Veo-2
      break;
    case 'minimax/video-01-director':
      if (!modelInput.aspect_ratio) modelInput.aspect_ratio = "16:9";
      if (!modelInput.fps) modelInput.fps = 25;
      if (prompt_optimizer !== undefined) modelInput.prompt_optimizer = prompt_optimizer;
      // if (!modelInput.duration) modelInput.duration = 6; // Default duration if not provided by user
      break;
    case 'minimax/video-01':
      if (image_url) { // image_url is specific to this model's capabilities
        modelInput.image_url = image_url;
      }
      if (subject_reference) modelInput.subject_reference = subject_reference;
      if (prompt_optimizer !== undefined) modelInput.prompt_optimizer = prompt_optimizer;
      if (!modelInput.aspect_ratio) modelInput.aspect_ratio = "16:9";
      if (!modelInput.fps) modelInput.fps = 25;
      // if (!modelInput.duration) modelInput.duration = 6; // Default duration if not provided by user
      break;
    default:
      console.warn(`Model ${model_identifier} not explicitly handled for custom video params. Applying general defaults.`);
      if (!modelInput.aspect_ratio) modelInput.aspect_ratio = "16:9"; // General default
      break;
  }

  try {
    const output = await replicate.run(
      model_identifier as `${string}/${string}:${string}`,
      { input: modelInput }
    ) as (string[] | string); 

    let replicateVideoUrl: string;
    if (Array.isArray(output) && output.length > 0) {
      replicateVideoUrl = output[0]; 
    } else if (typeof output === 'string') {
      replicateVideoUrl = output;
    } else {
      console.error('Replicate video model did not return a valid URL.', output);
      throw new Error('Failed to generate video: Invalid response from Replicate.');
    }

    console.log('Generated video URL from Replicate:', replicateVideoUrl);

    console.log('Downloading video from Replicate...');
    const videoResponse = await fetch(replicateVideoUrl);
    if (!videoResponse.ok) {
      throw new Error(`Failed to download video from Replicate: ${videoResponse.statusText}`);
    }

    const videoBuffer = await videoResponse.arrayBuffer();
    const contentType = videoResponse.headers.get('content-type') || 'video/mp4';
    const modelNameForFile = modelName.replace('/', '-');
    const safePromptPart = finalPrompt.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '-');
    const fileExtension = contentType.split('/')[1] || 'mp4';
    const filename = `vid-${modelNameForFile}-${safePromptPart}-${Date.now()}.${fileExtension}`;

    const videoFile = new File([videoBuffer], filename, { type: contentType });

    console.log(`Uploading video to Vercel Blob as ${filename}...`);
    const blobUploadResult = await uploadToBlob(videoFile, {
      folder: 'article-videos', 
      prefix: modelNameForFile + '/', 
    });

    if (!blobUploadResult.success || !blobUploadResult.url) {
      console.error('Failed to upload video to Vercel Blob:', blobUploadResult.error);
      throw new Error(`Failed to upload video to Vercel Blob: ${blobUploadResult.error}`);
    }

    console.log('Video uploaded to Vercel Blob:', blobUploadResult.url);

    // TODO: Implement thumbnail generation.
    // Some Replicate models might return a thumbnail, or a separate step might be needed.

    return {
      videoUrl: blobUploadResult.url,
      videoAlt: `AI-generated video for: ${finalPrompt.substring(0, 100)} (Model: ${modelName})`,
      // thumbnailUrl: "optional_thumbnail_url_if_generated"
    };
  } catch (error) {
    console.error('Error in generateArticleVideoLogic:', error);
    throw new Error(`Video generation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export const generateArticleVideoTool = tool({
  description: 'Generates a video using a specified Replicate model, uploads it to Vercel Blob, and returns the Blob URL and alt text. Supports model-specific parameters like camera movements and image URLs.',
  parameters: videoParamsSchema as ZodType<z.infer<typeof videoParamsSchema>>,
  execute: async (params: z.infer<typeof videoParamsSchema>) => generateArticleVideoLogic(params),
});
