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
    { "@type": "ListItem", position: 2, name: "Pricing", item: "https://refinea.io/pricing" },
  ],
};

/**
 * Per-tier Offer schema. Refinea is a single SoftwareApplication sold in
 * tiers, so the page exposes an AggregateOffer with one Offer node per
 * paid tier. The Agencies tier is custom-priced and intentionally has
 * no numeric Offer. Prices kept in sync with the pricing UI
 * (HomePricing.tsx / PricingContent.tsx): Lite €129/mo, Pro €299/mo.
 */
const pricingOfferJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://refinea.io/#product",
  name: "Refinea",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "EUR",
    lowPrice: "129",
    highPrice: "299",
    offerCount: 2,
    offers: [
      {
        "@type": "Offer",
        name: "Lite",
        price: "129",
        priceCurrency: "EUR",
        url: "https://refinea.io/pricing",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: "299",
        priceCurrency: "EUR",
        url: "https://refinea.io/pricing",
        availability: "https://schema.org/InStock",
      },
    ],
  },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingOfferJsonLd) }}
      />
      <Nav />
      {children}
      <Footer />
    </>
  );
}
