"use client";
import Image from "next/image";
import styles from "./styles.module.css";
import { useEffect, useRef } from "react";

export default function KvitkaPoloninyPage() {
  const chatWidgetRef = useRef<HTMLDivElement>(null);
  
  // Use effect to ensure our custom styles are applied after the chat widget loads
  useEffect(() => {
    // Load the ElevenLabs script if it's not already loaded
    const scriptId = "elevenlabs-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://elevenlabs.io/convai-widget/index.js";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    // Create and append the widget after the script is loaded
    const createChatWidget = () => {
      if (!chatWidgetRef.current || chatWidgetRef.current.childElementCount > 0) return;
      
      try {
        const widget = document.createElement("elevenlabs-convai");
        widget.setAttribute("agent-id", "iNXsli5ADa6T5QV7XQIM");
        widget.setAttribute("style", "position: static; bottom: auto; right: auto;");
        chatWidgetRef.current.appendChild(widget);
      } catch (error) {
        console.error("Error creating ElevenLabs widget:", error);
      }
    };

    // Check if the custom element is defined every 300ms until it's ready
    const interval = setInterval(() => {
      if (customElements.get("elevenlabs-convai")) {
        createChatWidget();
        clearInterval(interval);
      }
    }, 300);

    // Force widget positioning to be static
    const styleFixInterval = setInterval(() => {
      const chatContainer = document.getElementById("elevenlabs-chat-container");
      if (chatContainer) {
        chatContainer.style.position = "static";
        chatContainer.style.bottom = "auto";
        chatContainer.style.right = "auto";
        
        // Also fix any child elements
        Array.from(chatContainer.getElementsByTagName("*")).forEach(el => {
          if ((el as HTMLElement).style.position === "fixed") {
            (el as HTMLElement).style.position = "static";
          }
        });
        
        clearInterval(styleFixInterval);
      }
    }, 500);
    
    return () => {
      clearInterval(interval);
      clearInterval(styleFixInterval);
    };
  }, []);
  
  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <div className={styles.imageContainer}>
          <Image 
            src="/kvitka-polonyny.png" 
            alt="Квітка полонини – санаторій у Закарпатті" 
            width={320} 
            height={180} 
            className={styles.kvitkaImage}
          />
        </div>
        <div className={styles.textContent}>
          <h1 className={styles.pageTitle}>Квітка полонини</h1>
          <p className={styles.pageText}>
            Санаторій «Квітка полонини» — сучасний оздоровчий комплекс у Закарпатті. Пропонує унікальні мінеральні води, сучасну медичну базу, кваліфікованих лікарів, різноманітні лікувальні програми та комфортний відпочинок серед мальовничої природи.
          </p>
          <p className={styles.pageText}>
            Санаторій розташований у селі Поляна, відомому своїми термальними водами та лікувальними грязями. Тут ви зможете насолодитися не лише лікуванням, а й активним відпочинком: піші прогулянки, велосипедні маршрути, катання на лижах взимку.
          </p>            <div className={styles.chatWidget} id="kvitka-widget-container" ref={chatWidgetRef}>
            {/* Widget will be created dynamically via useEffect */}
          </div>
        </div>
      </main>
    </div>
  );
}