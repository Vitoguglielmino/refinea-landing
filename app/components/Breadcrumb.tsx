import Link from "next/link";

type BreadcrumbItem = {
  name: string;
  href: string;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://refinea.io";

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const allItems = [{ name: "Home", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-1.5 text-[12px] font-mono text-black/30">
          {allItems.map((item, i) => (
            <li key={item.href} className="flex items-center gap-1.5">
              {i > 0 && (
                <span className="text-black/15">/</span>
              )}
              {i < allItems.length - 1 ? (
                <Link
                  href={item.href}
                  className="hover:text-black transition-colors"
                >
                  {item.name}
                </Link>
              ) : (
                <span className="text-black/50">{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
