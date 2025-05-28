// Test script to verify AI image generation is working correctly
const testImageGeneration = async () => {
  try {
    console.log('🧪 Testing AI image generation...');
    
    const testRequest = {
      mediaType: "image",
      modelIdentifier: "nvidia/sana",
      prompt: "A beautiful sunset over mountains",
      modelVariant: "1600M-1024px",
      width: 1024,
      height: 1024,
      numInferenceSteps: 20,
      guidanceScale: 5.0
    };

    console.log('📤 Sending request:', testRequest);

    const response = await fetch('http://localhost:3001/api/admin/ai-tools/generate-media', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRequest),
    });

    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      return;
    }

    const data = await response.json();
    console.log('✅ Success! Generated image URL:', data.imageUrl);

    // Test if the image URL is accessible
    if (data.imageUrl) {
      console.log('🔍 Testing image accessibility...');
      try {
        const imageResponse = await fetch(data.imageUrl, { method: 'HEAD' });
        console.log('🖼️ Image response status:', imageResponse.status);
        console.log('🖼️ Image content-type:', imageResponse.headers.get('content-type'));
      } catch (imageError) {
        console.error('❌ Image not accessible:', imageError.message);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test
testImageGeneration();
