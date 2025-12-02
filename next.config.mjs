/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove "output: export" unless you are hosting on GitHub Pages manually.
  // Remove "unoptimized: true" to enable the Image Optimization API.
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;