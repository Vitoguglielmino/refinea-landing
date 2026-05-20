import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// X-XSS-Protection is intentionally omitted — the header is deprecated
// and modern browsers ignore it (some legacy implementations were
// themselves a vulnerability). CSP is the correct replacement.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Collapse the www host into the apex domain. www.refinea.io
      // otherwise resolves as a fully crawlable duplicate of every URL,
      // splitting ranking signals and producing conflicting hreflang.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.refinea.io" }],
        destination: "https://refinea.io/:path*",
        permanent: true,
      },
      // EN posts used to carry a redundant `-en` slug suffix. They now
      // live in a per-locale folder and share the clean IT slug, so the
      // old published URLs 301 to their canonical form.
      {
        source: "/blog/introducing-agentic-workflows-en",
        destination: "/blog/introducing-agentic-workflows",
        permanent: true,
      },
      {
        source: "/blog/introducing-brand-memory-en",
        destination: "/blog/introducing-brand-memory",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/llms.txt",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=86400, s-maxage=86400" },
        ],
      },
      {
        source: "/llms-full.txt",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=86400, s-maxage=86400" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
