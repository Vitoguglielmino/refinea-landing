import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getPostsBySection, type PostLocale } from "@/lib/mdx";
import { buildGlossaryIndexJsonLd } from "@/lib/blog-schema";
import Nav from "../../../components/Nav";
import Footer from "../../../components/Footer";
import Breadcrumb from "../../../components/Breadcrumb";
import { Link } from "@/i18n/routing";

const SITE_URL = "https://refinea.io";
const PATH = "/blog/glossary";

const META = {
  en: {
    title: "Glossary | Refinea — AI Search & GEO definitions",
    description:
      "Canonical definitions of the terms shaping AI search, Generative Engine Optimization, and Answer Engine Optimization.",
    h1: "Refinea GEO Glossary",
    intro:
      "Canonical definitions of the terms shaping AI search. Each entry is built to be cited directly by ChatGPT, Perplexity, Claude, and Google AI Overviews.",
    ogLocale: "en_US",
    emptyState: "Glossary entries are being added — check back soon.",
  },
  it: {
    title: "Glossario | Refinea — Definizioni AI Search e GEO",
    description:
      "Definizioni canoniche dei termini che modellano la AI search, la Generative Engine Optimization e la Answer Engine Optimization.",
    h1: "Glossario GEO di Refinea",
    intro:
      "Definizioni canoniche dei termini che modellano la AI search. Ogni voce è costruita per essere citata direttamente da ChatGPT, Perplexity, Claude e Google AI Overviews.",
    ogLocale: "it_IT",
    emptyState: "Le voci del glossario sono in arrivo — torna a trovarci presto.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isIt = locale === "it";
  const meta = isIt ? META.it : META.en;
  const canonical = isIt ? `${SITE_URL}/it${PATH}` : `${SITE_URL}${PATH}`;

  return {
    title: { absolute: meta.title },
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonical,
      type: "website",
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

export default async function GlossaryIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isIt = locale === "it";
  const meta = isIt ? META.it : META.en;

  const postLocale: PostLocale = locale === "it" ? "it" : "en";
  const entries = getPostsBySection("glossary", postLocale).sort((a, b) =>
    a.title.localeCompare(b.title),
  );
  const jsonLd = buildGlossaryIndexJsonLd(entries, postLocale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="landing bg-background text-foreground min-h-screen">
        <Nav />

        <main className="pt-20 pb-24">
          <section className="section-lines py-10 md:py-14">
            <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
              <div className="mb-8">
                <Breadcrumb
                  items={[
                    { name: "Blog", href: "/blog" },
                    { name: "Glossary", href: "/blog/glossary" },
                  ]}
                />
              </div>

              <div className="mb-12 md:mb-16">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent mb-4">
                  Glossary
                </p>
                <h1 className="text-black mb-5 max-w-[820px]">{meta.h1}</h1>
                <p className="text-black/60 text-lg leading-relaxed max-w-[640px]">
                  {meta.intro}
                </p>
              </div>

              {entries.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-sm text-black/40">{meta.emptyState}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {entries.map((entry) => (
                    <Link
                      key={entry.slug}
                      href={`/blog/${entry.slug}`}
                      className="group flex flex-col gap-2 p-5 rounded-2xl bg-white border border-black/[0.07] hover:border-accent/[0.3] hover:shadow-[0_2px_16px_rgba(0,0,0,0.05)] transition-all"
                    >
                      <h2
                        className="text-[16px] font-bold text-black group-hover:text-accent transition-colors"
                        style={{ letterSpacing: "-0.01em" }}
                      >
                        {entry.title}
                      </h2>
                      <p className="text-[13px] text-black/60 leading-relaxed line-clamp-2">
                        {entry.description}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
