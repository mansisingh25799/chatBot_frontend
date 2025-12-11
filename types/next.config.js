/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    if (dev) {
      // Workaround for HMR CSS "removeChild" bug in Next.js 15.x
      config.optimization.runtimeChunk = false;
    }
    return config;
  },
};

module.exports = nextConfig;
