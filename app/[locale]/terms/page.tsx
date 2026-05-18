import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import TermsEnContent from "./TermsEnContent";
import TermsItContent from "./TermsItContent";

const SITE_URL = "https://refinea.io";
const PATH = "/terms";

const META = {
  en: {
    description: "Terms governing the use of the Refinea platform.",
    ogLocale: "en_US",
  },
  it: {
    description:
      "Termini che regolano l'utilizzo della piattaforma Refinea.",
    ogLocale: "it_IT",
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

  // Title stays in English on both locales — Google's OAuth consent
  // screen verification looks for the standard label. `{ absolute }`
  // bypasses the root layout's "%s | Refinea" template so we don't
  // double-suffix the brand name.
  const title = "Terms of Service | Refinea";

  return {
    title: { absolute: title },
    description: meta.description,
    robots: {
      index: true,
      follow: true,
    },
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

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("terms");
  const isIt = locale === "it";

  return (
    <div className="landing bg-background text-foreground min-h-screen">
      <Nav />

      <main className="pt-28 md:pt-36 pb-24">
        <div className="mx-auto max-w-[760px] px-4 sm:px-6">
          {/* Header */}
          <header className="mb-12 md:mb-14">
            <h1 className="text-black mb-4">{t("title")}</h1>
            <p className="text-sm text-black/50">
              {t("lastUpdatedLabel")}: {t("lastUpdatedDate")}
            </p>
          </header>

          {/* Body */}
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
              prose-code:font-mono prose-code:text-[0.9em] prose-code:bg-black/[0.04] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none"
            style={{
              fontSize: 16,
              color: "#1A1A1A",
              lineHeight: 1.75,
            }}
          >
            {isIt ? <TermsItContent /> : <TermsEnContent />}
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
