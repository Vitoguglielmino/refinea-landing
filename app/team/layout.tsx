import type { Metadata } from "next";

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

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
