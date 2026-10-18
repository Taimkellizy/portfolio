import { getAllPosts, getPost, toMarkdownBody } from "@/lib/blog";
import { isLocale, type Locale } from "@/lib/i18n";
import { absolute } from "@/lib/seo";
import { topicLabel } from "@/lib/topics";

export const dynamic = "force-static";

const LOCALES: Locale[] = ["en", "ar"];

export async function generateStaticParams() {
  const params: Array<{ locale: string; slug: string }> = [];
  for (const locale of LOCALES) {
    for (const post of await getAllPosts(locale)) {
      params.push({ locale, slug: post.slug });
    }
  }
  return params;
}

/**
 * Markdown export of one post — `/en/blog/{slug}.md`.
 *
 * Serves the machine-readable twin of the post page: a small YAML header
 * (title, language, canonical + translation URLs, date, topics) plus the
 * raw body. Linked from the page via rel="alternate" type="text/markdown".
 * The pretty URL is produced by the rewrite in next.config.ts (a dynamic
 * segment cannot carry a literal `.md` suffix).
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; slug: string }> },
) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return new Response("Not found", { status: 404 });
  const locale = raw as Locale;

  const post = (await getAllPosts(locale)).find((p) => p.slug === slug);
  if (!post) return new Response("Not found", { status: 404 });

  const other = locale === "en" ? "ar" : "en";
  const twin = await getPost(other, post.id);
  const canonical = absolute(`/${locale}/blog/${post.slug}`);

  const header = [
    "---",
    `title: ${JSON.stringify(post.title)}`,
    `language: ${locale}`,
    `canonical: ${canonical}`,
    ...(twin ? [`translation: ${absolute(`/${other}/blog/${twin.slug}`)}`] : []),
    `date: ${post.date}`,
    ...(post.updated ? [`updated: ${post.updated}`] : []),
    `topics: [${post.topics
      .map((id) => JSON.stringify(topicLabel(id, locale)))
      .join(", ")}]`,
    "---",
    "",
  ].join("\n");

  return new Response(`${header}${toMarkdownBody(post.body)}`, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
