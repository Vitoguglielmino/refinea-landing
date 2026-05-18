/**
 * Italian Privacy Policy body. Mirrors the structure of PrivacyEnContent —
 * any section added/removed in one should be added/removed in the other.
 */

export default function PrivacyItContent() {
  return (
    <>
      <p>
        Refinea S.r.l. (&quot;Refinea&quot;, &quot;noi&quot;), P.IVA
        06241080875, gestisce il sito refinea.io e la piattaforma Refinea
        (app.refinea.io). La presente Privacy Policy spiega come
        raccogliamo, utilizziamo, conserviamo e condividiamo i tuoi dati
        personali quando usi i nostri servizi.
      </p>

      <h2>1. Titolare del trattamento</h2>
      <p>
        Il titolare del trattamento è Refinea S.r.l., con sede legale in
        Italia. Per qualsiasi richiesta relativa alla privacy, contattaci
        a <a href="mailto:privacy@refinea.io">privacy@refinea.io</a>.
      </p>

      <h2>2. Dati che raccogliamo</h2>
      <p>Quando usi Refinea, possiamo raccogliere le seguenti categorie di dati:</p>

      <h3>2.1 Dati dell&apos;account</h3>
      <ul>
        <li>Nome e indirizzo email (forniti in fase di registrazione o tramite Google Sign-In)</li>
        <li>Immagine del profilo (se accedi con Google)</li>
        <li>Nome dell&apos;azienda e sito web (forniti durante l&apos;onboarding)</li>
        <li>Dati di fatturazione (gestiti da Stripe — non conserviamo numeri di carta di credito)</li>
      </ul>

      <h3>2.2 Dati di utilizzo</h3>
      <ul>
        <li>Pagine visitate, funzionalità utilizzate e azioni compiute all&apos;interno della piattaforma</li>
        <li>Tipo di dispositivo, browser, sistema operativo e indirizzo IP</li>
        <li>Dati di analytics raccolti tramite PostHog (vedi Sezione 6)</li>
      </ul>

      <h3>2.3 Dati connessi da terze parti</h3>
      <ul>
        <li>Dati di Google Search Console (query di ricerca, impression, click, pagine) — connessi da te durante l&apos;onboarding</li>
        <li>Dati di Google Analytics 4 (traffico, comportamento utenti) — connessi da te durante l&apos;onboarding</li>
      </ul>
      <p>
        Accediamo a questi dati solo dopo che concedi esplicitamente
        l&apos;autorizzazione via OAuth. Non accediamo a nessun dato Google
        senza il tuo consenso.
      </p>

      <h2>3. Come utilizziamo i tuoi dati</h2>
      <p>Utilizziamo i tuoi dati per le seguenti finalità:</p>
      <ul>
        <li>Fornire e operare la piattaforma Refinea (generazione di buyer personas, monitoraggio della visibilità AI, creazione di contenuti, audit)</li>
        <li>Autenticare la tua identità e gestire il tuo account</li>
        <li>Elaborare i pagamenti (tramite Stripe)</li>
        <li>Analizzare l&apos;utilizzo della piattaforma e migliorare i nostri servizi (tramite PostHog)</li>
        <li>Inviarti comunicazioni di servizio (aggiornamenti dell&apos;account, fatturazione, avvisi di sicurezza)</li>
        <li>Fornire supporto clienti</li>
      </ul>
      <p>
        <strong>Non</strong> utilizziamo i tuoi dati per scopi
        pubblicitari. <strong>Non</strong> vendiamo i tuoi dati a terze
        parti. <strong>Non</strong> utilizziamo i tuoi dati Google per
        finalità non legate alla piattaforma Refinea.
      </p>

      <h2>4. Dati utente Google — Informativa specifica</h2>
      <p>
        Quando accedi con Google, richiediamo l&apos;accesso ai seguenti
        scope:
      </p>
      <ul>
        <li><code>openid</code> — per verificare la tua identità</li>
        <li><code>email</code> — per identificare il tuo account</li>
        <li><code>profile</code> — per mostrare il tuo nome e la tua immagine del profilo</li>
      </ul>
      <p>
        Utilizziamo questi dati esclusivamente per creare e gestire il
        tuo account Refinea. Non condividiamo, trasferiamo né utilizziamo
        i tuoi dati utente Google per scopi diversi dalla fornitura e dal
        miglioramento della piattaforma Refinea.
      </p>
      <p>
        Quando connetti Google Search Console o Google Analytics,
        richiediamo l&apos;accesso in lettura ai tuoi dati di ricerca e
        analytics. Questi dati vengono utilizzati esclusivamente
        all&apos;interno della piattaforma Refinea per generare buyer
        personas, monitorare la visibilità AI e fornire insight
        azionabili. Non condividiamo questi dati con terze parti.
      </p>
      <p>
        I tuoi dati utente Google sono conservati in modo sicuro tramite
        Firebase Authentication e sono protetti da misure di sicurezza
        standard del settore. Puoi revocare l&apos;accesso di Refinea ai
        tuoi dati Google in qualsiasi momento dalle{" "}
        <a
          href="https://myaccount.google.com/permissions"
          target="_blank"
          rel="noopener noreferrer"
        >
          impostazioni del tuo Account Google
        </a>
        .
      </p>
      <p>
        L&apos;uso e il trasferimento da parte di Refinea verso qualsiasi
        altra app delle informazioni ricevute dalle API di Google
        aderisce alla{" "}
        <a
          href="https://developers.google.com/terms/api-services-user-data-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google API Services User Data Policy
        </a>
        , inclusi i requisiti Limited Use.
      </p>

      <h2>5. Base giuridica del trattamento (GDPR)</h2>
      <p>Trattiamo i tuoi dati sulla base delle seguenti basi giuridiche:</p>
      <ul>
        <li><strong>Esecuzione del contratto</strong> (Art. 6(1)(b) GDPR): per fornirti i servizi a cui ti sei registrato</li>
        <li><strong>Legittimo interesse</strong> (Art. 6(1)(f) GDPR): per migliorare la nostra piattaforma e prevenire frodi</li>
        <li><strong>Consenso</strong> (Art. 6(1)(a) GDPR): per analytics opzionali e quando connetti account di terze parti</li>
      </ul>

      <h2>6. Analytics e cookie</h2>
      <p>
        Utilizziamo PostHog per l&apos;analisi del prodotto sul nostro
        sito web e sulla piattaforma. Sul sito marketing (refinea.io),
        PostHog opera in modalità cookieless: non vengono impostati
        cookie, nessun dato viene salvato nel browser, e nessuna
        informazione personale viene raccolta dai visitatori anonimi.
        Abbiamo disabilitato la cattura dell&apos;indirizzo IP per tutti i
        visitatori anonimi. PostHog misura pattern di utilizzo aggregati
        usando un hash che preserva la privacy e non può essere usato
        per identificare singoli utenti. Sulla piattaforma
        (app.refinea.io), dove sei autenticato, PostHog raccoglie dati
        di utilizzo associati al tuo account per aiutarci a migliorare
        il prodotto, come descritto nella Sezione 3 di questa policy. I
        dati di PostHog sono ospitati nell&apos;UE (Francoforte, Germania)
        e non lasciano lo Spazio Economico Europeo.
      </p>
      <p>
        Utilizziamo Stripe per l&apos;elaborazione dei pagamenti. Stripe
        può impostare cookie necessari al funzionamento dei pagamenti.
      </p>
      <p>
        Utilizziamo Google Analytics 4 (titolare: Google Ireland Limited e
        Google LLC) sul sito di marketing per capire come i visitatori
        usano Refinea e migliorare il prodotto. Google Analytics viene
        caricato con Google Consent Mode v2 in stato di{" "}
        <strong>default denied</strong>: finché non presti esplicitamente
        il consenso tramite il nostro cookie banner, vengono inviati solo
        cookieless pings anonimi e aggregati &mdash; nessun cookie viene
        memorizzato sul tuo dispositivo e nessun identificatore viene
        creato. Se acconsenti, GA4 memorizza i cookie <code>_ga</code> e{" "}
        <code>_ga_0ZHBMD6QJY</code> fino a 2 anni per distinguere i
        visitatori unici. Gli indirizzi IP sono anonimizzati alla
        raccolta, e i dati comportamentali sono conservati per 14 mesi.
        Base giuridica: consenso (art. 6(1)(a) GDPR). I dati possono essere
        trasferiti negli Stati Uniti in base all&apos;EU&ndash;US Data
        Privacy Framework e alle Clausole Contrattuali Standard con Google.
      </p>
      <p>
        Non utilizziamo cookie pubblicitari. Mostriamo un cookie consent
        banner alla prima visita che ti permette di accettare, rifiutare o
        personalizzare quali categorie di cookie attivare. La tua scelta
        viene salvata in un cookie di prima parte (<code>cc_cookie</code>,
        6 mesi) e può essere modificata in qualsiasi momento tramite il
        link &ldquo;Preferenze cookie&rdquo; nel Footer. Tutti i dettagli
        nella nostra <a href="/cookie-policy">Cookie Policy</a>.
      </p>

      <h2>7. Conservazione e trasferimento dei dati</h2>
      <p>
        I dati del tuo account sono conservati tramite Firebase (Google
        Cloud Platform). I dati di Firebase Authentication sono trattati
        negli Stati Uniti. Google fornisce Standard Contractual Clauses
        (SCC) e aderisce all&apos;EU-US Data Privacy Framework per
        garantire una protezione adeguata dei dati personali trasferiti
        al di fuori del SEE.
      </p>
      <p>
        I tuoi dati connessi da Google Search Console e Google Analytics
        sono trattati all&apos;interno dell&apos;infrastruttura della
        piattaforma Refinea.
      </p>
      <p>
        I dati di pagamento sono trattati da Stripe, Inc. Stripe è
        certificata in base all&apos;EU-US Data Privacy Framework.
      </p>

      <h2>8. Conservazione dei dati</h2>
      <p>
        Conserviamo i tuoi dati personali per tutto il periodo in cui il
        tuo account è attivo. Se elimini il tuo account, cancelleremo i
        tuoi dati personali entro 30 giorni, salvo i casi in cui siamo
        tenuti a conservarli per finalità legali o regolamentari (es.
        registri di fatturazione per scopi fiscali — conservati fino a
        10 anni come previsto dalla legge italiana).
      </p>

      <h2>9. I tuoi diritti (GDPR)</h2>
      <p>In base al GDPR, hai i seguenti diritti:</p>
      <ul>
        <li><strong>Diritto di accesso:</strong> richiedere una copia dei tuoi dati personali</li>
        <li><strong>Diritto di rettifica:</strong> correggere dati inesatti</li>
        <li><strong>Diritto alla cancellazione:</strong> richiedere la cancellazione dei tuoi dati</li>
        <li><strong>Diritto di limitazione del trattamento:</strong> limitare l&apos;uso dei tuoi dati</li>
        <li><strong>Diritto alla portabilità dei dati:</strong> ricevere i tuoi dati in un formato strutturato</li>
        <li><strong>Diritto di opposizione:</strong> opporti al trattamento basato sul legittimo interesse</li>
        <li><strong>Diritto di revocare il consenso:</strong> revocare il consenso in qualsiasi momento per i trattamenti basati sul consenso</li>
      </ul>
      <p>
        Per esercitare uno qualsiasi di questi diritti, contattaci a{" "}
        <a href="mailto:privacy@refinea.io">privacy@refinea.io</a>.
      </p>
      <p>
        Hai inoltre il diritto di presentare un reclamo all&apos;autorità
        locale per la protezione dei dati. In Italia è il{" "}
        <a
          href="https://www.garanteprivacy.it"
          target="_blank"
          rel="noopener noreferrer"
        >
          Garante per la protezione dei dati personali
        </a>
        .
      </p>

      <h2>10. Sicurezza dei dati</h2>
      <p>
        Adottiamo misure tecniche e organizzative adeguate per proteggere
        i tuoi dati, tra cui:
      </p>
      <ul>
        <li>Crittografia in transito (TLS/HTTPS)</li>
        <li>Firebase Authentication con gestione sicura dei token</li>
        <li>Controlli di accesso che limitano l&apos;accesso ai dati al solo personale autorizzato</li>
        <li>Revisioni periodiche della sicurezza</li>
      </ul>

      <h2>11. Minori</h2>
      <p>
        Refinea non è destinato all&apos;uso da parte di persone di età
        inferiore ai 18 anni. Non raccogliamo consapevolmente dati di
        minori. Se ritieni che abbiamo raccolto dati di un minore,
        contattaci a{" "}
        <a href="mailto:privacy@refinea.io">privacy@refinea.io</a> e li
        cancelleremo prontamente.
      </p>

      <h2>12. Modifiche a questa policy</h2>
      <p>
        Potremmo aggiornare questa Privacy Policy di tanto in tanto. Ti
        informeremo di eventuali modifiche sostanziali via email o
        pubblicando un avviso sul nostro sito. L&apos;uso continuato della
        piattaforma dopo l&apos;entrata in vigore delle modifiche
        costituisce accettazione della policy aggiornata.
      </p>

      <h2>13. Contatti</h2>
      <p>
        Refinea S.r.l.
        <br />
        Email:{" "}
        <a href="mailto:privacy@refinea.io">privacy@refinea.io</a>
        <br />
        Sito web:{" "}
        <a href="https://refinea.io" target="_blank" rel="noopener noreferrer">
          https://refinea.io
        </a>
      </p>
    </>
  );
}
