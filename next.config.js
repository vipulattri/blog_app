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
<<<<<<< HEAD
            value: '*', // Allow all origins
=======
            value: 'https://blog-app-sji9.onrender.com', // Updated to your new Render URL
>>>>>>> 1799c108fc409a52392c0a9e125637318d68addb
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
