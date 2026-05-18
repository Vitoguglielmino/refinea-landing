import { getAllPostMetas } from "@/lib/mdx";
import { getAllSections } from "@/lib/blog-taxonomy";
import { setRequestLocale } from "next-intl/server";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import ArticleCard from "../../components/blog/ArticleCard";
import { Link } from "@/i18n/routing";

const SITE_URL = "https://refinea.io";
const PATH = "/blog";

const META = {
  en: {
    title: "Blog | AI Visibility & GEO Insights",
    description:
      "Guides and research on Generative Engine Optimization, AI visibility, and how ChatGPT, Gemini and Perplexity recommend brands.",
    ogLocale: "en_US",
  },
  it: {
    title: "Blog | Visibilità AI & GEO",
    description:
      "Guide e ricerche su Generative Engine Optimization, visibilità AI e come ChatGPT, Gemini e Perplexity raccomandano i brand.",
    ogLocale: "it_IT",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isIt = locale === "it";
  const meta = isIt ? META.it : META.en;
  const canonical = isIt ? `${SITE_URL}/it${PATH}` : `${SITE_URL}${PATH}`;

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonical,
      siteName: "Refinea",
      type: "website" as const,
      locale: meta.ogLocale,
      alternateLocale: isIt ? ["en_US"] : ["it_IT"],
    },
    alternates: {
      canonical,
      languages: {
        en: `${SITE_URL}${PATH}`,
        it: `${SITE_URL}/it${PATH}`,
        "x-default": `${SITE_URL}${PATH}`,
      },
    },
  };
}

// ─── Article card ──────────────────────────────────────────────────────────────


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

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Show only posts whose source language matches the URL locale. Posts
  // exist in a single language (no parallel translations), so /blog lists
  // EN-only posts and /it/blog lists IT-only posts.
  const postLocale = locale === "it" ? "it" : "en";
  const posts = getAllPostMetas().filter((p) => p.locale === postLocale);

  return (
    <div className="landing bg-background text-foreground min-h-screen">
      <Nav />

      <main className="pt-20 pb-24">
        <section className="section-lines py-10 md:py-14">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            {/* Hero */}
            <div className="mb-8 md:mb-10">
              <h1 className="text-black mb-5 max-w-[820px]">
                AI Visibility &amp; GEO Insights
              </h1>
              <p className="text-black/60 text-lg leading-relaxed max-w-[640px]">
                Research, guides, and tactical insights on how AI recommends
                brands, and how to change the answer.
              </p>
            </div>

            {/* Section nav — All + 4 sections */}
            <div className="mb-12 flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center text-[13px] font-medium px-3.5 py-1.5 rounded-full text-white bg-accent"
              >
                All
              </span>
              {getAllSections().map((section) => (
                <Link
                  key={section.slug}
                  href={`/blog/section/${section.slug}`}
                  className="inline-flex items-center text-[13px] font-medium px-3.5 py-1.5 rounded-full text-black/65 bg-white border border-black/[0.08] hover:border-accent/[0.4] hover:text-accent transition-colors"
                >
                  {section.shortName}
                </Link>
              ))}
            </div>

            {/* Grid */}
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

      <Footer />
    </div>
  );
}
