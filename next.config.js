/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Temporarily disable ESLint to focus on TypeScript errors and runtime issues
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Necessary for Vercel deployment
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },      {
        protocol: 'https',
        hostname: 'mzcje1drftvqhdku.public.blob.vercel-storage.com',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'mzcje1drftvqhdku.public.blob.vercel-storage.com',
        port: '',
        pathname: '/videos/**',
      },
    ],
    domains: [
      // Vercel Blob domains
      'mzcje1drftvqhdku.public.blob.vercel-storage.com',
      'vercel-storage.com',
    ],
    unoptimized: true, // For Vercel Blob Storage images
    // Use unoptimized images to avoid issues with Vercel's image optimization
    // This is necessary for Vercel Blob Storage images
    // See: https://vercel.com/docs/storage/vercel-blob#images
  },
  serverExternalPackages: ['sharp', '@neondatabase/serverless'],
  // Increase the timeout for builds
  experimental: {
    cpus: 4,
  },
};

export default nextConfig;