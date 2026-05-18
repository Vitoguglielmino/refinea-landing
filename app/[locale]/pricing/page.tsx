import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import PricingClient from "./PricingClient";

/**
 * Server entry for /pricing. Calls `setRequestLocale` so server components
 * inside Nav/Footer/PricingClient get the correct locale, then renders the
 * client tree wrapped in Suspense (required because PricingClient reads
 * `useSearchParams` to keep the active tab in sync with the URL).
 */
export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={null}>
      <PricingClient />
    </Suspense>
  );
}
