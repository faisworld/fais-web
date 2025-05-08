// app/kvitka-poloniny/page.tsx
import Image from "next/image";

export default function KvitkaPoloninyPage() {
  return (
    <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <main style={{ maxWidth: 900, margin: "2rem auto", display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <div style={{ flex: "0 0 320px", display: "flex", justifyContent: "center" }}>
          <Image src="/kvitka-polonyny.png" alt="Квітка полонини – санаторій у Закарпатті" width={320} height={180} style={{ borderRadius: 12 }} />
        </div>
        <div style={{ flex: 1 }}>
          <h1>Квітка полонини</h1>
          <p>
            Санаторій «Квітка полонини» — сучасний оздоровчий комплекс у Закарпатті. Пропонує унікальні мінеральні води, сучасну медичну базу, кваліфікованих лікарів, різноманітні лікувальні програми та комфортний відпочинок серед мальовничої природи.
          </p>
          <p>
            Санаторій розташований у селі Поляна, відомому своїми термальними водами та лікувальними грязями. Тут ви зможете насолодитися не лише лікуванням, а й активним відпочинком: піші прогулянки, велосипедні маршрути, катання на лижах взимку.
          </p>
        </div>
      </main>
      <div style={{ position: 'relative', top: '60%', right: '30%', transform: 'translateY(-50%)', zIndex: 1000 }}>
        <elevenlabs-convai agent-id="iNXsli5ADa6T5QV7XQIM"></elevenlabs-convai> <script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script> </div> <script src="https://cdn.jsdelivr.net/npm/@widgetbot/crate@3" async></script>
    </div>
  );
}