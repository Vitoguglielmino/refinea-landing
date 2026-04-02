import type { Metadata } from "next";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Pricing - Refinea | GEO Infrastructure Plans",
  description:
    "Choose the right Generative Engine Optimization plan. Growth (€129/mo) or Pro (€299/mo) + VAT. Track AI visibility across ChatGPT, Gemini, and Perplexity by buyer persona.",
  openGraph: {
    title: "Pricing - Refinea | GEO Infrastructure Plans",
    description:
      "Choose the right Generative Engine Optimization plan. Growth (€129/mo) or Pro (€299/mo) + VAT. Track AI visibility across ChatGPT, Gemini, and Perplexity.",
    url: "https://refinea.io/pricing",
  },
  alternates: {
    canonical: "https://refinea.io/pricing",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://refinea.io" },
    { "@type": "ListItem", position: 2, name: "Pricing", item: "https://refinea.io/pricing" },
  ],
};

export default function PricingLayout({
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
