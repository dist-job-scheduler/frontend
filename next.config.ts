import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Proxy /api/* → Go backend.
  // This avoids CORS in local dev: browser calls /api/... (same origin),
  // Next.js forwards server-side to BACKEND_URL.
  // In production, set NEXT_PUBLIC_API_URL to the real backend URL instead
  // (e.g. https://api.fliq.sh) and the proxy is bypassed entirely.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL ?? "http://localhost:8080"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
