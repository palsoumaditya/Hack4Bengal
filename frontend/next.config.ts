import { createCivicAuthPlugin } from "@civic/auth/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Optimize for Vercel deployment
  experimental: {
    optimizePackageImports: ['react-icons', 'leaflet', 'react-leaflet'],
  },
  // Handle environment variables properly
  env: {
    CIVIC_CLIENT_ID: process.env.CIVIC_CLIENT_ID || "8f217843-99ca-4206-ad02-b10adbe0c926",
  },
  // Add security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

const withCivicAuth = createCivicAuthPlugin({
  clientId: process.env.CIVIC_CLIENT_ID || "8f217843-99ca-4206-ad02-b10adbe0c926"
});

export default withCivicAuth(nextConfig);
