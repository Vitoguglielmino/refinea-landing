/**
 * Industries registry — single source of truth for which sectors are
 * tracked by Refinea Analysis, plus their display labels and sample
 * prompts.
 *
 * To add an industry that's live in the API:
 *   1. Add an entry below with `status: "active"`.
 *   2. Add its display name to `messages/{en,it}.json` under
 *      `refineaAnalysis.industries.<camelCaseKey>`.
 *   3. Drop in 5 verbatim sample prompts from the panel.
 *
 * To remove a placeholder, just delete the corresponding `coming-soon`
 * entry. The toggle in the page renders this array as-is.
 */

export type Industry = {
  /** API slug — same value the backend uses for `GET /public/marketing/avi/{slug}`. */
  slug: string;
  /** Toggle state: "active" = clickable + fetchable, "coming-soon" = disabled chip. */
  status: "active" | "coming-soon";
  /** i18n key under `refineaAnalysis.industries.*` for the display name.
   *  Required for active industries; null for coming-soon placeholders. */
  labelKey: string | null;
  /** Verbatim prompts from the panel. Italian-only by design — they are
   *  the actual LLM inputs, not translatable marketing copy. */
  samplePrompts: readonly string[];
};

export const INDUSTRIES: readonly Industry[] = [
  {
    slug: "saas-gestionali-italia",
    status: "active",
    labelKey: "industries.saasGestionaliItalia",
    samplePrompts: [
      "Quale software CRM scegliere per aumentare le vendite?",
      "Migliore contabilità in cloud per piccole imprese",
      "Qual è la migliore app per la fattura elettronica per piccole imprese?",
      "Miglior software per gestire i dipendenti in Italia",
      "Miglior software gestione risorse umane per piccole e medie imprese",
    ],
  },
  {
    slug: "fintech-italia",
    status: "active",
    labelKey: "industries.fintechItalia",
    samplePrompts: [
      "Qual è il miglior conto corrente online senza costi di gestione?",
      "Quale carta di credito è migliore per viaggiare all'estero?",
      "Confronta conti deposito per trovare l'offerta più vantaggiosa.",
      "Quali piattaforme compra ora paga dopo permettono pagamenti senza interessi?",
      "Quali sono i migliori wallet per pagare con il telefono",
    ],
  },
  {
    slug: "_coming_soon",
    status: "coming-soon",
    labelKey: null,
    samplePrompts: [],
  },
] as const;

/** Default industry to load when the user lands on /refinea-analysis. */
export const DEFAULT_INDUSTRY_SLUG = "saas-gestionali-italia";

/** Active industries only — convenience helper for fetching all valid
 *  slugs at build/runtime. */
export const ACTIVE_INDUSTRIES: readonly Industry[] = INDUSTRIES.filter(
  (i): i is Industry & { status: "active"; labelKey: string } =>
    i.status === "active" && i.labelKey !== null,
);

/** Look up an industry by slug (used by the API proxy route + by the
 *  view to resolve sample prompts when the toggle changes). */
export function getIndustry(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug);
}
