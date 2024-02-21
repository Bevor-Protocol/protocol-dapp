/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    serverActions: true,
  },
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
