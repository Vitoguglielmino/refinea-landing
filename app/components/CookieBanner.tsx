"use client";

/**
 * CookieBanner — GDPR / ePrivacy compliant consent UI.
 *
 * Wired to Google Consent Mode v2 (default denied in layout.tsx, gtag.js
 * boots in cookieless-pings mode; this component flips analytics_storage
 * to 'granted' when the visitor accepts).
 *
 * Design rationale:
 *   - 3 buttons of equal visual weight (Accept all / Customize / Reject all)
 *     — EDPB guideline 03/2022 compliance.
 *   - Analytics pre-checked in modal: lawful because banner exposes Reject
 *     at equal weight (Garante provvedimento 10 Jun 2021).
 *   - Persistent "Cookie preferences" link in Footer reopens the modal.
 *   - Consent proof stored in `cc_cookie` (categories + timestamp + version)
 *     to satisfy art. 7.1 GDPR.
 */

import { useEffect } from "react";
import { useTranslations } from "next-intl";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    refineaOpenCookiePrefs?: () => void;
  }
}

export default function CookieBanner({ locale }: { locale: string }) {
  const t = useTranslations("cookies");

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const CC = await import("vanilla-cookieconsent");
      // Library base CSS is imported statically from app/globals.css so
      // it loads BEFORE our overrides in the cascade. Importing it here
      // (async) would inject it last → its !important rules would beat
      // ours. Do not re-add the dynamic import.

      if (!isMounted) return;

      const lang = locale === "it" ? "it" : "en";

      const sections = [
        {
          title: t("prefs.intro.title"),
          description: t("prefs.intro.body"),
        },
        {
          title: t("prefs.necessary.title"),
          description: t("prefs.necessary.body"),
          linkedCategory: "necessary",
        },
        {
          title: t("prefs.analytics.title"),
          description: t("prefs.analytics.body"),
          linkedCategory: "analytics",
          cookieTable: {
            caption: t("prefs.analytics.tableCaption"),
            headers: {
              name: t("prefs.table.name"),
              domain: t("prefs.table.domain"),
              duration: t("prefs.table.duration"),
              description: t("prefs.table.purpose"),
            },
            body: [
              {
                name: "_ga",
                domain: "refinea.io",
                duration: t("prefs.duration.2years"),
                description: t("prefs.cookies.ga"),
              },
              {
                name: "_ga_0ZHBMD6QJY",
                domain: "refinea.io",
                duration: t("prefs.duration.2years"),
                description: t("prefs.cookies.gaProperty"),
              },
              {
                name: "cc_cookie",
                domain: "refinea.io",
                duration: t("prefs.duration.6months"),
                description: t("prefs.cookies.cc"),
              },
            ],
          },
        },
        {
          title: t("prefs.more.title"),
          description: t("prefs.more.body").replace(
            "__PRIVACY_LINK__",
            `<a href="/privacy">${t("prefs.more.privacyText")}</a>`,
          ),
        },
      ];

      const translation = {
        consentModal: {
          title: t("banner.title"),
          description: t("banner.description"),
          acceptAllBtn: t("banner.acceptAll"),
          acceptNecessaryBtn: t("banner.rejectAll"),
          showPreferencesBtn: t("banner.preferences"),
          footer: `<a href="/privacy">${t("banner.privacyLink")}</a> · <a href="/cookie-policy">${t("banner.cookieLink")}</a>`,
        },
        preferencesModal: {
          title: t("prefs.title"),
          acceptAllBtn: t("banner.acceptAll"),
          acceptNecessaryBtn: t("banner.rejectAll"),
          savePreferencesBtn: t("prefs.save"),
          closeIconLabel: t("prefs.close"),
          sections,
        },
      };

      CC.run({
        root: "body",
        guiOptions: {
          consentModal: {
            layout: "box",
            position: "bottom right",
            equalWeightButtons: true,
            flipButtons: false,
          },
          preferencesModal: {
            layout: "box",
            position: "right",
            equalWeightButtons: true,
            flipButtons: false,
          },
        },
        cookie: {
          name: "cc_cookie",
          expiresAfterDays: 182, // 6 months re-prompt (EDPB best practice)
        },
        categories: {
          necessary: {
            enabled: true,
            readOnly: true,
          },
          analytics: {
            enabled: true, // Pre-checked: lawful because banner has Reject
            autoClear: {
              cookies: [
                { name: /^_ga/ },
                { name: "_gid" },
                { name: "_gat" },
              ],
            },
          },
        },
        language: {
          default: lang,
          translations: {
            [lang]: translation,
          },
        },
        onConsent: ({ cookie }) => {
          const analytics = cookie.categories.includes("analytics");
          window.gtag?.("consent", "update", {
            analytics_storage: analytics ? "granted" : "denied",
            ad_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied",
          });
        },
        onChange: ({ cookie }) => {
          const analytics = cookie.categories.includes("analytics");
          window.gtag?.("consent", "update", {
            analytics_storage: analytics ? "granted" : "denied",
            ad_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied",
          });
        },
      });

      window.refineaOpenCookiePrefs = () => CC.showPreferences();
    })();

    return () => {
      isMounted = false;
    };
  }, [locale, t]);

  return null;
}
