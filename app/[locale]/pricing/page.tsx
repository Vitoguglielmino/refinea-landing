import { setRequestLocale } from "next-intl/server";
import PricingContent from "./PricingContent";

/**
 * Server entry for /pricing. Calls `setRequestLocale` so server
 * components inside Nav/Footer/PricingContent get the correct locale.
 * PricingContent is itself a server component — the only client island
 * is the PricingTabs switcher, which carries its own Suspense boundary
 * for useSearchParams.
 */
export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PricingContent />;
}
