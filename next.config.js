/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Disable server-side features since we're doing static export
  experimental: {
    // Remove appDir as it's now the default in Next.js 14
  }
}

module.exports = nextConfig 