"use client"

import { getBlobImage } from "@/utils/image-utils"
import ClientImage from "@/components/ui/ClientImage"
import Link from "next/link"

type LogoProps = {
  variant?: "white" | "black"
  href?: string
  className?: string
  onClick?: () => void
  isFooter?: boolean // Add new prop to identify footer usage
}

export default function Logo({ 
  variant = "white", 
  href = "/", 
  className = "", 
  onClick,
  isFooter = false // Default to false
}: LogoProps) {
  const logoKey = variant === "white" ? "logo" : "logo-black"
  const logoAlt = "Fantastic AI Studio Logo"

  // Apply negative margin only if it's used in the footer
  const footerAdjustment = isFooter ? "md:-ml-3" : ""

  const logoImage = (
    <ClientImage
      src={getBlobImage(logoKey)}
      alt={logoAlt}
      width={100}
      height={40}
      priority={variant === "white"} // Prioritize loading the header logo
      style={{
        width: "auto",
        height: "40px",
        maxWidth: "100%",
        padding: 0,
        margin: 0
      }}
      className={`transition-all duration-300 sm:h-[40px] h-[32px] ${footerAdjustment} ${className}`}
    />
  )

  if (href) {
    return (
      <Link href={href} className={`flex-shrink-0 p-0 m-0 ${footerAdjustment}`} style={{ padding: 0, margin: 0 }} onClick={onClick}>
        {logoImage}
      </Link>
    )
  }

  return logoImage
}
