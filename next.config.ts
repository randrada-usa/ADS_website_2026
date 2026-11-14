import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  // Dev server only: lets a Cloudflare quick tunnel (random *.trycloudflare.com
  // link) load scripts and live updates when sharing localhost with others.
  allowedDevOrigins: ["*.trycloudflare.com"],
  experimental: {
    useTypeScriptCli: false,
    webpackBuildWorker: false,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};
export default nextConfig;
