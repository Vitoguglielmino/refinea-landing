export default function CookiePolicyEnContent() {
  return (
    <>
      <p>
        This Cookie Policy explains how Refinea S.r.l. (&ldquo;Refinea&rdquo;,
        &ldquo;we&rdquo;, &ldquo;us&rdquo;) uses cookies and similar
        technologies on the marketing website at{" "}
        <strong>refinea.io</strong>. It complements our{" "}
        <a href="/privacy">Privacy Policy</a> and explains what each cookie
        does, how long it lives, and how you can change your choice at any
        time.
      </p>

      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files that a website stores in your browser to
        remember information between visits or pages. Similar technologies
        include localStorage, sessionStorage, and tracking pixels. We refer to
        all of these as &ldquo;cookies&rdquo; in this policy for simplicity.
      </p>

      <h2>2. Categories of cookies we use</h2>

      <h3>2.1 Strictly necessary cookies</h3>
      <p>
        These cookies are required for the site to work and to record your
        cookie consent choice itself. They do not identify you personally and
        cannot be disabled.
      </p>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Provider</th>
            <th>Duration</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>cc_cookie</code>
            </td>
            <td>refinea.io</td>
            <td>6 months</td>
            <td>
              Stores your cookie consent choice (categories accepted,
              timestamp, version) so we do not ask you again.
            </td>
          </tr>
          <tr>
            <td>
              <code>NEXT_LOCALE</code>
            </td>
            <td>refinea.io</td>
            <td>1 year</td>
            <td>
              Remembers your language preference (EN / IT) across visits.
            </td>
          </tr>
        </tbody>
      </table>

      <h3>2.2 Analytics cookies</h3>
      <p>
        With your consent, we use Google Analytics 4 (provider: Google
        Ireland Limited and Google LLC) to understand how visitors use
        Refinea so we can improve the product. We use Google Consent Mode v2
        with default <strong>denied</strong> state: until you accept, Google
        receives only anonymous, aggregated &ldquo;cookieless pings&rdquo; with
        no identifiers and no cookies are stored on your device.
      </p>
      <p>
        IP addresses are anonymized at collection (IP truncation). Behavioral
        data is retained for 14 months and then automatically deleted. Data
        may be transferred to the United States: this transfer is covered by
        the EU&ndash;US Data Privacy Framework and Standard Contractual
        Clauses with Google.
      </p>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Provider</th>
            <th>Duration</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>_ga</code>
            </td>
            <td>refinea.io (Google Analytics)</td>
            <td>2 years</td>
            <td>
              Distinguishes unique visitors with a random anonymous ID.
            </td>
          </tr>
          <tr>
            <td>
              <code>_ga_0ZHBMD6QJY</code>
            </td>
            <td>refinea.io (Google Analytics)</td>
            <td>2 years</td>
            <td>
              Stores session state for the Refinea Google Analytics property.
            </td>
          </tr>
        </tbody>
      </table>

      <h3>2.3 Product analytics (no cookies)</h3>
      <p>
        We also use <strong>PostHog</strong> (provider: PostHog Inc., hosted
        in the EU) in <em>cookieless mode</em>: no cookies are stored, IP
        addresses are not captured, and no personal identifier is created.
        Because no information is stored on your device, this technology
        falls outside the consent requirement of the ePrivacy Directive
        (Art. 5(3)) and runs by default. Read more in our{" "}
        <a href="/privacy">Privacy Policy</a>.
      </p>

      <h2>3. How to manage your preferences</h2>
      <p>You can change your cookie choice at any time:</p>
      <ul>
        <li>
          Click <strong>&ldquo;Cookie preferences&rdquo;</strong> at the bottom
          of any page (in the Footer).
        </li>
        <li>
          Clear the <code>cc_cookie</code> cookie in your browser settings
          &mdash; we will ask you again on your next visit.
        </li>
        <li>
          Most browsers let you block all cookies in their privacy settings.
          Doing so may break parts of the site that depend on strictly
          necessary cookies.
        </li>
      </ul>

      <h2>4. Third-party cookies</h2>
      <p>
        Some pages may embed content from third parties (e.g. YouTube video
        embeds, LinkedIn buttons, Calendly booking widget). These providers
        may set their own cookies when you interact with their content. We do
        not control these cookies; please refer to each provider&rsquo;s
        privacy policy.
      </p>

      <h2>5. Your GDPR rights</h2>
      <p>
        Under the General Data Protection Regulation you have the right to
        access, rectify, erase, restrict, port, or object to the processing
        of your personal data, and the right to withdraw consent at any time.
        You can exercise these rights by writing to{" "}
        <a href="mailto:privacy@refinea.io">privacy@refinea.io</a> or by
        contacting our Data Protection Officer at the same address. You also
        have the right to lodge a complaint with your local supervisory
        authority &mdash; in Italy, this is the Garante per la Protezione dei
        Dati Personali (<a href="https://www.garanteprivacy.it">garanteprivacy.it</a>).
      </p>

      <h2>6. Changes to this policy</h2>
      <p>
        We may update this Cookie Policy from time to time to reflect changes
        in our cookies or in applicable law. The &ldquo;Last updated&rdquo;
        date at the top of this page indicates the most recent version. If
        we add a new cookie category, we will ask for your consent again
        before activating it.
      </p>

      <h2>7. Contact</h2>
      <p>
        Refinea S.r.l. &mdash; VAT IT06241080875 &mdash; Italy
        <br />
        Email: <a href="mailto:privacy@refinea.io">privacy@refinea.io</a>
      </p>
    </>
  );
}
