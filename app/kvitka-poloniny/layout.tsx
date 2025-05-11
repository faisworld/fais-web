// app/kvitka-poloniny/layout.tsx
import "../globals.css"
import "./styles.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Квітка полонини — сучасний санаторій у Закарпатті",
  description: "Санаторій Квітка полонини — сучасний оздоровчий комплекс у Закарпатті з унікальними мінеральними водами, сучасною медичною базою та комфортним відпочинком серед природи.",
}

export default function KvitkaPoloninyLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  // We're returning the children directly without html/body tags 
  // to use the root layout's html/body structure
  return children
}
