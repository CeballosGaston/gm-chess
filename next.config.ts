import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },

      {
        protocol: "https",
        hostname: "images.chesscomfiles.com",
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', 
      },
    ],
  },
};

export default nextConfig;
