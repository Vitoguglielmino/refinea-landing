import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import CookiePrefsButton from "./CookiePrefsButton";

type PlatformKey = "visibility" | "personas" | "citations" | "content" | "workflows" | "brandMemory";
type ResourcesKey = "blog" | "docs" | "analysis";
type CompanyKey = "team" | "pricing" | "privacy" | "terms" | "cookies" | "cookiePrefs" | "linkedin" | "youtube";

const PLATFORM: { key: PlatformKey; href: string }[] = [
  { key: "visibility",  href: "/#monitoring" },
  { key: "personas",    href: "/#intelligence" },
  { key: "citations",   href: "/#sources" },
  { key: "content",     href: "/#content" },
  { key: "workflows",   href: "/#workflows" },
  { key: "brandMemory", href: "/#brand-memory" },
];

const RESOURCES: { key: ResourcesKey; href: string; soon?: boolean }[] = [
  { key: "blog",     href: "/blog" },
  { key: "docs",     href: "/docs" },
  { key: "analysis", href: "/refinea-analysis" },
];

const COMPANY: { key: CompanyKey; href: string; external?: boolean; action?: "openCookiePrefs" }[] = [
  { key: "team",        href: "/team" },
  { key: "pricing",     href: "/pricing" },
  { key: "linkedin",    href: "https://www.linkedin.com/company/refinea", external: true },
  { key: "youtube",     href: "https://www.youtube.com/@OfficialRefinea", external: true },
  { key: "privacy",     href: "/privacy" },
  { key: "terms",       href: "/terms" },
  { key: "cookies",     href: "/cookie-policy" },
  { key: "cookiePrefs", href: "#", action: "openCookiePrefs" },
];

function FooterColumn({
  title,
  links,
  soonLabel,
}: {
  title: string;
  links: { key: string; label: string; href: string; external?: boolean; soon?: boolean; action?: "openCookiePrefs" }[];
  soonLabel: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/40 mb-4">
        {title}
      </p>
      <ul className="space-y-1">
        {links.map((link) => {
          if (link.soon) {
            return (
              <li key={link.key}>
                <span className="text-sm text-white/30 inline-flex items-center gap-2 cursor-default py-1.5">
                  {link.label}
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      padding: "1px 6px",
                      borderRadius: 3,
                      background: "rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.4)",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    {soonLabel}
                  </span>
                </span>
              </li>
            );
          }
          if (link.external) {
            return (
              <li key={link.key}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-white/60 hover:text-white transition-colors py-1.5 -my-1.5"
                >
                  {link.label}
                </a>
              </li>
            );
          }
          if (link.action === "openCookiePrefs") {
            return (
              <li key={link.key}>
                <CookiePrefsButton label={link.label} />
              </li>
            );
          }
          return (
            <li key={link.key}>
              <Link
                href={link.href}
                className="block text-sm text-white/60 hover:text-white transition-colors py-1.5 -my-1.5"
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default async function Footer() {
  const t = await getTranslations("footer");
  const soonLabel = t("soonBadge");

  const platformLinks = PLATFORM.map((l) => ({ ...l, label: t(`platform.${l.key}`) }));
  const resourcesLinks = RESOURCES.map((l) => ({ ...l, label: t(`resources.${l.key}`) }));
  const companyLinks = COMPANY.map((l) => ({ ...l, label: t(`company.${l.key}`) }));

  return (
    <footer className="bg-black border-t border-white/[0.06]">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-12 sm:pt-14 pb-10 safe-px">
        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 sm:gap-x-10 gap-y-10 mb-12 sm:mb-14">
          <FooterColumn title={t("platformLabel")}  links={platformLinks}  soonLabel={soonLabel} />
          <FooterColumn title={t("resourcesLabel")} links={resourcesLinks} soonLabel={soonLabel} />
          <FooterColumn title={t("companyLabel")}   links={companyLinks}   soonLabel={soonLabel} />
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logos/refinea%20grigio.svg"
              alt="Refinea logo"
              style={{
                height: 30,
                width: 30,
                objectFit: "contain",
                filter: "brightness(0) invert(1)",
                opacity: 0.4,
                marginRight: -4,
              }}
            />
            <span className="text-sm font-bold text-white/35">Refinea</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-5">
            <span className="text-xs text-white/20">
              {t("copyright", { year: new Date().getFullYear() })}
            </span>
            <span className="hidden sm:block text-white/10 text-xs">&middot;</span>
            <span className="text-xs text-white/15 font-mono">
              {t("vat")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
