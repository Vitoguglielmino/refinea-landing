import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import structuredData from "./structured-data";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://refinea.io"),
  title: {
    default: "Refinea - Generative Engine Optimization (GEO) Infrastructure",
    template: "%s | Refinea",
  },
  description:
    "Refinea is the Generative Engine Optimization (GEO) platform that tracks and optimizes how ChatGPT, Gemini, and Perplexity recommend your brand. Analyze AI visibility by buyer persona, purchase intent, and geographic context. Optimize decisions, not rankings.",
  keywords: [
    "Generative Engine Optimization",
    "GEO",
    "GEO platform",
    "GEO infrastructure",
    "AI visibility",
    "AI visibility tracking",
    "AI brand recommendations",
    "ChatGPT brand recommendations",
    "ChatGPT visibility",
    "Gemini brand visibility",
    "Perplexity brand discovery",
    "buyer persona AI optimization",
    "AI-native marketing",
    "post-search SEO",
    "LLM brand selection",
    "AI search optimization",
    "AI recommendation engine",
    "brand visibility AI",
    "optimize for ChatGPT",
    "how to appear in ChatGPT",
    "how to appear in AI answers",
    "AI content optimization",
    "LLM optimization",
    "AI discovery platform",
  ],
  authors: [
    { name: "Vito Guglielmino", url: "https://www.linkedin.com/in/vitoguglielmino/" },
    { name: "Giorgio Monaco", url: "https://www.linkedin.com/in/giorgio-monaco/" },
  ],
  creator: "Refinea S.r.l.",
  publisher: "Refinea",
  category: "Technology",
  openGraph: {
    type: "website",
    url: "https://refinea.io",
    title: "Refinea - Generative Engine Optimization (GEO) Infrastructure",
    description:
      "The GEO platform that tracks how ChatGPT, Gemini, and Perplexity recommend your brand by buyer persona and intent. Optimize for AI-native brand visibility.",
    siteName: "Refinea",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Refinea - The Generative Engine Optimization (GEO) Infrastructure",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Refinea - Generative Engine Optimization (GEO) Infrastructure",
    description:
      "The GEO platform that tracks how ChatGPT, Gemini, and Perplexity recommend your brand by buyer persona and intent.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  alternates: {
    canonical: "https://refinea.io",
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
  verification: {
    // Add your verification codes here:
    // google: "your-google-search-console-verification-code",
    // yandex: "your-yandex-verification-code",
    other: {
      "msvalidate.01": "", // Add Bing Webmaster Tools verification code
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0ZHBMD6QJY"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-0ZHBMD6QJY');`}
        </Script>
      </body>
    </html>
  );
}
