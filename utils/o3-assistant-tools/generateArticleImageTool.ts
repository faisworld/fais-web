import { tool } from 'ai';
import { z, ZodType } from 'zod';
import Replicate from 'replicate';
import { uploadToBlob } from '../blob-upload'; // Import Vercel Blob upload function

// Define specific model identifiers with versions based on user-provided IDs
const MODEL_MINIMAX_IMAGE_01 = "minimax/image-01:w4agaakfhnrme0cnbhgtyfmstc";
const MODEL_GOOGLE_IMAGEN_3_FAST = "google/imagen-3-fast:swntzryxznrm80cmvc1aqbnqgg";
const MODEL_NVIDIA_SANA = "nvidia/sana:c6b5d2b7459910fec94432e9e1203c3cdce92d6db20f714f1355747990b52fa6";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN, // Corrected to use REPLICATE_API_TOKEN from .env.local
});

export const GenerateArticleImageParameters = z.object({
  prompt: z.string().min(5).describe('A detailed prompt for the image generation model.'),
  aspectRatio: z.enum(['1:1', '16:9', '4:3', '3:2', '9:16']).default('16:9').optional()
    .describe('Desired aspect ratio for the generated image.'),
  modelIdentifier: z.enum([MODEL_MINIMAX_IMAGE_01, MODEL_GOOGLE_IMAGEN_3_FAST, MODEL_NVIDIA_SANA]).default(MODEL_MINIMAX_IMAGE_01)
    .describe('The Replicate model identifier (owner/name:version).'),
  negativePrompt: z.string().optional().describe('Optional negative prompt for the image generation.'),
});

// Helper to round to nearest multiple of 64, required by some models like nvidia/sana
const roundTo64 = (n: number) => Math.round(n / 64) * 64;

interface ModelInput {
  prompt: string;
  aspect_ratio_str?: '1:1' | '16:9' | '4:3' | '3:2' | '9:16';
  aspect_ratio?: '1:1' | '16:9' | '4:3' | '3:2' | '9:16';
  width?: number;
  height?: number;
  negative_prompt?: string;
  // Add other potential model-specific parameters here if known
}

async function generateArticleImageLogic(
  prompt: string,
  aspectRatio: '1:1' | '16:9' | '4:3' | '3:2' | '9:16' = '16:9',
  modelIdentifier: string,
  negativePrompt?: string,
): Promise<{ imageUrl: string; imageAlt: string }> {
  console.log(`Generating image with Replicate model: ${modelIdentifier}, Prompt: \"${prompt}\", Aspect Ratio: ${aspectRatio}`);

  const modelInput: ModelInput = {
    prompt: prompt,
  };

  if (negativePrompt) {
    modelInput.negative_prompt = negativePrompt;
  }

  // Adapt input parameters based on the selected model
  const modelName = modelIdentifier.split(':')[0];

  switch (modelName) {
    case 'minimax/image-01':
      modelInput.aspect_ratio_str = aspectRatio;
      break;
    case 'google/imagen-3-fast':
      modelInput.aspect_ratio = aspectRatio;
      break;
    case 'nvidia/sana':
      const baseSize = 1024;
      let width: number, height: number;
      const [ratioW, ratioH] = aspectRatio.split(':').map(Number);

      if (ratioW >= ratioH) { // Landscape or square
        width = baseSize;
        height = baseSize * (ratioH / ratioW);
      } else { // Portrait
        height = baseSize;
        width = baseSize * (ratioW / ratioH);
      }
      modelInput.width = roundTo64(width);
      modelInput.height = roundTo64(height);
      break;
    default:
      console.warn(`Model ${modelIdentifier} not explicitly handled for custom params, using generic prompt approach.`);
      // For unhandled models, we can only pass the prompt and hope the model infers aspect ratio or uses a default.
      // The enum for modelIdentifier should prevent this case with the current setup.
      break;
  }

  try {
    const output = await replicate.run(
      modelIdentifier as `${string}/${string}:${string}`,
      { input: modelInput }
    ) as (string[] | string);

    let replicateImageUrl: string;
    if (Array.isArray(output) && output.length > 0) {
      replicateImageUrl = output[0];
    } else if (typeof output === 'string') {
      replicateImageUrl = output;
    } else {
      console.error('Replicate model did not return a valid image URL.', output);
      throw new Error('Failed to generate image: Invalid response from Replicate.');
    }

    console.log('Generated image URL from Replicate:', replicateImageUrl);

    console.log('Downloading image from Replicate...');
    const imageResponse = await fetch(replicateImageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image from Replicate: ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/png';
    const modelNameForFile = modelName.replace('/', '-');
    const safePromptPart = prompt.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '-');
    const fileExtension = contentType.split('/')[1] || 'png';
    const filename = `img-${modelNameForFile}-${safePromptPart}-${Date.now()}.${fileExtension}`;

    const imageFile = new File([imageBuffer], filename, { type: contentType });

    console.log(`Uploading image to Vercel Blob as ${filename}...`);
    const blobUploadResult = await uploadToBlob(imageFile, {
      folder: 'article-images',
      prefix: modelNameForFile + '/',
    });

    if (!blobUploadResult.success || !blobUploadResult.url) {
      console.error('Failed to upload image to Vercel Blob:', blobUploadResult.error);
      throw new Error(`Failed to upload image to Vercel Blob: ${blobUploadResult.error}`);
    }

    console.log('Image uploaded to Vercel Blob:', blobUploadResult.url);

    return {
      imageUrl: blobUploadResult.url,
      imageAlt: `AI-generated image for: ${prompt.substring(0, 100)} (Model: ${modelName})`,
    };
  } catch (error) {
    console.error('Error in generateArticleImageLogic:', error);
    const mockImageUrl = "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/blog-placeholder-ai-generated-LSpH7hJk2vXbDcYqRzWnPfG3tS8aFm.png";
    return {
      imageUrl: mockImageUrl,
      imageAlt: `Fallback image due to error generating: ${prompt.substring(0, 50)}`,
    };
  }
}

export const generateArticleImageTool = tool({
  description: 'Generates an image using a specified Replicate model, uploads it to Vercel Blob, and returns the Blob URL and alt text.',
  parameters: GenerateArticleImageParameters as ZodType<z.infer<typeof GenerateArticleImageParameters>>,
  execute: async ({ prompt, aspectRatio, modelIdentifier, negativePrompt }: z.infer<typeof GenerateArticleImageParameters>) =>
    generateArticleImageLogic(prompt, aspectRatio, modelIdentifier, negativePrompt),
});
