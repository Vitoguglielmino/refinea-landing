import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getPostsByTopic, type PostLocale } from "@/lib/mdx";
import {
  getAllTopics,
  getTopic,
  type TopicSlug,
} from "@/lib/blog-taxonomy";
import { buildTopicPageJsonLd } from "@/lib/blog-schema";
import Nav from "../../../../components/Nav";
import Footer from "../../../../components/Footer";
import Breadcrumb from "../../../../components/Breadcrumb";
import ArticleCard from "../../../../components/blog/ArticleCard";
import { Link } from "@/i18n/routing";

const SITE_URL = "https://refinea.io";

export function generateStaticParams() {
  return (["en", "it"] as const).flatMap((locale) =>
    getAllTopics().map((topic) => ({ locale, slug: topic.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return { title: "Not found | Refinea" };

  const isIt = locale === "it";
  const path = `/blog/topic/${topic.slug}`;
  const canonical = isIt ? `${SITE_URL}/it${path}` : `${SITE_URL}${path}`;
  const title = `${topic.name} | Refinea Blog`;

  return {
    title: { absolute: title },
    description: topic.description,
    openGraph: {
      title,
      description: topic.description,
      url: canonical,
      type: "website",
      locale: isIt ? "it_IT" : "en_US",
      alternateLocale: isIt ? ["en_US"] : ["it_IT"],
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

export default async function TopicPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const topic = getTopic(slug);
  if (!topic) notFound();

  const postLocale: PostLocale = locale === "it" ? "it" : "en";
  const posts = getPostsByTopic(topic.slug as TopicSlug, postLocale);
  const jsonLd = buildTopicPageJsonLd(topic, posts, postLocale);

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
                    { name: topic.name, href: `/blog/topic/${topic.slug}` },
                  ]}
                />
              </div>

              <div className="mb-8 md:mb-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent mb-4">
                  Topic
                </p>
                <h1 className="text-black mb-5 max-w-[820px]">{topic.name}</h1>
                <p className="text-black/60 text-lg leading-relaxed max-w-[640px]">
                  {topic.about}
                </p>
              </div>

              {/* Topic nav */}
              <div className="mb-12 flex flex-wrap items-center gap-2">
                {getAllTopics().map((t) => (
                  <Link
                    key={t.slug}
                    href={`/blog/topic/${t.slug}`}
                    className={
                      t.slug === topic.slug
                        ? "inline-flex items-center text-[12px] font-medium px-3 py-1.5 rounded-full text-white bg-accent"
                        : "inline-flex items-center text-[12px] font-medium px-3 py-1.5 rounded-full text-black/65 bg-white border border-black/[0.08] hover:border-accent/[0.4] hover:text-accent transition-colors"
                    }
                  >
                    {t.name}
                  </Link>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {posts.length === 0 ? (
                  <div className="col-span-full py-24 text-center">
                    <p className="text-sm text-black/40">
                      No posts on this topic yet.
                    </p>
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
