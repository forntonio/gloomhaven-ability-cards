import type { NextConfig } from 'next';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: {
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    reactCompiler: true,
  },
  typedRoutes: true,
};

export default nextConfig;
