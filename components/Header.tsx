import Image from 'next/image';

// Find the Image component using the white logo and update it:

const logoSrc = process.env.NEXT_PUBLIC_LOGO_WHITE_URL || '/fallback-logo.png';

<Image
  src={logoSrc}
  alt="fAis logo"
  className="logo"
  // width and height are handled in your global CSS
  sizes="(max-width: 350px) 105px, (max-width: 768px) 126px, (min-width: 1200px) 154px, 150px"
  fill
/>
