import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  outputFileTracingIncludes: {
    '/*': ['./node_modules/.prisma/client/**/*'],
  },
};

export default nextConfig;
