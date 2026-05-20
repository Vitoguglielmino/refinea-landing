import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminUser } from "@/lib/admin-auth";

export const metadata = {
  title: "Guida — Refinea CMS",
  robots: { index: false, follow: false },
};

export default async function GuidePage() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="max-w-[820px] mx-auto px-8 py-10">
      <header className="mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent mb-3">
          Guida
        </p>
        <h1 className="text-3xl font-bold tracking-[-0.025em] mb-3">
          Come usare il CMS di Refinea
        </h1>
        <p className="text-base text-black/55 leading-relaxed">
          Riferimento a prova di scemo per pubblicare articoli sul blog.
          Copre ogni tipo di articolo, le regole di validazione, le
          traduzioni e le scelte SEO/GEO già integrate.
        </p>
      </header>

      <Toc />

      <article className="cms-guide">
        {/* ─────────────────────────── 1. Login ──────────────────────────── */}
        <Section id="login" title="1. Login" eyebrow="Entrare">
          <p>
            Vai su <Code>/admin/login</Code>. Inserisci la tua email Refinea
            (funzionano solo le email in allowlist — attualmente{" "}
            <Code>vito.guglielmino@refinea.io</Code> e{" "}
            <Code>giorgio.monaco@refinea.io</Code>).
          </p>
          <p>
            Clicca <Strong>Send sign-in link</Strong>. Apri l&apos;email su
            qualsiasi dispositivo, clicca il magic link, sei dentro. La
            sessione dura 1 ora, dopo devi rifare login.
          </p>
          <Callout tone="warn">
            Se l&apos;email non è nell&apos;allowlist ricevi un 403. Per
            aggiungere un nuovo editor, modifica{" "}
            <Code>lib/admin-auth.ts</Code> aggiungendo l&apos;email, poi fai
            commit.
          </Callout>
        </Section>

        {/* ─────────────────────── 2. The dashboard ──────────────────────── */}
        <Section id="dashboard" title="2. La dashboard" eyebrow="Dove atterri">
          <p>
            Dopo il login vedi <Strong>Blog posts</Strong> — tutti i file
            MDX nel repo, dal più recente. Ogni riga mostra titolo, sezione,
            autore, locale, data.
          </p>
          <ul>
            <li>
              <Strong>Click su una riga</Strong> → modifica quel post
            </li>
            <li>
              <Strong>+ New post</Strong> (in alto a destra o nella sidebar)
              → editor vuoto
            </li>
            <li>
              <Strong>View live blog ↗</Strong> (sidebar) → apre il sito
              pubblicato in nuova tab
            </li>
          </ul>
        </Section>

        {/* ─────────────────────── 3. The editor ─────────────────────────── */}
        <Section
          id="editor"
          title="3. L'editor — ogni campo, spiegato"
          eyebrow="Il form"
        >
          <p>
            Il CMS è costruito perché un post strutturalmente sbagliato{" "}
            <Strong>non possa essere pubblicato</Strong>. Gli errori sono
            rossi e bloccano il bottone Publish. Gli warning sono ambra e ti
            lasciano pubblicare ma ti dicono cosa migliorare.
          </p>

          <h3>3.1 Title</h3>
          <p>
            Il titolo H1 dell&apos;articolo. <Strong>30–65 caratteri</Strong>.
            Google tronca a circa 65. Il counter diventa rosso quando
            superi.
          </p>
          <p>
            Scrivi il titolo come una risposta completa o un hook. Non{" "}
            <em>&ldquo;Generative Engine Optimization&rdquo;</em> ma
            <em> &ldquo;Come gli AI engine scelgono quali brand consigliare nel 2026&rdquo;</em>.
          </p>

          <h3>3.2 Description</h3>
          <p>
            Meta description + summary dell&apos;Atom feed + preview
            LinkedIn. <Strong>120–160 caratteri</Strong>. Una frase che
            riassume il valore del post. Usata da Google nel SERP snippet.
          </p>

          <h3>3.3 Slug</h3>
          <p>
            Il segmento di URL. Auto-generato dal titolo (lowercase,
            stopword rimosse, separato da trattini). Puoi sovrascriverlo.{" "}
            <Strong>≤ 60 caratteri</Strong>, niente stopword
            (il/della/per/ecc), niente underscore.
          </p>
          <p>
            <Strong>URL finale</Strong>: <Code>/blog/&lt;slug&gt;</Code> per
            i post EN, <Code>/it/blog/&lt;slug&gt;</Code> per quelli IT.
          </p>
          <Callout tone="warn">
            Lo slug <Strong>non può essere cambiato dopo la pubblicazione</Strong>{" "}
            (romperebbe i link in entrata e le citazioni AI). Per
            rinominare: cancella il post e ricrealo.
          </Callout>

          <h3>3.4 Section</h3>
          <p>
            Una di 4. Determina lo schema type e la index page in cui il
            post appare.
          </p>
          <ul>
            <li>
              <Strong>Product</Strong> — changelog, feature deep-dive, case
              study. Schema:{" "}
              <Code>TechArticle</Code>
            </li>
            <li>
              <Strong>News</Strong> — analisi di settore, ricerche originali,
              opinioni. Schema:{" "}
              <Code>BlogPosting</Code>. Solo i post News con data ≤ 2 giorni
              entrano nel Google News sitemap (eligibility Top Stories).
            </li>
            <li>
              <Strong>Guides</Strong> — pillar guide, how-to, playbook.
              Schema: <Code>TechArticle</Code>. Massimo valore SEO se fatte
              bene.
            </li>
            <li>
              <Strong>Glossary</Strong> — definizioni di singolo termine
              (400–600 parole). Schema: <Code>DefinedTerm</Code> dentro il{" "}
              <Code>DefinedTermSet</Code> &ldquo;Refinea GEO Glossary&rdquo;. Cover
              opzionale.
            </li>
          </ul>
          <Callout tone="warn">
            Sezione sbagliata = schema fuorviante. L&apos;update Google di
            marzo 2026 tratta il markup fuorviante come terreno da manual
            action. Scegli la sezione che riflette davvero il contenuto.
          </Callout>

          <h3>3.5 Topics</h3>
          <p>
            <Strong>Da 1 a 3 topic</Strong> da una lista fissa di 5:
          </p>
          <ul>
            <li>
              <Code>generative-engine-optimization</Code>
            </li>
            <li>
              <Code>ai-search-strategy</Code>
            </li>
            <li>
              <Code>llm-citations</Code>
            </li>
            <li>
              <Code>ai-brand-visibility</Code>
            </li>
            <li>
              <Code>marketing-measurement</Code>
            </li>
          </ul>
          <p>
            I topic alimentano: <Strong>related posts</Strong> in fondo a
            ogni articolo, le hub page{" "}
            <Code>/blog/topic/&lt;slug&gt;</Code>, il campo{" "}
            <Code>about[]</Code> nel JSON-LD (entity anchor per gli LLM),
            i chip dei topic nell&apos;header dell&apos;articolo.
          </p>
          <p>
            Meglio pochi e precisi che molti e vaghi — 1 topic affilato batte
            3 topic fumosi.
          </p>

          <h3>3.6 Author</h3>
          <p>
            <Strong>Vito</Strong> — post strategici, di mercato, decision-layer,
            brand.<br />
            <Strong>Giorgio</Strong> — post tecnici, meccaniche AI,
            retrieval, schema, infrastructure.
          </p>
          <p>
            Determina lo schema JSON-LD <Code>Person</Code> (con{" "}
            <Code>sameAs</Code> LinkedIn, il segnale E-E-A-T più forte
            post-marzo 2026 core update), l&apos;avatar nell&apos;header
            dell&apos;articolo, il byline autore, e la pagina{" "}
            <Code>/blog/author/&lt;slug&gt;</Code>.
          </p>

          <h3>3.7 Locale</h3>
          <p>
            <Code>en</Code> o <Code>it</Code>. Determina il prefisso URL
            (<Code>/blog/...</Code> vs <Code>/it/blog/...</Code>),
            l&apos;attributo HTML <Code>lang</Code>, l&apos;hreflang, il
            language tag dell&apos;Atom feed.
          </p>

          <h3>3.8 Publish date</h3>
          <p>
            Data ISO (YYYY-MM-DD). Default a oggi sui nuovi post. Determina
            l&apos;ordering, l&apos;eligibility per il news sitemap, il
            campo JSON-LD <Code>datePublished</Code>.
          </p>

          <h3>3.9 Modified date</h3>
          <p>
            Opzionale. Impostala SOLO quando fai una modifica sostanziale
            (nuovi dati, sezione riscritta, esempi freschi). <Strong>Mai
            cosmetic-bump</Strong> — gli AI engine riconoscono la freschezza
            fake e penalizzano.
          </p>

          <h3>3.10 Review cycle</h3>
          <p>
            <Code>monthly</Code> · <Code>quarterly</Code> ·{" "}
            <Code>evergreen</Code>. Determina il flag di staleness (non
            ancora collegato a una dashboard, ma archiviato per future
            funzionalità di health monitoring).
          </p>

          <h3>3.11 Cover image</h3>
          <p>
            <Strong>1600×900 jpg/webp, ≤ 300 KB</Strong> è l&apos;ideale.
            Drag-drop nel box di upload o incolla un URL. Obbligatoria per
            tutto tranne le glossary entry (dove è opzionale).
          </p>
          <p>
            L&apos;upload commit il file in{" "}
            <Code>public/blog/&lt;filename-sanitizzato&gt;</Code> su GitHub.
            Il filename viene messo in lowercase, separato da trattini,
            solo ASCII.
          </p>
          <p>
            <Strong>Obbligatoria per i rich result Article in Google</Strong> —
            senza immagine, niente rich card.
          </p>

          <h3>3.12 Body</h3>
          <p>
            Editor Markdown con tre tab:
          </p>
          <ul>
            <li>
              <Strong>Write</Strong> — editor Markdown
            </li>
            <li>
              <Strong>SERP preview</Strong> — come apparirà il post nei
              risultati Google
            </li>
            <li>
              <Strong>Schema preview</Strong> — il JSON-LD esatto che verrà
              embeddato
            </li>
          </ul>
          <p>Vedi sezione 4 per le regole di scrittura del body.</p>

          <h3>3.13 Translation</h3>
          <p>
            Campo opzionale <Code>translationKey</Code> + un bottone{" "}
            <Strong>Translate with Gemini</Strong>. Vedi sezione 5 per il
            workflow completo di traduzione.
          </p>
        </Section>

        {/* ──────────────── 4. Writing the body ─────────────── */}
        <Section
          id="body"
          title="4. Scrivere il body — regole Markdown"
          eyebrow="Il contenuto"
        >
          <h3>4.1 La struttura che viene citata</h3>
          <p>
            Best practice 2026 per le citazioni AI (ChatGPT, Perplexity,
            Claude, Google AI Overviews):
          </p>
          <ol>
            <li>
              <Strong>Primo paragrafo BLUF</Strong> (~40–60 parole). Bottom
              Line Up Front: rispondi al titolo direttamente. Gli AI engine
              spesso citano questa parte alla lettera.
            </li>
            <li>
              <Strong>Eventuale secondo paragrafo</Strong> per contesto o le
              entità che tratterai.
            </li>
            <li>
              <Strong>H2 ogni 150–250 parole</Strong>. L&apos;AI legge gli{" "}
              <Code>&lt;h2&gt;</Code> come &ldquo;answerable units&rdquo; —
              ognuno è un potenziale gancio di citazione.
            </li>
            <li>
              <Strong>H3 per i sotto-punti</Strong> dentro un H2.
            </li>
            <li>
              <Strong>Mai usare H1</Strong> (singolo <Code>#</Code>) — il
              titolo dal form renderizza già come H1.
            </li>
          </ol>

          <h3>4.2 Riferimento Markdown</h3>
          <pre className="bg-[#0d0d0d] text-emerald-300/90 p-4 rounded-lg text-[12px] font-mono leading-relaxed overflow-x-auto">{`Primo paragrafo — il BLUF. Rispondi al titolo in 1–2 frasi.

## Prima sezione (## = H2, pattern obbligatorio)

Body, 2–4 paragrafi.

### Sotto-titolo dentro la sezione (### = H3, opzionale)

Più dettaglio.

## Prossima sezione

**testo bold** e *testo italic*.

\`codice inline\` e:

\`\`\`js
const block = "di codice";
\`\`\`

> Blockquote — usalo per citazioni da fonti esterne.

- elemento di lista puntata
- altro elemento

1. lista ordinata
2. secondo step

| Colonna A | Colonna B |
| --- | --- |
| valore 1 | valore 2 |

[Testo del link](https://example.com)

![Immagine inline](/blog/screenshot-inline.png)`}</pre>

          <h3>4.3 Citation patterns (la salsa segreta)</h3>
          <p>
            Il CMS estrae automaticamente le citazioni autorevoli dai link
            nel body e le mette nel campo JSON-LD <Code>citation[]</Code>{" "}
            dell&apos;articolo. È uno dei segnali AI più forti.
          </p>
          <p><Strong>Cosa viene auto-estratto:</Strong></p>
          <ul>
            <li>
              Link a <Code>refinea.io/blog/*</Code> (cluster interno —
              dimostra che hai profondità)
            </li>
            <li>
              Link a <Code>.gov</Code>, <Code>.edu</Code>,{" "}
              <Code>.ac.uk</Code>, <Code>europa.eu</Code>
            </li>
            <li>
              Wikipedia, Britannica, Statista, Nature, ScienceDirect, arXiv,
              Schema.org, Search Engine Land/Journal, Ahrefs/Moz/Backlinko,
              HBR, MIT, FT, Economist, WSJ, NYT
            </li>
          </ul>
          <p>
            Strategia: cita 3–5 fonti autorevoli per ogni post lungo.
            ChatGPT/Perplexity pesano il &ldquo;grounded in authoritative
            sources&rdquo; come fattore di citazione.
          </p>

          <h3>4.4 Link al glossary</h3>
          <p>
            Quando menzioni un termine definito da Refinea (AI Visibility
            Index, Brand Memory, Prompt Fan-Out, ecc.), linkalo alla
            glossary entry: <Code>[Brand Memory](/blog/brand-memory)</Code>.
            Costruisce il grafo di entità interno che gli LLM tracciano.
          </p>

          <h3>4.5 Regole di validazione — cosa fa scattare errori</h3>
          <p>
            Questi BLOCCANO la pubblicazione (rossi):
          </p>
          <ul>
            <li>Titolo vuoto o &gt; 65 caratteri</li>
            <li>Description vuota o &gt; 160 caratteri</li>
            <li>Slug vuoto, malformato, o duplicato di un post esistente</li>
            <li>Section non selezionata</li>
            <li>0 topic, o 4+ topic</li>
            <li>Author non selezionato</li>
            <li>Body vuoto</li>
            <li>H1 (<Code>#</Code>) usato nel body</li>
            <li>Modified date precedente alla publish date</li>
          </ul>
          <p>Questi danno WARNING ma non bloccano (ambra):</p>
          <ul>
            <li>Titolo &lt; 30 caratteri (troppo corto per gli AI hook)</li>
            <li>Description &lt; 120 caratteri</li>
            <li>Slug &gt; 60 caratteri o contiene stopword</li>
            <li>Body &lt; 400 parole (thin content, rischio demotion HCU di Google)</li>
            <li>Body &gt; 400 parole senza nessun H2 (non strutturato)</li>
            <li>Nessuna cover image (tranne per glossary)</li>
          </ul>
        </Section>

        {/* ──────────────── 5. Translation workflow ──────────── */}
        <Section
          id="translation"
          title="5. Workflow di traduzione"
          eyebrow="EN ↔ IT"
        >
          <h3>5.1 Post single-locale (la maggior parte)</h3>
          <p>
            Pubblica in una sola lingua. Lascia{" "}
            <Code>translationKey</Code> vuoto. Il post vive a un solo URL,
            l&apos;hreflang è minimal, niente altro a cui pensare.
          </p>

          <h3>5.2 Creare una traduzione con Gemini (la via veloce)</h3>
          <ol>
            <li>Apri il post sorgente in modalità edit</li>
            <li>
              Scorri al pannello <Strong>Translation</Strong>
            </li>
            <li>
              Clicca <Strong>Translate to IT/EN with Gemini</Strong>
            </li>
            <li>
              Gemini genera una bozza di titolo, description, body nella
              lingua target, preservando la struttura Markdown e
              proteggendo il vocabolario brand Refinea (GEO, AVI, Brand
              Memory, ecc. restano in inglese).
            </li>
            <li>
              Atterri su <Code>/admin/blog/new</Code> con il form già
              compilato. Stessa section, topic, autore, cover. Locale
              switchata.
            </li>
            <li>
              <Strong>Rivedi e modifica</Strong> la bozza. Gemini è veloce
              ma non perfetto — rilavora sempre per il tono.
            </li>
            <li>
              Scegli uno slug localizzato (es.{" "}
              <Code>come-chatgpt-cita-le-fonti</Code>, non lo stesso slug
              inglese)
            </li>
            <li>Clicca <Strong>Publish</Strong></li>
          </ol>
          <p>
            I due post sono ora linkati tramite <Code>translationKey</Code>{" "}
            (auto-generato). L&apos;hreflang reciproco si attiva.
            Entrambe le pagine mostrano un chip nell&apos;header: &ldquo;Leggi
            in italiano&rdquo; / &ldquo;Read in English&rdquo;.
          </p>

          <h3>5.3 Creare una traduzione a mano (senza Gemini)</h3>
          <ol>
            <li>
              Nel post sorgente, digita una <Code>translationKey</Code>{" "}
              (es. <Code>chatgpt-citations</Code>). Salva.
            </li>
            <li>
              Crea un nuovo post nell&apos;altra locale.
            </li>
            <li>
              Nel pannello Translation del nuovo post, digita la{" "}
              <Strong>stessa</Strong> <Code>translationKey</Code>. Salva.
            </li>
            <li>La coppia è linkata.</li>
          </ol>

          <h3>5.4 Cosa succede automaticamente quando i post sono linkati</h3>
          <ul>
            <li>
              <Strong>Hreflang nell&apos;HTML head</Strong>:{" "}
              <Code>en</Code> + <Code>it</Code> + <Code>x-default</Code>{" "}
              reciproco tra i due URL
            </li>
            <li>
              <Strong>Hreflang in sitemap.xml</Strong>: language group
              emesso (best practice 2026 — sia head sia sitemap)
            </li>
            <li>
              <Strong>JSON-LD <Code>workTranslation</Code> /{" "}
                <Code>translationOfWork</Code></Strong>: relazione schema.org
              tra i due articoli. Direzione basata sulla publish date (più
              vecchio = sorgente).
            </li>
            <li>
              <Strong>Open Graph <Code>alternateLocale</Code></Strong>: le
              social preview sanno di entrambe le versioni
            </li>
            <li>
              <Strong>Chip nell&apos;header</Strong>: link &ldquo;Read in
              English / Leggi in italiano&rdquo; con attributo{" "}
              <Code>hreflang</Code> corretto
            </li>
          </ul>

          <h3>5.5 Cosa Gemini NON traduce (termini protetti)</h3>
          <p>
            Questi restano in inglese in ogni locale:
          </p>
          <p className="text-[13px] text-black/65 leading-relaxed">
            Refinea · Generative Engine Optimization · GEO · Answer Engine
            Optimization · AEO · AI Visibility Index · AVI · Brand Memory ·
            Share of Voice · Share of Model · Prompt Fan-Out · Citation
            Source Mix · Decision-Layer Marketing · Persona-Prompted
            Retrieval · Agentic Content Workflows · ChatGPT · Gemini ·
            Perplexity · Claude · Google AI Overviews · Google Search
            Console · GA4
          </p>
        </Section>

        {/* ──────────────── 6. Article type recipes ────────── */}
        <Section
          id="recipes"
          title="6. Ricette per tipo di articolo"
          eyebrow="Per sezione"
        >
          <p>
            Per ogni sezione: struttura target, lunghezza, cosa mettere nel
            frontmatter, come scrivere il body.
          </p>

          <h3>6.1 Product — Changelog</h3>
          <p>
            <Strong>Quando</Strong>: hai rilasciato una nuova feature, cambio
            di coverage modelli, rilascio integrazione, breaking change.
          </p>
          <p>
            <Strong>Struttura</Strong>: 200–500 parole, 1–2 H2 al massimo.
          </p>
          <Recipe
            section="product"
            topics={[
              "ai-brand-visibility",
            ]}
            author="giorgio"
            reviewCycle="evergreen"
            example={`Cosa c'è di nuovo\nDa oggi, ogni workspace Refinea traccia le citazioni del brand da Anthropic Claude Sonnet 4.7 oltre agli engine che già monitori — ChatGPT, Gemini, Perplexity e Google AI Overviews.\n\n## Perché conta\n\nClaude Sonnet 4.7 [dettagli sul nuovo modello e perché i clienti ci tengono].\n\n## Cosa fare\n\nNulla — la coverage è automatica su ogni prompt esistente. Vedrai Claude apparire nei tuoi grafici Share of Voice entro 24 ore.`}
          />

          <h3>6.2 Product — Feature deep-dive</h3>
          <p>
            <Strong>Quando</Strong>: spieghi come funziona una feature
            esistente in profondità, fissi un entity claim su un concetto
            di prodotto.
          </p>
          <p>
            <Strong>Struttura</Strong>: 800–1500 parole, 4–6 H2.
          </p>
          <Recipe
            section="product"
            topics={[
              "ai-brand-visibility",
              "generative-engine-optimization",
            ]}
            author="giorgio"
            reviewCycle="quarterly"
            example={`Primo paragrafo BLUF: spiega in una frase cosa fa la feature e il valore che produce.\n\nSecondo paragrafo: contesto — qual era il problema prima, per chi è.\n\n## Come funziona sotto il cofano\n\nDettaglio tecnico. Diagramma se utile.\n\n## Cosa cambia nel tuo workflow\n\nImpatto concreto user-facing.\n\n## Limiti e roadmap\n\nDisclaimer onesto.\n\n## Come attivarla\n\nStep-by-step.`}
          />

          <h3>6.3 Product — Case study</h3>
          <p>
            <Strong>Quando</Strong>: storia di un cliente con outcome
            misurabile (con il loro consenso).
          </p>
          <p>
            <Strong>Struttura</Strong>: 600–1200 parole, 4–5 H2.
          </p>
          <Recipe
            section="product"
            topics={[
              "ai-brand-visibility",
              "marketing-measurement",
            ]}
            author="vito"
            reviewCycle="evergreen"
            example={`BLUF: chi, quale outcome, in quanto tempo.\n\n## La sfida\n\nCosa cercavano di risolvere.\n\n## Il setup\n\nQuali feature di Refinea hanno usato.\n\n## Il risultato\n\nNumeri, screenshot, citazione del cliente (usa blockquote Markdown: > citazione).\n\n## Cosa significa per gli altri brand\n\nGeneralizza la lezione.`}
          />

          <h3>6.4 News — Analisi di settore</h3>
          <p>
            <Strong>Quando</Strong>: reagisci a un evento di settore (update
            Google, rilascio nuovo modello, cambio normativo).
          </p>
          <p>
            <Strong>Struttura</Strong>: 600–1200 parole, 3–5 H2.{" "}
            <Strong>Pubblica entro 2 giorni dall&apos;evento</Strong> per
            entrare nel Google News sitemap.
          </p>
          <Recipe
            section="news"
            topics={[
              "ai-search-strategy",
              "generative-engine-optimization",
            ]}
            author="vito"
            reviewCycle="evergreen"
            example={`BLUF: cosa è successo, cosa significa per i brand.\n\nFrase di contesto: quando, chi, perché ora.\n\n## Cosa è cambiato\n\nI fatti dell'evento, con link alla fonte primaria (usa domini autorevoli — finiscono nello schema citation[]).\n\n## Perché conta per la visibilità AI\n\nLa tua angolazione analitica. Qui ti distingui dalla copertura standard.\n\n## Cosa fare questa settimana\n\nAction item pratici per i brand.\n\n## Domande aperte\n\nOnesto su cosa è ancora poco chiaro.`}
          />

          <h3>6.5 News — Ricerca originale</h3>
          <p>
            <Strong>Quando</Strong>: hai fatto uno studio, analizzato i dati
            della tua piattaforma, intervistato clienti.
          </p>
          <p>
            <Strong>Struttura</Strong>: 1000–2000 parole. Grafici/dati sono
            killer — embedda immagini. <Strong>Massimo potenziale di
            citation</Strong> tra tutti i tipi di post.
          </p>
          <Recipe
            section="news"
            topics={[
              "llm-citations",
              "ai-brand-visibility",
              "ai-search-strategy",
            ]}
            author="giorgio"
            reviewCycle="quarterly"
            example={`BLUF: il singolo finding più sorprendente.\n\n## Metodo\n\nQuanti data point, time range, metodologia. Onesto sui limiti.\n\n## Finding 1\n\nStatua il finding in una frase. Poi spiega. Include un grafico/tabella.\n\n## Finding 2\n\nStesso pattern.\n\n## Cosa significa\n\nLa tua interpretazione.\n\n## Note di metodo\n\nMetodologia completa per chi vuole replicare.`}
          />

          <h3>6.6 Guides — Pillar guide</h3>
          <p>
            <Strong>Quando</Strong>: risorsa completa su un topic principale.
            Costruita per essere la pagina canonical Refinea su quel
            soggetto.
          </p>
          <p>
            <Strong>Struttura</Strong>: 2000–4000 parole, 6–10 H2, indice
            (auto-generato). <Strong>Linka a 3–5 cluster post</Strong> nel
            body che vanno più a fondo sui sub-topic. Punta a essere la
            &ldquo;pagina Wikipedia&rdquo; per il topic.
          </p>
          <Recipe
            section="guides"
            topics={[
              "generative-engine-optimization",
              "ai-search-strategy",
            ]}
            author="vito"
            reviewCycle="quarterly"
            example={`BLUF: in una frase, cos'è questa entità e perché conta nel 2026.\n\nContesto: chi deve saperlo, cosa imparerà.\n\n## Definizione\n\nDefinizione formale. Linka alla glossary entry.\n\n## Come funziona\n\nMeccaniche di base.\n\n## Perché conta nel 2026\n\nLo shift, la posta in gioco, i player.\n\n## I pilastri di [topic]\n\nElenca i 4–6 sub-topic. Ognuno linkato a un cluster post.\n\n## Errori comuni\n\nCosa va storto.\n\n## Come misurare il successo\n\nMetriche.\n\n## Tool e piattaforme\n\nRefinea + altri.\n\n## Cosa viene dopo\n\nDove va il campo.`}
          />

          <h3>6.7 Guides — How-to / Playbook</h3>
          <p>
            <Strong>Quando</Strong>: procedura concreta orientata
            all&apos;azione con step.
          </p>
          <p>
            <Strong>Struttura</Strong>: 1000–2000 parole. Step numerati come
            H2 o H3. Ogni step ha un obiettivo, un&apos;azione, un risultato
            atteso.
          </p>
          <Recipe
            section="guides"
            topics={[
              "ai-brand-visibility",
              "llm-citations",
            ]}
            author="giorgio"
            reviewCycle="quarterly"
            example={`BLUF: cosa otterrai, in quanto tempo, con quali prerequisiti.\n\n## Cosa ti serve\n\nLista dei prerequisiti.\n\n## Step 1 — [Azione]\n\nCosa fare, come farlo, com'è il successo.\n\n## Step 2 — [Azione]\n\nStesso pattern.\n\n## Step 3 — [Azione]\n\nStesso pattern.\n\n## Troubleshooting\n\nProblemi comuni e fix.\n\n## Prossimi step\n\nCosa fare dopo aver completato il playbook.`}
          />

          <h3>6.8 Glossary — Singola definizione</h3>
          <p>
            <Strong>Quando</Strong>: un termine che ricorre nella
            comunicazione Refinea e merita una pagina canonical.
          </p>
          <p>
            <Strong>Struttura</Strong>: 300–700 parole, 2–4 H2. Cover image
            opzionale. Schema: <Code>DefinedTerm</Code> dentro il{" "}
            <Code>DefinedTermSet</Code> &ldquo;Refinea GEO Glossary&rdquo;.
          </p>
          <Recipe
            section="glossary"
            topics={[
              "ai-brand-visibility",
            ]}
            author="vito"
            reviewCycle="quarterly"
            example={`**[Nome del termine]** è [definizione canonical in una frase]. [Seconda frase: dove si colloca nel panorama più ampio].\n\n## Come funziona\n\nMeccaniche in 2–3 paragrafi.\n\n## Come si misura\n\nSe è una metrica, la formula. Se no, gli indicatori.\n\n## Perché conta\n\nLa posta in gioco per i brand.\n\n## Termini correlati\n\nLinka ad altre glossary entry.`}
          />
        </Section>

        {/* ──────────────── 6.5 Cover images ────────── */}
        <Section
          id="covers"
          title="6.5 Le immagini di copertina (OG image)"
          eyebrow="Cover"
        >
          <p>
            Ogni articolo ha bisogno di una cover: è l&apos;immagine che
            appare sulla card del blog, nell&apos;header dell&apos;articolo,
            e soprattutto nella preview quando il link viene condiviso su
            LinkedIn, WhatsApp o X. Senza cover l&apos;articolo perde i
            rich result Article di Google e la preview social è vuota.
          </p>
          <p>
            Le cover non si disegnano a mano. Un generatore le produce in
            automatico, tutte nello stesso stile brand, leggendo il titolo
            direttamente dal post.
          </p>

          <h3>6.5.1 Il flusso in tre passi</h3>
          <ol>
            <li>
              Nel frontmatter del post, imposta il campo{" "}
              <Code>cover</Code> con un path del tipo{" "}
              <Code>/blog/&lt;nome&gt;.png</Code>. Convenzione: usa lo slug
              del post più <Code>-cover</Code>, e per gli articoli che
              esistono in due lingue aggiungi <Code>-it</Code> o{" "}
              <Code>-en</Code>. Esempio:{" "}
              <Code>/blog/come-llm-citano-cover-it.png</Code> e{" "}
              <Code>/blog/how-llms-cite-cover-en.png</Code>.
            </li>
            <li>
              Da terminale, nella cartella del progetto, lancia{" "}
              <Code>npm run covers</Code>.
            </li>
            <li>
              Fai commit dei PNG generati in <Code>public/blog/</Code>{" "}
              insieme al post.
            </li>
          </ol>

          <h3>6.5.2 Cosa fa il generatore</h3>
          <p>
            Il comando <Code>npm run covers</Code> esegue{" "}
            <Code>scripts/generate-blog-covers.mjs</Code>. Lo script:
          </p>
          <ul>
            <li>
              Scansiona <Strong>tutti</Strong> i file in{" "}
              <Code>content/posts/</Code>
            </li>
            <li>
              Legge da ciascuno <Code>title</Code>, <Code>section</Code>,{" "}
              <Code>author</Code>, <Code>cover</Code> dal frontmatter
            </li>
            <li>
              Genera una cover 1600×900 PNG per ogni post che ha un campo{" "}
              <Code>cover</Code> puntato a un path locale{" "}
              <Code>/blog/....png</Code>
            </li>
            <li>
              Salta i post senza <Code>cover</Code> e lo segnala a schermo
            </li>
          </ul>
          <p>
            Il punto chiave: <Strong>il titolo della cover viene preso
            dal post stesso</Strong>. Un post italiano produce una cover
            con titolo italiano, un post inglese una con titolo inglese.
            Non devi fare nulla per la lingua, è automatico. Se hai una
            coppia tradotta, hai due post MDX distinti con due campi{" "}
            <Code>cover</Code> distinti, e lo script genera le due
            immagini nelle due lingue da solo.
          </p>

          <h3>6.5.3 Quando rilanciare il comando</h3>
          <ul>
            <li>
              <Strong>Nuovo articolo</Strong>: dopo aver scritto il post
              con il suo campo <Code>cover</Code>
            </li>
            <li>
              <Strong>Titolo modificato</Strong>: la cover mostra il
              titolo, quindi va rigenerata se cambi il titolo del post
            </li>
            <li>
              <Strong>Sezione o autore cambiati</Strong>: il chip e la
              byline derivano da quei campi
            </li>
          </ul>
          <p>
            Il generatore è deterministico: se rilanci senza aver
            cambiato nulla, riproduce file identici. Rilanciarlo non fa
            mai danni.
          </p>

          <Callout tone="info">
            <Strong>Stile delle cover.</Strong> Tutte le cover usano lo
            stesso template &ldquo;editorial minimal&rdquo;: sfondo grigio
            con la griglia Refinea, logo del brand, chip della sezione,
            titolo grande, byline autore. È voluto — la coerenza visiva
            tra tutte le cover è un segnale di brand solido. Non servono
            foto stock.
          </Callout>

          <Callout tone="warn">
            <Strong>Il generatore gira in locale, non in produzione.</Strong>{" "}
            Le cover sono asset versionati: vanno committati in Git come
            qualsiasi altro file. Non vengono rigenerate al deploy. Questo
            è voluto — un URL immagine stabile significa cache pulita su
            CDN e social, e un deploy che non dipende da servizi esterni
            (font, logo) per andare a buon fine.
          </Callout>
        </Section>

        {/* ──────────────── 7. Publish flow ────────── */}
        <Section id="publish" title="7. Pubblicazione — cosa succede" eyebrow="Click su publish">
          <p>
            Quando clicchi <Strong>Publish</Strong>:
          </p>
          <ol>
            <li>
              Il CMS valida il form un&apos;ultima volta. Se ci sono errori
              → bloccato.
            </li>
            <li>
              Il file MDX viene costruito (frontmatter + body) e committato
              in <Code>content/posts/&lt;slug&gt;.mdx</Code> sul branch{" "}
              <Code>main</Code> di GitHub. Commit author = la tua email.
            </li>
            <li>
              Vercel rileva il push e fa partire una rebuild. Dura ~30s.
            </li>
            <li>
              Quando la rebuild finisce, il post è online al suo URL.
            </li>
            <li>
              <Code>sitemap.xml</Code>, <Code>news-sitemap.xml</Code>,{" "}
              <Code>/blog/feed.xml</Code>, hub page section/topic/author si
              rigenerano in automatico.
            </li>
            <li>
              <Code>IndexNow</Code> pinga Bing e Yandex sul nuovo URL.
            </li>
          </ol>
          <Callout tone="info">
            <Strong>Non devi sottomettere manualmente a Google.</Strong> Ma
            per post ad alta priorità, puoi accelerare l&apos;indicizzazione
            sottomettendo l&apos;URL in{" "}
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Google Search Console
            </a>{" "}
            (URL inspection → Request indexing).
          </Callout>
        </Section>

        {/* ──────────────── 8. Editing / deleting ────────── */}
        <Section
          id="edit-delete"
          title="8. Modificare ed eliminare post pubblicati"
          eyebrow="Dopo la pubblicazione"
        >
          <h3>8.1 Modificare</h3>
          <p>
            Clicca un post qualsiasi nella dashboard → si apre il form di
            modifica con tutti i campi pre-compilati.
          </p>
          <p>
            Fai le modifiche. <Strong>Se la modifica è sostanziale</Strong>{" "}
            (riscritto una sezione, aggiunti nuovi dati, aggiornate
            statistiche), imposta la data <Code>Modified</Code> a oggi. Gli
            AI engine usano <Code>dateModified</Code> come segnale di
            freschezza.
          </p>
          <p>
            Clicca <Strong>Save changes</Strong> — stesso flusso del
            publish: commit su GitHub, Vercel rebuild.
          </p>
          <Callout tone="warn">
            <Strong>Lo slug non può essere cambiato.</Strong> Se ti serve
            davvero un URL diverso, cancella il post e ricrealo. Perderai i
            link in entrata a meno che non setti un redirect 301 (chiedi a
            Giorgio).
          </Callout>

          <h3>8.2 Eliminare</h3>
          <p>
            Nell&apos;edit view, in alto a destra c&apos;è un piccolo
            bottone rosso <Strong>Delete</Strong>. Chiede conferma, poi
            committa la cancellazione su GitHub.
          </p>
          <Callout tone="warn">
            La cancellazione è permanente. Il post diventa 404. I link in
            entrata (da altri siti, citazioni AI) si rompono. Cancella
            solo se il post non dovrebbe esistere. Per &ldquo;nascondere&rdquo; un
            post, meglio impostare la data molto indietro nel tempo + rimuoverlo
            dal sitemap manualmente.
          </Callout>
        </Section>

        {/* ──────────────── 9. SEO checks ─────────── */}
        <Section id="seo-checks" title="9. La checklist SEO prima di ogni pubblicazione" eyebrow="Prima di shippare">
          <ul className="space-y-1.5">
            <li>✓ Titolo 30–65 caratteri, contiene la query target o l&apos;hook</li>
            <li>✓ Description 120–160 caratteri, riassume il valore</li>
            <li>✓ Slug ≤ 60 caratteri, senza stopword</li>
            <li>✓ 1–3 topic, affilati non fumosi</li>
            <li>✓ Sezione coerente col contenuto (Product/News/Guides/Glossary)</li>
            <li>✓ Autore scelto (alimenta lo schema Person)</li>
            <li>
              ✓ Primo paragrafo BLUF (40–60 parole) che risponde direttamente
              al titolo
            </li>
            <li>✓ H2 ogni 150–250 parole</li>
            <li>✓ Nessun H1 nel body</li>
            <li>
              ✓ Cover image 1600×900 (tranne per glossary)
            </li>
            <li>
              ✓ 3–5 link esterni autorevoli (gov/edu/Wikipedia/publication
              reputate) → popolano automaticamente lo schema{" "}
              <Code>citation[]</Code>
            </li>
            <li>
              ✓ 2–4 link interni ad altri post Refinea (segnale di cluster)
            </li>
            <li>
              ✓ Controlla la tab <Strong>SERP preview</Strong> — lo snippet
              si legge bene?
            </li>
            <li>
              ✓ Controlla la tab <Strong>Schema preview</Strong> — il campo{" "}
              <Code>citation[]</Code> è popolato? <Code>author</Code> è
              Vito o Giorgio?
            </li>
            <li>
              ✓ Se stai traducendo: <Code>translationKey</Code> impostata, il
              pannello sibling dice &ldquo;linked&rdquo;
            </li>
          </ul>
          <p>
            Se tutti i 15 sono spuntati, pubblica. Il CMS comunque non ti
            lascia shippare con hard error.
          </p>
        </Section>

        {/* ──────────────── 10. Troubleshooting ─────────── */}
        <Section
          id="troubleshooting"
          title="10. Troubleshooting"
          eyebrow="Quando le cose vanno storte"
        >
          <h3>10.1 &ldquo;Email not in admin allowlist&rdquo;</h3>
          <p>
            La tua email non è in <Code>lib/admin-auth.ts</Code>.
            Aggiungila lì, commit, redeploy. Oppure loggati con{" "}
            <Code>vito.guglielmino@refinea.io</Code> o{" "}
            <Code>giorgio.monaco@refinea.io</Code>.
          </p>

          <h3>10.2 &ldquo;This post was edited elsewhere&rdquo; (409 al save)</h3>
          <p>
            Qualcuno (o tu in un&apos;altra tab) ha modificato il file tra
            il momento in cui l&apos;hai aperto e adesso. Ricarica la pagina
            per ottenere l&apos;ultima versione, rifai la tua modifica.
          </p>

          <h3>10.3 Il save fallisce con &ldquo;GitHub write failed&rdquo;</h3>
          <p>
            Probabilmente il <Code>GITHUB_TOKEN</Code> è scaduto (rotazione
            ogni 90 giorni). Genera un nuovo token su GitHub, aggiorna{" "}
            <Code>.env.local</Code> + le env var su Vercel, redeploy.
          </p>

          <h3>10.4 La traduzione con Gemini fallisce</h3>
          <p>
            Solitamente <Code>GEMINI_API_KEY</Code> mancante o quota
            esaurita (1500 req/giorno nel free tier). Controlla la key su
            Google AI Studio, aggiorna l&apos;env se serve.
          </p>

          <h3>10.5 Post pubblicato ma non visibile sul sito</h3>
          <p>
            Il deploy Vercel impiega ~30s. Se è passato più di 2 minuti,
            controlla la dashboard Vercel per build error.
          </p>

          <h3>10.6 L&apos;upload della cover fallisce</h3>
          <p>
            Immagine &gt; 4 MB o mime type sbagliato. Comprimi con{" "}
            <a
              href="https://squoosh.app"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              squoosh.app
            </a>{" "}
            (convertila in WebP, ≤ 300 KB ideale).
          </p>

          <h3>10.7 Lo Schema preview mostra campi che non ho impostato</h3>
          <p>
            Normale. <Code>citation[]</Code>, <Code>wordCount</Code>,{" "}
            <Code>speakable</Code>, <Code>workTranslation</Code> sono
            auto-derivati dal contenuto del body e dal frontmatter. Non li
            modifichi direttamente.
          </p>
        </Section>

        {/* ──────────────── 11. Quick reference ─────────── */}
        <Section
          id="cheatsheet"
          title="11. Cheatsheet"
          eyebrow="Salvati questa"
        >
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-black/[0.03] border-b border-black/[0.08]">
                <th className="text-left px-3 py-2 font-semibold text-[12px] uppercase tracking-wider text-black/55">
                  Campo
                </th>
                <th className="text-left px-3 py-2 font-semibold text-[12px] uppercase tracking-wider text-black/55">
                  Target
                </th>
                <th className="text-left px-3 py-2 font-semibold text-[12px] uppercase tracking-wider text-black/55">
                  Limite hard
                </th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              <Row label="Title" target="30–65 caratteri" hard="65 (errore)" />
              <Row label="Description" target="120–160 caratteri" hard="160 (errore)" />
              <Row label="Slug" target="≤ 60 caratteri, senza stopword" hard="errore se malformato" />
              <Row label="Topics" target="1–3" hard="4+ (errore)" />
              <Row label="Body (Article)" target="≥ 400 parole" hard="—" />
              <Row label="Body (Glossary)" target="300–700 parole" hard="—" />
              <Row label="Frequenza H2" target="ogni 150–250 parole" hard="—" />
              <Row label="Cover image" target="1600×900, ≤ 300 KB" hard="4 MB (errore)" />
            </tbody>
          </table>
        </Section>
      </article>

      <footer className="mt-16 pt-8 border-t border-black/[0.06]">
        <p className="text-[12px] text-black/40">
          Loggato come <Code>{user.email}</Code>. Serve aiuto? Pinga
          l&apos;altro editor.
        </p>
        <p className="text-[11px] text-black/30 mt-2">
          Questa guida si aggiorna con l&apos;evoluzione del CMS. Sorgente:{" "}
          <Code>app/admin/guide/page.tsx</Code>.
        </p>
        <div className="mt-6">
          <Link
            href="/admin/blog"
            className="text-[13px] font-medium text-accent hover:underline"
          >
            ← Torna ai post
          </Link>
        </div>
      </footer>
    </div>
  );
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function Toc() {
  const items = [
    ["login", "Login"],
    ["dashboard", "Dashboard"],
    ["editor", "L'editor (ogni campo)"],
    ["body", "Scrivere il body"],
    ["translation", "Workflow di traduzione"],
    ["recipes", "Ricette per tipo di articolo"],
    ["covers", "Immagini di copertina (OG)"],
    ["publish", "Cosa succede al publish"],
    ["edit-delete", "Modificare ed eliminare"],
    ["seo-checks", "Checklist SEO"],
    ["troubleshooting", "Troubleshooting"],
    ["cheatsheet", "Cheatsheet"],
  ];
  return (
    <nav className="rounded-2xl border border-black/[0.06] bg-white p-5 mb-12">
      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-black/45 mb-3">
        Indice
      </p>
      <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-[13px]">
        {items.map(([id, label], i) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className="text-black/70 hover:text-accent transition-colors"
            >
              <span className="text-black/35 font-mono mr-2">
                {(i + 1).toString().padStart(2, "0")}
              </span>
              {label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Section({
  id,
  title,
  eyebrow,
  children,
}: {
  id: string;
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8 mb-14">
      {eyebrow && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent mb-2">
          {eyebrow}
        </p>
      )}
      <h2 className="text-[24px] font-bold tracking-[-0.02em] mb-4">{title}</h2>
      <div className="text-[14px] text-black/75 leading-[1.7] [&_h3]:text-[16px] [&_h3]:font-bold [&_h3]:tracking-[-0.01em] [&_h3]:text-black [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:mb-4 [&_ul]:mb-4 [&_ol]:mb-4 [&_ul]:pl-5 [&_ol]:pl-5 [&_ul>li]:mb-1.5 [&_ol>li]:mb-1.5 [&_li]:list-disc [&_ol>li]:list-decimal">
        {children}
      </div>
    </section>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[0.9em] bg-black/[0.05] px-1.5 py-0.5 rounded text-black/80">
      {children}
    </code>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-black">{children}</strong>;
}

function Callout({
  tone,
  children,
}: {
  tone: "info" | "warn";
  children: React.ReactNode;
}) {
  const styles =
    tone === "warn"
      ? "bg-amber-50 border-amber-100 text-amber-900"
      : "bg-accent/[0.04] border-accent/[0.15] text-black/75";
  return (
    <div className={`rounded-lg border px-4 py-3 my-4 text-[13px] leading-relaxed ${styles}`}>
      {children}
    </div>
  );
}

function Recipe({
  section,
  topics,
  author,
  reviewCycle,
  example,
}: {
  section: string;
  topics: string[];
  author: string;
  reviewCycle: string;
  example: string;
}) {
  return (
    <div className="my-4 rounded-xl border border-black/[0.07] bg-white overflow-hidden">
      <div className="px-4 py-2.5 bg-black/[0.02] border-b border-black/[0.06] text-[11px] font-semibold uppercase tracking-[0.06em] text-black/55">
        Frontmatter consigliato
      </div>
      <div className="px-4 py-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-[12.5px]">
        <Field label="section" value={section} />
        <Field label="author" value={author} />
        <Field label="topics" value={topics.join(", ")} />
        <Field label="reviewCycle" value={reviewCycle} />
      </div>
      <div className="px-4 py-2.5 bg-black/[0.02] border-y border-black/[0.06] text-[11px] font-semibold uppercase tracking-[0.06em] text-black/55">
        Scheletro del body
      </div>
      <pre className="px-4 py-3 text-[12px] font-mono leading-relaxed text-black/75 overflow-x-auto bg-white">
        {example}
      </pre>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2 min-w-0">
      <span className="text-[11px] font-mono uppercase text-black/40 shrink-0">
        {label}:
      </span>
      <span className="text-black/75 font-medium truncate">{value}</span>
    </div>
  );
}

function Row({ label, target, hard }: { label: string; target: string; hard: string }) {
  return (
    <tr className="border-b border-black/[0.04] last:border-b-0">
      <td className="px-3 py-2 font-semibold text-black">{label}</td>
      <td className="px-3 py-2 text-black/70">{target}</td>
      <td className="px-3 py-2 text-black/55">{hard}</td>
    </tr>
  );
}
