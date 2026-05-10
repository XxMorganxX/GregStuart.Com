/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next-local',
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig






