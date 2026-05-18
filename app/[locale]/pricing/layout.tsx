import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";

const SITE_URL = "https://refinea.io";
const PATH = "/pricing";

const META = {
  en: {
    title: "Pricing | Refinea - AI Visibility Platform",
    description:
      "Simple pricing for AI visibility. Free 14-day trial on Pro. Custom plans for agencies. Unlimited team members on every plan.",
    ogLocale: "en_US",
  },
  it: {
    title: "Prezzi | Refinea - Piattaforma di Visibilità AI",
    description:
      "Prezzi semplici per la visibilità AI. 14 giorni gratis sul piano Pro. Piani custom per agenzie. Membri del team illimitati su ogni piano.",
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
    title: meta.title,
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
    { "@type": "ListItem", position: 2, name: "Pricing", item: "https://refinea.io/pricing" },
  ],
};

export default async function PricingLayout({
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
      {/* Nav lives OUTSIDE the Suspense boundary in page.tsx so the
          language toggle (which needs SSR to be crawlable) renders even
          while PricingClient — which uses useSearchParams — is being
          hydrated. Same reason Footer is here too. */}
      <Nav />
      {children}
      <Footer />
    </>
  );
}
