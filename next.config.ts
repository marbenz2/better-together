import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "wungtsnksbbbatababgh.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/better-together-media/**",
      },
    ],
  },
};

export default nextConfig;
