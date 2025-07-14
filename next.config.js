/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true, // ← 🔥 追加！
  },
};

module.exports = nextConfig;
