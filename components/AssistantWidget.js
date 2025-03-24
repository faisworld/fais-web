import { useEffect } from 'react';

export default function AssistantWidget() {
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
      const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
      
      if (!assistantId || !apiKey) {
        console.warn('VAPI credentials not found in environment variables');
        return;
      }
      
      // Load the VAPI script
      const script = document.createElement('script');
      script.src = 'https://cdn.vapi.ai/web-sdk.js';
      script.async = true;
      script.onload = () => {
        // Initialize VAPI widget with voice capabilities
        window.vapi('create', {
          apiKey: apiKey,
          options: {
            assistantId: assistantId,
            withAudio: true, // Enable voice capabilities
            welcomeMessage: "Hi! I'm the Fantastic AI Studio assistant. How can I help you today?",
            placeholder: "Ask me anything about AI solutions...",
            position: "bottom-right",
            withSpeech: true, // Enable speech recognition
            theme: {
              primaryColor: "#627983",
              backgroundColor: "#FFFFFF",
              secondaryColor: "#745334",
              textColor: "#646464"
            }
          }
        });
      };
      
      document.body.appendChild(script);
      
      // Clean up script on unmount
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, []);

  return null; // This component doesn't render anything visible
}