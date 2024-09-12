/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    domains: ['example.com', 'lh3.googleusercontent.com', 'drive.google.com'], // 'drive.google.com' を追加
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.join(__dirname, 'src');
    config.resolve.alias['@components'] = path.join(__dirname, 'src/components');
    config.resolve.alias['@styles'] = path.join(__dirname, 'src/styles');
    config.resolve.alias['@utils'] = path.join(__dirname, 'src/utils');
    return config;
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/line/webhook',
        destination: '/api/line/webhook',
      },
    ];
  },
}

module.exports = nextConfig