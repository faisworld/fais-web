/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // For production builds, we want errors to be caught
  // but for development, we can be less strict
  typescript: {
    // Don't fail the build in development due to TypeScript errors
    ignoreBuildErrors: process.env.NODE_ENV !== 'production',
  },
  eslint: {
    // Don't fail the build in development due to ESLint errors
    ignoreDuringBuilds: process.env.NODE_ENV !== 'production',
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
      },
      {
        protocol: 'https',
        hostname: 'mzcje1drftvqhdku.public.blob.vercel-storage.com',
        port: '',
        pathname: '/images/**',
      },
    ],
    domains: [
      // Vercel Blob domains
      'mzcje1drftvqhdku.public.blob.vercel-storage.com',
      'vercel-storage.com',
    ],
    unoptimized: true, // For Vercel Blob Storage images
  },
  serverExternalPackages: ['sharp', '@neondatabase/serverless'],
  // Increase the timeout for builds
  experimental: {
    cpus: 4,
  },
};

export default nextConfig;
