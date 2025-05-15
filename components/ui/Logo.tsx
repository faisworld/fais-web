"use client"

import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  variant?: 'white' | 'black';
  href?: string;
  className?: string;
}

export default function Logo({ variant = 'white', href = '/', className = '' }: LogoProps) {
  const logoSrc = variant === 'white' 
    ? "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Logo_white_fais-e1734783482439-0gYn1yvp1J0Oud09HvWZK7ePuLfaC4.png"
    : "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1746460117071-logo-fais-black.png";

  const logoImage = (
    <Image 
      src={logoSrc}
      alt="FAIS Logo"
      width={140}
      height={40}
      style={{ 
        height: 'auto', // This fixes the aspect ratio warning
        width: 'auto', 
      }}
      priority
      className={`logo ${className}`}
    />
  );

  if (href === null) {
    return logoImage;
  }

  return (
    <Link href={href} className="flex items-center">
      {logoImage}
    </Link>
  );
}
