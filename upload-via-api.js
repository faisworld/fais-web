import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import FormData from 'form-data';

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
    
    const imageBuffer = await response.buffer();
    console.log(`Downloaded image: ${imageBuffer.byteLength} bytes`);
    
    // Prepare FormData for upload
    const formData = new FormData();
    formData.append('file', imageBuffer, {
      filename: 'latest-advancements-llm.png',
      contentType: 'image/png'
    });
    formData.append('title', 'Latest Advancements in Large Language Models');
    formData.append('folder', 'article-images/stability-ai-sdxl');
    
    console.log("Uploading to Vercel blob storage via API...");
    
    // Use the existing upload API endpoint
    const uploadResponse = await fetch('http://localhost:3001/api/admin/gallery/upload', {
      method: 'POST',
      body: formData,
      headers: {
        // Include any necessary headers for admin auth if needed
        'X-Forwarded-For': '127.0.0.1'
      }
    });
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText} - ${errorText}`);
    }
    
    const uploadResult = await uploadResponse.json();
    console.log("✅ Image uploaded successfully!");
    console.log("New blob URL:", uploadResult.url);
    
    // Now update the blog data files with the new URL
    const blogDataPath = path.join(__dirname, 'app', 'blog', 'blog-data.ts');
    let blogData = fs.readFileSync(blogDataPath, 'utf8');
    blogData = blogData.replace(replicateUrl, uploadResult.url);
    fs.writeFileSync(blogDataPath, blogData);
    console.log("✅ Updated blog-data.ts");
    
    // Update blog-image-urls.js
    const blogImageUrlsPath = path.join(__dirname, 'blog-image-urls.js');
    let blogImageUrls = fs.readFileSync(blogImageUrlsPath, 'utf8');
    blogImageUrls = blogImageUrls.replace(replicateUrl, uploadResult.url);
    fs.writeFileSync(blogImageUrlsPath, blogImageUrls);
    console.log("✅ Updated blog-image-urls.js");
    
    console.log("\n🎉 All done! The image has been properly uploaded to Vercel blob storage and all references have been updated.");
    console.log("Final blob URL:", uploadResult.url);
    
  } catch (error) {
    console.error("❌ Error uploading image to blob storage:", error);
    process.exit(1);
  }
}

// Run the upload
uploadReplicateImageToBlob();
