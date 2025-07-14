/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export' を削除またはコメントアウト
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig