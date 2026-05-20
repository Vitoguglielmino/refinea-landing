/**
 * Site-wide Open Graph image, served at the fixed URL /opengraph-image.
 *
 * Why a route handler and not the `opengraph-image.tsx` metadata file:
 * the metadata-file convention makes Next serve the image at a hashed
 * path (/opengraph-image-<hash>), so a hardcoded reference to
 * "/opengraph-image" in layout.tsx and structured-data.ts 404s. A route
 * handler binds the image to the exact, stable URL those references use.
 *
 * Rendered with the Node runtime so the Inter TTFs (resolved from the
 * Google Fonts CSS API) parse reliably.
 */

import { ImageResponse } from "next/og";

export const contentType = "image/png";

const SIZE = { width: 1200, height: 630 };

/** Inter TTF URLs from the Google Fonts CSS API — same pinned set the
 *  blog cover generator uses. Re-resolve from
 *  fonts.googleapis.com/css2?family=Inter:wght@400;700 if Google rotates
 *  the v20 hashes. */
const FONT_400 =
  "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf";
const FONT_700 =
  "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf";

export async function GET() {
  const [regular, bold] = await Promise.all([
    fetch(FONT_400).then((r) => r.arrayBuffer()),
    fetch(FONT_700).then((r) => r.arrayBuffer()),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#f5f6f7",
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          padding: "80px",
          fontFamily: "Inter",
          position: "relative",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginBottom: 60,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#6c47ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 20px rgba(108, 71, 255, 0.3)",
            }}
          >
            <div
              style={{
                color: "#fff",
                fontSize: 36,
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              R
            </div>
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#000",
              letterSpacing: "-0.02em",
            }}
          >
            Refinea
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 700,
            color: "#000",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            marginBottom: 28,
            maxWidth: 980,
          }}
        >
          The AI Visibility Platform for GEO
        </div>

        {/* Subhead */}
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "rgba(0,0,0,0.6)",
            lineHeight: 1.35,
            maxWidth: 920,
            letterSpacing: "-0.01em",
          }}
        >
          Discover what your customers ask AI, and where AI chooses your
          competitors.
        </div>

        {/* Footer row */}
        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            bottom: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 22,
              color: "rgba(0,0,0,0.55)",
              fontWeight: 500,
            }}
          >
            <span>ChatGPT</span>
            <span style={{ color: "rgba(0,0,0,0.2)" }}>·</span>
            <span>Gemini</span>
            <span style={{ color: "rgba(0,0,0,0.2)" }}>·</span>
            <span>Perplexity</span>
            <span style={{ color: "rgba(0,0,0,0.2)" }}>·</span>
            <span>Claude</span>
            <span style={{ color: "rgba(0,0,0,0.2)" }}>·</span>
            <span>AI Overviews</span>
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#6c47ff",
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            refinea.io
          </div>
        </div>
      </div>
    ),
    {
      ...SIZE,
      fonts: [
        { name: "Inter", data: regular, weight: 400, style: "normal" },
        { name: "Inter", data: bold, weight: 700, style: "normal" },
      ],
      headers: {
        "Cache-Control": "public, immutable, no-transform, max-age=86400",
      },
    },
  );
}
