/**
 * Authors registry — single source of truth for blog bylines.
 *
 * Drives:
 *   - <ArticleHeader> avatar + byline
 *   - Blog card author chip
 *   - /blog/author/<slug> page
 *   - Person JSON-LD on every BlogPosting (the highest-leverage E-E-A-T
 *     signal post-March 2026 core update — verified via LinkedIn sameAs).
 *
 * To add an author: append to AUTHORS, drop a square photo at
 * public/team/<slug>.jpg (>=400x400, will be served circular).
 */

export type AuthorSlug = "vito" | "giorgio";

export type Author = {
  slug: AuthorSlug;
  name: string;
  jobTitle: string;
  bio: string;
  /** Short blurb shown next to the byline on article cards. */
  shortBio: string;
  image: string;
  email: string;
  linkedin: string;
  /** Drives Person.knowsAbout in JSON-LD — semantic anchor that AI engines
   *  use to validate topical authority. Keep entries aligned with how the
   *  author actually shows up across the web (LinkedIn headline, talks,
   *  podcasts). Mismatch here weakens the signal. */
  knowsAbout: string[];
};

export const AUTHORS: Record<AuthorSlug, Author> = {
  vito: {
    slug: "vito",
    name: "Vito Guglielmino",
    jobTitle: "Co-Founder & CEO, Refinea",
    bio: "Co-founded Refinea to give brands the infrastructure to measure and influence how AI engines recommend them. Leads product, go-to-market, and the strategic positioning of Generative Engine Optimization as a discipline.",
    shortBio: "Co-Founder & CEO of Refinea. Writes on AI search strategy and decision-layer marketing.",
    image: "/team/vito.jpg",
    email: "vito.guglielmino@refinea.io",
    linkedin: "https://www.linkedin.com/in/vitoguglielmino/",
    knowsAbout: [
      "Generative Engine Optimization",
      "AI Visibility",
      "Decision-Layer Marketing",
      "Go-to-Market Strategy",
      "B2B SaaS",
    ],
  },
  giorgio: {
    slug: "giorgio",
    name: "Giorgio Monaco",
    jobTitle: "Co-Founder & CTO, Refinea",
    bio: "Co-founded Refinea and leads engineering. Builds the retrieval, persona modeling, and citation tracking systems that measure how LLMs recommend brands across ChatGPT, Gemini, Perplexity, Claude, and Google AI Overviews.",
    shortBio: "Co-Founder & CTO of Refinea. Writes on LLM citation mechanics, retrieval, and schema.",
    image: "/team/giorgio.jpg",
    email: "giorgio.monaco@refinea.io",
    linkedin: "https://www.linkedin.com/in/giorgio-monaco/",
    knowsAbout: [
      "Machine Learning",
      "Natural Language Processing",
      "Software Architecture",
      "Retrieval-Augmented Generation",
      "AI Search Infrastructure",
    ],
  },
};

export function getAuthor(slug: string | undefined): Author | null {
  if (!slug) return null;
  return (AUTHORS as Record<string, Author>)[slug] ?? null;
}

export function getAllAuthors(): Author[] {
  return Object.values(AUTHORS);
}

/**
 * Builds a Person JSON-LD object for the given author. Used inline inside
 * BlogPosting.author and on /blog/author/<slug>. sameAs LinkedIn is the
 * single most important entity-disambiguation property — Google links the
 * author to a real LinkedIn identity, which feeds the E-E-A-T (Experience
 * + Expertise) signal that the March 2026 core update made foundational.
 */
export function authorJsonLd(author: Author) {
  return {
    "@type": "Person",
    "@id": `https://refinea.io/blog/author/${author.slug}#person`,
    name: author.name,
    jobTitle: author.jobTitle,
    image: `https://refinea.io${author.image}`,
    url: `https://refinea.io/blog/author/${author.slug}`,
    description: author.bio,
    email: `mailto:${author.email}`,
    sameAs: [author.linkedin],
    knowsAbout: author.knowsAbout,
    worksFor: {
      "@type": "Organization",
      "@id": "https://refinea.io/#organization",
      name: "Refinea",
      url: "https://refinea.io",
    },
  };
}
