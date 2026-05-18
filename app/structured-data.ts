/**
 * JSON-LD structured data — homepage of refinea.io.
 *
 * Schemas emitted (single @graph, injected via <script type="application/ld+json">
 * in app/layout.tsx <head>):
 *
 *   - Organization        (E-E-A-T, founders, contact, social)
 *   - WebSite             (sitelinks search box hint)
 *   - WebPage             (homepage metadata)
 *   - BreadcrumbList      (root crumb)
 *   - SoftwareApplication (product, AggregateOffer, feature list)
 *   - DefinedTerm × 2     (GEO + AEO topical authority)
 *
 * Removed (deprecated or off-topic for the homepage):
 *   - HowTo   — Google deprecated HowTo rich results for non-recipe content
 *   - FAQPage — Google now restricts FAQ rich results to dedicated FAQ pages
 *   - Service — duplicated SoftwareApplication offers; not adding signal
 */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    /* ───────────────────────── Organization ──────────────────────── */
    {
      "@type": "Organization",
      "@id": "https://refinea.io/#organization",
      name: "Refinea",
      legalName: "Refinea S.r.l.",
      url: "https://refinea.io",
      logo: {
        "@type": "ImageObject",
        url: "https://refinea.io/logos/refinea%20grigio.svg",
        width: 512,
        height: 512,
      },
      image: "https://refinea.io/opengraph-image",
      description:
        "AI Visibility Platform for Generative Engine Optimization. Refinea discovers what real customers ask AI, shows why competitors get recommended, and provides tools to change the answer.",
      foundingDate: "2025",
      vatID: "06241080875",
      address: {
        "@type": "PostalAddress",
        addressCountry: "IT",
      },
      areaServed: "Worldwide",
      sameAs: [
        "https://www.linkedin.com/company/refinea",
        "https://www.youtube.com/@OfficialRefinea",
      ],
      founder: [
        {
          "@type": "Person",
          "@id": "https://refinea.io/#vito",
          name: "Vito Guglielmino",
          jobTitle: "Co-Founder & CEO",
          url: "https://www.linkedin.com/in/vitoguglielmino/",
          worksFor: { "@id": "https://refinea.io/#organization" },
          knowsAbout: [
            "Generative Engine Optimization",
            "AI Visibility",
            "Go-to-Market Strategy",
            "Brand Strategy",
          ],
        },
        {
          "@type": "Person",
          "@id": "https://refinea.io/#giorgio",
          name: "Giorgio Monaco",
          jobTitle: "Co-Founder & CTO",
          url: "https://www.linkedin.com/in/giorgio-monaco/",
          worksFor: { "@id": "https://refinea.io/#organization" },
          knowsAbout: [
            "AI Intelligence Pipelines",
            "Machine Learning",
            "Natural Language Processing",
            "Software Architecture",
            "Generative Engine Optimization",
          ],
        },
      ],
      knowsAbout: [
        "Generative Engine Optimization",
        "GEO",
        "AI Visibility",
        "AI Visibility Tracking",
        "Brand Recommendations in AI",
        "Buyer Persona Analysis",
        "ChatGPT Brand Visibility",
        "Gemini Brand Recommendations",
        "Perplexity Brand Discovery",
        "AI Content Optimization",
        "LLM Optimization",
        "Answer Engine Optimization",
        "AEO",
      ],
      alumni: {
        "@type": "Organization",
        name: "B4i - Bocconi for innovation",
        url: "https://www.b4i.unibocconi.it/pre-acceleration/",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        url: "https://refinea.io/pricing",
        availableLanguage: ["English", "Italian"],
      },
    },

    /* ───────────────────────── WebSite ──────────────────────────── */
    {
      "@type": "WebSite",
      "@id": "https://refinea.io/#website",
      name: "Refinea",
      url: "https://refinea.io",
      description:
        "AI Visibility Platform for Generative Engine Optimization",
      publisher: { "@id": "https://refinea.io/#organization" },
      inLanguage: "en-US",
    },

    /* ───────────────────────── WebPage ─────────────────────────── */
    {
      "@type": "WebPage",
      "@id": "https://refinea.io/#webpage",
      url: "https://refinea.io",
      name: "Refinea - AI Visibility Platform | Generative Engine Optimization",
      description:
        "Refinea discovers what your real customers ask ChatGPT, Gemini and Perplexity and why AI recommends competitors instead of you. Monitor, analyze, and change the answer.",
      isPartOf: { "@id": "https://refinea.io/#website" },
      about: { "@id": "https://refinea.io/#organization" },
      inLanguage: "en-US",
      datePublished: "2024-01-01",
      dateModified: new Date().toISOString().split("T")[0],
      breadcrumb: { "@id": "https://refinea.io/#breadcrumb-home" },
    },

    /* ─────────────────────── BreadcrumbList ────────────────────── */
    {
      "@type": "BreadcrumbList",
      "@id": "https://refinea.io/#breadcrumb-home",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://refinea.io",
        },
      ],
    },

    /* ───────────────────── SoftwareApplication ──────────────────── */
    {
      "@type": "SoftwareApplication",
      "@id": "https://refinea.io/#product",
      name: "Refinea",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Generative Engine Optimization",
      operatingSystem: "Web",
      url: "https://refinea.io",
      description:
        "Generative Engine Optimization platform that discovers what real customers ask ChatGPT, Gemini, Perplexity and Claude, monitors AI visibility by buyer persona, and provides tools to optimize AI recommendations.",
      provider: { "@id": "https://refinea.io/#organization" },
      offers: {
        "@type": "AggregateOffer",
        lowPrice: "0",
        priceCurrency: "EUR",
        offerCount: "3",
        url: "https://refinea.io/pricing",
      },
      featureList: [
        "Buyer Persona Intelligence from real customer data",
        "AI Visibility Monitoring across 4+ AI models",
        "Citation and Source Analysis with fan-out queries",
        "AI-Optimized Content Creation",
        "Automated GEO Audits",
        "Brand Memory for verified proof points",
      ],
    },

    /* ─────────────────────── DefinedTerm × 2 ───────────────────── */
    {
      "@type": "DefinedTerm",
      "@id": "https://refinea.io/#geo-definition",
      name: "Generative Engine Optimization",
      alternateName: ["GEO", "AI SEO", "LLM Optimization"],
      description:
        "Generative Engine Optimization (GEO) is the discipline of optimizing brand visibility and recommendation probability within AI-generated responses from large language models such as ChatGPT, Gemini, Perplexity, and Claude.",
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        name: "AI Marketing Terminology",
      },
    },
    {
      "@type": "DefinedTerm",
      "@id": "https://refinea.io/#aeo-definition",
      name: "Answer Engine Optimization",
      alternateName: ["AEO"],
      description:
        "Answer Engine Optimization (AEO) is the practice of structuring and optimizing content to be selected as the direct answer in AI-generated responses, featured snippets, and voice search results.",
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        name: "AI Marketing Terminology",
      },
    },
  ],
};

export default structuredData;
