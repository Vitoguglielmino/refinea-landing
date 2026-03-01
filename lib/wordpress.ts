// ─── WordPress Headless API ────────────────────────────────────────────────────
//
// Setup checklist:
//  1. Set WORDPRESS_API_URL in .env.local
//     e.g. WORDPRESS_API_URL=https://cms.refinea.io/wp-json/wp/v2
//  2. Install ACF plugin in WordPress.
//     Create field group "GEO Settings" applied to Posts:
//       - json_ld_script  (Textarea)
//       - primary_entity  (Text)
//       - target_persona  (Select: Research | Purchase | Comparison | Awareness)
//     Enable "Show in REST API" for the group.
//  3. (Optional) Disable WP frontend: add to wp-config.php or via plugin.
//  4. For revalidation on publish: add a webhook in WordPress
//     → Settings > Actions on publish
//     POST https://refinea.io/api/revalidate?secret=<REVALIDATION_SECRET>

const WP_API = process.env.WORDPRESS_API_URL ?? "";

export type WPPost = {
  id: number;
  slug: string;
  date: string;
  modified: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  featured_media: number;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
  acf?: {
    json_ld_script?: string;
    primary_entity?: string;
    target_persona?: "Research" | "Purchase" | "Comparison" | "Awareness";
    meta_description?: string;
  };
};

function wpUrl(path: string) {
  return `${WP_API}${path}`;
}

export async function getPosts(): Promise<WPPost[]> {
  if (!WP_API) return [];
  try {
    const res = await fetch(wpUrl("/posts?_embed&per_page=24&status=publish"), {
      next: { tags: ["wp-posts"], revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  if (!WP_API) return null;
  try {
    const res = await fetch(
      wpUrl(`/posts?slug=${encodeURIComponent(slug)}&_embed&status=publish`),
      { next: { tags: ["wp-posts"], revalidate: 60 } }
    );
    if (!res.ok) return null;
    const posts: WPPost[] = await res.json();
    return posts[0] ?? null;
  } catch {
    return null;
  }
}

export async function getAllSlugs(): Promise<string[]> {
  const posts = await getPosts();
  return posts.map((p) => p.slug);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getCoverUrl(post: WPPost): string | null {
  return post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
}

export type Heading = { id: string; text: string; level: 2 | 3 };

/** Extract h2 + h3 headings from WordPress HTML content */
export function extractHeadings(html: string): Heading[] {
  const regex = /<(h[23])[^>]*>(.*?)<\/h[23]>/gi;
  const headings: Heading[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1].slice(1)) as 2 | 3;
    const text = match[2].replace(/<[^>]+>/g, "").trim();
    if (!text) continue;
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    headings.push({ id, text, level });
  }
  return headings;
}

/** Inject id attributes into h2 + h3 tags so TOC anchors work */
export function addHeadingIds(html: string): string {
  return html.replace(/<(h[23])([^>]*)>(.*?)<\/h[23]>/gi, (_, tag, attrs, inner) => {
    const text = inner.replace(/<[^>]+>/g, "").trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
  });
}

/** Short date format for the "Updated" badge */
export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}
