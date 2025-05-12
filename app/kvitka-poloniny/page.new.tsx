"use client";

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './styles.module.css';

export default function KvitkaPoloninyPage() {
  const chatWidgetRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Prevent conflicts with global widget script by using unique ID
    const kvitkaWidgetScriptId = "elevenlabs-kvitka-script";
    
    // Remove any previously created widget elements to start fresh
    if (chatWidgetRef.current) {
      while (chatWidgetRef.current.firstChild) {
        chatWidgetRef.current.removeChild(chatWidgetRef.current.firstChild);
      }
    }
    
    const loadWidgetScript = () => {
      return new Promise<void>((resolve, reject) => {
        // Check if script already exists
        let existingScript = document.getElementById(kvitkaWidgetScriptId) as HTMLScriptElement | null;
        
        if (!existingScript) {
          console.log('Creating new ElevenLabs script for Kvitka Poloniny');
          existingScript = document.createElement('script');
          existingScript.id = kvitkaWidgetScriptId;
          existingScript.src = 'https://elevenlabs.io/convai-widget/index.js';
          existingScript.async = true;
          existingScript.onload = () => {
            console.log('Kvitka widget script loaded successfully');
            resolve();
          };
          existingScript.onerror = (error) => {
            console.error('Error loading Kvitka widget script', error);
            reject(error);
          };
          document.head.appendChild(existingScript);
        } else {
          console.log('ElevenLabs script already exists, using it');
          resolve();
        }
      });
    };
    
    const createKvitkaWidget = () => {
      if (!chatWidgetRef.current) return;
      
      // Wait for custom elements to be defined
      if (!customElements.get('elevenlabs-convai')) {
        console.log('Waiting for ElevenLabs custom elements to be defined...');
        setTimeout(createKvitkaWidget, 500);
        return;
      }
      
      console.log('Creating Kvitka Poloniny widget with ID: iNXsli5ADa6T5QV7XQIM');
      
      // Create Kvitka-specific widget with correct agent ID
      const kvitkaWidget = document.createElement('elevenlabs-convai');
      kvitkaWidget.setAttribute('agent-id', 'iNXsli5ADa6T5QV7XQIM');
      chatWidgetRef.current.appendChild(kvitkaWidget);
      
      // Adjust the positioning to be relative instead of fixed
      setTimeout(() => {
        const internalContainer = kvitkaWidget.shadowRoot?.querySelector('div[style*="position: fixed"]');
        if (internalContainer instanceof HTMLElement) {
          console.log('Adjusting widget position to relative');
          internalContainer.style.position = 'relative';
          internalContainer.style.bottom = 'auto';
          internalContainer.style.right = 'auto';
          internalContainer.style.zIndex = '1';
        } else {
          console.log('Could not find internal widget container to adjust position');
        }
      }, 1000);
    };
    
    // First load script, then create widget
    loadWidgetScript()
      .then(() => {
        console.log('Widget script loaded, creating widget');
        createKvitkaWidget();
      })
      .catch((error) => {
        console.error('Failed to load widget script', error);
      });
    
    // Cleanup on unmount
    return () => {
      if (chatWidgetRef.current) {
        console.log('Cleaning up Kvitka widget');
        while (chatWidgetRef.current.firstChild) {
          chatWidgetRef.current.removeChild(chatWidgetRef.current.firstChild);
        }
      }
    };
  }, []);
  
  return (
    <div className={`${styles.pageContainer} pt-20`}>
      <main>
        <div className={styles.imageContainer}>
          <Image 
            src="/kvitka-polonyny.png" 
            alt="Квітка Полонини" 
            className={styles.kvitkaImage}
            width={500}
            height={300}
            priority
          />
        </div>
        <div className={styles.textContent}>
          <h1 className={styles.pageTitle}>Ласкаво просимо до AI Асистента Санаторію &quot;Квітка Полонини&quot;</h1>
          <p className={styles.pageText}>
            Задайте своє питання нашому віртуальному помічнику. Він готовий надати інформацію про послуги санаторію, 
            процедури, проживання та багато іншого. Ми прагнемо зробити ваш досвід максимально комфортним та інформативним.
          </p>
          <p className={styles.pageText}>
            AI Асистент працює 24/7, щоб ви могли отримати відповіді у будь-який зручний для вас час.
          </p>
        </div>
        <div ref={chatWidgetRef} className={styles.chatWidget} id="kvitka-widget-container">
          {/* ElevenLabs widget will be inserted here by the script */}
        </div>
      </main>
    </div>
  );
}
