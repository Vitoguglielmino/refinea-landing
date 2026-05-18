/**
 * Gemini wrapper for MDX post translation. Used by the CMS when the editor
 * clicks "Translate with Gemini" — generates a draft of the body + title +
 * description in the target locale, which the editor then refines.
 *
 * The system prompt is the contract: it locks in Refinea-specific
 * vocabulary that must stay in English (entity-claim plays), forbids the
 * model from inventing facts, and demands Markdown structure preservation.
 *
 * Model: gemini-2.0-flash — fastest and cheapest in the 2.x line, more
 * than capable for marketing-content translation.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.0-flash";

let _client: GoogleGenerativeAI | null = null;
function client(): GoogleGenerativeAI {
  if (!KEY) {
    throw new Error("GEMINI_API_KEY not configured. Set it in .env.local.");
  }
  if (!_client) _client = new GoogleGenerativeAI(KEY);
  return _client;
}

// ─── Refinea brand vocabulary that must NOT be translated ─────────────────────

const PROTECTED_TERMS = [
  "Refinea",
  "Generative Engine Optimization",
  "GEO",
  "Answer Engine Optimization",
  "AEO",
  "AI Visibility Index",
  "AVI",
  "Brand Memory",
  "Share of Voice",
  "Share of Model",
  "Prompt Fan-Out",
  "Citation Source Mix",
  "Decision-Layer Marketing",
  "Persona-Prompted Retrieval",
  "Agentic Content Workflows",
  "ChatGPT",
  "Gemini",
  "Perplexity",
  "Claude",
  "Google AI Overviews",
  "Google Search Console",
  "GA4",
];

function systemPrompt(targetLocale: "en" | "it"): string {
  const targetLanguage = targetLocale === "it" ? "Italian" : "English";
  const sourceLanguage = targetLocale === "it" ? "English" : "Italian";
  return `You are a senior bilingual marketing copywriter translating B2B SaaS blog content for Refinea — a Generative Engine Optimization (GEO) platform.

TASK: Translate the provided text from ${sourceLanguage} to ${targetLanguage}.

NON-NEGOTIABLE RULES:
1. Preserve Markdown structure EXACTLY: headings (#, ##, ###), lists, tables, blockquotes, code fences, links, inline code. Same number of paragraphs, same line breaks.
2. Do NOT translate these brand and technical terms — keep them verbatim in English:
${PROTECTED_TERMS.map((t) => `   - ${t}`).join("\n")}
3. Translate URL slugs in internal links to ${targetLanguage} where appropriate (e.g. /blog/how-x-works → /it/blog/come-funziona-x), but ONLY for internal Refinea links (refinea.io). Leave external URLs untouched.
4. Match the original tone: professional, direct, opinionated. Avoid corporate filler.
5. Adapt examples and references to the ${targetLanguage} audience when meaningful (e.g. "Forbes" → "Il Sole 24 Ore" for IT; vice versa for EN).
6. Do NOT invent facts, statistics, or quotes that are not present in the source.
7. Do NOT add introductory phrases like "Here is the translation:" — output the translated content directly.

OUTPUT FORMAT (strict JSON, no markdown wrapper):
{
  "title": "translated title",
  "description": "translated description",
  "body": "translated markdown body"
}`;
}

export type TranslationInput = {
  sourceTitle: string;
  sourceDescription: string;
  sourceBody: string;
  targetLocale: "en" | "it";
};

export type TranslationOutput = {
  title: string;
  description: string;
  body: string;
};

export async function translatePost(
  input: TranslationInput,
): Promise<TranslationOutput> {
  const model = client().getGenerativeModel({
    model: MODEL,
    systemInstruction: systemPrompt(input.targetLocale),
    generationConfig: {
      temperature: 0.3,
      responseMimeType: "application/json",
    },
  });

  const userPrompt = JSON.stringify({
    title: input.sourceTitle,
    description: input.sourceDescription,
    body: input.sourceBody,
  });

  const result = await model.generateContent(userPrompt);
  const text = result.response.text();

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(
      `Gemini returned malformed JSON. First 200 chars: ${text.slice(0, 200)}`,
    );
  }

  if (
    !parsed ||
    typeof parsed !== "object" ||
    typeof (parsed as Record<string, unknown>).title !== "string" ||
    typeof (parsed as Record<string, unknown>).description !== "string" ||
    typeof (parsed as Record<string, unknown>).body !== "string"
  ) {
    throw new Error("Gemini response missing required fields.");
  }

  const out = parsed as TranslationOutput;
  return {
    title: out.title.trim(),
    description: out.description.trim(),
    body: out.body.trim(),
  };
}
