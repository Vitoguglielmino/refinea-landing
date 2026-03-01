import { after, NextRequest, NextResponse } from "next/server";

// ─── Bot signatures ────────────────────────────────────────────────────────────

const BOT_SIGNATURES: Array<{ pattern: RegExp; name: string }> = [
  // Search engines
  { pattern: /Googlebot-Image/i,     name: "Googlebot-Image" },
  { pattern: /Googlebot/i,           name: "Googlebot" },
  { pattern: /Bingbot/i,             name: "Bingbot" },
  { pattern: /Slurp/i,               name: "Yahoo Slurp" },
  { pattern: /DuckDuckBot/i,         name: "DuckDuckBot" },
  { pattern: /Baiduspider/i,         name: "Baiduspider" },
  { pattern: /YandexBot/i,           name: "YandexBot" },
  { pattern: /Sogou/i,               name: "Sogou" },
  { pattern: /Exabot/i,              name: "Exabot" },
  { pattern: /ia_archiver/i,         name: "Alexa" },

  // AI crawlers
  { pattern: /GPTBot/i,              name: "GPTBot" },
  { pattern: /ChatGPT-User/i,        name: "ChatGPT-User" },
  { pattern: /ClaudeBot/i,           name: "ClaudeBot" },
  { pattern: /anthropic-ai/i,        name: "Anthropic" },
  { pattern: /CCBot/i,               name: "CCBot" },
  { pattern: /cohere-ai/i,           name: "Cohere" },
  { pattern: /PerplexityBot/i,       name: "PerplexityBot" },
  { pattern: /YouBot/i,              name: "YouBot" },

  // Social & messaging
  { pattern: /facebookexternalhit/i, name: "Facebook" },
  { pattern: /Twitterbot/i,          name: "Twitterbot" },
  { pattern: /LinkedInBot/i,         name: "LinkedInBot" },
  { pattern: /Slackbot/i,            name: "Slackbot" },
  { pattern: /WhatsApp/i,            name: "WhatsApp" },
  { pattern: /TelegramBot/i,         name: "TelegramBot" },
  { pattern: /Discordbot/i,          name: "Discordbot" },

  // SEO tools
  { pattern: /AhrefsBot/i,           name: "AhrefsBot" },
  { pattern: /SemrushBot/i,          name: "SemrushBot" },
  { pattern: /MJ12bot/i,             name: "MJ12bot" },
  { pattern: /DotBot/i,              name: "DotBot" },
  { pattern: /rogerbot/i,            name: "Moz Rogerbot" },
  { pattern: /MajesticBot/i,         name: "MajesticBot" },

  // Monitoring & performance
  { pattern: /UptimeRobot/i,         name: "UptimeRobot" },
  { pattern: /Pingdom/i,             name: "Pingdom" },
  { pattern: /GTmetrix/i,            name: "GTmetrix" },
  { pattern: /Lighthouse/i,          name: "Lighthouse" },

  // Generic fallback - must stay last
  { pattern: /\bbot\b/i,             name: "Generic Bot" },
  { pattern: /\bcrawler\b/i,         name: "Generic Crawler" },
  { pattern: /\bspider\b/i,          name: "Generic Spider" },
  { pattern: /\bscraper\b/i,         name: "Generic Scraper" },
];

function detectBot(ua: string): { isBot: boolean; botName: string } {
  for (const { pattern, name } of BOT_SIGNATURES) {
    if (pattern.test(ua)) return { isBot: true, botName: name };
  }
  return { isBot: false, botName: "human" };
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
  const { isBot, botName } = detectBot(ua);

  if (!isBot) return NextResponse.next();

  const secret = process.env.LOG_SHARED_SECRET;
  if (secret) {
    const rawIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    // after() guarantees execution completes after the response is sent,
    // even on Edge/serverless runtimes - more reliable than fire-and-forget
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
