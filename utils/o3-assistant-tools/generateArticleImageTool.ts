import { tool } from 'ai';
import { z, ZodType } from 'zod';
import Replicate from 'replicate';
import { uploadToBlobServer } from '../blob-upload-server'; // Import server-side Vercel Blob upload function

// Define the best image generation models based on quality
const MODEL_GOOGLE_IMAGEN_4 = "google/imagen-4";
const MODEL_FLUX_1_1_PRO = "black-forest-labs/flux-1.1-pro";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export const GenerateArticleImageParameters = z.object({
  prompt: z.string().min(5).describe('A detailed prompt for the image generation model.'),
  aspectRatio: z.enum(['1:1', '9:16', '16:9', '3:4', '4:3']).default('16:9').optional()
    .describe('Desired aspect ratio for the generated image.'),  modelIdentifier: z.enum([MODEL_GOOGLE_IMAGEN_4, MODEL_FLUX_1_1_PRO]).default(MODEL_GOOGLE_IMAGEN_4)
    .describe('The Replicate model identifier. Google Imagen 4 (best quality) or Flux 1.1 Pro (excellent quality, fast).'),  negativePrompt: z.string().optional().describe('Optional negative prompt for the image generation.'),
  safetyFilterLevel: z.enum(['block_low_and_above', 'block_medium_and_above', 'block_only_high']).default('block_only_high').optional()
    .describe('Safety filter level for Google Imagen 4. block_low_and_above is strictest, block_only_high is most permissive.'),
});

interface ModelInput {
  prompt: string;
  aspect_ratio?: '1:1' | '9:16' | '16:9' | '3:4' | '4:3';
  safety_filter_level?: 'block_low_and_above' | 'block_medium_and_above' | 'block_only_high';
  // For SDXL compatibility
  width?: number;
  height?: number;
  negative_prompt?: string;
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
  switch (modelName) {
    case 'black-forest-labs/flux-1.1-pro':
      // Flux 1.1 Pro uses aspect ratio parameter
      modelInput.aspect_ratio = aspectRatio;
      break;
        case 'google/imagen-4':
      modelInput.aspect_ratio = aspectRatio;
      if (safetyFilterLevel) {
        modelInput.safety_filter_level = safetyFilterLevel;
      }
      break;
      
    default:
      console.warn(`Model ${modelIdentifier} not explicitly handled for custom params, using generic prompt approach.`);
      break;
  }  try {    const output = await replicate.run(
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
          replicateImageUrl = parsed.url;
        } else {
          throw new Error('No valid URL found in stream response');
        }      } catch {
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
    const filename = `img-${modelNameForFile}-${safePromptPart}-${Date.now()}.${fileExtension}`;    console.log(`Uploading image to Vercel Blob as ${filename}...`);
    const blobUploadResult = await uploadToBlobServer(imageBuffer, filename, contentType, {
      folder: 'images/article-images',
      // Removed prefix to store all article images in one folder
    });

    if (!blobUploadResult.success || !blobUploadResult.url) {
      console.error('Failed to upload image to Vercel Blob:', blobUploadResult.error);
      throw new Error(`Failed to upload image to Vercel Blob: ${blobUploadResult.error}`);
    }

    console.log('Image uploaded to Vercel Blob:', blobUploadResult.url);

    // Also save the image to the database for gallery system
    try {
      const { Client } = await import('pg');
      const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });
      
      await client.connect();
      
      const imageTitle = `${filename} - AI Generated Image`;
      const seoName = `fais-ai-generated-${Date.now()}-${safePromptPart}`;
      const altTag = `AI-generated image for: ${prompt.substring(0, 100)}`;
      
      // Get image dimensions based on aspect ratio
      let width = 1920, height = 1080; // Default 16:9
      switch (aspectRatio) {
        case '1:1': width = 1080; height = 1080; break;
        case '9:16': width = 1080; height = 1920; break;
        case '3:4': width = 810; height = 1080; break;
        case '4:3': width = 1440; height = 1080; break;
        default: width = 1920; height = 1080; break;
      }
      
      await client.query(`
        INSERT INTO images (
          url, title, "alt-tag", seo_name, width, height, format, folder, uploaded_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      `, [
        blobUploadResult.url,
        imageTitle,
        altTag,
        seoName,
        width,
        height,
        fileExtension,
        'article-images'
      ]);
      
      await client.end();
      console.log('✅ Image also saved to images table for gallery');
    } catch (dbError) {
      console.error('❌ Failed to save image to database:', dbError);
      // Continue without failing - image is still uploaded to blob storage
    }

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

export { generateArticleImageLogic, MODEL_GOOGLE_IMAGEN_4, MODEL_FLUX_1_1_PRO };
