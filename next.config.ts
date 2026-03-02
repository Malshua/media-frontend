import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  env: {
    BASE_URL: process.env.BASE_URL,
  },
  async redirects() {
    return [{ source: "/", destination: "/login", permanent: true }];
  },
};

export default nextConfig;
