// app/kvitka-poloniny/page.tsx
import Image from "next/image";
import styles from "./styles.module.css";

export const metadata = {
  title: "Квітка полонини — сучасний санаторій у Закарпатті",
  description: "Санаторій Квітка полонини — сучасний оздоровчий комплекс у Закарпатті з унікальними мінеральними водами, сучасною медичною базою та комфортним відпочинком серед природи.",
};

export default function KvitkaPoloninyPage() {
  return (
    <>      <div className={styles.pageContainer}>
        <main className={styles.mainContent}>
          <div className={styles.imageContainer}>
            <Image 
              src="/kvitka-polonyny.png" 
              alt="Квітка полонини – санаторій у Закарпатті" 
              width={320} 
              height={180} 
              className={styles.kvitkaImage}
            />          </div>
          <div className={styles.textContent}>
            <h1 className={styles.pageTitle}>Квітка полонини</h1>
            <p className={styles.pageText}>
              Санаторій «Квітка полонини» — сучасний оздоровчий комплекс у Закарпатті. Пропонує унікальні мінеральні води, сучасну медичну базу, кваліфікованих лікарів, різноманітні лікувальні програми та комфортний відпочинок серед мальовничої природи.
            </p>
            <p className={styles.pageText}>
              Санаторій розташований у селі Поляна, відомому своїми термальними водами та лікувальними грязями. Тут ви зможете насолодитися не лише лікуванням, а й активним відпочинком: піші прогулянки, велосипедні маршрути, катання на лижах взимку.
            </p>
          </div>        </main>
        <div className={styles.chatWidget}>
          {/* @ts-ignore */}
          <elevenlabs-convai agent-id="iNXsli5ADa6T5QV7XQIM"></elevenlabs-convai> 
          <script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script></div> 
        <script src="https://cdn.jsdelivr.net/npm/@widgetbot/crate@3" async></script>
      </div>
    </>
  );
}