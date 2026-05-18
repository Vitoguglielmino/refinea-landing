import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Footer from "../../components/Footer";

const SITE_URL = "https://refinea.io";
const PATH = "/team";

const META = {
  en: {
    title: "Team | Refinea - AI Visibility Platform",
    description:
      "Meet the team behind Refinea, the AI visibility platform for Generative Engine Optimization.",
    ogLocale: "en_US",
  },
  it: {
    title: "Team | Refinea - Piattaforma di Visibilità AI",
    description:
      "Il team di Refinea, la piattaforma di Generative Engine Optimization per la visibilità AI.",
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
    { "@type": "ListItem", position: 2, name: "Team", item: "https://refinea.io/team" },
  ],
};

const aboutPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  mainEntity: {
    "@type": "Organization",
    name: "Refinea",
    url: "https://refinea.io",
    founder: [
      {
        "@type": "Person",
        name: "Vito Guglielmino",
        jobTitle: "Co-Founder & CEO",
        url: "https://refinea.io/team",
        sameAs: ["https://www.linkedin.com/in/vitoguglielmino/"],
      },
      {
        "@type": "Person",
        name: "Giorgio Monaco",
        jobTitle: "Co-Founder & CTO",
        url: "https://refinea.io/team",
        sameAs: ["https://www.linkedin.com/in/giorgio-monaco/"],
      },
    ],
  },
};

export default async function TeamLayout({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }}
      />
      {children}
      <Footer />
    </>
  );
}
