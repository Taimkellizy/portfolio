import { getAllPosts } from "@/lib/blog";
import { content, isLocale, type Locale } from "@/lib/i18n";
import { absolute } from "@/lib/seo";
import { topicLabel } from "@/lib/topics";

export const dynamic = "force-static";

const LOCALES: Locale[] = ["en", "ar"];

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** RSS 2.0 feed per locale — `/en/rss.xml`, `/ar/rss.xml`. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return new Response("Not found", { status: 404 });
  const locale = raw as Locale;

  const { person, ui } = content[locale];
  const posts = await getAllPosts(locale);
  const blog = absolute(`/${locale}/blog`);

  const items = posts
    .map((post) => {
      const link = absolute(`/${locale}/blog/${post.slug}`);
      return [
        "    <item>",
        `      <title>${esc(post.title)}</title>`,
        `      <link>${esc(link)}</link>`,
        `      <guid isPermaLink="true">${esc(link)}</guid>`,
        `      <pubDate>${new Date(post.date).toUTCString()}</pubDate>`,
        `      <description>${esc(post.excerpt)}</description>`,
        ...post.topics.map(
          (id) => `      <category>${esc(topicLabel(id, locale))}</category>`,
        ),
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${esc(person.name)} — ${esc(ui.writingTitle)}</title>`,
    `    <link>${esc(blog)}</link>`,
    `    <description>${esc(ui.metaDescription)}</description>`,
    `    <language>${locale}</language>`,
    `    <managingEditor>${esc(person.email)} (${esc(person.name)})</managingEditor>`,
    `    <atom:link href="${esc(absolute(`/${locale}/rss.xml`))}" rel="self" type="application/rss+xml"/>`,
    items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
