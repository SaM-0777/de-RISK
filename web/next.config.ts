import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingRoot: path.join(__dirname, "/web"),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "violet-just-marlin-907.mypinata.cloud",
      }
    ]
  }
};

export default nextConfig;
