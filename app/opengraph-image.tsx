import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Refinea — AI Visibility Platform for GEO";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const inter = await fetch(
    new URL(
      "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff",
    ),
  ).then((r) => r.arrayBuffer());

  const interBold = await fetch(
    new URL(
      "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIa2JL7SUc.woff",
    ),
  ).then((r) => r.arrayBuffer());

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
            fontSize: 30,
            color: "rgba(0,0,0,0.6)",
            lineHeight: 1.35,
            maxWidth: 920,
            letterSpacing: "-0.01em",
          }}
        >
          Discover what your customers ask AI — and where AI chooses your
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
      ...size,
      fonts: [
        { name: "Inter", data: inter, weight: 400, style: "normal" },
        { name: "Inter", data: interBold, weight: 700, style: "normal" },
      ],
    },
  );
}
