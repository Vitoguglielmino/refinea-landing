import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";

const SITE_URL = "https://refinea.io";
const PATH = "/docs";

const META = {
  en: {
    title: "Docs | Refinea — AI Visibility Platform",
    description:
      "How Refinea works. Read the metrics, understand the workflows, set up Brand Memory, and connect the public API.",
    ogLocale: "en_US",
  },
  it: {
    title: "Docs | Refinea — Piattaforma di Visibilità AI",
    description:
      "Come funziona Refinea. Leggi le metriche, capisci i workflow, configura la Brand Memory e collega l'API pubblica.",
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

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://refinea.io" },
    { "@type": "ListItem", position: 2, name: "Docs", item: "https://refinea.io/docs" },
  ],
};

export default async function DocsLayout({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Nav />
      {children}
      <Footer />
    </>
  );
}
