/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mzcje1drftvqhdku.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
      // Add this as a fallback for any other Vercel Blob storage URLs
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Add this to help with source map issues
  webpack: (config) => {
    config.devtool = "source-map"
    return config
  },
}

module.exports = nextConfig
