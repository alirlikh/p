import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname, ""), // We set the root to the directory where next.config.ts is located (__dirname) to remove the duplicate json.lock file error
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "swiper"],
  },
  // outputFileTracingRoot: __dirname, // or we can set this value to remove the duplicate json.lock file error
};

export default nextConfig;
