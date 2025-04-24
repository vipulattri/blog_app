/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Required for Render and Docker deployment

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  env: {
    SKIP_DB_CONNECTION_IN_BUILD: 'true',
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Allow all origins (use cautiously in production)
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, DELETE, PATCH, POST, PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },

  webpack: (config, { isServer }) => {
    return config;
  },
};

module.exports = nextConfig;
