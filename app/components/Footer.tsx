import Link from "next/link";

const SOLUTIONS = [
  { label: "For E-commerce", href: "/solutions/ecommerce" },
  { label: "For SaaS", href: "/solutions/saas" },
  { label: "For Agencies", href: "/solutions/agencies" },
  { label: "For Enterprise", href: "/solutions/enterprise" },
];

const RESOURCES = [
  { label: "Blog", href: "/blog" },
  { label: "Documentation", href: "#", soon: true },
  { label: "Glossary", href: "#", soon: true },
  { label: "Case Studies", href: "#", soon: true },
];

const COMPANY = [
  { label: "Team", href: "/team" },
  { label: "Pricing", href: "/pricing" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/refinea", external: true },
  { label: "YouTube", href: "https://www.youtube.com/@OfficialRefinea", external: true },
];

const LEGAL = [
  { label: "Privacy Policy", href: "/privacy", soon: true },
  { label: "Terms of Service", href: "/terms", soon: true },
  { label: "Cookie Policy", href: "/cookie", soon: true },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; external?: boolean; soon?: boolean }[];
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/30 mb-4">
        {title}
      </p>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            {link.soon ? (
              <span className="text-sm text-white/20 flex items-center gap-2">
                {link.label}
                <span className="text-[9px] font-semibold uppercase tracking-wide text-white/15 bg-white/[0.05] px-1.5 py-0.5 rounded-full">
                  Soon
                </span>
              </span>
            ) : link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/40 hover:text-white/70 transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="text-sm text-white/40 hover:text-white/70 transition-colors"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/[0.06]">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-14 pb-10">
        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <FooterColumn title="Solutions" links={SOLUTIONS} />
          <FooterColumn title="Resources" links={RESOURCES} />
          <FooterColumn title="Company" links={COMPANY} />
          <FooterColumn title="Legal" links={LEGAL} />
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center">
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
              &copy; {new Date().getFullYear()} Refinea. All rights reserved.
            </span>
            <span className="hidden sm:block text-white/10 text-xs">&middot;</span>
            <span className="text-xs text-white/15 font-mono">
              VAT 06241080875 &middot; Cap. Soc. &euro;10.000
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
