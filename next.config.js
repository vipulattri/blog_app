/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // Set environment variables for build time to skip DB connections
  env: {
    SKIP_DB_CONNECTION_IN_BUILD: 'true',
  },
  // Add a webpack analyzer to see what's causing the slow build (optional)
  webpack: (config, { isServer }) => {
    // Keep the existing config
    return config;
  },
};

module.exports = nextConfig; 