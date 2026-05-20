/**
 * Blog cover generator — one-shot script.
 *
 * Renders the 5 launch-article cover images as static 1600x900 PNGs into
 * public/blog/. "Editorial minimal" style: light grey background with the
 * Refinea square grid, brand mark, section chip, large title, author byline.
 *
 * Run with:  node scripts/generate-blog-covers.mjs
 *
 * Re-run any time the title/section/author of an article changes. The
 * output is deterministic, so re-running produces byte-identical files
 * unless inputs change.
 */

// ESM needs the explicit file path — "next/og" alone resolves only
// under the Next bundler, not plain Node.
import { ImageResponse } from "next/og.js";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const OUT_DIR = join(process.cwd(), "public", "blog");
const LOGO_SVG = join(process.cwd(), "public", "logos", "refinea viola.svg");
const W = 1600;
const H = 900;
const ACCENT = "#6c47ff";
const BG = "#f5f6f7";
/** On-screen logo height inside the cover, in cover px. */
const LOGO_H = 52;

/** satori (the ImageResponse engine) cannot render the brand SVG — it
 *  uses <filter>/<mask>/feColorMatrix which satori does not support.
 *  So we rasterize the SVG to a PNG with sharp and embed it as a
 *  data URL. Rendered at 3x for crisp downscaling. */
async function loadLogoDataUrl() {
  const svg = await readFile(LOGO_SVG);
  const png = await sharp(svg)
    .resize({ height: LOGO_H * 3 })
    .png()
    .toBuffer();
  return `data:image/png;base64,${png.toString("base64")}`;
}

/** Every article that needs a generated cover. `file` is the exact name
 *  referenced by each MDX frontmatter `cover:` field. `section` and
 *  `author` drive the chip and byline. Keep this list in sync with
 *  content/posts/. */
const COVERS = [
  // ── Launch batch (May 2026) ──────────────────────────────────────
  {
    file: "refinea-analysis-cover.png",
    section: "News",
    title: "Refinea Analysis: lo standard italiano per misurare la AI Visibility",
    author: "Vito Guglielmino",
  },
  {
    file: "geo-operational-guide-2026-cover.png",
    section: "Guides",
    title: "Generative Engine Optimization: la guida operativa per il 2026",
    author: "Vito Guglielmino",
  },
  {
    file: "real-customers-vs-generic-prompts-cover.png",
    section: "News",
    title: "AI Visibility per i tuoi clienti reali: perché i prompt generici falliscono",
    author: "Vito Guglielmino",
  },
  {
    file: "llm-citation-signals-cover.png",
    section: "Guides",
    title: "Come gli LLM scelgono cosa citare: i sette segnali che decidono",
    author: "Giorgio Monaco",
  },
  {
    file: "measuring-ai-visibility-cover.png",
    section: "Guides",
    title: "Misurare la AI Visibility: le metriche che contano davvero",
    author: "Vito Guglielmino",
  },
  // ── Earlier articles — re-covered for visual consistency ─────────
  {
    file: "what-is-geo-cover.png",
    section: "Guides",
    title: "What Is Generative Engine Optimization (GEO)?",
    author: "Vito Guglielmino",
  },
  {
    file: "geo-vs-seo-cover.png",
    section: "News",
    title: "GEO vs SEO: Key Differences Explained",
    author: "Vito Guglielmino",
  },
  {
    file: "servizi-geo-italia-cover.png",
    section: "Guides",
    title: "Servizi GEO in Italia: Guida Completa 2026",
    author: "Vito Guglielmino",
  },
];

/** Inter TTF URLs resolved from the Google Fonts CSS API (the default
 *  UA returns truetype, which @vercel/og parses). Pinned here so the
 *  build is reproducible — re-resolve from
 *  fonts.googleapis.com/css2?family=Inter:wght@400;600;700 if Google
 *  ever rotates the v20 hashes. */
const FONT_URLS = {
  400: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf",
  600: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.ttf",
  700: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf",
};

async function loadFonts() {
  const entries = await Promise.all(
    Object.entries(FONT_URLS).map(async ([weight, url]) => {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Font fetch failed (${res.status}) for ${url}`);
      }
      return {
        name: "Inter",
        data: await res.arrayBuffer(),
        weight: Number(weight),
        style: "normal",
      };
    }),
  );
  return entries;
}

function CoverElement({ section, title, author, logoDataUrl }) {
  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: BG,
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        padding: "80px 88px",
        fontFamily: "Inter",
      },
      children: [
        // Top row: brand mark + section chip
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            },
            children: [
              {
                type: "div",
                props: {
                  style: { display: "flex", alignItems: "center", gap: 10 },
                  children: [
                    {
                      type: "img",
                      props: {
                        src: logoDataUrl,
                        height: LOGO_H,
                        style: { height: LOGO_H, objectFit: "contain" },
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: 28,
                          fontWeight: 700,
                          color: "#000",
                          letterSpacing: "-0.02em",
                        },
                        children: "Refinea",
                      },
                    },
                  ],
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 20,
                    fontWeight: 600,
                    color: ACCENT,
                    background: "rgba(108,71,255,0.08)",
                    border: "1px solid rgba(108,71,255,0.18)",
                    borderRadius: 999,
                    padding: "10px 22px",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  },
                  children: section,
                },
              },
            ],
          },
        },
        // Title block
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              fontSize: 68,
              fontWeight: 700,
              color: "#000",
              letterSpacing: "-0.03em",
              lineHeight: 1.12,
              maxWidth: 1280,
            },
            children: title,
          },
        },
        // Bottom row: byline
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 24,
              color: "rgba(0,0,0,0.55)",
              fontWeight: 500,
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: ACCENT,
                  },
                },
              },
              { type: "div", props: { children: author } },
              {
                type: "div",
                props: {
                  style: { color: "rgba(0,0,0,0.25)" },
                  children: "·",
                },
              },
              { type: "div", props: { children: "refinea.io" } },
            ],
          },
        },
      ],
    },
  };
}

async function main() {
  const [fonts, logoDataUrl] = await Promise.all([
    loadFonts(),
    loadLogoDataUrl(),
  ]);
  await mkdir(OUT_DIR, { recursive: true });

  for (const cover of COVERS) {
    const img = new ImageResponse(CoverElement({ ...cover, logoDataUrl }), {
      width: W,
      height: H,
      fonts,
    });
    const buf = Buffer.from(await img.arrayBuffer());
    const outPath = join(OUT_DIR, cover.file);
    await writeFile(outPath, buf);
    console.log(`✓ ${cover.file}  (${(buf.length / 1024).toFixed(0)} KB)`);
  }
  console.log(`\nDone — ${COVERS.length} covers written to public/blog/`);
}

main().catch((err) => {
  console.error("Cover generation failed:", err);
  process.exit(1);
});
