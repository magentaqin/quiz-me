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
