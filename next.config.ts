import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack config (Next.js 16 default bundler)
  turbopack: {
    resolveAlias: {
      canvas: "./src/lib/empty-module.ts",
      encoding: "./src/lib/empty-module.ts",
    },
  },
  // Keep webpack config for legacy builds
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
