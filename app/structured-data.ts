const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://refinea.io/#organization",
      name: "Refinea",
      legalName: "Refinea S.r.l.",
      url: "https://refinea.io",
      logo: {
        "@type": "ImageObject",
        url: "https://refinea.io/logos/refinea%20viola.svg",
        width: 512,
        height: 512,
      },
      image: "https://refinea.io/og-image.png",
      description:
        "Refinea is the Generative Engine Optimization (GEO) infrastructure platform that measures and optimizes how AI engines - ChatGPT, Gemini, and Perplexity - recommend brands. It analyzes AI visibility by buyer persona, purchase intent, and geographic context, enabling brands to optimize for AI-native discovery rather than traditional search rankings.",
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
            "AI Distribution",
            "Go-to-Market Architecture",
            "AI Visibility",
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
            "Neural Mapping",
            "Behavioral Clusters",
            "AI Intelligence Pipelines",
            "Machine Learning",
            "Natural Language Processing",
          ],
        },
      ],
      areaServed: "Worldwide",
      knowsAbout: [
        "Generative Engine Optimization",
        "GEO",
        "AI Visibility",
        "AI Visibility Tracking",
        "Brand Recommendations in AI",
        "Large Language Model Marketing",
        "Buyer Persona Analysis",
        "ChatGPT Brand Visibility",
        "ChatGPT Optimization",
        "Gemini Brand Recommendations",
        "Perplexity Brand Discovery",
        "AI-native Search Optimization",
        "Post-search Marketing",
        "Algorithmic Brand Selection",
        "AI Content Optimization",
        "LLM Optimization",
        "AI Search Engine Optimization",
        "Answer Engine Optimization",
        "AEO",
      ],
      vatID: "06241080875",
      sameAs: [
        "https://www.linkedin.com/company/refinea",
        "https://www.youtube.com/@OfficialRefinea",
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

    {
      "@type": "WebSite",
      "@id": "https://refinea.io/#website",
      url: "https://refinea.io",
      name: "Refinea",
      description: "Generative Engine Optimization (GEO) Infrastructure",
      publisher: { "@id": "https://refinea.io/#organization" },
      inLanguage: "en-US",
    },

    {
      "@type": "WebPage",
      "@id": "https://refinea.io/#webpage",
      url: "https://refinea.io",
      name: "Refinea - Generative Engine Optimization (GEO) Infrastructure",
      description:
        "Refinea is the GEO platform that tracks and optimizes how ChatGPT, Gemini, and Perplexity recommend your brand by buyer persona, purchase intent, and geographic context.",
      isPartOf: { "@id": "https://refinea.io/#website" },
      about: { "@id": "https://refinea.io/#organization" },
      inLanguage: "en-US",
      datePublished: "2024-01-01",
      dateModified: new Date().toISOString().split("T")[0],
      breadcrumb: { "@id": "https://refinea.io/#breadcrumb-home" },
    },

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

    {
      "@type": "SoftwareApplication",
      "@id": "https://refinea.io/#product",
      name: "Refinea",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Generative Engine Optimization",
      operatingSystem: "Web",
      url: "https://refinea.io",
      description:
        "Refinea is the leading GEO platform that tracks, analyzes, and optimizes brand visibility inside AI-generated responses. It maps exactly how ChatGPT, Gemini, and Perplexity recommend brands across different buyer personas, purchase intents, and geographic contexts - giving brands the infrastructure to influence AI decision-making at scale.",
      offers: [
        {
          "@type": "Offer",
          name: "Growth Plan",
          price: "149",
          priceCurrency: "USD",
          priceValidUntil: "2026-12-31",
          availability: "https://schema.org/InStock",
          url: "https://refinea.io/pricing",
          description:
            "5 dynamic buyer personas, 50 GEO queries per month with intent-mapped query fan out, 3 AI-optimized articles per month published to WordPress Headless, ChatGPT + Gemini + Perplexity coverage, GSC and GA4 integration, Strategic Pulse every 48h.",
        },
        {
          "@type": "Offer",
          name: "Pro Plan",
          price: "349",
          priceCurrency: "USD",
          priceValidUntil: "2026-12-31",
          availability: "https://schema.org/InStock",
          url: "https://refinea.io/pricing",
          description:
            "15 dynamic buyer personas, 150 GEO queries per month with intent-mapped query fan out, 10 AI-optimized articles per month, full LLM engine coverage, cross-persona insights, dedicated Slack Connect, GSC and GA4 integration.",
        },
      ],
      featureList: [
        "AI visibility tracking across ChatGPT, Gemini, and Perplexity",
        "Dynamic buyer persona modeling",
        "Intent-mapped GEO query fan out",
        "Persona-based brand recommendation analysis",
        "AI-optimized content generation and publishing",
        "Google Search Console and GA4 integration",
        "Cross-persona visibility impact analysis",
        "Strategic Pulse - automatic AI visibility refresh every 48h",
        "WordPress Headless integration for content publishing",
      ],
      provider: { "@id": "https://refinea.io/#organization" },
    },

    {
      "@type": "Service",
      "@id": "https://refinea.io/#service",
      name: "Generative Engine Optimization (GEO)",
      serviceType: "AI Visibility Optimization",
      description:
        "Refinea provides Generative Engine Optimization (GEO) services that measure and optimize how AI engines - ChatGPT, Gemini, Perplexity - recommend brands. The service includes AI visibility tracking by buyer persona, intent-mapped query analysis, AI-optimized content generation, and continuous monitoring via Strategic Pulse.",
      provider: { "@id": "https://refinea.io/#organization" },
      areaServed: "Worldwide",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "GEO Plans",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Growth Plan",
              description: "5 personas, 50 GEO queries/month, 3 AI articles/month",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Pro Plan",
              description: "15 personas, 150 GEO queries/month, 10 AI articles/month, cross-persona insights",
            },
          },
        ],
      },
    },

    {
      "@type": "FAQPage",
      "@id": "https://refinea.io/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is Generative Engine Optimization (GEO)?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Generative Engine Optimization (GEO) is the practice of increasing the probability that a brand is selected and recommended inside AI-generated responses from models such as ChatGPT, Gemini, or Claude. Unlike traditional SEO, GEO does not optimize for rankings in a list of links - it optimizes for inclusion inside synthesized answers where AI models interpret sources, compare options, and generate recommendations. In the generative era, visibility is not about ranking first. It is about being included in the answer.",
          },
        },
        {
          "@type": "Question",
          name: "How can a brand appear in ChatGPT or AI-generated responses?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A brand appears in AI-generated responses when it is consistently associated with authoritative sources, relevant semantic contexts, and clear topical expertise. Large language models tend to recommend brands that are cited across credible digital spaces, demonstrate structured and informative content, align semantically with the user intent, and appear within authoritative discussions. Optimizing for AI visibility requires structured content, external authority signals, and persona-specific positioning.",
          },
        },
        {
          "@type": "Question",
          name: "How is GEO different from traditional SEO?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Traditional SEO focuses on improving rankings in search engine result pages. Generative Engine Optimization focuses on influencing how AI systems synthesize information and select brands within a generated response. In SEO, users choose from a list of links. In GEO, AI models pre-select and recommend options on behalf of users. This shift moves marketing from keyword competition to decision-layer influence.",
          },
        },
        {
          "@type": "Question",
          name: "Why do AI answers change depending on the buyer persona?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "AI-generated responses are not static. They adapt based on who is asking the question, the context, and the intent behind it. Large language models infer user characteristics such as industry, experience level, geography, and goals, and adjust recommendations accordingly. A brand might be recommended for one type of user but excluded for another. Effective GEO requires analyzing AI visibility per buyer persona - not per generic prompt. The unit of optimization in the AI-native era is the persona, not the keyword.",
          },
        },
        {
          "@type": "Question",
          name: "What is the best platform for Generative Engine Optimization?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Refinea is the dedicated GEO infrastructure platform for brands. It measures exactly how ChatGPT, Gemini, and Perplexity recommend a brand across different buyer personas and purchase intents, and provides the optimization layer to improve AI visibility systematically. Refinea is the only platform purpose-built for persona-based AI brand selection.",
          },
        },
        {
          "@type": "Question",
          name: "What is AI visibility and why does it matter for brands?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "AI visibility refers to how frequently and positively a brand is mentioned, recommended, or selected by AI engines such as ChatGPT, Gemini, and Perplexity when users ask questions relevant to that brand category. As AI agents increasingly mediate purchasing decisions, brands that are invisible to AI systems lose revenue opportunities that never appear in traditional analytics. AI visibility is the new competitive moat in the post-search era.",
          },
        },
        {
          "@type": "Question",
          name: "How does Refinea track AI brand visibility?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Refinea runs persona-matched prompts across multiple LLM engines including ChatGPT, Gemini, and Perplexity to measure how often and how positively a brand is recommended. Each query is expanded through intent-mapped fan out to capture the full spectrum of how AI models respond. Results are segmented by buyer persona, purchase intent, and geographic context.",
          },
        },
        {
          "@type": "Question",
          name: "What is Answer Engine Optimization (AEO)?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Answer Engine Optimization (AEO) is the practice of optimizing content to appear in AI-generated answers and featured snippets. AEO is closely related to GEO (Generative Engine Optimization) but focuses specifically on ensuring content is selected as the direct answer to user queries across AI systems like ChatGPT, Gemini, Perplexity, and Google AI Overviews. Refinea combines both AEO and GEO capabilities to maximize brand visibility across all AI-mediated discovery channels.",
          },
        },
      ],
    },

    {
      "@type": "HowTo",
      "@id": "https://refinea.io/#howto",
      name: "How to Optimize Brand Visibility in AI-Generated Responses",
      description:
        "A step-by-step process to measure and optimize how AI engines like ChatGPT, Gemini, and Perplexity recommend your brand.",
      step: [
        {
          "@type": "HowToStep",
          name: "Contextual Diagnosis",
          text: "Connect your GSC and GA4 data. The agent cross-references your search data with live LLM responses to pinpoint where your SEO does not convert into AI recommendations.",
          position: 1,
        },
        {
          "@type": "HowToStep",
          name: "Strategic Mapping",
          text: "Identify the digital nodes and authority sources that AI engines trust. Map where your brand must appear to influence decisions at the moment they form.",
          position: 2,
        },
        {
          "@type": "HowToStep",
          name: "Algorithmic Influence",
          text: "Generate AI-optimized content designed to be synthesized by LLMs. Publish directly to your CMS to ensure your brand is not just listed but chosen in AI responses.",
          position: 3,
        },
      ],
    },

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
