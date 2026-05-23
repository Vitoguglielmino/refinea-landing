import { getTranslations, setRequestLocale } from "next-intl/server";
import Nav from "../../components/Nav";

/* ─── Founder data (photos + links; copy lives in messages/{locale}.json) ─── */
type FounderKey = "vito" | "giorgio";
const FOUNDERS: { id: FounderKey; photo: string; linkedin: string }[] = [
  {
    id: "vito",
    photo: "/logos/Vito.jpeg",
    linkedin: "https://www.linkedin.com/in/vitoguglielmino/",
  },
  {
    id: "giorgio",
    photo: "/logos/giorgio.jpeg",
    linkedin: "https://www.linkedin.com/in/giorgio-monaco/",
  },
];

/* ─── Validation partners (logos + URLs; labels come from i18n) ─── */
type PartnerKey = "b4i" | "techEurope" | "startcup";
const PARTNERS: { key: PartnerKey; href: string; logo: string }[] = [
  { key: "b4i",        href: "https://www.b4i.unibocconi.eu/", logo: "/logos/B4i-logo-CMYK-pos.svg" },
  { key: "techEurope", href: "https://tef.tech/", logo: "/logos/tech_europe_foundation_logo.jpeg" },
  { key: "startcup",   href: "https://startcup.it/", logo: "/logos/startcup_logo_2017 (1).png" },
];

/* ─── LinkedIn icon ─── */
function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/* ─── Page ─── */
export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("team");

  return (
    <div className="landing bg-background text-foreground min-h-screen">
      <Nav />

      <main className="section-lines pt-28 md:pt-36 pb-24">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          {/* Intro */}
          <div className="max-w-[680px] mx-auto text-center mb-16 md:mb-20">
            <div
              className="inline-flex items-center mb-6"
              style={{
                gap: 8,
                padding: "7px 14px",
                fontSize: 14,
                fontWeight: 500,
                color: "rgba(0,0,0,0.75)",
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: 6,
                whiteSpace: "nowrap",
                lineHeight: 1.2,
              }}
            >
              {t("overline")}
            </div>
            <h1 className="text-black mb-6">{t("title")}</h1>
            <p className="text-black/60 text-lg leading-relaxed">
              {t("subtitle")}
            </p>
          </div>

          {/* Founder cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[860px] mx-auto mb-20 md:mb-24">
            {FOUNDERS.map((f) => (
              <article
                key={f.id}
                className="bg-white rounded-2xl border border-black/[0.09] shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-7"
              >
                <div className="flex items-start gap-4 mb-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.photo}
                    alt={t(`${f.id}.name`)}
                    width={72}
                    height={72}
                    className="w-[72px] h-[72px] rounded-xl object-cover shrink-0 bg-black/[0.04]"
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-black tracking-tight">
                      {t(`${f.id}.name`)}
                    </h2>
                    <div className="text-sm text-black/55 mb-2">{t(`${f.id}.role`)}</div>
                    <a
                      href={f.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[12px] text-black/40 hover:text-accent transition-colors"
                    >
                      <LinkedInIcon size={13} />
                      {t("linkedinLabel")}
                    </a>
                  </div>
                </div>
                <p className="text-sm text-black/65 leading-relaxed">{t(`${f.id}.bio`)}</p>
              </article>
            ))}
          </div>

          {/* Validation */}
          <div className="max-w-[760px] mx-auto text-center">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 mb-6">
              {t("validation.overline")}
            </div>
            <p className="text-black/80 text-base font-semibold mb-10">
              {t("validation.headline")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-8">
              {PARTNERS.map((p) => {
                const label = t(`validation.${p.key}`);
                return (
                  <a
                    key={p.key}
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-3 group"
                    title={label}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.logo}
                      alt={`${label} logo`}
                      className="object-contain transition-opacity"
                      style={{
                        height: 48,
                        maxWidth: 160,
                        filter: "grayscale(100%)",
                        opacity: 0.65,
                      }}
                    />
                    <span className="text-sm font-bold text-black/80 group-hover:text-black transition-colors">
                      {label}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
