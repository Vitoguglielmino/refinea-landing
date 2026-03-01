import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - Refinea | GEO Infrastructure Plans",
  description:
    "Choose the right Generative Engine Optimization plan. Growth ($149/mo) or Pro ($349/mo). Track AI visibility across ChatGPT, Gemini, and Perplexity by buyer persona.",
  openGraph: {
    title: "Pricing - Refinea | GEO Infrastructure Plans",
    description:
      "Choose the right Generative Engine Optimization plan. Growth ($149/mo) or Pro ($349/mo). Track AI visibility across ChatGPT, Gemini, and Perplexity.",
    url: "https://refinea.io/pricing",
  },
  alternates: {
    canonical: "https://refinea.io/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
