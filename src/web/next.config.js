const withTM = require('next-transpile-modules')(['/server']);

/** @type {import('next').NextConfig} */
const nextConfig = withTM({
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
      {
        source: '/images/:path*',
        destination: 'http://localhost:8080/images/:path*',
      },
      {
        source: '/audio/:path*',
        destination: 'http://localhost:8080/audio/:path*',
      },
      {
        source: '/socket.io/:path*',
        destination: 'http://localhost:8080/socket.io/:path*',
      },
    ];
  },
});

module.exports = nextConfig;
