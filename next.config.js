/** @type {import('next').NextConfig} */
const { createReadStream } = require("fs");
const path = require("path");

const nextConfig = {
  reactStrictMode: true,  // 권장: 개발 중에 문제 감지
  swcMinify: true,        // 빌드 최적화 (Next.js 12+)

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
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 클라이언트에서만 필요한 모듈 무시 (SSR 문제 해결)
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
      };
    }

    return config;
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
