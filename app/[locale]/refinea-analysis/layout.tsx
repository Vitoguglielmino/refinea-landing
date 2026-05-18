import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";

const SITE_URL = "https://refinea.io";
const PATH = "/refinea-analysis";

const META = {
  en: {
    title: "Refinea Analysis | AI Visibility Index by Industry",
    description:
      "An independent observatory measuring how often AI models cite the vendors of each industry. Updated daily.",
    ogLocale: "en_US",
  },
  it: {
    title: "Refinea Analysis | AI Visibility Index by Industry",
    description:
      "An independent observatory measuring how often AI models cite the vendors of each industry. Updated daily.",
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

  return {
    title: { absolute: meta.title },
    description: meta.description,
    robots: { index: true, follow: true },
    openGraph: {
      title: meta.title,
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

/* schema.org/Dataset markup — helps Google Dataset Search and AI engines
   classify this as a structured observatory dataset rather than ordinary
   prose. Updated dates are kept generic ("daily"); fine-grained
   `dateModified` per request would defeat ISR caching. */
const datasetJsonLd = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "Refinea AI Visibility Index — Industry Leaderboards",
  description:
    "Daily-updated AI Visibility Index (AVI) leaderboards measuring how often large language models cite the vendors of each tracked industry.",
  url: "https://refinea.io/refinea-analysis",
  keywords: [
    "AI Visibility Index",
    "Generative Engine Optimization",
    "GEO",
    "AI search",
    "LLM citations",
    "brand visibility",
  ],
  isAccessibleForFree: true,
  license: "https://refinea.io/terms",
  creator: {
    "@type": "Organization",
    "@id": "https://refinea.io/#organization",
    name: "Refinea",
    url: "https://refinea.io",
  },
  publisher: {
    "@type": "Organization",
    "@id": "https://refinea.io/#organization",
    name: "Refinea",
    url: "https://refinea.io",
  },
  temporalCoverage: "2026/..",
  spatialCoverage: { "@type": "Place", name: "Italy" },
  variableMeasured: [
    { "@type": "PropertyValue", name: "AVI", description: "Share of LLM iterations in which a brand is cited." },
    { "@type": "PropertyValue", name: "mentions", description: "Total mention count across the daily panel." },
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://refinea.io" },
    { "@type": "ListItem", position: 2, name: "Refinea Analysis", item: "https://refinea.io/refinea-analysis" },
  ],
};

export default async function RefineaAnalysisLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Nav />
      {children}
      <Footer />
    </>
  );
}
