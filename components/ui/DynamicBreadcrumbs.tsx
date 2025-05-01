"use client"

import Breadcrumbs from "@/components/ui/Breadcrumbs"
import { usePathname } from "next/navigation"

export default function DynamicBreadcrumbs({ darkBg = false }: { darkBg?: boolean }) {
  const pathname = usePathname()

  // Don't show breadcrumbs on home page
  if (!pathname || pathname === "/") return null

  const segments = pathname.split("/").filter(Boolean)
  const items = [
    { label: "Home", href: "/" },
    ...segments.map((seg, idx) => ({
      label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "),
      href: "/" + segments.slice(0, idx + 1).join("/"),
    })),
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <Breadcrumbs items={items} darkBg={darkBg} />
    </div>
  )
}
