import {
  getPostBySlug,
  getSlugsByLocale,
  getRelatedPosts,
  getTranslationSibling,
  formatDate,
  formatShortDate,
  extractHeadings,
} from "@/lib/mdx";
import { getAuthor } from "@/lib/authors";
import { getSection, getTopic } from "@/lib/blog-taxonomy";
import { buildPostJsonLd } from "@/lib/blog-schema";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Nav from "../../../components/Nav";
import Footer from "../../../components/Footer";
import Breadcrumb from "../../../components/Breadcrumb";
import ArticleSidebar, { MobileTOC } from "../../../components/blog/ArticleSidebar";
import { Link } from "@/i18n/routing";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://refinea.io";

// ─── Static params (SSG) ───────────────────────────────────────────────────────

export function generateStaticParams() {
  // Each post lives in exactly one locale (frontmatter `locale: "en" | "it"`),
  // so we emit a single `{locale, slug}` pair per post — never the cartesian
  // product. Wrong-locale visits are caught at runtime by the page-body
  // redirect below.
  return (["en", "it"] as const).flatMap((locale) =>
    getSlugsByLocale(locale).map((slug) => ({ locale, slug })),
  );
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not found | Refinea" };
  // Frontmatter `title` is the clean H1 used on the page; the SERP meta
  // title appends the brand suffix. `description` is authored to fit Google's
  // ~155-char SERP snippet, no truncation here.
  const metaTitle = `${post.title} | Refinea`;
  const description = post.description;
  const cover = post.cover;
  const canonicalUrl =
    post.locale === "it"
      ? `${SITE_URL}/it/blog/${slug}`
      : `${SITE_URL}/blog/${slug}`;

  // Hreflang strategy:
  //   - Post with a sibling translation (translationKey match across
  //     locales): emit reciprocal en + it + x-default. x-default points
  //     to the EN URL (consistent with sitemap policy).
  //   - Single-locale post: only the post's own language + x-default
  //     pointing to itself (Google's recommendation for content not
  //     available in other languages).
  const sibling = getTranslationSibling(post);
  const siblingUrl = sibling
    ? sibling.locale === "it"
      ? `${SITE_URL}/it/blog/${sibling.slug}`
      : `${SITE_URL}/blog/${sibling.slug}`
    : null;

  const languages: Record<string, string> = sibling
    ? {
        en: post.locale === "en" ? canonicalUrl : siblingUrl!,
        it: post.locale === "it" ? canonicalUrl : siblingUrl!,
        "x-default": post.locale === "en" ? canonicalUrl : siblingUrl!,
      }
    : {
        [post.locale]: canonicalUrl,
        "x-default": canonicalUrl,
      };

  return {
    title: metaTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title: post.title,
      description,
      url: canonicalUrl,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
      siteName: "Refinea",
      locale: post.locale === "it" ? "it_IT" : "en_US",
      ...(sibling
        ? {
            alternateLocale: [post.locale === "it" ? "en_US" : "it_IT"],
          }
        : {}),
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
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const tCta = await getTranslations("blogCta");
  const tNav = await getTranslations("nav");

  const post = getPostBySlug(slug);
  if (!post) notFound();

  // Redirect when the post's source language doesn't match the URL locale.
  // E.g. /blog/servizi-... → /it/blog/servizi-..., and /it/blog/geo-vs-seo
  // → /blog/geo-vs-seo. Next's `redirect()` throws a `NEXT_REDIRECT` error
  // that's caught upstream and serves a 307 (308 in production builds).
  if (post.locale !== locale) {
    const target =
      post.locale === "it"
        ? `/it/blog/${post.slug}`
        : `/blog/${post.slug}`;
    redirect(target);
  }

  const cover       = post.cover;
  const persona     = post.persona;
  const entity      = post.entity;
  const jsonLd      = post.jsonLd;
  const headings    = extractHeadings(post.contentHtml);
  const contentHtml = post.contentHtml;
  const articleUrl  = post.locale === "it"
    ? `${SITE_URL}/it/blog/${post.slug}`
    : `${SITE_URL}/blog/${post.slug}`;
  const wasUpdated  = post.modified && post.modified !== post.date;

  const postJsonLd = buildPostJsonLd(post);
  const author = getAuthor(post.author);
  const section = getSection(post.section);
  const relatedPosts = getRelatedPosts(post, 3);
  const sibling = getTranslationSibling(post);

  return (
    <>
      {/* Article JSON-LD — type dispatched from post.section (BlogPosting /
          NewsArticle / TechArticle / DefinedTerm) with Person author and
          DefinedTerm about[] anchors. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd) }}
      />
      {/* Optional per-post JSON-LD override from frontmatter */}
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
                backgroundSize: "16px 16px",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />
          </div>
        )}

        {/* Content area */}
        <div className="mx-auto max-w-[1100px] px-6 py-12">

          {/* Breadcrumb */}
          <Breadcrumb items={[
            { name: tNav("resourcesItems.blog"), href: "/blog" },
            { name: post.title, href: `/blog/${post.slug}` },
          ]} />

          {/* Article header */}
          <header className="max-w-[720px] mb-10">
            {/* Section + persona chips + translation link */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {section && (
                <Link
                  href={`/blog/section/${section.slug}`}
                  className="inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full text-accent bg-accent/[0.08] border border-accent/[0.18] hover:bg-accent/[0.12] transition-colors"
                >
                  {section.shortName}
                </Link>
              )}
              {persona && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full border text-black/60 bg-black/[0.03] border-black/[0.08]">
                  <span className="w-1 h-1 rounded-full bg-black/40 shrink-0" />
                  {persona}
                </span>
              )}
              {sibling && (
                <a
                  href={
                    sibling.locale === "it"
                      ? `/it/blog/${sibling.slug}`
                      : `/blog/${sibling.slug}`
                  }
                  hrefLang={sibling.locale}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full text-black/65 bg-white border border-black/[0.08] hover:border-accent/[0.4] hover:text-accent transition-colors"
                >
                  <span className="font-mono text-[10px] uppercase tracking-wider">
                    {sibling.locale}
                  </span>
                  <span>
                    {sibling.locale === "it"
                      ? "Leggi in italiano"
                      : "Read in English"}
                  </span>
                </a>
              )}
            </div>

            {/* Title */}
            <h1
              className="text-3xl md:text-[40px] font-bold leading-[1.1] tracking-[-0.025em] mb-6"
              style={{ color: "#1A1A1A" }}
            >
              {post.title}
            </h1>

            {/* Author byline + date */}
            {author && (
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={author.image}
                  alt={author.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover shrink-0"
                  style={{ width: 40, height: 40 }}
                />
                <div className="flex flex-col">
                  <Link
                    href={`/blog/author/${author.slug}`}
                    className="text-sm font-semibold text-black hover:text-accent transition-colors leading-tight"
                  >
                    {author.name}
                  </Link>
                  <div className="flex items-center gap-2 text-[12px] text-black/50 leading-tight mt-0.5">
                    <span>{author.jobTitle}</span>
                    <span className="text-black/20">·</span>
                    {wasUpdated ? (
                      <span>Updated {formatShortDate(post.modified!)}</span>
                    ) : (
                      <time>{formatDate(post.date)}</time>
                    )}
                  </div>
                </div>
              </div>
            )}
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

              {/* Topics chips — surface the cluster the article belongs to */}
              {post.topics.length > 0 && (
                <div
                  className="mt-12 pt-8 flex flex-wrap items-center gap-2"
                  style={{ borderTop: "0.5px solid #E5E7EB" }}
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-black/40 mr-2">
                    Topics
                  </span>
                  {post.topics.map((topicSlug) => {
                    const topic = getTopic(topicSlug);
                    if (!topic) return null;
                    return (
                      <Link
                        key={topic.slug}
                        href={`/blog/topic/${topic.slug}`}
                        className="inline-flex items-center text-[12px] font-medium px-2.5 py-1 rounded-full text-black/65 bg-black/[0.04] border border-black/[0.06] hover:bg-accent/[0.08] hover:text-accent hover:border-accent/[0.18] transition-colors"
                      >
                        {topic.name}
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Related posts — same topic cluster, deterministic ranking */}
              {relatedPosts.length > 0 && (
                <section
                  className="mt-12 pt-10"
                  style={{ borderTop: "0.5px solid #E5E7EB" }}
                >
                  <h2
                    className="text-xl font-bold tracking-[-0.02em] mb-6"
                    style={{ color: "#1A1A1A" }}
                  >
                    Continue reading
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {relatedPosts.map((rel) => (
                      <Link
                        key={rel.slug}
                        href={`/blog/${rel.slug}`}
                        className="group flex flex-col p-4 rounded-xl border border-black/[0.07] bg-white hover:border-black/[0.15] hover:shadow-[0_2px_16px_rgba(0,0,0,0.05)] transition-all"
                      >
                        <time className="text-[10px] text-black/35 font-mono mb-1.5">
                          {formatDate(rel.date)}
                        </time>
                        <h3
                          className="text-[14px] font-bold text-black group-hover:text-accent transition-colors leading-snug mb-1.5"
                          style={{ letterSpacing: "-0.01em" }}
                        >
                          {rel.title}
                        </h3>
                        <p className="text-[12px] text-black/55 leading-relaxed line-clamp-2">
                          {rel.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Closing CTA */}
              <section
                className="mt-14 pt-10"
                style={{ borderTop: "0.5px solid #E5E7EB" }}
              >
                <h2
                  className="text-2xl font-bold tracking-[-0.02em] mb-3"
                  style={{ color: "#1A1A1A" }}
                >
                  {tCta("title")}
                </h2>
                <p className="text-base text-black/55 mb-7 leading-relaxed max-w-[560px]">
                  {tCta("body")}
                </p>
                <Link
                  href="https://platform.refinea.io"
                  className="inline-flex items-center text-white bg-accent hover:bg-accent/90 active:scale-[0.98] transition-all"
                  style={{
                    gap: 8,
                    padding: "12px 22px",
                    fontSize: 16,
                    fontWeight: 500,
                    border: "1px solid transparent",
                    borderRadius: 8,
                    whiteSpace: "nowrap",
                    lineHeight: 1.2,
                  }}
                >
                  {tCta("cta")}
                </Link>
              </section>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
