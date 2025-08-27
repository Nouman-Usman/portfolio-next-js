/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...existing Next config options (if any) ...
  images: {
    // allow GitHub avatar images used by the repo cards
    domains: ['avatars.githubusercontent.com'],
    // remotePatterns is more flexible; keep both for compatibility
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
