/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- Image settings ---
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "media.dev.to",
      },
      {
        protocol: "https",
        hostname: "media2.dev.to",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "dev-to-uploads.s3.amazonaws.com",
      },
    ],
  },

  // --- ESLint/TypeScript settings ---
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // --- Redirects ---
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/md8-habibullah",
        permanent: true,
      },
      {
        source: "/linkedin",
        destination: "https://www.linkedin.com/in/md-habibullahs",
        permanent: true,
      },
      {
        source: "/whatsapp",
        destination: "https://wa.me/8801329876070",
        permanent: true,
      },
      {
        source: "/facebook",
        destination: "https://facebook.com/md8.habibullah",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
