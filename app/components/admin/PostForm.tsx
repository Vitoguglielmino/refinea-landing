"use client";

/**
 * PostForm — the CMS workhorse. Shared between /admin/blog/new and
 * /admin/blog/[slug]/edit. Renders every editable field, runs SEO/GEO
 * validation on every keystroke, and shows live SERP + JSON-LD previews.
 *
 * Design rule: every field that affects SEO/GEO is paired with a
 * real-time signal (counter, validation, preview). The CMS itself is the
 * SEO coach — by the time you click Publish, the post is structurally
 * correct or you've explicitly overridden a warning.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { SectionSlug, TopicSlug } from "@/lib/blog-taxonomy";
import { SECTIONS, TOPICS } from "@/lib/blog-taxonomy";
import { AUTHORS, type AuthorSlug } from "@/lib/authors";
import {
  validatePost,
  hasErrors,
  slugifyTitle,
  type PostInput,
  type ValidationIssue,
  type ReviewCycle,
} from "@/lib/post-validation";

export type PostFormMode = "create" | "edit";

const SECTION_LIST = Object.values(SECTIONS);
const TOPIC_LIST = Object.values(TOPICS);
const AUTHOR_LIST = Object.values(AUTHORS);
const REVIEW_CYCLES: ReviewCycle[] = ["monthly", "quarterly", "evergreen"];

const TITLE_TARGET = "30-65";
const DESC_TARGET = "120-160";

const EMPTY: PostInput = {
  title: "",
  description: "",
  slug: "",
  body: "",
  section: "",
  topics: [],
  author: "",
  locale: "en",
  date: new Date().toISOString().slice(0, 10),
  modified: undefined,
  reviewCycle: "quarterly",
  cover: undefined,
  translationKey: undefined,
};

export default function PostForm({
  mode,
  initial,
  initialSha,
}: {
  mode: PostFormMode;
  initial?: PostInput;
  initialSha?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<PostInput>(initial ?? EMPTY);
  const [sha, setSha] = useState<string | undefined>(initialSha);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"body" | "seo" | "schema">("body");
  // Track whether the user has manually edited the slug — if so, stop
  // auto-suggesting from the title (don't clobber their work).
  const slugTouchedRef = useRef(mode === "edit");

  // If we arrived here via "Translate to ..." from another post, hydrate
  // the form from sessionStorage.
  useEffect(() => {
    if (mode !== "create") return;
    if (searchParams.get("fromTranslation") !== "1") return;
    const stash = sessionStorage.getItem("refineaCmsTranslationDraft");
    if (!stash) return;
    try {
      const draft = JSON.parse(stash) as PostInput;
      setData(draft);
      slugTouchedRef.current = false; // let auto-slug re-run for new locale
      sessionStorage.removeItem("refineaCmsTranslationDraft");
    } catch {
      // ignore — invalid stash
    }
  }, [mode, searchParams]);

  const issues = useMemo(() => validatePost(data), [data]);
  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;
  const canPublish = !hasErrors(issues) && !submitting;

  const update = useCallback(
    <K extends keyof PostInput>(key: K, value: PostInput[K]) => {
      setData((d) => ({ ...d, [key]: value }));
    },
    [],
  );

  // Auto-suggest slug from title in create mode until the user touches it.
  useEffect(() => {
    if (mode !== "create") return;
    if (slugTouchedRef.current) return;
    if (!data.title) return;
    const suggested = slugifyTitle(data.title);
    setData((d) => ({ ...d, slug: suggested }));
  }, [data.title, mode]);

  async function handleSubmit() {
    if (!canPublish) return;
    setSubmitting(true);
    setServerError(null);
    try {
      const url =
        mode === "create"
          ? "/api/admin/posts"
          : `/api/admin/posts/${initial?.slug}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, sha }),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json.issues) {
          setServerError(
            `Server validation: ${json.issues
              .filter((i: ValidationIssue) => i.severity === "error")
              .map((i: ValidationIssue) => i.message)
              .join(" · ")}`,
          );
        } else {
          setServerError(json.error ?? `Save failed (${res.status})`);
        }
        return;
      }
      if (json.sha) setSha(json.sha);
      if (mode === "create") {
        router.push(`/admin/blog/${data.slug}/edit`);
      } else {
        router.refresh();
      }
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (mode !== "edit") return;
    if (!confirm(`Delete "${data.title}"? This commits to GitHub.`)) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/posts/${initial?.slug}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setServerError(json.error ?? `Delete failed (${res.status})`);
        return;
      }
      router.push("/admin/blog");
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col h-full min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-white border-b border-black/[0.06] px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => router.push("/admin/blog")}
            className="text-sm text-black/55 hover:text-black"
          >
            ← Blog
          </button>
          <span className="text-black/20">/</span>
          <div className="text-sm font-semibold text-black truncate">
            {mode === "create" ? "New post" : data.title || "Untitled"}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {errorCount > 0 ? (
            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-red-700">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {errorCount} {errorCount === 1 ? "error" : "errors"}
            </span>
          ) : warningCount > 0 ? (
            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-amber-700">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {warningCount} {warningCount === 1 ? "warning" : "warnings"}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Ready to publish
            </span>
          )}
          {mode === "edit" && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={submitting}
              className="text-[13px] text-red-700 hover:underline disabled:opacity-50"
            >
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canPublish}
            className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium disabled:opacity-50 hover:bg-accent/90 transition-colors"
          >
            {submitting
              ? "Publishing..."
              : mode === "create"
                ? "Publish"
                : "Save changes"}
          </button>
        </div>
      </header>

      {serverError && (
        <div className="px-8 py-3 bg-red-50 border-b border-red-100 text-[13px] text-red-700">
          {serverError}
        </div>
      )}

      <div className="flex flex-1 min-h-0">
        {/* LEFT — form */}
        <div className="flex-1 min-w-0 overflow-y-auto px-8 py-6">
          {/* Title */}
          <Field
            label="Title"
            hint={`SERP truncates ~65 chars · Target ${TITLE_TARGET}`}
            issues={issues.filter((i) => i.field === "title")}
            counter={`${data.title.length}`}
          >
            <input
              type="text"
              value={data.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. How ChatGPT cites sources in 2026"
              className="w-full px-3.5 py-2.5 rounded-lg border border-black/[0.1] bg-white text-base font-medium focus:outline-none focus:border-accent transition-colors"
            />
          </Field>

          {/* Description */}
          <Field
            label="Description"
            hint={`Meta description + feed summary · Target ${DESC_TARGET}`}
            issues={issues.filter((i) => i.field === "description")}
            counter={`${data.description.length}`}
          >
            <textarea
              value={data.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              placeholder="One sentence that summarizes the value of this post for SERP."
              className="w-full px-3.5 py-2.5 rounded-lg border border-black/[0.1] bg-white text-[14px] leading-relaxed focus:outline-none focus:border-accent transition-colors resize-none"
            />
          </Field>

          {/* Slug */}
          <Field
            label="Slug"
            hint="URL segment · auto-suggested from title (lowercase, no stopwords)"
            issues={issues.filter((i) => i.field === "slug")}
            counter={`${data.slug.length}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-black/40 font-mono shrink-0">
                /{data.locale === "it" ? "it/" : ""}blog/
              </span>
              <input
                type="text"
                value={data.slug}
                onChange={(e) => {
                  slugTouchedRef.current = true;
                  update("slug", e.target.value);
                }}
                disabled={mode === "edit"}
                placeholder="how-chatgpt-cites-sources"
                className="flex-1 px-3 py-2 rounded-lg border border-black/[0.1] bg-white text-[13px] font-mono focus:outline-none focus:border-accent transition-colors disabled:bg-black/[0.02] disabled:text-black/40"
              />
            </div>
            {mode === "edit" && (
              <p className="text-[11px] text-black/40 mt-1">
                Slug cannot be changed after publish (rename = delete + create).
              </p>
            )}
          </Field>

          {/* Taxonomy row: section + author + locale */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            <Field
              label="Section"
              hint="Drives schema type"
              issues={issues.filter((i) => i.field === "section")}
            >
              <select
                value={data.section}
                onChange={(e) =>
                  update("section", e.target.value as SectionSlug | "")
                }
                className="w-full px-3 py-2.5 rounded-lg border border-black/[0.1] bg-white text-sm focus:outline-none focus:border-accent transition-colors"
              >
                <option value="">— Choose —</option>
                {SECTION_LIST.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label="Author"
              hint="Person schema"
              issues={issues.filter((i) => i.field === "author")}
            >
              <select
                value={data.author}
                onChange={(e) =>
                  update("author", e.target.value as AuthorSlug | "")
                }
                className="w-full px-3 py-2.5 rounded-lg border border-black/[0.1] bg-white text-sm focus:outline-none focus:border-accent transition-colors"
              >
                <option value="">— Choose —</option>
                {AUTHOR_LIST.map((a) => (
                  <option key={a.slug} value={a.slug}>
                    {a.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Locale" hint="Drives URL prefix + hreflang">
              <select
                value={data.locale}
                onChange={(e) =>
                  update("locale", e.target.value as "en" | "it")
                }
                className="w-full px-3 py-2.5 rounded-lg border border-black/[0.1] bg-white text-sm focus:outline-none focus:border-accent transition-colors"
              >
                <option value="en">English</option>
                <option value="it">Italiano</option>
              </select>
            </Field>
          </div>

          {/* Topics */}
          <Field
            label="Topics"
            hint="Pick 1-3 · Drives related posts, hub pages, schema about[]"
            issues={issues.filter((i) => i.field === "topics")}
          >
            <div className="flex flex-wrap gap-2">
              {TOPIC_LIST.map((t) => {
                const selected = data.topics.includes(t.slug);
                return (
                  <button
                    key={t.slug}
                    type="button"
                    onClick={() => {
                      if (selected) {
                        update(
                          "topics",
                          data.topics.filter((x) => x !== t.slug),
                        );
                      } else if (data.topics.length < 3) {
                        update("topics", [...data.topics, t.slug as TopicSlug]);
                      }
                    }}
                    className={
                      selected
                        ? "inline-flex items-center text-[12px] font-medium px-2.5 py-1 rounded-full bg-accent text-white"
                        : "inline-flex items-center text-[12px] font-medium px-2.5 py-1 rounded-full text-black/65 bg-white border border-black/[0.08] hover:border-accent/[0.4] hover:text-accent transition-colors"
                    }
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Dates + review cycle */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            <Field
              label="Publish date"
              hint="ISO format"
              issues={issues.filter((i) => i.field === "date")}
            >
              <input
                type="date"
                value={data.date}
                onChange={(e) => update("date", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-black/[0.1] bg-white text-sm focus:outline-none focus:border-accent transition-colors"
              />
            </Field>
            <Field
              label="Modified"
              hint="Bump only on substantive edits"
            >
              <input
                type="date"
                value={data.modified ?? ""}
                onChange={(e) =>
                  update("modified", e.target.value || undefined)
                }
                className="w-full px-3 py-2.5 rounded-lg border border-black/[0.1] bg-white text-sm focus:outline-none focus:border-accent transition-colors"
              />
            </Field>
            <Field
              label="Review cycle"
              hint="Drives staleness flag"
              issues={issues.filter((i) => i.field === "reviewCycle")}
            >
              <select
                value={data.reviewCycle}
                onChange={(e) =>
                  update("reviewCycle", e.target.value as ReviewCycle)
                }
                className="w-full px-3 py-2.5 rounded-lg border border-black/[0.1] bg-white text-sm focus:outline-none focus:border-accent transition-colors"
              >
                {REVIEW_CYCLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Cover */}
          <Field
            label="Cover image"
            hint="1600×900 jpg/webp, <300 KB · Required for Article rich results"
            issues={issues.filter((i) => i.field === "cover")}
          >
            <CoverUpload
              value={data.cover}
              onChange={(url) => update("cover", url)}
            />
          </Field>

          {/* Body */}
          <Field
            label="Body"
            hint="Markdown — start at H2 (## ...). Cite glossary terms inline."
            issues={issues.filter((i) => i.field === "body")}
            counter={`${countWords(data.body)} words`}
          >
            <BodyTabs
              active={activeTab}
              onChange={setActiveTab}
              body={data.body}
              onBodyChange={(v) => update("body", v)}
              data={data}
            />
          </Field>

          {/* Translation linker */}
          <TranslationLinker
            data={data}
            mode={mode}
            update={update}
          />

          {/* Validation summary */}
          {issues.length > 0 && (
            <div className="mt-8 rounded-xl border border-black/[0.06] bg-white overflow-hidden">
              <div className="px-4 py-3 bg-black/[0.02] border-b border-black/[0.06] text-[12px] font-semibold uppercase tracking-[0.06em] text-black/55">
                Validation
              </div>
              <ul className="divide-y divide-black/[0.04]">
                {issues.map((i, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2.5 flex items-start gap-3 text-[13px]"
                  >
                    <span
                      className={
                        i.severity === "error"
                          ? "shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5"
                          : "shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5"
                      }
                    />
                    <div className="flex-1">
                      <span className="font-mono text-[11px] uppercase text-black/40 mr-2">
                        {i.field}
                      </span>
                      <span className="text-black/75">{i.message}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* RIGHT — sticky preview pane */}
        <aside className="w-[380px] border-l border-black/[0.06] bg-white overflow-y-auto sticky top-[57px] self-start max-h-[calc(100vh-57px)]">
          <PreviewPane data={data} />
        </aside>
      </div>
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({
  label,
  hint,
  issues,
  counter,
  children,
}: {
  label: string;
  hint?: string;
  issues?: ValidationIssue[];
  counter?: string;
  children: React.ReactNode;
}) {
  const hasError = issues?.some((i) => i.severity === "error");
  const hasWarning = issues?.some((i) => i.severity === "warning");
  return (
    <div className="mb-5">
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-[12px] font-semibold uppercase tracking-[0.06em] text-black/55">
          {label}
        </label>
        {counter && (
          <span
            className={
              hasError
                ? "text-[11px] font-mono text-red-600"
                : hasWarning
                  ? "text-[11px] font-mono text-amber-600"
                  : "text-[11px] font-mono text-black/35"
            }
          >
            {counter}
          </span>
        )}
      </div>
      {children}
      {hint && (
        <p className="text-[11px] text-black/40 mt-1.5 leading-relaxed">
          {hint}
        </p>
      )}
    </div>
  );
}

// ─── Body tabs (write / SEO preview / schema preview) ────────────────────────

function BodyTabs({
  active,
  onChange,
  body,
  onBodyChange,
  data,
}: {
  active: "body" | "seo" | "schema";
  onChange: (tab: "body" | "seo" | "schema") => void;
  body: string;
  onBodyChange: (v: string) => void;
  data: PostInput;
}) {
  return (
    <div>
      <div className="flex items-center gap-1 mb-2">
        {(
          [
            ["body", "Write"],
            ["seo", "SERP preview"],
            ["schema", "Schema preview"],
          ] as const
        ).map(([tab, label]) => (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={
              tab === active
                ? "px-3 py-1.5 rounded-md text-[12px] font-medium bg-black/[0.06] text-black"
                : "px-3 py-1.5 rounded-md text-[12px] font-medium text-black/55 hover:bg-black/[0.03]"
            }
          >
            {label}
          </button>
        ))}
      </div>

      {active === "body" && (
        <textarea
          value={body}
          onChange={(e) => onBodyChange(e.target.value)}
          rows={28}
          placeholder={`First paragraph — your BLUF (Bottom Line Up Front). Answer the title in 1–2 sentences, ~40–60 words. AI engines often quote this verbatim.\n\nOptional second paragraph that expands context or names the entities you'll cover.\n\n## First section heading (## = H2)\n\nBody of the section, 2–4 paragraphs, ~150–250 words before the next H2.\n\n### Optional sub-heading inside the section (### = H3)\n\nMore detail.\n\n## Next section\n\n...\n\nRules: never use a single \`#\` (the H1 is generated from your title above).`}
          className="w-full px-4 py-3 rounded-lg border border-black/[0.1] bg-white text-[14px] font-mono leading-relaxed focus:outline-none focus:border-accent transition-colors resize-y"
          spellCheck
        />
      )}
      {active === "seo" && <SerpPreview data={data} />}
      {active === "schema" && <SchemaPreview data={data} />}
    </div>
  );
}

// ─── SERP preview ────────────────────────────────────────────────────────────

function SerpPreview({ data }: { data: PostInput }) {
  const url = `https://refinea.io${data.locale === "it" ? "/it" : ""}/blog/${data.slug || "..."}`;
  return (
    <div className="rounded-lg border border-black/[0.06] bg-white p-5">
      <div className="text-[12px] text-black/55 mb-1 truncate">{url}</div>
      <div className="text-[20px] leading-snug text-[#1a0dab] font-normal mb-1">
        {data.title || "Title will appear here"}
      </div>
      <div className="text-[14px] text-[#4d5156] leading-snug">
        {data.description || "Description will appear here"}
      </div>
    </div>
  );
}

// ─── Schema preview ─────────────────────────────────────────────────────────

/**
 * Schema preview — mirrors what lib/blog-schema.ts actually emits at
 * publish time. Keep in sync if you add fields server-side.
 */
function SchemaPreview({ data }: { data: PostInput }) {
  const SITE_URL = "https://refinea.io";
  const section = data.section ? SECTIONS[data.section as SectionSlug] : null;
  const schemaType = section?.schemaType ?? "BlogPosting";
  const articleType =
    schemaType === "DefinedTerm" ? "BlogPosting" : schemaType;
  const author = data.author ? AUTHORS[data.author as AuthorSlug] : null;
  const url = `${SITE_URL}${data.locale === "it" ? "/it" : ""}/blog/${data.slug || "..."}`;

  const about = data.topics
    .map((slug) => TOPICS[slug as TopicSlug])
    .filter(Boolean)
    .map((t) => ({
      "@type": "DefinedTerm",
      name: t!.name,
      description: t!.about,
      url: `${SITE_URL}/blog/topic/${t!.slug}`,
    }));

  const wordCount = data.body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_~|\-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const isGlossary = schemaType === "DefinedTerm";

  const preview = isGlossary
    ? {
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        "@id": `${url}#term`,
        name: data.title || "",
        description: data.description || "",
        url,
        inDefinedTermSet: {
          "@type": "DefinedTermSet",
          "@id": `${SITE_URL}/blog/glossary#set`,
          name: "Refinea GEO Glossary",
          url: `${SITE_URL}/blog/glossary`,
        },
        ...(author
          ? {
              creator: {
                "@type": "Person",
                "@id": `${SITE_URL}/blog/author/${author.slug}#person`,
                name: author.name,
                jobTitle: author.jobTitle,
                url: `${SITE_URL}/blog/author/${author.slug}`,
                sameAs: [author.linkedin],
                knowsAbout: author.knowsAbout,
                worksFor: {
                  "@type": "Organization",
                  "@id": `${SITE_URL}/#organization`,
                  name: "Refinea",
                },
              },
            }
          : {}),
        ...(wordCount > 0 ? { wordCount } : {}),
        inLanguage: data.locale === "it" ? "it-IT" : "en-US",
      }
    : {
        "@context": "https://schema.org",
        "@type": articleType,
        "@id": `${url}#article`,
        headline: data.title || "",
        description: data.description || "",
        url,
        datePublished: data.date,
        dateModified: data.modified ?? data.date,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        ...(author
          ? {
              author: {
                "@type": "Person",
                "@id": `${SITE_URL}/blog/author/${author.slug}#person`,
                name: author.name,
                jobTitle: author.jobTitle,
                image: `${SITE_URL}${author.image}`,
                url: `${SITE_URL}/blog/author/${author.slug}`,
                description: author.bio,
                email: `mailto:${author.email}`,
                sameAs: [author.linkedin],
                knowsAbout: author.knowsAbout,
                worksFor: {
                  "@type": "Organization",
                  "@id": `${SITE_URL}/#organization`,
                  name: "Refinea",
                  url: SITE_URL,
                },
              },
            }
          : {}),
        publisher: {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: "Refinea",
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/logos/refinea%20viola.svg`,
            width: 512,
            height: 512,
          },
        },
        ...(data.cover
          ? {
              image: {
                "@type": "ImageObject",
                url: data.cover.startsWith("http")
                  ? data.cover
                  : `${SITE_URL}${data.cover}`,
              },
            }
          : {}),
        ...(about.length > 0 ? { about } : {}),
        ...(section ? { articleSection: section.name } : {}),
        ...(wordCount > 0 ? { wordCount } : {}),
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [".prose > p:first-of-type", ".prose h2"],
        },
        isPartOf: { "@id": `${SITE_URL}/#website` },
        inLanguage: data.locale === "it" ? "it-IT" : "en-US",
      };

  return (
    <div>
      <p className="text-[11px] text-black/45 mb-2 leading-relaxed">
        This is the exact JSON-LD that will be embedded on the page at publish
        time. <span className="font-mono">citation[]</span> is auto-extracted
        from your body links to <span className="font-mono">.gov</span>,{" "}
        <span className="font-mono">.edu</span>, and other authoritative
        domains.
      </p>
      <pre className="p-4 rounded-lg bg-[#0d0d0d] text-emerald-300/90 text-[11px] font-mono leading-relaxed overflow-x-auto max-h-[500px]">
        {JSON.stringify(preview, null, 2)}
      </pre>
    </div>
  );
}

// ─── Cover upload ────────────────────────────────────────────────────────────

function CoverUpload({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (url: string | undefined) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? `Upload failed (${res.status})`);
        return;
      }
      onChange(json.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-start gap-4">
      {value ? (
        <div className="relative group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className="rounded-lg border border-black/[0.07] object-cover"
            style={{ width: 160, height: 90 }}
          />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        </div>
      ) : (
        <label className="cursor-pointer flex items-center justify-center rounded-lg border border-dashed border-black/[0.15] bg-black/[0.02] hover:border-accent/40 hover:bg-accent/[0.03] transition-colors" style={{ width: 160, height: 90 }}>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="sr-only"
          />
          <span className="text-[11px] text-black/45">
            {uploading ? "Uploading..." : "+ Upload"}
          </span>
        </label>
      )}
      <div className="flex-1 min-w-0">
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value || undefined)}
          placeholder="/blog/my-cover.jpg"
          className="w-full px-3 py-2 rounded-lg border border-black/[0.1] bg-white text-[13px] font-mono focus:outline-none focus:border-accent transition-colors"
        />
        {error && (
          <p className="text-[11px] text-red-600 mt-1">{error}</p>
        )}
      </div>
    </div>
  );
}

// ─── Translation linker (create-version button + key field) ──────────────────

function TranslationLinker({
  data,
  mode,
  update,
}: {
  data: PostInput;
  mode: PostFormMode;
  update: <K extends keyof PostInput>(key: K, value: PostInput[K]) => void;
}) {
  const router = useRouter();
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sibling, setSibling] = useState<
    { slug: string; locale: "en" | "it"; title: string } | null
  >(null);

  // Poll the API whenever translationKey or locale changes to surface
  // whether a sibling already exists in the other locale.
  useEffect(() => {
    if (!data.translationKey) {
      setSibling(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/admin/sibling?key=${encodeURIComponent(data.translationKey ?? "")}&locale=${data.locale}`,
        );
        if (!res.ok) return;
        const json = await res.json();
        if (!cancelled) setSibling(json.sibling ?? null);
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [data.translationKey, data.locale]);

  async function createTranslation() {
    if (mode !== "edit") return;
    if (!data.title || !data.body) return;
    setTranslating(true);
    setError(null);
    try {
      const targetLocale = data.locale === "it" ? "en" : "it";
      const res = await fetch("/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceTitle: data.title,
          sourceDescription: data.description,
          sourceBody: data.body,
          targetLocale,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Translation failed");
        return;
      }
      // Stash draft in sessionStorage and navigate to the new-post form,
      // which will read it on mount and pre-fill.
      const key =
        data.translationKey ?? `tk-${data.slug}-${Date.now().toString(36)}`;
      // Ensure the source post has the translation key so the pair is
      // linked when the new locale gets published.
      if (!data.translationKey) update("translationKey", key);

      const draft: PostInput = {
        ...data,
        slug: "",
        locale: targetLocale,
        translationKey: key,
        title: json.title,
        description: json.description,
        body: json.body,
        date: new Date().toISOString().slice(0, 10),
        modified: undefined,
      };
      sessionStorage.setItem(
        "refineaCmsTranslationDraft",
        JSON.stringify(draft),
      );
      router.push("/admin/blog/new?fromTranslation=1");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Translation failed");
    } finally {
      setTranslating(false);
    }
  }

  return (
    <div className="mt-6 rounded-xl border border-black/[0.06] bg-white p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-[0.06em] text-black/55">
            Translation
          </div>
          <p className="text-[12px] text-black/55 mt-1">
            Link this post to its other-language version via translationKey. Both
            posts get reciprocal hreflang.
          </p>
        </div>
        {mode === "edit" && data.body && data.title && (
          <button
            type="button"
            onClick={createTranslation}
            disabled={translating}
            className="px-3 py-1.5 rounded-lg bg-black text-white text-[12px] font-medium disabled:opacity-50 hover:bg-black/85 transition-colors shrink-0"
          >
            {translating
              ? "Translating..."
              : `Translate to ${data.locale === "it" ? "EN" : "IT"} with Gemini`}
          </button>
        )}
      </div>
      <input
        type="text"
        value={data.translationKey ?? ""}
        onChange={(e) => update("translationKey", e.target.value || undefined)}
        placeholder="(optional) e.g. chatgpt-citations"
        className="w-full px-3 py-2 rounded-lg border border-black/[0.1] bg-white text-[13px] font-mono focus:outline-none focus:border-accent transition-colors"
      />
      {sibling ? (
        <div className="mt-2 flex items-center gap-2 text-[12px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
          <span className="font-mono uppercase">{sibling.locale}</span>
          <span className="text-emerald-800/70">linked →</span>
          <a
            href={`/admin/blog/${sibling.slug}/edit`}
            className="font-medium underline truncate"
          >
            {sibling.title}
          </a>
        </div>
      ) : data.translationKey ? (
        <p className="text-[11px] text-black/45 mt-2">
          No sibling found yet in {data.locale === "it" ? "EN" : "IT"} with this
          key. Create the {data.locale === "it" ? "English" : "Italian"} version
          and set the same translationKey to link them.
        </p>
      ) : null}
      {error && <p className="text-[11px] text-red-600 mt-2">{error}</p>}
    </div>
  );
}

// ─── Preview pane (right sidebar) ────────────────────────────────────────────

function PreviewPane({ data }: { data: PostInput }) {
  const url = `${data.locale === "it" ? "/it" : ""}/blog/${data.slug || "..."}`;
  const author = data.author ? AUTHORS[data.author as AuthorSlug] : null;
  return (
    <div className="p-6">
      <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-black/45 mb-4">
        Card preview
      </div>
      <div className="rounded-xl border border-black/[0.06] overflow-hidden bg-white">
        {data.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.cover}
            alt=""
            className="w-full aspect-[16/9] object-cover bg-black/5"
          />
        ) : (
          <div className="w-full aspect-[16/9] bg-black/[0.04]" />
        )}
        <div className="p-4 flex flex-col gap-2">
          <h3 className="text-[15px] font-bold text-black tracking-[-0.01em] leading-snug">
            {data.title || "Title preview"}
          </h3>
          <p className="text-[13px] text-black/55 leading-relaxed line-clamp-2">
            {data.description || "Description preview"}
          </p>
          {author && (
            <div className="flex items-center gap-2 pt-3 mt-2 border-t border-black/[0.05]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={author.image}
                alt=""
                width={20}
                height={20}
                className="rounded-full object-cover"
                style={{ width: 20, height: 20 }}
              />
              <span className="text-[12px] font-medium text-black/70">
                {author.name}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-black/45 mt-8 mb-3">
        Live URL
      </div>
      <div className="px-3 py-2 rounded-lg bg-black/[0.03] font-mono text-[12px] text-black/65 break-all">
        {url}
      </div>
    </div>
  );
}

function countWords(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}
