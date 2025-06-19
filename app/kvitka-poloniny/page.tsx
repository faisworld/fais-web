"use client";

import Image from 'next/image';
import styles from './styles.module.css';

export default function KvitkaPoloninyPage() {
  return (
    <div className={`${styles.pageContainer} pt-20`}>
      {/* Global CSS to hide global FAIS widgets on this page */}
      <style jsx global>{`
        /* Hide global FAIS widgets on Kvitka page */
        elevenlabs-convai[agent-id="GkOKedIUAelQwYORYU3j"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          position: absolute !important;
          left: -9999px !important;
        }
      `}</style>
      
      <div className="container mx-auto px-4 max-w-screen-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Full width content area */}
          <div className="lg:col-span-12">
            <div className="mb-8 flex justify-center lg:justify-start">
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
            </div>
            <div className={styles.textContent}>
              <h1 className="text-3xl font-bold mb-4">Ласкаво просимо до AI Асистента Санаторію &quot;Квітка Полонини&quot;</h1>
              <p className={styles.pageText}>
                Задайте своє питання нашому віртуальному помічнику. Він готовий надати інформацію про послуги санаторію, 
                процедури, проживання та багато іншого. Ми прагнемо зробити ваш досвід максимально комфортним та інформативним.
              </p>
              <p className={styles.pageText}>
                AI Асистент працює 24/7, щоб ви могли отримати відповіді у будь-який зручний для вас час.
              </p>
            </div>
          </div>
        </div>
      </div>
        {/* Simple ElevenLabs Widget - Let it handle its own positioning */}
      <div dangerouslySetInnerHTML={{
        __html: '<elevenlabs-convai agent-id="iNXsli5ADa6T5QV7XQIM"></elevenlabs-convai><script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>'
      }} />
    </div>
  );
}
