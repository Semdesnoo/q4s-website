import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
    // Nodig omdat de root layout in een dynamisch segment zit ([locale]).
    // Zie app/global-not-found.tsx.
    globalNotFound: true,
  },
  // Verbergt de `X-Powered-By: Next.js`-header — onnodige informatie over de stack.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Bewust géén Strict-Transport-Security: Vercel zet die al
          // (max-age=63072000). Een eigen header zou die overschrijven.
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
