import type { NextConfig } from 'next';
import * as path from 'path';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },

  outputFileTracingRoot: path.join(__dirname, '../'),
};

export default nextConfig;
