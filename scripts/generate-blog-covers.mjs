/**
 * Blog cover generator — auto-discovery.
 *
 * Scans content/posts/<locale>/, reads each post's frontmatter, and renders an
 * Open Graph cover image for every post that declares a `cover:` field
 * pointing at /blog/<name>.png. Title, section and author come straight
 * from the MDX frontmatter, so the cover always matches the published
 * article — including its language (an Italian post gets an Italian
 * cover, an English post an English one, automatically).
 *
 * Style: "editorial minimal" — light grey background with the Refinea
 * square grid, the brand logo, a section chip, a large title, and the
 * author byline. 1600x900 PNG.
 *
 * Run:  npm run covers
 *
 * The output is deterministic: re-running produces byte-identical files
 * unless a post's title/section/author changes. Commit the regenerated
 * PNGs alongside the post — covers are versioned assets, not build
 * artifacts (stable URLs => clean social/CDN caching).
 */

import { ImageResponse } from "next/og.js";
import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import sharp from "sharp";

const ROOT = process.cwd();
const POSTS_DIR = join(ROOT, "content", "posts");
const OUT_DIR = join(ROOT, "public", "blog");
const LOGO_SVG = join(ROOT, "public", "logos", "refinea viola.svg");

const W = 1600;
const H = 900;
const ACCENT = "#6c47ff";
const BG = "#f5f6f7";
const LOGO_H = 52;

/** Maps a frontmatter `section` slug to the label shown on the chip. */
const SECTION_LABEL = {
  product: "Product",
  news: "News",
  guides: "Guides",
  glossary: "Glossary",
};

/** Maps a frontmatter `author` slug to the display name on the byline.
 *  Keep in sync with lib/authors.ts. */
const AUTHOR_NAME = {
  vito: "Vito Guglielmino",
  giorgio: "Giorgio Monaco",
};

/* ─── Logo ───────────────────────────────────────────────────────────── */

/** satori (the ImageResponse engine) cannot render the brand SVG — it
 *  uses <filter>/<mask>/feColorMatrix, none of which satori supports.
 *  We rasterize the SVG to PNG with sharp (3x for crisp downscaling)
 *  and embed it as a data URL. */
async function loadLogoDataUrl() {
  const svg = await readFile(LOGO_SVG);
  const png = await sharp(svg)
    .resize({ height: LOGO_H * 3 })
    .png()
    .toBuffer();
  return `data:image/png;base64,${png.toString("base64")}`;
}

/* ─── Fonts ──────────────────────────────────────────────────────────── */

/** Inter TTF URLs resolved from the Google Fonts CSS API (the default
 *  UA returns truetype, which @vercel/og parses). Pinned for a
 *  reproducible build — re-resolve from
 *  fonts.googleapis.com/css2?family=Inter:wght@400;600;700 if Google
 *  ever rotates the v20 hashes. */
const FONT_URLS = {
  400: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf",
  600: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.ttf",
  700: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf",
};

async function loadFonts() {
  return Promise.all(
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
}

/* ─── Post discovery ─────────────────────────────────────────────────── */

/** Posts live in per-locale subfolders. Translated pairs share a slug,
 *  so each locale gets its own cover (en/<slug>.mdx -> EN cover). */
const LOCALES = ["en", "it"];

/**
 * Reads every .mdx under content/posts/<locale>/ and returns the covers
 * to render. A post contributes a cover only when its frontmatter
 * `cover:` points at a local /blog/<name>.png path. Posts without a
 * cover, or pointing at an external/non-png path, are skipped (logged).
 */
async function discoverCovers() {
  const covers = [];
  const skipped = [];

  for (const locale of LOCALES) {
    const dir = join(POSTS_DIR, locale);
    let files;
    try {
      files = (await readdir(dir)).filter((f) => f.endsWith(".mdx"));
    } catch {
      continue; // locale folder may not exist
    }

    for (const filename of files) {
      const raw = await readFile(join(dir, filename), "utf-8");
      const { data } = matter(raw);
      const slug = `${locale}/${filename.replace(/\.mdx$/, "")}`;

      const cover = typeof data.cover === "string" ? data.cover.trim() : "";
      if (!cover.startsWith("/blog/") || !cover.endsWith(".png")) {
        skipped.push({ slug, reason: cover ? `non-local cover (${cover})` : "no cover field" });
        continue;
      }

      const title = typeof data.title === "string" ? data.title.trim() : "";
      if (!title) {
        skipped.push({ slug, reason: "missing title" });
        continue;
      }

      covers.push({
        // Strip the /blog/ prefix — OUT_DIR already is public/blog.
        file: cover.slice("/blog/".length),
        title,
        section: SECTION_LABEL[data.section] ?? "Article",
        author: AUTHOR_NAME[data.author] ?? "Refinea",
      });
    }
  }

  return { covers, skipped };
}

/* ─── Cover element ──────────────────────────────────────────────────── */

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
        // Top row: logo + section chip
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

/* ─── Main ───────────────────────────────────────────────────────────── */

async function main() {
  const [fonts, logoDataUrl, discovery] = await Promise.all([
    loadFonts(),
    loadLogoDataUrl(),
    discoverCovers(),
  ]);
  await mkdir(OUT_DIR, { recursive: true });

  const { covers, skipped } = discovery;

  for (const cover of covers) {
    const img = new ImageResponse(CoverElement({ ...cover, logoDataUrl }), {
      width: W,
      height: H,
      fonts,
    });
    const buf = Buffer.from(await img.arrayBuffer());
    await writeFile(join(OUT_DIR, cover.file), buf);
    console.log(`✓ ${cover.file}  (${(buf.length / 1024).toFixed(0)} KB)`);
  }

  if (skipped.length > 0) {
    console.log("\nSkipped:");
    for (const s of skipped) console.log(`  · ${s.slug} — ${s.reason}`);
  }
  console.log(`\nDone — ${covers.length} covers written to public/blog/`);
}

main().catch((err) => {
  console.error("Cover generation failed:", err);
  process.exit(1);
});
