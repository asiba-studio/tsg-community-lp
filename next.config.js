/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'export',
  images: {
    unoptimized: false,
    domains: ['images.ctfassets.net'],
  },
};

module.exports = nextConfig;
