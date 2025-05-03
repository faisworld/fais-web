"use client"

import { getBlobImage } from "@/utils/image-utils"
import ClientImage from "@/components/ui/ClientImage"
import Link from "next/link"

type LogoProps = {
  variant?: "white" | "black"
  href?: string
  className?: string
  onClick?: () => void
}

export default function Logo({ variant = "white", href = "/", className = "", onClick }: LogoProps) {
  const logoKey = variant === "white" ? "logo" : "logo-black"
  const logoAlt = "Fantastic AI Studio Logo"

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
      }}
      className={`transition-all duration-300 sm:h-[40px] h-[32px] ${className}`}
    />
  )

  if (href) {
    return (
      <Link href={href} className="flex-shrink-0" onClick={onClick}>
        {logoImage}
      </Link>
    )
  }

  return logoImage
}
