/**
 * Blog taxonomy — single source of truth for sections and topics.
 *
 * Two orthogonal axes:
 *   - SECTION (1 per post, drives schema type + index page)
 *   - TOPICS  (1..3 per post, drives clusters + related + about[] schema)
 *
 * Adding a new section requires schema-dispatcher work in mdx.ts and a
 * matching /blog/section/<slug> page. Adding a new topic is free —
 * /blog/topic/<slug> is generated dynamically.
 */

export type SectionSlug = "product" | "news" | "guides" | "glossary";
export type TopicSlug =
  | "generative-engine-optimization"
  | "ai-search-strategy"
  | "llm-citations"
  | "ai-brand-visibility"
  | "marketing-measurement";

export type Section = {
  slug: SectionSlug;
  name: string;
  shortName: string;
  description: string;
  /** Schema.org type emitted for posts in this section. Picked to match
   *  content nature so we never apply misleading markup (Google's
   *  March 2026 enforcement category). */
  schemaType: "BlogPosting" | "NewsArticle" | "TechArticle" | "DefinedTerm";
};

export const SECTIONS: Record<SectionSlug, Section> = {
  product: {
    slug: "product",
    name: "Product",
    shortName: "Product",
    description:
      "Refinea changelog, feature deep-dives, and customer case studies.",
    schemaType: "TechArticle",
  },
  news: {
    slug: "news",
    name: "News & Insights",
    shortName: "News",
    description:
      "Industry analysis, original research, and opinions on AI search and GEO.",
    schemaType: "BlogPosting",
  },
  guides: {
    slug: "guides",
    name: "Guides",
    shortName: "Guides",
    description:
      "Pillar guides and how-tos for building AI visibility — from first principles to operational playbooks.",
    schemaType: "TechArticle",
  },
  glossary: {
    slug: "glossary",
    name: "Glossary",
    shortName: "Glossary",
    description:
      "Canonical definitions of the terms shaping AI search, GEO, and AEO.",
    schemaType: "DefinedTerm",
  },
};

export type Topic = {
  slug: TopicSlug;
  name: string;
  description: string;
  /** Plain-text seed for CollectionPage.about — gives LLMs a clean entity
   *  description even before the cluster is dense. */
  about: string;
};

export const TOPICS: Record<TopicSlug, Topic> = {
  "generative-engine-optimization": {
    slug: "generative-engine-optimization",
    name: "Generative Engine Optimization",
    description:
      "The discipline of optimizing brands for inclusion inside AI-generated responses.",
    about:
      "Generative Engine Optimization (GEO) is the practice of increasing the probability that a brand is cited and recommended by large language models such as ChatGPT, Gemini, Perplexity, and Claude inside generated answers.",
  },
  "ai-search-strategy": {
    slug: "ai-search-strategy",
    name: "AI Search Strategy",
    description:
      "How marketing leaders frame, fund, and measure AI search programs.",
    about:
      "AI search strategy covers positioning, organizational ownership, budget allocation, KPIs, and the executive narratives that determine whether a brand wins in the AI-mediated discovery layer.",
  },
  "llm-citations": {
    slug: "llm-citations",
    name: "LLM Citations",
    description:
      "How and why large language models cite sources — and how to be cited.",
    about:
      "LLM citations are the mechanism by which large language models surface and credit external sources inside generated responses. Citation patterns differ across ChatGPT, Perplexity, Claude, and Gemini, and are driven by retrieval, authority, freshness, and structural signals.",
  },
  "ai-brand-visibility": {
    slug: "ai-brand-visibility",
    name: "AI Brand Visibility",
    description:
      "Measuring and growing how often AI engines recommend your brand.",
    about:
      "AI brand visibility is the share of AI-generated answers in which a brand is mentioned or recommended across the major AI engines, segmented by buyer persona, intent, and geography.",
  },
  "marketing-measurement": {
    slug: "marketing-measurement",
    name: "Marketing Measurement",
    description:
      "Attribution, ROI, and metrics for marketing in the AI era.",
    about:
      "Marketing measurement in the AI era covers attribution beyond last-click, the role of zero-click discovery, AI-driven funnel metrics, and the redefinition of organic traffic when answers replace links.",
  },
};

export function getSection(slug: string | undefined): Section | null {
  if (!slug) return null;
  return (SECTIONS as Record<string, Section>)[slug] ?? null;
}

export function getTopic(slug: string | undefined): Topic | null {
  if (!slug) return null;
  return (TOPICS as Record<string, Topic>)[slug] ?? null;
}

export function getAllSections(): Section[] {
  return Object.values(SECTIONS);
}

export function getAllTopics(): Topic[] {
  return Object.values(TOPICS);
}
