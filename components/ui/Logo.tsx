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
    : "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1746460117071-logo-fais-black.png";  // Add priority to white variant when used in header (above-the-fold) for LCP optimization
  const isHeaderLogo = variant === 'white' && className.includes('header-logo');
  const isFooterLogo = className.includes('footer-logo');
  
  // Use smaller intrinsic dimensions and force the sizing with inline styles
  // The logo has an aspect ratio of approximately 3.5:1
  const logoImage = (
    <Image 
      src={logoSrc}
      alt="FAIS Logo"
      width={126}
      height={36}
      priority={isHeaderLogo}
      sizes="(max-width: 350px) 105px, (max-width: 768px) 126px, (min-width: 1200px) 154px, 126px"
      className={`logo ${className}`}      style={{
        height: isHeaderLogo ? '36px' : isFooterLogo ? '34px' : 'auto',
        width: isHeaderLogo ? 'auto' : isFooterLogo ? 'auto' : 'auto',
        maxWidth: '100%'
      }}
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
