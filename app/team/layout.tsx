import type { Metadata } from "next";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Team - Refinea | Founders & Mission",
  description:
    "Meet the founders of Refinea: Vito Guglielmino (CEO) and Giorgio Monaco (CTO). Building the Generative Engine Optimization infrastructure for AI-native brand visibility.",
  openGraph: {
    title: "Team - Refinea | Founders & Mission",
    description:
      "Meet the founders of Refinea. Building the GEO infrastructure for AI-native brand visibility.",
    url: "https://refinea.io/team",
  },
  alternates: {
    canonical: "https://refinea.io/team",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://refinea.io" },
    { "@type": "ListItem", position: 2, name: "Team", item: "https://refinea.io/team" },
  ],
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
      <Footer />
    </>
  );
}
