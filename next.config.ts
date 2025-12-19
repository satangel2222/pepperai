import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'fal.media',
        pathname: '/**',
      },
      {
        protocol: 'https' as const,
        hostname: '**.fal.ai',
        pathname: '/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
