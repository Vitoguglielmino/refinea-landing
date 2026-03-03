import { after, NextRequest, NextResponse } from "next/server";

// ─── Bot categories ────────────────────────────────────────────────────────────
// answer_engine  = AI fetching your page to answer a user query (you get cited)
// training       = AI crawling to collect training data (no citation)
// search_engine  = traditional search crawler
// social         = social/messaging link preview
// seo_tool       = SEO analysis crawler
// monitor        = uptime/performance monitoring
// unknown        = generic fallback

type BotCategory =
  | "answer_engine"
  | "training"
  | "search_engine"
  | "social"
  | "seo_tool"
  | "monitor"
  | "unknown";

// ─── Bot signatures ────────────────────────────────────────────────────────────

const BOT_SIGNATURES: Array<{
  pattern: RegExp;
  name: string;
  category: BotCategory;
}> = [
  // ── AI Answer Engines (RAG) ──────────────────────────────────────────────
  // These bots fetch your page in real-time because a user asked a question.
  // Your site IS in the response / citation.
  { pattern: /ChatGPT-User/i,        name: "ChatGPT-User",       category: "answer_engine" },
  { pattern: /OAI-SearchBot/i,       name: "OAI-SearchBot",      category: "answer_engine" },
  { pattern: /PerplexityBot/i,       name: "PerplexityBot",      category: "answer_engine" },
  { pattern: /YouBot/i,              name: "YouBot",             category: "answer_engine" },
  { pattern: /PhindBot/i,            name: "PhindBot",           category: "answer_engine" },

  // ── AI Training Crawlers ─────────────────────────────────────────────────
  // These bots crawl to build training datasets. No citation, no attribution.
  { pattern: /GPTBot/i,              name: "GPTBot",             category: "training" },
  { pattern: /ClaudeBot/i,           name: "ClaudeBot",          category: "training" },
  { pattern: /anthropic-ai/i,        name: "Anthropic",          category: "training" },
  { pattern: /CCBot/i,               name: "CCBot",              category: "training" },
  { pattern: /cohere-ai/i,           name: "Cohere",             category: "training" },
  { pattern: /Google-Extended/i,     name: "Google-Extended",    category: "training" },
  { pattern: /Applebot-Extended/i,   name: "Applebot-Extended",  category: "training" },
  { pattern: /Meta-ExternalAgent/i,  name: "Meta-ExternalAgent", category: "training" },
  { pattern: /Bytespider/i,          name: "Bytespider",         category: "training" },
  { pattern: /Amazonbot/i,           name: "Amazonbot",          category: "training" },
  { pattern: /AI2Bot/i,              name: "AI2Bot",             category: "training" },
  { pattern: /Diffbot/i,             name: "Diffbot",            category: "training" },
  { pattern: /FacebookBot/i,         name: "FacebookBot",        category: "training" },
  { pattern: /Omgilibot/i,           name: "Omgilibot",          category: "training" },
  { pattern: /img2dataset/i,         name: "img2dataset",        category: "training" },

  // ── Search engines ───────────────────────────────────────────────────────
  { pattern: /Googlebot-Image/i,     name: "Googlebot-Image",   category: "search_engine" },
  { pattern: /Googlebot/i,           name: "Googlebot",          category: "search_engine" },
  { pattern: /Bingbot/i,             name: "Bingbot",            category: "search_engine" },
  { pattern: /Applebot(?!-Extended)/i, name: "Applebot",         category: "search_engine" },
  { pattern: /Slurp/i,               name: "Yahoo Slurp",        category: "search_engine" },
  { pattern: /DuckDuckBot/i,         name: "DuckDuckBot",        category: "search_engine" },
  { pattern: /Baiduspider/i,         name: "Baiduspider",        category: "search_engine" },
  { pattern: /YandexBot/i,           name: "YandexBot",          category: "search_engine" },
  { pattern: /Sogou/i,               name: "Sogou",              category: "search_engine" },
  { pattern: /Exabot/i,              name: "Exabot",             category: "search_engine" },
  { pattern: /ia_archiver/i,         name: "Alexa",              category: "search_engine" },
  { pattern: /PetalBot/i,            name: "PetalBot",           category: "search_engine" },

  // ── Social & messaging ──────────────────────────────────────────────────
  { pattern: /facebookexternalhit/i, name: "Facebook",           category: "social" },
  { pattern: /Twitterbot/i,          name: "Twitterbot",         category: "social" },
  { pattern: /LinkedInBot/i,         name: "LinkedInBot",        category: "social" },
  { pattern: /Slackbot/i,            name: "Slackbot",           category: "social" },
  { pattern: /WhatsApp/i,            name: "WhatsApp",           category: "social" },
  { pattern: /TelegramBot/i,         name: "TelegramBot",        category: "social" },
  { pattern: /Discordbot/i,          name: "Discordbot",         category: "social" },

  // ── SEO tools ────────────────────────────────────────────────────────────
  { pattern: /AhrefsBot/i,           name: "AhrefsBot",          category: "seo_tool" },
  { pattern: /SemrushBot/i,          name: "SemrushBot",         category: "seo_tool" },
  { pattern: /MJ12bot/i,             name: "MJ12bot",            category: "seo_tool" },
  { pattern: /DotBot/i,              name: "DotBot",             category: "seo_tool" },
  { pattern: /rogerbot/i,            name: "Moz Rogerbot",       category: "seo_tool" },
  { pattern: /MajesticBot/i,         name: "MajesticBot",        category: "seo_tool" },

  // ── Monitoring & performance ─────────────────────────────────────────────
  { pattern: /UptimeRobot/i,         name: "UptimeRobot",        category: "monitor" },
  { pattern: /Pingdom/i,             name: "Pingdom",            category: "monitor" },
  { pattern: /GTmetrix/i,            name: "GTmetrix",           category: "monitor" },
  { pattern: /Lighthouse/i,          name: "Lighthouse",         category: "monitor" },

  // ── Generic fallback - must stay last ────────────────────────────────────
  { pattern: /\bbot\b/i,             name: "Generic Bot",        category: "unknown" },
  { pattern: /\bcrawler\b/i,         name: "Generic Crawler",    category: "unknown" },
  { pattern: /\bspider\b/i,          name: "Generic Spider",     category: "unknown" },
  { pattern: /\bscraper\b/i,         name: "Generic Scraper",    category: "unknown" },
];

function detectBot(ua: string): {
  isBot: boolean;
  botName: string;
  category: BotCategory;
} {
  for (const { pattern, name, category } of BOT_SIGNATURES) {
    if (pattern.test(ua))
      return { isBot: true, botName: name, category };
  }
  return { isBot: false, botName: "human", category: "unknown" };
}

// ─── IP hashing (GDPR - never store raw IPs) ──────────────────────────────────

async function hashIp(ip: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(ip),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16); // 64-bit prefix - enough for dedup, not enough to re-identify
}

// ─── Middleware ────────────────────────────────────────────────────────────────

export async function middleware(req: NextRequest) {
  const ua = req.headers.get("user-agent") ?? "";
  const { isBot, botName, category } = detectBot(ua);

  if (!isBot) return NextResponse.next();

  const secret = process.env.LOG_SHARED_SECRET;
  if (secret) {
    const rawIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    after(async () => {
      const ipHash = await hashIp(rawIp);
      await fetch(new URL("/api/log", req.nextUrl.origin).toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-log-secret": secret,
        },
        body: JSON.stringify({
          event: "bot_visit",
          botName,
          category,
          path: req.nextUrl.pathname,
          ua,
          referer: req.headers.get("referer"),
          host: req.headers.get("host"),
          ipHash,
        }),
      }).catch(() => {
        // Silently swallow - never let a log failure affect real traffic
      });
    });
  }

  return NextResponse.next();
}

// Run on all routes except static assets and API routes (avoids recursion)
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|api/).*)"],
};
