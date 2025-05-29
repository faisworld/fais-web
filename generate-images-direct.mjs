// Simple image generation script using fetch
async function generateImageWithReplicate(prompt, topic) {
  const replicateApiToken = process.env.REPLICATE_API_TOKEN;
  
  try {
    console.log(`Generating image for: ${topic}`);
    
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${replicateApiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: '9e3ce855e6437b594a6716d54a8c7d0eaa10c28a8ada83c52ee84bde3b98f88d', // Google Imagen 4
        input: {
          prompt: prompt,
          aspect_ratio: '16:9'
        }
      })
    });
    
    const prediction = await response.json();
    console.log(`Started prediction for ${topic}:`, prediction.id);
    
    // Poll for completion
    let result = prediction;
    while (result.status === 'starting' || result.status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: {
          'Authorization': `Bearer ${replicateApiToken}`,
        }
      });
      
      result = await statusResponse.json();
      console.log(`${topic} status:`, result.status);
    }
    
    if (result.status === 'succeeded' && result.output && result.output.length > 0) {
      console.log(`✅ Generated image for ${topic}:`, result.output[0]);
      return result.output[0];
    } else {
      console.error(`❌ Failed to generate image for ${topic}:`, result.error);
      return null;
    }
    
  } catch (error) {
    console.error(`❌ Error generating image for ${topic}:`, error);
    return null;
  }
}

const blogTopics = [
  { topic: 'DeFi', prompt: 'Professional, high-quality blog featured image about Decentralized Finance (DeFi). Modern, clean, visually appealing design showing blockchain networks, cryptocurrency symbols, financial technology interfaces. Corporate style, professional photography aesthetic. Bright, vibrant colors with blue and gold accents. No text overlays. Suitable for a technology blog header.' },
  { topic: 'AI Blockchain', prompt: 'Professional, high-quality blog featured image about AI and blockchain convergence. Modern, clean, visually appealing design showing artificial intelligence neural networks merged with blockchain technology. Corporate style, professional photography aesthetic. Bright, vibrant colors with purple and blue accents. No text overlays. Suitable for a technology blog header.' },
  { topic: 'Supply Chain', prompt: 'Professional, high-quality blog featured image about blockchain supply chain management. Modern, clean, visually appealing design showing global logistics, shipping containers, blockchain networks. Corporate style, professional photography aesthetic. Bright, vibrant colors with green and blue accents. No text overlays. Suitable for a technology blog header.' },
  { topic: 'AI ML', prompt: 'Professional, high-quality blog featured image about AI and machine learning advancements. Modern, clean, visually appealing design showing neural networks, data processing, machine learning algorithms. Corporate style, professional photography aesthetic. Bright, vibrant colors with orange and blue accents. No text overlays. Suitable for a technology blog header.' },
  { topic: 'Quantum AI', prompt: 'Professional, high-quality blog featured image about quantum computing and AI. Modern, clean, visually appealing design showing quantum circuits, qubits, futuristic technology. Corporate style, professional photography aesthetic. Bright, vibrant colors with cyan and purple accents. No text overlays. Suitable for a technology blog header.' }
];

async function generateAllImages() {
  const results = [];
  
  for (const item of blogTopics) {
    const imageUrl = await generateImageWithReplicate(item.prompt, item.topic);
    if (imageUrl) {
      results.push({ topic: item.topic, imageUrl });
    }
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n📋 Final Results:');
  results.forEach(result => {
    console.log(`${result.topic}: ${result.imageUrl}`);
  });
  
  return results;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateAllImages, generateImageWithReplicate };
}

// Run if called directly
if (typeof process !== 'undefined' && process.argv[1] === new URL(import.meta.url).pathname) {
  generateAllImages().catch(console.error);
}
