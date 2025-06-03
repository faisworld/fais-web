#!/usr/bin/env node

// Generate image for the missing blog article that still uses Unsplash URL

const missingBlogImage = {
  slug: "latest-advancements-in-large-language-models",
  topic: "Large Language Models LLM AI",
  prompt: "Professional, high-quality blog featured image about large language models and AI advancements. Modern, clean, visually appealing design showing neural networks, AI language processing, brain-computer interfaces, futuristic technology. Corporate style, professional photography aesthetic. Bright, vibrant colors with blue and purple accents. No text overlays. Suitable for a technology blog header."
};

async function generateImageForMissingArticle() {
  try {
    console.log(`🎨 Generating image for: ${missingBlogImage.topic}`);
    
    // First, let's test the API endpoint to see what's happening
    console.log('🔍 Testing API endpoint...');
    
    const response = await fetch('http://localhost:3001/api/admin/ai-tools/generate-media', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },      body: JSON.stringify({
        mediaType: "image",
        modelIdentifier: "stability-ai/sdxl",
        prompt: missingBlogImage.prompt,
        aspectRatio: "16:9"
      })
    });
    
    console.log(`📡 Response status: ${response.status}`);
    console.log(`📡 Response headers:`, Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Raw error response: ${errorText}`);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { error: errorText };
      }
      
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || errorData.message || 'Unknown error'}`);
    }
    
    const result = await response.json();
    
    if (result.imageUrl) {
      console.log(`✅ Generated image for ${missingBlogImage.topic}:`);
      console.log(`   URL: ${result.imageUrl}`);
      
      // Log the update command for blog-data.ts
      console.log('\n🔄 Update command for blog-data.ts:');
      console.log('===================================');
      console.log(`// ${missingBlogImage.topic}`);
      console.log(`coverImage: "${result.imageUrl}",`);
      
      return {
        slug: missingBlogImage.slug,
        topic: missingBlogImage.topic,
        imageUrl: result.imageUrl,
        alt: `AI-generated image for: ${missingBlogImage.prompt.substring(0, 100)}`
      };
    } else {
      console.log(`❌ No image generated for ${missingBlogImage.topic}`);
      console.log('Response:', result);
      return null;
    }
    
  } catch (error) {
    console.error(`❌ Error generating image for ${missingBlogImage.topic}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting image generation for missing blog article...\n');
  
  const result = await generateImageForMissingArticle();
  
  if (result) {
    console.log('\n📋 Generated Image Summary:');
    console.log('=====================================');
    console.log(`Slug: ${result.slug}`);
    console.log(`Topic: ${result.topic}`);
    console.log(`URL: ${result.imageUrl}`);
    console.log(`Alt: ${result.alt}`);
    
    // Add to blog-image-urls.js file
    console.log('\n📝 Add to blog-image-urls.js:');
    console.log('===================================');
    console.log(`{`);
    console.log(`  slug: "${result.slug}",`);
    console.log(`  title: "Latest advancements in large language models",`);
    console.log(`  imageUrl: "${result.imageUrl}"`);
    console.log(`},`);
  } else {
    console.log('\n❌ Failed to generate image for the missing article.');
  }
}

main().catch(console.error);
