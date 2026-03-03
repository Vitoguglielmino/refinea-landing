import {
  getPostBySlug,
  getAllSlugs,
  formatDate,
  formatShortDate,
  extractHeadings,
} from "@/lib/mdx";
import Nav from "../../components/Nav";
import ArticleSidebar, { MobileTOC } from "../../components/blog/ArticleSidebar";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://refinea.io";

// ─── Static params (SSG) ───────────────────────────────────────────────────────

export function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not found - Refinea" };
  const description = post.description.slice(0, 160);
  const cover = post.cover;
  const canonicalUrl = `${SITE_URL}/blog/${slug}`;
  return {
    title: `${post.title} - Refinea Blog`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: post.title,
      description,
      url: canonicalUrl,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
      siteName: "Refinea",
      ...(cover ? { images: [{ url: cover, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      ...(cover ? { images: [cover] } : {}),
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const cover       = post.cover;
  const persona     = post.persona;
  const entity      = post.entity;
  const jsonLd      = post.jsonLd;
  const headings    = extractHeadings(post.contentHtml);
  const contentHtml = post.contentHtml;
  const articleUrl  = `${SITE_URL}/blog/${post.slug}`;
  const wasUpdated  = post.modified && post.modified !== post.date;

  return (
    <>
      {/* JSON-LD - critical for LLM scrapers */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}

      <Nav />
      <main className="min-h-screen bg-white pt-16">

        {/* Cover image */}
        {cover && (
          <div className="relative w-full h-[280px] md:h-[380px] overflow-hidden bg-[#0d0d0d]">
            <img
              src={cover}
              alt={post.title}
              className="w-full h-full object-cover"
              style={{ filter: "grayscale(90%) contrast(1.05)" }}
            />
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />
          </div>
        )}

        {/* Content area */}
        <div className="mx-auto max-w-[1100px] px-6 py-12">

          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[12px] font-mono text-black/30 hover:text-black transition-colors mb-10"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M12 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            /blog
          </Link>

          {/* Article header */}
          <header className="max-w-[720px] mb-10">
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              {persona && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full border text-accent/80 bg-accent/[0.06] border-accent/[0.15]">
                  <span className="w-1 h-1 rounded-full bg-accent/60 shrink-0" />
                  {persona}
                </span>
              )}
              {/* Updated badge */}
              <div
                className="flex items-center gap-2 pl-3 text-[12px] font-semibold text-black/60"
                style={{ borderLeft: "2px solid #6c47ff" }}
              >
                {wasUpdated ? (
                  <span>Updated {formatShortDate(post.modified!)}</span>
                ) : (
                  <time>{formatDate(post.date)}</time>
                )}
              </div>
            </div>

            {/* Title */}
            <h1
              className="text-3xl md:text-[40px] font-bold leading-[1.1] tracking-[-0.025em]"
              style={{ color: "#1A1A1A" }}
            >
              {post.title}
            </h1>
          </header>

          {/* Split layout: sidebar + content */}
          <div
            className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-x-14 gap-y-0"
            style={{ borderTop: "0.5px solid #E5E7EB" }}
          >
            {/* LEFT - sticky sidebar (desktop only) */}
            <div className="pt-8">
              <ArticleSidebar headings={headings} articleUrl={articleUrl} />
            </div>

            {/* RIGHT - main content */}
            <div
              className="pt-8 min-w-0"
              style={{ borderLeft: "0.5px solid #E5E7EB", paddingLeft: "3.5rem" }}
            >
              {/* Mobile TOC */}
              <MobileTOC headings={headings} />

              {/* GEO metadata box */}
              {(entity || persona) && (
                <div
                  className="rounded-xl border border-accent/[0.12] bg-accent/[0.02] p-4 mb-8"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/30 mb-2.5">
                    GEO Optimization
                  </p>
                  <div className="space-y-1.5">
                    {persona && (
                      <p className="text-[12px] font-mono" style={{ color: "#555" }}>
                        <span className="text-accent/70">intent</span>{"  →  "}{persona}
                      </p>
                    )}
                    {entity && (
                      <p className="text-[12px] font-mono" style={{ color: "#555" }}>
                        <span className="text-accent/70">entity</span>{"  →  "}{entity}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Article body */}
              <article
                className="prose max-w-none
                  prose-headings:font-bold prose-headings:tracking-[-0.02em]
                  prose-h2:text-[22px] prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-[18px]
                  prose-p:leading-[1.85] prose-p:mb-5
                  prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                  prose-code:font-mono prose-code:text-[0.85em] prose-code:bg-black/[0.04] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                  prose-pre:bg-[#0d0d0d] prose-pre:text-white/80 prose-pre:rounded-xl
                  prose-blockquote:border-l-2 prose-blockquote:border-accent/50 prose-blockquote:not-italic prose-blockquote:text-black/55
                  prose-img:rounded-xl
                  prose-table:text-sm prose-th:text-left prose-th:font-semibold prose-th:border-b prose-th:border-black/10 prose-th:pb-2 prose-td:border-b prose-td:border-black/[0.05] prose-td:py-2"
                style={{
                  fontSize: "18px",
                  color: "#1A1A1A",
                  lineHeight: "1.85",
                }}
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />

              {/* Closing CTA */}
              <div
                className="mt-14 pt-10"
                style={{ borderTop: "0.5px solid #E5E7EB" }}
              >
                <p className="text-[11px] font-mono text-black/25 mb-5">
                  {">"} optimized_for: {persona ?? "General"} · entity: {entity ?? "Refinea"}
                </p>
                <h2 className="text-2xl font-bold tracking-[-0.02em] mb-3" style={{ color: "#1A1A1A" }}>
                  Know exactly where your brand stands in AI.
                </h2>
                <p className="text-base text-black/50 mb-6 leading-relaxed">
                  Get your free Persona Visibility Report - see how ChatGPT, Claude, and Gemini recommend your brand, persona by persona.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent/90 active:scale-[0.99] transition-all"
                >
                  Get your free report
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
}
