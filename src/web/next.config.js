const withTM = require('next-transpile-modules')(['../server']);
const env = require('./env');

/** @type {import('next').NextConfig} */
const nextConfig = withTM({
  reactStrictMode: true,
  swcMinify: true,

  serverRuntimeConfig: {
    variant: 'server',
    serverUrl: env.serverUrl,
  },
  publicRuntimeConfig: {
    variant: 'client',
    serverUrl: env.serverUrl,
  },
});

module.exports = nextConfig;
