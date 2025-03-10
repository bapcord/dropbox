/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "mongodb-client-encryption": false,
      "aws4": false,
    };
    return config;
  },
}

module.exports = nextConfig 