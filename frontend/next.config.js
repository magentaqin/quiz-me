/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // skip eslint error
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `http://${process.env.BACKEND_ORIGIN}:7001/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
