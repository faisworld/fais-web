import { tool } from 'ai';
import { z, ZodType } from 'zod';
import Replicate from 'replicate';
import { uploadToBlobServer } from '../blob-upload-server'; // Import server-side Vercel Blob upload function

// Define the premium image generation models (Google-focused for best quality)
const MODEL_IMAGEN_4 = "google/imagen-4";
const MODEL_IMAGEN_3 = "google/imagen-3"; 
const MODEL_RECRAFT_V3 = "recraft-ai/recraft-v3";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export const GenerateArticleImageParameters = z.object({
  prompt: z.string().min(5).describe('A detailed prompt for the image generation model.'),
  aspectRatio: z.enum(['1:1', '9:16', '16:9', '3:4', '4:3']).default('16:9').optional()
    .describe('Desired aspect ratio for the generated image.'),  modelIdentifier: z.enum([MODEL_IMAGEN_4, MODEL_IMAGEN_3, MODEL_RECRAFT_V3]).default(MODEL_IMAGEN_4)
    .describe('The Replicate model identifier. Google Imagen 4 (latest), Imagen 3 (reliable), or Recraft V3 (artistic).'),
  negativePrompt: z.string().optional().describe('Optional negative prompt for the image generation.'),  safetyFilterLevel: z.enum(['block_low_and_above', 'block_medium_and_above', 'block_only_high']).default('block_only_high').optional()
    .describe('Safety filter level for Google Imagen models. block_low_and_above is strictest, block_only_high is most permissive.'),
});

interface ModelInput {
  prompt: string;
  aspect_ratio?: '1:1' | '9:16' | '16:9' | '3:4' | '4:3';
  output_format?: 'jpg' | 'png';
  output_quality?: number;
  size?: string;
  style?: string;
  negative_prompt?: string;
  safety_filter_level?: 'block_low_and_above' | 'block_medium_and_above' | 'block_only_high';
  // For SDXL compatibility
  width?: number;
  height?: number;
  // Add other potential model-specific parameters here if known
}

async function generateArticleImageLogic(
  prompt: string,
  aspectRatio: '1:1' | '9:16' | '16:9' | '3:4' | '4:3' = '16:9',
  modelIdentifier: string,
  negativePrompt?: string,
  safetyFilterLevel?: 'block_low_and_above' | 'block_medium_and_above' | 'block_only_high',
): Promise<{ imageUrl: string; imageAlt: string }> {
  console.log(`Generating image with Replicate model: ${modelIdentifier}, Prompt: \"${prompt}\", Aspect Ratio: ${aspectRatio}, Safety Filter: ${safetyFilterLevel || 'default'}`);

  const modelInput: ModelInput = {
    prompt: prompt,
  };

  if (negativePrompt) {
    modelInput.negative_prompt = negativePrompt;
  }  // Adapt input parameters based on the selected model
  const modelName = modelIdentifier.split(':')[0];

  if (safetyFilterLevel) {
    modelInput.safety_filter_level = safetyFilterLevel;
  }

  switch (modelName) {
    case 'google/imagen-3':
    case 'google/imagen-4':
      // Google Imagen models use aspect_ratio and safety filters
      modelInput.aspect_ratio = aspectRatio;
      modelInput.output_format = 'jpg';
      modelInput.output_quality = 95;
      if (!modelInput.safety_filter_level) {
        modelInput.safety_filter_level = 'block_only_high';
      }
      break;
      
    case 'stability-ai/stable-diffusion-3':
      // Stability models use aspect_ratio
      modelInput.aspect_ratio = aspectRatio;
      modelInput.output_format = 'jpg';
      break;
      
    case 'recraft-ai/recraft-v3':
      // Recraft uses size parameter
      const sizeMap = {
        '1:1': '1024x1024',
        '16:9': '1344x768',
        '9:16': '768x1344',
        '3:4': '768x1024',
        '4:3': '1024x768'
      };
      modelInput.size = sizeMap[aspectRatio];
      modelInput.style = 'realistic_image';
      break;
      
    default:
      console.warn(`Model ${modelIdentifier} not explicitly handled for custom params, using generic prompt approach.`);
      break;
  }try {    const output = await replicate.run(
      modelIdentifier as `${string}/${string}` | `${string}/${string}:${string}`,
      { input: modelInput }
    );

    let replicateImageUrl: string;
    if (Array.isArray(output) && output.length > 0) {
      replicateImageUrl = output[0];
    } else if (typeof output === 'string') {
      replicateImageUrl = output;
    } else if (output && typeof output === 'object' && 'getReader' in output) {
      // Handle ReadableStream response - convert to text and extract URL
      const reader = (output as ReadableStream).getReader();
      const decoder = new TextDecoder();
      let result = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
      }
      
      // Try to parse as JSON first, then as plain URL
      try {
        const parsed = JSON.parse(result);
        if (Array.isArray(parsed) && parsed.length > 0) {
          replicateImageUrl = parsed[0];
        } else if (typeof parsed === 'string') {
          replicateImageUrl = parsed;
        } else if (parsed.url) {
          replicateImageUrl = parsed.url;        } else {
          throw new Error('No valid URL found in stream response');
        }
      } catch {
        // If not JSON, treat as plain URL
        replicateImageUrl = result.trim();
      }
    } else {
      console.error('Replicate model did not return a valid image URL.', output);
      throw new Error('Failed to generate image: Invalid response from Replicate.');
    }

    console.log('Generated image URL from Replicate:', replicateImageUrl);

    console.log('Downloading image from Replicate...');
    const imageResponse = await fetch(replicateImageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image from Replicate: ${imageResponse.statusText}`);
    }    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/png';
    const modelNameForFile = modelName.replace('/', '-');
    const safePromptPart = prompt.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '-');
    const fileExtension = contentType.split('/')[1] || 'png';
    const filename = `img-${modelNameForFile}-${safePromptPart}-${Date.now()}.${fileExtension}`;

    console.log(`Uploading image to Vercel Blob as ${filename}...`);
    const blobUploadResult = await uploadToBlobServer(imageBuffer, filename, contentType, {
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
  execute: async ({ prompt, aspectRatio, modelIdentifier, negativePrompt, safetyFilterLevel }: z.infer<typeof GenerateArticleImageParameters>) =>
    generateArticleImageLogic(prompt, aspectRatio, modelIdentifier, negativePrompt, safetyFilterLevel),
});
