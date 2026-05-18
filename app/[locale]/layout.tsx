import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import structuredData from "../structured-data";
import CookieBanner from "../components/CookieBanner";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://refinea.io";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Locale-specific copy for the homepage / default metadata. Per-page
 * overrides (e.g. /pricing, /blog/[slug]) are merged on top of this by
 * Next.js's metadata system, so anything not set here falls through from
 * the page-level `generateMetadata`.
 */
const META = {
  en: {
    title: "Refinea — AI Visibility Platform for GEO",
    description:
      "Refinea discovers what your customers ask AI and where AI chooses your competitors. Tools to change the answer.",
    ogLocale: "en_US",
    ogImageAlt: "Refinea — Generative Engine Optimization platform",
  },
  it: {
    title: "Refinea — Piattaforma di Visibilità AI per GEO",
    description:
      "Refinea scopre cosa chiedono i tuoi clienti all'AI e dove l'AI sceglie i competitor. Strumenti per cambiare la risposta.",
    ogLocale: "it_IT",
    ogImageAlt: "Refinea — Piattaforma di Generative Engine Optimization",
  },
} as const;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#f5f6f7",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isIt = locale === "it";
  const meta = isIt ? META.it : META.en;
  const canonical = isIt ? `${SITE_URL}/it` : SITE_URL;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: meta.title,
      template: "%s | Refinea",
    },
    description: meta.description,
    authors: [
      { name: "Vito Guglielmino", url: "https://www.linkedin.com/in/vitoguglielmino/" },
      { name: "Giorgio Monaco", url: "https://www.linkedin.com/in/giorgio-monaco/" },
    ],
    creator: "Refinea S.r.l.",
    publisher: "Refinea",
    category: "Technology",
    openGraph: {
      type: "website",
      url: canonical,
      title: meta.title,
      description: meta.description,
      siteName: "Refinea",
      locale: meta.ogLocale,
      alternateLocale: isIt ? ["en_US"] : ["it_IT"],
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: meta.ogImageAlt,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/opengraph-image"],
    },
    icons: {
      icon: "/icon.svg",
      apple: "/icon.svg",
    },
    alternates: {
      canonical,
      languages: {
        en: SITE_URL,
        it: `${SITE_URL}/it`,
        "x-default": SITE_URL,
      },
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

/**
 * Locale-scoped root layout.
 *
 * In a next-intl App Router setup with `[locale]` segment, this is the
 * canonical root layout: it renders `<html>` and `<body>`, applies fonts,
 * injects structured data and analytics, then wraps everything in
 * `NextIntlClientProvider` so client components can use `useTranslations`.
 *
 * Special files in `app/` (sitemap.ts, robots.ts, icon.svg, api routes,
 * globals.css) work without a layout — Next handles them directly.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="alternate"
          type="application/atom+xml"
          title="Refinea Blog — Atom feed"
          href="/blog/feed.xml"
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        {/*
          Google Consent Mode v2 — default DENIED for all storage. Must run
          before gtag.js loads so GA4 boots in "consent denied" mode (sends
          anonymous cookieless pings) until the visitor explicitly consents
          via the CookieBanner. CookieBanner calls gtag('consent','update')
          to flip the relevant flags to 'granted'.
        */}
        <Script id="consent-default" strategy="beforeInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 500
});
gtag('set','ads_data_redaction', true);
gtag('set','url_passthrough', true);`}
        </Script>
        <NextIntlClientProvider>
          {children}
          <CookieBanner locale={locale} />
        </NextIntlClientProvider>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0ZHBMD6QJY"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`gtag('js', new Date());
gtag('config', 'G-0ZHBMD6QJY');`}
        </Script>
      </body>
    </html>
  );
}
