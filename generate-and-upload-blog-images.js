// Generate and upload all missing blog images to Vercel Blob storage

import fetch from 'node-fetch';
import FormData from 'form-data';

const blogPostsToGenerate = [
  {
    id: "swtx4g9l",
    slug: "decentralized-finance-defi-latest-developments-and-innovations",
    title: "Decentralized Finance (DeFi): Latest Developments and Innovations",
    prompt: "Professional, high-quality blog featured image about DeFi and decentralized finance. Modern design showing cryptocurrency symbols, blockchain networks, financial charts, DeFi protocols. Clean corporate style with blue and purple gradients. Digital finance concept. No text overlays. 16:9 aspect ratio. Technology and finance theme.",
    category: "blockchain"
  },
  {
    id: "bia54hp2", 
    slug: "the-convergence-of-ai-and-blockchain-unlocking-new-opportunities",
    title: "The Convergence of AI and Blockchain: Unlocking New Opportunities",
    prompt: "Professional, high-quality blog featured image about AI and blockchain convergence. Modern design showing neural networks merging with blockchain connections, digital brain, cryptocurrency elements, futuristic technology. Clean corporate style with vibrant blue and purple colors. No text overlays. 16:9 aspect ratio.",
    category: "ai"
  },
  {
    id: "dzwpccn5",
    slug: "how-blockchain-is-revolutionizing-supply-chain-management", 
    title: "How Blockchain Is Revolutionizing Supply Chain Management",
    prompt: "Professional, high-quality blog featured image about blockchain supply chain management. Modern design showing global supply chain network, shipping containers, blockchain connections, logistics flow, transparency concept. Clean corporate style with blue and green colors. No text overlays. 16:9 aspect ratio.",
    category: "blockchain"
  },
  {
    id: "4ttgyyd3",
    slug: "recent-advancements-in-ai-and-machine-learning",
    title: "Recent Advancements in AI and Machine Learning",
    prompt: "Professional, high-quality blog featured image about AI and machine learning advancements. Modern design showing neural networks, deep learning visualization, AI algorithms, brain-computer interfaces, data flow. Clean corporate style with vibrant blue and purple gradients. No text overlays. 16:9 aspect ratio.",
    category: "ai"
  },
  {
    id: "j10k9ag6",
    slug: "the-future-of-quantum-computing-in-ai",
    title: "The Future of Quantum Computing in AI", 
    prompt: "Professional, high-quality blog featured image about quantum computing and AI. Modern design showing quantum circuits, qubits, quantum entanglement visualization, AI neural networks, futuristic computing. Clean corporate style with electric blue and silver colors. No text overlays. 16:9 aspect ratio.",
    category: "ai"
  }
];

async function generateImageForBlogPost(blogPost) {
  try {
    console.log(`🎨 Generating image for: ${blogPost.title}`);
    
    // Generate image using the API
    const response = await fetch('http://localhost:3002/api/admin/ai-tools/generate-media', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mediaType: "image",
        modelIdentifier: "stability-ai/sdxl",
        prompt: blogPost.prompt,
        aspectRatio: "16:9"
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const result = await response.json();
    
    if (!result.imageUrl) {
      throw new Error('No image URL returned from API');
    }
    
    console.log(`✅ Generated image: ${result.imageUrl}`);
    
    // Download the generated image
    console.log(`📥 Downloading image...`);
    const imageResponse = await fetch(result.imageUrl);
    
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.statusText}`);
    }
    
    const imageBuffer = await imageResponse.arrayBuffer();
    console.log(`Downloaded image: ${imageBuffer.byteLength} bytes`);
      // Generate a consistent filename
    const safeTitle = blogPost.title.substring(0, 50).replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const filename = `${safeTitle}-${Date.now()}.png`;
    
    // Upload to Vercel Blob storage using the API endpoint
    console.log(`☁️ Uploading to Vercel Blob storage as ${filename}...`);
    
    const formData = new FormData();
    formData.append('file', Buffer.from(imageBuffer), {
      filename: filename,
      contentType: 'image/png'
    });
    formData.append('title', blogPost.title);
    formData.append('folder', 'article-images/stability-ai-sdxl');
    
    const uploadResponse = await fetch('http://localhost:3002/api/admin/gallery/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'X-Forwarded-For': '127.0.0.1'
      }
    });
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText} - ${errorText}`);
    }
    
    const uploadResult = await uploadResponse.json();
    
    if (!uploadResult.success || !uploadResult.url) {
      throw new Error(`Upload failed: ${uploadResult.error || 'Unknown error'}`);
    }    
    console.log(`✅ Image uploaded successfully: ${uploadResult.url}`);
    
    return {
      ...blogPost,
      replicateUrl: result.imageUrl,
      blobUrl: uploadResult.url,
      filename: filename
    };
    
  } catch (error) {
    console.error(`❌ Error generating image for ${blogPost.title}:`, error.message);
    return null;
  }
}

async function updateBlogData(generatedImages) {
  try {
    console.log('\n📝 Updating blog-data.ts with new blob URLs...');
    
    // Read current blog-data.ts
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    const blogDataPath = path.join(__dirname, 'app', 'blog', 'blog-data.ts');
    let blogDataContent = fs.readFileSync(blogDataPath, 'utf8');
      // Create a mapping of old URLs to new URLs
    const urlMapping = {};
    generatedImages.forEach(img => {
      if (img && img.blobUrl) {
        urlMapping[img.id] = img.blobUrl;
      }
    });
    
    // Replace URLs by ID lookup
    generatedImages.forEach(img => {
      if (img && img.blobUrl) {
        // Find the blog post by ID and update its coverImage
        const idPattern = new RegExp(`id: "${img.id}"([\\s\\S]*?)coverImage: "[^"]+"`);
        const replacement = `id: "${img.id}"$1coverImage: "${img.blobUrl}"`;
        blogDataContent = blogDataContent.replace(idPattern, replacement);
      }
    });
    
    fs.writeFileSync(blogDataPath, blogDataContent);
    console.log('✅ Updated blog-data.ts');
    
  } catch (error) {
    console.error('❌ Error updating blog-data.ts:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting blog image generation and upload process...\n');
  
  const generatedImages = [];
  
  // Generate images one by one to avoid API rate limits
  for (const blogPost of blogPostsToGenerate) {
    const result = await generateImageForBlogPost(blogPost);
    if (result) {
      generatedImages.push(result);
    }
    
    // Add a small delay between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log(`\n📊 Generation Summary: ${generatedImages.length}/${blogPostsToGenerate.length} images generated successfully`);
  
  if (generatedImages.length > 0) {
    await updateBlogData(generatedImages);
    
    console.log('\n🎉 Blog image generation and upload complete!');
    console.log('\n📋 Generated Images:');
    console.log('=====================================');
    generatedImages.forEach(img => {
      console.log(`✅ ${img.title}`);
      console.log(`   Blob URL: ${img.blobUrl}`);
      console.log('');
    });
    
    console.log('\n🔄 Next steps:');
    console.log('1. Restart your development server');
    console.log('2. Check the blog page to verify images are loading');
    console.log('3. Update media-utils.ts if needed for friendly names');
  } else {
    console.log('\n❌ No images were generated successfully.');
  }
}

// Run the main function
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
