import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getPostsByAuthor, type PostLocale } from "@/lib/mdx";
import { getAllAuthors, getAuthor, type AuthorSlug } from "@/lib/authors";
import { buildAuthorPageJsonLd } from "@/lib/blog-schema";
import Nav from "../../../../components/Nav";
import Footer from "../../../../components/Footer";
import Breadcrumb from "../../../../components/Breadcrumb";
import ArticleCard from "../../../../components/blog/ArticleCard";

const SITE_URL = "https://refinea.io";

export function generateStaticParams() {
  return (["en", "it"] as const).flatMap((locale) =>
    getAllAuthors().map((author) => ({ locale, slug: author.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const author = getAuthor(slug);
  if (!author) return { title: "Not found | Refinea" };

  const isIt = locale === "it";
  const path = `/blog/author/${author.slug}`;
  const canonical = isIt ? `${SITE_URL}/it${path}` : `${SITE_URL}${path}`;
  const title = `${author.name} | Refinea`;

  return {
    title: { absolute: title },
    description: author.bio,
    openGraph: {
      title,
      description: author.bio,
      url: canonical,
      type: "profile",
      locale: isIt ? "it_IT" : "en_US",
      alternateLocale: isIt ? ["en_US"] : ["it_IT"],
      images: [{ url: `${SITE_URL}${author.image}`, alt: author.name }],
    },
    alternates: {
      canonical,
      languages: {
        en: `${SITE_URL}${path}`,
        it: `${SITE_URL}/it${path}`,
        "x-default": `${SITE_URL}${path}`,
      },
    },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const author = getAuthor(slug);
  if (!author) notFound();

  const postLocale: PostLocale = locale === "it" ? "it" : "en";
  const posts = getPostsByAuthor(author.slug as AuthorSlug, postLocale);
  const jsonLd = buildAuthorPageJsonLd(author, posts, postLocale);

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
                    { name: author.name, href: `/blog/author/${author.slug}` },
                  ]}
                />
              </div>

              {/* Author header */}
              <header className="mb-12 md:mb-14 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 max-w-[820px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={author.image}
                  alt={author.name}
                  width={96}
                  height={96}
                  className="rounded-full object-cover shrink-0"
                  style={{ width: 96, height: 96 }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent mb-2">
                    Author
                  </p>
                  <h1
                    className="text-black mb-2"
                    style={{ fontSize: 36, lineHeight: 1.1, letterSpacing: "-0.025em" }}
                  >
                    {author.name}
                  </h1>
                  <p className="text-base text-black/60 mb-4">
                    {author.jobTitle}
                  </p>
                  <p className="text-black/70 text-[15px] leading-relaxed mb-4 max-w-[640px]">
                    {author.bio}
                  </p>
                  <a
                    href={author.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent hover:underline"
                  >
                    LinkedIn →
                  </a>
                </div>
              </header>

              {/* Knows about — entity signal made visible */}
              {author.knowsAbout.length > 0 && (
                <div className="mb-12 max-w-[820px]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 mb-3">
                    Expertise
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {author.knowsAbout.map((topic) => (
                      <span
                        key={topic}
                        className="inline-flex items-center text-[12px] font-medium px-2.5 py-1 rounded-full text-black/65 bg-black/[0.04] border border-black/[0.06]"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Posts */}
              <div className="mb-8">
                <h2
                  className="text-black mb-2"
                  style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.015em" }}
                >
                  Posts by {author.name.split(" ")[0]}
                </h2>
                <p className="text-sm text-black/50">
                  {posts.length} {posts.length === 1 ? "article" : "articles"}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {posts.length === 0 ? (
                  <div className="col-span-full py-16 text-center">
                    <p className="text-sm text-black/40">No posts yet.</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <ArticleCard key={post.slug} post={post} />
                  ))
                )}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
