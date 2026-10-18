import { getAllPosts, toMarkdownBody } from "@/lib/blog";
import { content, isLocale, type Locale } from "@/lib/i18n";
import { absolute } from "@/lib/seo";
import { topicLabel } from "@/lib/topics";

export const dynamic = "force-static";

const LOCALES: Locale[] = ["en", "ar"];

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/**
 * llms-full.txt per locale — every post concatenated, newest first,
 * as plain markdown. Half the size of the bilingual dump per file.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return new Response("Not found", { status: 404 });
  const locale = raw as Locale;

  const { person } = content[locale];
  const posts = await getAllPosts(locale);
  const parts: string[] = [
    `# ${person.name} — ${locale === "en" ? "full text" : "النص الكامل"}`,
    "",
    `> ${absolute(`/${locale}/llms-full.txt`)} — every post, newest first.`,
    "",
  ];

  for (const post of posts) {
    const link = absolute(`/${locale}/blog/${post.slug}`);
    const topics = post.topics.map((id) => topicLabel(id, locale)).join(", ");
    parts.push(`## ${post.title}`);
    parts.push("");
    parts.push(`> ${post.excerpt}`);
    parts.push(`> ${link} · ${post.date} · ${topics}`);
    parts.push("");
    parts.push(toMarkdownBody(post.body.trim()));
    parts.push("");
    parts.push("---");
    parts.push("");
  }

  return new Response(parts.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
