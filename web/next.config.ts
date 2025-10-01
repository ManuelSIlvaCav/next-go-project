import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';


const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001'

  

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL, 'https://picsum.photos'].map((item) => {
        const url = new URL(item)
        const protocol = url.protocol.replace(':', '')

        return {
          hostname: url.hostname,
          protocol: protocol as 'http' | 'https',
        }
      }),
    ],
  },
  reactStrictMode: false,
  experimental: {
    globalNotFound: true,
  },
}


export default withNextIntl(nextConfig)
