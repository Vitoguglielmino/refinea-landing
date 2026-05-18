/**
 * English Privacy Policy body.
 *
 * Kept as a JSX module (not MDX, not a JSON string) because:
 * - it's a static legal document that almost never changes
 * - line-by-line diffing is much easier than a JSON blob
 * - we can use the same typography utilities as other pages
 *
 * Imported by app/[locale]/privacy/page.tsx when locale === "en".
 */

export default function PrivacyEnContent() {
  return (
    <>
      <p>
        Refinea S.r.l. (&quot;Refinea&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), VAT number
        06241080875, operates the website refinea.io and the Refinea platform
        (app.refinea.io). This Privacy Policy explains how we collect, use,
        store, and share your personal data when you use our services.
      </p>

      <h2>1. Data Controller</h2>
      <p>
        The data controller is Refinea S.r.l., with registered office in
        Italy. For any privacy-related inquiries, contact us at{" "}
        <a href="mailto:privacy@refinea.io">privacy@refinea.io</a>.
      </p>

      <h2>2. Data We Collect</h2>
      <p>
        When you use Refinea, we may collect the following categories of
        data:
      </p>

      <h3>2.1 Account Data</h3>
      <ul>
        <li>Name and email address (provided during signup or via Google Sign-In)</li>
        <li>Profile picture (if you sign in with Google)</li>
        <li>Company name and website (provided during onboarding)</li>
        <li>Billing information (processed by Stripe — we do not store credit card numbers)</li>
      </ul>

      <h3>2.2 Usage Data</h3>
      <ul>
        <li>Pages visited, features used, and actions taken within the platform</li>
        <li>Device type, browser, operating system, and IP address</li>
        <li>Analytics data collected via PostHog (see Section 6)</li>
      </ul>

      <h3>2.3 Third-Party Connected Data</h3>
      <ul>
        <li>Google Search Console data (search queries, impressions, clicks, pages) — connected by you during onboarding</li>
        <li>Google Analytics 4 data (traffic, user behavior) — connected by you during onboarding</li>
      </ul>
      <p>
        We only access this data after you explicitly grant permission via
        OAuth. We do not access any Google data without your consent.
      </p>

      <h2>3. How We Use Your Data</h2>
      <p>We use your data for the following purposes:</p>
      <ul>
        <li>To provide and operate the Refinea platform (buyer persona generation, AI visibility monitoring, content creation, audits)</li>
        <li>To authenticate your identity and manage your account</li>
        <li>To process payments (via Stripe)</li>
        <li>To analyze platform usage and improve our services (via PostHog)</li>
        <li>To send you service-related communications (account updates, billing, security alerts)</li>
        <li>To provide customer support</li>
      </ul>
      <p>
        We do <strong>not</strong> use your data for advertising. We do{" "}
        <strong>not</strong> sell your data to third parties. We do{" "}
        <strong>not</strong> use your Google user data for purposes
        unrelated to the Refinea platform.
      </p>

      <h2>4. Google User Data — Specific Disclosure</h2>
      <p>
        When you sign in with Google, we request access to the following
        scopes:
      </p>
      <ul>
        <li><code>openid</code> — to verify your identity</li>
        <li><code>email</code> — to identify your account</li>
        <li><code>profile</code> — to display your name and profile picture</li>
      </ul>
      <p>
        We use this data solely to create and manage your Refinea account.
        We do not share, transfer, or use your Google user data for any
        purpose other than providing and improving the Refinea platform.
      </p>
      <p>
        When you connect Google Search Console or Google Analytics, we
        request access to read your search and analytics data. This data is
        used exclusively within the Refinea platform to generate buyer
        personas, monitor AI visibility, and provide actionable insights.
        We do not share this data with third parties.
      </p>
      <p>
        Your Google user data is stored securely using Firebase
        Authentication and is protected by industry-standard security
        measures. You can revoke Refinea&apos;s access to your Google data at
        any time through your{" "}
        <a
          href="https://myaccount.google.com/permissions"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Account settings
        </a>
        .
      </p>
      <p>
        Refinea&apos;s use and transfer to any other app of information
        received from Google APIs will adhere to the{" "}
        <a
          href="https://developers.google.com/terms/api-services-user-data-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google API Services User Data Policy
        </a>
        , including the Limited Use requirements.
      </p>

      <h2>5. Legal Basis for Processing (GDPR)</h2>
      <p>We process your data based on the following legal grounds:</p>
      <ul>
        <li><strong>Contract performance</strong> (Art. 6(1)(b) GDPR): to provide you with the services you signed up for</li>
        <li><strong>Legitimate interest</strong> (Art. 6(1)(f) GDPR): to improve our platform and prevent fraud</li>
        <li><strong>Consent</strong> (Art. 6(1)(a) GDPR): for optional analytics and when you connect third-party accounts</li>
      </ul>

      <h2>6. Analytics and Cookies</h2>
      <p>
        We use PostHog for product analytics on our website and platform.
        On our marketing website (refinea.io), PostHog operates in
        cookieless mode: no cookies are set, no data is stored in your
        browser, and no personally identifiable information is collected
        from anonymous visitors. We have disabled IP address capture for
        all anonymous visitors. PostHog measures aggregate usage patterns
        using a privacy-preserving hash that cannot be used to identify
        individual users. On our platform (app.refinea.io), where you are
        authenticated, PostHog collects usage data associated with your
        account to help us improve the product, as described in Section
        3 of this policy. PostHog data is hosted in the EU (Frankfurt,
        Germany) and does not leave the European Economic Area.
      </p>
      <p>
        We use Stripe for payment processing. Stripe may set cookies
        necessary for payment functionality.
      </p>
      <p>
        We use Google Analytics 4 (provider: Google Ireland Limited and
        Google LLC) on the marketing website to understand how visitors use
        Refinea so we can improve the product. Google Analytics is loaded
        with Google Consent Mode v2 in <strong>default denied</strong>
        state: until you explicitly consent through our cookie banner, only
        anonymous, aggregated cookieless pings are sent &mdash; no cookies
        are stored on your device and no identifier is created. If you
        consent, GA4 stores the cookies <code>_ga</code> and
        <code>_ga_0ZHBMD6QJY</code> for up to 2 years to distinguish
        unique visitors. IP addresses are anonymized at collection, and
        behavioral data is retained for 14 months. Legal basis: consent
        (Art. 6(1)(a) GDPR). Data may be transferred to the United States
        under the EU&ndash;US Data Privacy Framework and Standard
        Contractual Clauses with Google.
      </p>
      <p>
        We do not use advertising cookies. We display a cookie consent
        banner on first visit allowing you to accept, reject, or customize
        which categories of cookies to enable. Your choice is stored in a
        first-party cookie (<code>cc_cookie</code>, 6 months) and can be
        changed at any time via the &ldquo;Cookie preferences&rdquo; link in
        the Footer. Full details are in our{" "}
        <a href="/cookie-policy">Cookie Policy</a>.
      </p>

      <h2>7. Data Storage and Transfers</h2>
      <p>
        Your account data is stored using Firebase (Google Cloud Platform).
        Firebase Authentication data is processed in the United States.
        Google provides Standard Contractual Clauses (SCCs) and adheres to
        the EU-US Data Privacy Framework to ensure adequate protection of
        personal data transferred outside the EEA.
      </p>
      <p>
        Your connected Google Search Console and Google Analytics data is
        processed within the Refinea platform infrastructure.
      </p>
      <p>
        Payment data is processed by Stripe, Inc. Stripe is certified
        under the EU-US Data Privacy Framework.
      </p>

      <h2>8. Data Retention</h2>
      <p>
        We retain your personal data for as long as your account is
        active. If you delete your account, we will delete your personal
        data within 30 days, except where we are required to retain it for
        legal or regulatory purposes (e.g., billing records for tax
        purposes — retained for up to 10 years as required by Italian law).
      </p>

      <h2>9. Your Rights (GDPR)</h2>
      <p>Under the GDPR, you have the following rights:</p>
      <ul>
        <li><strong>Right of access:</strong> request a copy of your personal data</li>
        <li><strong>Right to rectification:</strong> correct inaccurate data</li>
        <li><strong>Right to erasure:</strong> request deletion of your data</li>
        <li><strong>Right to restrict processing:</strong> limit how we use your data</li>
        <li><strong>Right to data portability:</strong> receive your data in a structured format</li>
        <li><strong>Right to object:</strong> object to processing based on legitimate interest</li>
        <li><strong>Right to withdraw consent:</strong> withdraw consent at any time for consent-based processing</li>
      </ul>
      <p>
        To exercise any of these rights, contact us at{" "}
        <a href="mailto:privacy@refinea.io">privacy@refinea.io</a>.
      </p>
      <p>
        You also have the right to lodge a complaint with your local data
        protection authority. In Italy, this is the{" "}
        <a
          href="https://www.garanteprivacy.it"
          target="_blank"
          rel="noopener noreferrer"
        >
          Garante per la protezione dei dati personali
        </a>
        .
      </p>

      <h2>10. Data Security</h2>
      <p>
        We implement appropriate technical and organizational measures to
        protect your data, including:
      </p>
      <ul>
        <li>Encryption in transit (TLS/HTTPS)</li>
        <li>Firebase Authentication with secure token management</li>
        <li>Access controls limiting data access to authorized personnel</li>
        <li>Regular security reviews</li>
      </ul>

      <h2>11. Children</h2>
      <p>
        Refinea is not intended for use by anyone under the age of 18. We
        do not knowingly collect data from minors. If you believe we have
        collected data from a minor, contact us at{" "}
        <a href="mailto:privacy@refinea.io">privacy@refinea.io</a> and we
        will delete it promptly.
      </p>

      <h2>12. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will
        notify you of material changes by email or by posting a notice on
        our website. Your continued use of the platform after changes take
        effect constitutes acceptance of the updated policy.
      </p>

      <h2>13. Contact</h2>
      <p>
        Refinea S.r.l.
        <br />
        Email:{" "}
        <a href="mailto:privacy@refinea.io">privacy@refinea.io</a>
        <br />
        Website:{" "}
        <a href="https://refinea.io" target="_blank" rel="noopener noreferrer">
          https://refinea.io
        </a>
      </p>
    </>
  );
}
