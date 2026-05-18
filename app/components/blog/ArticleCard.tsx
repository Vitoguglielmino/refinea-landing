import { Link } from "@/i18n/routing";
import { formatDate, type PostMeta } from "@/lib/mdx";
import { getAuthor } from "@/lib/authors";
import { getSection } from "@/lib/blog-taxonomy";

/**
 * ArticleCard — shared between /blog index and the section/topic/author
 * index pages. Single source of truth so card design changes propagate.
 */
export default function ArticleCard({
  post,
  showSectionBadge = true,
}: {
  post: PostMeta;
  showSectionBadge?: boolean;
}) {
  const cover = post.cover;
  const author = getAuthor(post.author);
  const section = getSection(post.section);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl border border-black/[0.09] bg-white overflow-hidden hover:border-black/[0.15] hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-200"
    >
      <div className="relative w-full aspect-[16/9] bg-[#0d0d0d] overflow-hidden">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={post.title}
            className="w-full h-full object-cover"
            style={{ filter: "grayscale(90%) contrast(1.05)" }}
          />
        ) : (
          <div className="absolute inset-0 flex items-end p-4">
            <div className="space-y-1.5 w-full">
              <div className="h-2 rounded-full bg-white/10 w-3/4" />
              <div className="h-2 rounded-full bg-white/10 w-1/2" />
            </div>
          </div>
        )}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        {showSectionBadge && section && (
          <span className="absolute top-3 left-3 inline-flex items-center text-[10px] font-semibold uppercase tracking-[0.08em] px-2 py-1 rounded-full bg-white/95 text-accent backdrop-blur-sm">
            {section.shortName}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 gap-2">
        <h3
          className="font-bold text-black group-hover:text-accent transition-colors duration-200"
          style={{
            fontSize: 15,
            lineHeight: 1.35,
            letterSpacing: "-0.01em",
            margin: 0,
          }}
        >
          {post.title}
        </h3>

        <p className="text-[13px] text-black/55 leading-relaxed line-clamp-2 flex-1">
          {post.description}
        </p>

        {author && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-black/[0.05]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={author.image}
              alt={author.name}
              width={24}
              height={24}
              className="rounded-full object-cover shrink-0"
              style={{ width: 24, height: 24 }}
            />
            <span className="text-[12px] font-medium text-black/70 truncate">
              {author.name}
            </span>
            <span className="text-black/20 text-[11px]">·</span>
            <time className="text-[11px] text-black/40 font-mono shrink-0">
              {formatDate(post.date)}
            </time>
          </div>
        )}
      </div>
    </Link>
  );
}
