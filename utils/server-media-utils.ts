'use server';

/**
 * Helper function to get a Vercel Blob URL for an image (server-side version)
 */
export function getBlobImageUrl(path: string): string {
  // Base URL for your Vercel Blob storage
  const blobBaseUrl = 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com';

  // If the path already starts with http, assume it's already a full URL
  if (path.startsWith('http')) {
    return path;
  }

  // If the path already starts with the blob base URL, return it as is
  if (path.startsWith(blobBaseUrl)) {
    return path;
  }

  // Ensure the path starts with a slash
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path;

  // Return the full URL
  return `${blobBaseUrl}/${normalizedPath}`;
}

/**
 * Generate a placeholder image URL
 */
export function getPlaceholderImage(text: string, width = 400, height = 300): string {
  return `/placeholder.svg?width=${width}&height=${height}&query=${encodeURIComponent(text)}`;
}

// Map of friendly names to actual blob URLs or placeholder SVGs
// This is a copy of the client-side blobImages map
export const blobImages: { [key: string]: string } = {
  // Use actual Blob URLs for logos
  logo: 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Logo_white_fais-e1734783482439-0gYn1yvp1J0Oud09HvWZK7ePuLfaC4.png',
  'logo-black': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1746460117071-logo-fais-black.png',
  // Carousel and feature images - Fixed mapping
  'pioneering-digital-transformation': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/carousel/carousel-video-pioneering-digital-transformation.mp4',
  'innovating-future': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/carousel/carousel-video-innovating-the-future.mp4',
  'shaping-sota-technologies': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/carousel/carousel-video-shaping-sota-technologies.mp4',
    // Services hero video
  'services-hero-video': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/videos/videos/807577ac-cf02-45ee-a8c0-6d2c87aa2c3e.mp4',
  
  // Solutions section images
  'ai-solutions': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1747076648350-20250512-2151-Futuristic-Office-Collaboration-simple-compose-01jv2xcqegeqzsm27xw0wayv3d.gif',
  'blockchain-solutions': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1747076641901-20250512-2155-Futuristic-Blockchain-Technology-simple-compose-01jv2xkk35fg99g5m1yecjjxa3.gif',
  
  // Project section images
  'web3-gaming': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1747069232372-20250512-1951-Web3-Gaming-Revolution-simple-compose-01jv2phxzzeprrz0e36tjat8hy.gif',   
  'payment-systems': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1747075171305-20250512-2057-Futuristic-Blockchain-Payments-remix-01jv2tacjdf7prr72x36a3r710.gif',
  'mev-staking': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1747055425140-20250511-2158-Futuristic-Data-Connectivity-simple-compose-01jv0bd9emep8ssw4bwmkwkptb.gif',
  'nft-marketplace': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1747055463123-20250511-2149-AI-Glow-Effect-storyboard-01jv0aw3mvf7et4sgshfjs7z7v.gif',
  'ai-services': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1747055432399-20250511-2154-Digital-Harmony-simple-compose-01jv0b560pexvvbv6we6kkm31v.gif',
  
  // Quote section images
  'ceo-portrait': 
  'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1746354931230-instantid-1746354169011.webp',
  
  // Projects page specific images
  'projects-dopple-ai': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Screenshot-2025-01-05-160711-X4TsCx0Tznl0kEKC9xteDtdk9eifzt.png',
  'projects-degen-kombat': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Screenshot-2025-01-05-160251-a1hFy83k9Rfzoenroo51nuUuLpXwXr.png',
  'projects-heroes-of-mavia': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Screenshot-2025-01-05-160852-CbIqDoFaMOWTENTm4tNfniGclPjKo3.png',
  'projects-multichain-dex': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Screenshot-2025-01-05-165735-YrpRehlPFZCuhQHFooDAEqol59jfjx.png',
  'projects-payment-system': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Screenshot-2025-01-05-174629-wxPq1MW2OplBB8V70zjeSN9RqpQ7W0.png',
  'projects-optimism-io': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Screenshot-2025-01-05-175331-WPpSHQyWIcLYFLTcfZHXYLrpY93PIx.png',
  'projects-blast-io': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Screenshot-2025-01-05-172306-qOsrwGzaEfz7gHuseaH756pBDbR88Y.png',
  'projects-base-org': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Screenshot-2025-01-05-172939-8HJfc36gfs5XyiuijmGkMiJgjnvIGI.png',
  // Services page images 
  'services-og-image': 
  'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/videos/8b42303a-6fd5-4e3e-99dc-ff5d2c207ead.mp4',
  // About page images
  'about-mission-image': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1747069236709-20250512-1428-Futuristic-Innovation-Hub-simple-compose-01jv242h1dexrbkgvw5vn5wx5v.gif',
  'about-mission-video': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/videos/8b42303a-6fd5-4e3e-99dc-ff5d2c207ead.mp4',  
  'about-vision-image': '/placeholder.svg?width=500&height=300&query=Vision%20Image',
  'about-vision-video': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/videos/videos/fb3c4b1c-c5cf-4570-8082-9673b0ba6516.mp4',  
  'about-value-innovation-image': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/images/cc47ef93-db7a-4e21-9663-7051131a4a79.png',
  'about-value-integrity-image': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/images/01a7d351-f4ef-4f95-9261-bb79a7affc2d.png',
  'about-value-collaboration-image': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/images/67d6bcc8-fdf2-4bde-addb-5a19b0f4e196.png',
  'about-team-member-yevhen-lukyanov-image': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/instant-id/generated-1748571756551-instantid-1748571756550.webp',
  'about-team-member-arik-vigas-image': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/photo_2024-09-06_14-10-40-UXOlLLTn4PXpt3zuJZotwguhCZcXlz.jpg',
  'about-team-member-andrii-stehno-image': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1525272441578-qsun1wc6mdk3geegvjjt75pmibcc8iv3drkakgyblc-lc4eX0RKR35BecEHkh7GWgSy1yg0Rp.webp',  'about-team-member-vitalii-melnyk-image': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Vitaliy-Melnyk-wLuvov0LC7IyMYiE2kcCgkfTaWPpfc.webp',
    // Blog post images
  'blog-ai-llm': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/images/30369d5f-2bd3-42b2-b24e-d03a0e269b92.png',  'blog-blockchain-supply': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/images/20d56314-2eb0-4f86-a329-ce1465cd3448.png',
  'blog-blockchain-optimism': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1747076641901-20250512-2155-Futuristic-Blockchain-Technology-simple-compose-01jv2xkk35fg99g5m1yecjjxa3.gif',
  'blog-og-image': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/images/a36adc18-4752-49bd-b970-f6b1e5814b2e.png',
  'blog-twitter-card': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/images/6e972845-d283-487c-be43-db051920940c.png',
    // Author images
  'author-fantastic': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/images/360e407c-ca7b-4f0b-87b9-7f550d743cda.jpeg',
  'author-sarah': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1746354931230-instantid-1746354169011.webp',
  'author-yevhen': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/instant-id/generated-1748571756551-instantid-1748571756550.webp',
  'author-tech-team': 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/photo_2024-09-06_14-10-40-UXOlLLTn4PXpt3zuJZotwguhCZcXlz.jpg',
};

/**
 * Get an image URL from the Blob storage by its friendly name (server-side version)
 */
export function getBlobImage(key: string, fallback?: string): string {
  // If the provided key is already a full URL, return it
  if (key && typeof key === 'string' && key.startsWith('http')) {
    return key;
  }
  
  // Return the mapped URL or fallback
  return (key && blobImages[key]) || fallback || getPlaceholderImage(key || 'Image');
}
