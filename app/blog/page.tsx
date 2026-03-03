import { getAllPostMetas, formatDate, type PostMeta } from "@/lib/mdx";
import Nav from "../components/Nav";
import Link from "next/link";

export const metadata = {
  title: "Blog - Refinea | GEO & AI Visibility Insights",
  description:
    "Insights on Generative Engine Optimization, AI visibility, LLM optimization, and how brands can appear in ChatGPT, Gemini, and Perplexity responses.",
  alternates: { canonical: "https://refinea.io/blog" },
  openGraph: {
    title: "Blog - Refinea | GEO & AI Visibility Insights",
    description:
      "Insights on Generative Engine Optimization, AI visibility, LLM optimization, and how brands can appear in ChatGPT, Gemini, and Perplexity responses.",
    url: "https://refinea.io/blog",
    siteName: "Refinea",
    type: "website",
  },
};

// ─── Persona badge ─────────────────────────────────────────────────────────────

function PersonaBadge({ persona }: { persona: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full border text-accent/80 bg-accent/[0.06] border-accent/[0.15]">
      <span className="w-1 h-1 rounded-full bg-accent/60 shrink-0" />
      {persona}
    </span>
  );
}

// ─── Article card ──────────────────────────────────────────────────────────────

function ArticleCard({ post }: { post: PostMeta }) {
  const cover = post.cover;
  const persona = post.persona;
  const entity = post.entity;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl border border-black/[0.06] bg-white/60 overflow-hidden hover:border-black/[0.12] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300"
    >
      {/* Cover image */}
      <div className="relative w-full aspect-[16/9] bg-[#0d0d0d] overflow-hidden">
        {cover ? (
          <img
            src={cover}
            alt={post.title}
            className="w-full h-full object-cover"
            style={{ filter: "grayscale(90%) contrast(1.05)" }}
          />
        ) : (
          /* Placeholder when no featured image */
          <div className="absolute inset-0 flex items-end p-4">
            <div className="space-y-1.5 w-full">
              <div className="h-2 rounded-full bg-white/10 w-3/4" />
              <div className="h-2 rounded-full bg-white/10 w-1/2" />
            </div>
          </div>
        )}
        {/* Subtle grid overlay on image */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Top row: persona + date */}
        <div className="flex items-center justify-between gap-2">
          {persona ? (
            <PersonaBadge persona={persona} />
          ) : (
            <span />
          )}
          <time className="text-[11px] text-black/30 font-mono shrink-0">
            {formatDate(post.date)}
          </time>
        </div>

        {/* Title */}
        <h2
          className="text-[16px] font-bold text-black leading-snug tracking-[-0.015em] group-hover:text-accent transition-colors duration-200"
        >
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-[13px] text-black/50 leading-relaxed line-clamp-2 flex-1">
          {post.description}
        </p>

        {/* GEO metadata footer */}
        {(entity || persona) && (
          <div className="pt-3 mt-auto border-t border-black/[0.05]">
            <p className="text-[10px] font-mono text-black/30 leading-relaxed">
              {entity && `// entity: ${entity}`}
              {entity && persona && "  "}
              {persona && `// intent: ${persona}`}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="col-span-full py-24 text-center">
      <p className="text-[13px] font-mono text-black/25 mb-2">
        {">"}  no_posts_found
      </p>
      <p className="text-sm text-black/30">
        Add <code className="font-mono text-xs bg-black/[0.04] px-1.5 py-0.5 rounded">.mdx</code> files to <code className="font-mono text-xs bg-black/[0.04] px-1.5 py-0.5 rounded">content/posts/</code> to start publishing.
      </p>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function BlogPage() {
  const posts = getAllPostMetas();

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-background pt-16">

        {/* Hero */}
        <section className="section-lines pt-24 pb-16">
          <div className="mx-auto max-w-[1100px] px-6">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent bg-accent/[0.08] border border-accent/[0.15] px-3.5 py-1.5 rounded-full mb-8">
              <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
              The Lab
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
              <div>
                <h1 className="text-5xl md:text-[52px] font-bold leading-[1.02] tracking-[-0.03em] text-black">
                  Intelligence,<br />
                  <span style={{ color: "rgba(0,0,0,0.2)" }}>documented.</span>
                </h1>
              </div>
              <div>
                <p className="text-lg text-black/55 leading-relaxed">
                  Research, patterns, and observations on how AI recommends brands - and what it means for the companies building on top of it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="pb-28">
          <div className="mx-auto max-w-[1100px] px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.length === 0 ? (
                <EmptyState />
              ) : (
                posts.map((post) => <ArticleCard key={post.slug} post={post} />)
              )}
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
