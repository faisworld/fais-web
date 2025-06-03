import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadToBlobServer } from './utils/blob-upload-server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function uploadReplicateImageToBlob() {
  try {
    // The current Replicate URL that needs to be moved to blob storage
    const replicateUrl = "https://replicate.delivery/xezq/J831bWVrMIaCC9FOzjNw9PhG4LsTDkz6Dq5yGJJxmWk2SxMF/out-0.png";
    
    console.log("Downloading image from Replicate...");
    const response = await fetch(replicateUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }
    
    const imageBuffer = await response.arrayBuffer();
    console.log(`Downloaded image: ${imageBuffer.byteLength} bytes`);
    
    // Generate a filename following the same pattern as other blog images
    const filename = `Professional--high-quality-b-latest-advancements-llm.png`;
    
    console.log("Uploading to Vercel blob storage...");
    const blobUploadResult = await uploadToBlobServer(imageBuffer, filename, 'image/png', {
      folder: 'article-images',
      prefix: 'stability-ai-sdxl/',
    });
    
    if (!blobUploadResult.success || !blobUploadResult.url) {
      throw new Error(`Failed to upload to blob storage: ${blobUploadResult.error}`);
    }
    
    console.log("✅ Image uploaded successfully!");
    console.log("New blob URL:", blobUploadResult.url);
    
    // Now update the blog data files with the new URL    
    // Update blog-data.ts
    const blogDataPath = path.join(__dirname, 'app', 'blog', 'blog-data.ts');
    let blogData = fs.readFileSync(blogDataPath, 'utf8');
    blogData = blogData.replace(replicateUrl, blobUploadResult.url);
    fs.writeFileSync(blogDataPath, blogData);
    console.log("✅ Updated blog-data.ts");
    
    // Update blog-image-urls.js
    const blogImageUrlsPath = path.join(__dirname, 'blog-image-urls.js');
    let blogImageUrls = fs.readFileSync(blogImageUrlsPath, 'utf8');
    blogImageUrls = blogImageUrls.replace(replicateUrl, blobUploadResult.url);
    fs.writeFileSync(blogImageUrlsPath, blogImageUrls);
    console.log("✅ Updated blog-image-urls.js");
    
    console.log("\n🎉 All done! The image has been properly uploaded to Vercel blob storage and all references have been updated.");
    console.log("Final blob URL:", blobUploadResult.url);
    
  } catch (error) {
    console.error("❌ Error uploading image to blob storage:", error);
    process.exit(1);
  }
}

// Run the upload
uploadReplicateImageToBlob();
