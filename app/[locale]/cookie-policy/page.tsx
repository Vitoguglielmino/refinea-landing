import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import CookiePolicyEnContent from "./CookiePolicyEnContent";
import CookiePolicyItContent from "./CookiePolicyItContent";

const SITE_URL = "https://refinea.io";
const PATH = "/cookie-policy";

const META = {
  en: {
    description:
      "How Refinea uses cookies and similar technologies, what data we collect, and how to manage your preferences.",
    ogLocale: "en_US",
    title: "Cookie Policy",
    lastUpdated: "Last updated",
    lastUpdatedDate: "May 18, 2026",
  },
  it: {
    description:
      "Come Refinea utilizza i cookie e tecnologie simili, quali dati raccogliamo e come gestire le tue preferenze.",
    ogLocale: "it_IT",
    title: "Cookie Policy",
    lastUpdated: "Ultimo aggiornamento",
    lastUpdatedDate: "18 maggio 2026",
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
  const title = "Cookie Policy | Refinea";

  return {
    title: { absolute: title },
    description: meta.description,
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description: meta.description,
      url: canonical,
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

export default async function CookiePolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isIt = locale === "it";
  const meta = isIt ? META.it : META.en;

  return (
    <div className="landing bg-background text-foreground min-h-screen">
      <Nav />

      <main className="pt-28 md:pt-36 pb-24">
        <div className="mx-auto max-w-[760px] px-4 sm:px-6">
          <header className="mb-12 md:mb-14">
            <h1 className="text-black mb-4">{meta.title}</h1>
            <p className="text-sm text-black/50">
              {meta.lastUpdated}: {meta.lastUpdatedDate}
            </p>
          </header>

          <article
            className="prose max-w-none
              prose-headings:font-bold prose-headings:tracking-[-0.02em] prose-headings:text-black
              prose-h2:text-[22px] prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-[17px] prose-h3:mt-8 prose-h3:mb-3
              prose-p:leading-[1.75] prose-p:mb-5 prose-p:text-black/75
              prose-li:leading-[1.7] prose-li:text-black/75 prose-li:mb-1
              prose-ul:mb-6 prose-ul:pl-5
              prose-a:text-accent prose-a:no-underline hover:prose-a:underline
              prose-strong:text-black
              prose-table:my-6 prose-th:text-left prose-th:text-black prose-th:font-semibold prose-th:p-2 prose-th:border prose-th:border-black/10 prose-td:p-2 prose-td:border prose-td:border-black/10 prose-td:text-black/75"
            style={{ fontSize: 16, color: "#1A1A1A", lineHeight: 1.75 }}
          >
            {isIt ? <CookiePolicyItContent /> : <CookiePolicyEnContent />}
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
