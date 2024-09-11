/** @type {import('next').NextConfig} */
const { createReadStream } = require("fs");
const path = require("path");

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  reactStrictMode: false,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/main",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BASE_URL}/api/:path*`,
      },
      {
        source: "/workspace/:path*",
        destination: `${process.env.NEXT_PUBLIC_BASE_URL}/workspace/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
