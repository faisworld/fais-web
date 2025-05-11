"use client";

import { useEffect, useRef } from 'react';
import styles from './styles.module.css';

export default function KvitkaPoloninyPage() {
  const chatWidgetRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const scriptId = "elevenlabs-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://elevenlabs.io/convai-widget/index.js";
      script.async = true;
      document.head.appendChild(script);
    }

    const createChatWidget = () => {
      if (customElements.get('elevenlabs-convai') && chatWidgetRef.current && chatWidgetRef.current.childElementCount === 0) {
        const widget = document.createElement('elevenlabs-convai');
        widget.setAttribute('agent-id', 'GkOKedIUAelQwYORYU3j');
        if (chatWidgetRef.current) {
          chatWidgetRef.current.appendChild(widget);
          setTimeout(() => {
            const internalWidgetContainer = widget.shadowRoot?.querySelector('div[style*="position: fixed"]');
            if (internalWidgetContainer instanceof HTMLElement) {
              internalWidgetContainer.style.position = 'relative';
              internalWidgetContainer.style.bottom = 'auto';
              internalWidgetContainer.style.right = 'auto';
            }
          }, 1000);
        }
      } else if (!customElements.get('elevenlabs-convai')) {
        setTimeout(createChatWidget, 300);
      }
    };

    if (script.onload) {
      createChatWidget();
    } else {
      script.onload = createChatWidget;
    }
    
    return () => {
      // Cleanup logic if needed
    };
  }, []);
  
  return (
    <div className={`${styles.pageContainer} pt-20`}>
      <main className={styles.mainContent}>
        <div className={styles.imageContainer}>
          <img src="/kvitka-polonyny.png" alt="Квітка Полонини" className={styles.kvitkaImage} />
        </div>
        <div className={styles.textContent}>
          <h1 className={styles.pageTitle}>Ласкаво просимо до AI Асистента Санаторію "Квітка Полонини"</h1>
          <p className={styles.pageText}>
            Задайте своє питання нашому віртуальному помічнику. Він готовий надати інформацію про послуги санаторію, 
            процедури, проживання та багато іншого. Ми прагнемо зробити ваш досвід максимально комфортним та інформативним.
          </p>
          <p className={styles.pageText}>
            AI Асистент працює 24/7, щоб ви могли отримати відповіді у будь-який зручний для вас час.
          </p>
        </div>
        <div ref={chatWidgetRef} className={styles.chatWidget} id="kvitka-widget-container">
          {/* ElevenLabs widget will be appended here by the script */}
        </div>
      </main>
    </div>
  );
}