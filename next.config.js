/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'youtubecloneforbootcamp.s3.amazonaws.com',
    ],
  },
  swcMinify: true,
}

module.exports = nextConfig
