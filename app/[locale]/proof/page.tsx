import { setRequestLocale } from "next-intl/server";
import PlatformOverviewReplica from "../../components/mockups/HeroAVITimeSeries";
import PlatformPersonas from "../../components/mockups/PlatformPersonas";
import PlatformShareOfVoice from "../../components/mockups/PlatformShareOfVoice";
import PlatformCitations from "../../components/mockups/PlatformCitations";
import PlatformInsights from "../../components/mockups/PlatformInsights";
import {
  ContentMini,
  WorkflowsMini,
  BrandMemoryMini,
} from "../../components/mockups/PlatformActionMinis";

export const metadata = {
  title: "Proof — Platform Replicas",
  robots: { index: false, follow: false },
};

const sectionLabel = "text-[10px] uppercase tracking-[0.12em] text-black/40 font-semibold mb-3";
const sectionTitle = "text-xl font-bold text-black mb-2";
const sectionDesc  = "text-sm text-black/55 mb-8";

export default async function ProofPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="landing bg-background text-foreground min-h-screen">
      <section className="pt-20 pb-12">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <h1 className="text-black mb-3">Platform replicas — review</h1>
          <p className="text-black/55 text-base mb-10">
            All mockups are static (no animations), built by copying inline styles from the platform source.
            Data is fabricated but plausible for Gucci / luxury fashion.
          </p>

          {/* ── Hero: AVI Time Series Overview ── */}
          <div className="mb-24">
            <div className={sectionLabel}>Hero · Section 0</div>
            <h2 className={sectionTitle}>AI Visibility Index — Overview top-fold</h2>
            <p className={sectionDesc}>
              Source: <code>AviLeaderboard.tsx</code> + <code>KpiCard.tsx</code> + <code>OverviewMetrics.tsx</code> nav.
            </p>
            <PlatformOverviewReplica />
          </div>

          {/* ── Personas ── */}
          <div className="mb-24">
            <div className={sectionLabel}>Section 1 · Buyer Persona Intelligence</div>
            <h2 className={sectionTitle}>Personas grid</h2>
            <p className={sectionDesc}>
              Source: <code>personas/page.tsx</code> PersonaCard component + filter chips.
            </p>
            <PlatformPersonas />
          </div>

          {/* ── Share of Voice ── */}
          <div className="mb-24">
            <div className={sectionLabel}>Section 2 · AI Visibility Monitoring</div>
            <h2 className={sectionTitle}>Share of Voice quarter-arc chart</h2>
            <p className={sectionDesc}>
              Source: <code>SovChart.tsx</code> — concentric quarter arcs with ranked legend.
            </p>
            <PlatformShareOfVoice />
          </div>

          {/* ── Citations ── */}
          <div className="mb-24">
            <div className={sectionLabel}>Section 3 · Citations & Sources</div>
            <h2 className={sectionTitle}>Citation Share bar chart</h2>
            <p className={sectionDesc}>
              Source: <code>CitationShareCard.tsx</code> — top domains by citation share + ranked panel.
            </p>
            <PlatformCitations />
          </div>

          {/* ── Action Minis ── */}
          <div className="mb-24">
            <div className={sectionLabel}>Section 4 · Action — 3 mini-mockups inside cards</div>
            <h2 className={sectionTitle}>Content · Workflows · Brand Memory</h2>
            <p className={sectionDesc}>
              These sit inside feature cards on the landing — compact visual sketches, not full-page replicas.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { label: "Content Creation & Optimization", Mini: ContentMini },
                { label: "Agentic Workflows",               Mini: WorkflowsMini },
                { label: "Brand Memory",                    Mini: BrandMemoryMini },
              ].map(({ label, Mini }) => (
                <div
                  key={label}
                  className="bg-white rounded-2xl border border-black/[0.09] p-6 flex flex-col gap-5 shadow-[0_2px_16px_rgba(0,0,0,0.05)]"
                >
                  <div>
                    <div className="text-xs uppercase tracking-wider text-black/40 font-semibold mb-1">
                      Action
                    </div>
                    <h3 className="text-base font-bold text-black">{label}</h3>
                    <p className="text-xs text-black/55 mt-2 leading-relaxed">
                      Card body copy goes here in the real landing — feature description tailored to the action.
                    </p>
                  </div>
                  <Mini />
                </div>
              ))}
            </div>
          </div>

          {/* ── Insights ── */}
          <div className="mb-24">
            <div className={sectionLabel}>Section 5 · Actionable Insights</div>
            <h2 className={sectionTitle}>Refinea Actionable Insights table</h2>
            <p className={sectionDesc}>
              Source: <code>InsightCard.tsx</code> compact table row layout with severity/category/confidence badges.
            </p>
            <PlatformInsights />
          </div>
        </div>
      </section>
    </div>
  );
}
