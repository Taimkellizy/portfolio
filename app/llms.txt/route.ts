import { getAllPosts } from "@/lib/blog";
import { content, locales } from "@/lib/i18n";
import { absolute, SITE } from "@/lib/seo";
import { topicLabel } from "@/lib/topics";

export const dynamic = "force-static";

/**
 * llms.txt — the machine-readable index of this site (llmstxt.org).
 *
 * Every page and post also has a Markdown export at its URL plus `.md`;
 * those exports omit site chrome, so cite the canonical HTML URL.
 */
export async function GET() {
  const { person, ui } = content.en;

  const lines: string[] = [
    `# ${person.name}`,
    "",
    `> ${ui.metaDescription}`,
    "",
    `${person.name} is a ${person.role.toLowerCase()} ${person.location.toLowerCase()}. ` +
      `Selected work, credentials, and writing live on this site, which exists in ` +
      `English (/en) and Arabic (/ar) — the two are translations of one another, ` +
      `not separate content.`,
    "",
    `Markdown: every post has a Markdown export at its URL with \`.md\` appended ` +
      `(for example /en/blog/on-learning-c-twice.md). The exports carry a title, ` +
      `language, canonical URL and translation URL. They omit site navigation; ` +
      `cite the canonical HTML URL.`,
    "",
    "## Pages",
    "",
  ];

  for (const locale of locales) {
    const label = locale === "en" ? "English" : "Arabic";
    lines.push(`### ${label}`);
    lines.push("");
    lines.push(
      `- [Home](${absolute(`/${locale}`)}) — ${content[locale].ui.metaDescription}`,
    );
    lines.push(`- [Blog](${absolute(`/${locale}/blog`)}) — ${content[locale].ui.writingTitle}`);
    lines.push(`- [RSS feed](${absolute(`/${locale}/rss.xml`)})`);
    lines.push(`- [Full text](${absolute(`/${locale}/llms-full.txt`)})`);
    lines.push("");
  }

  for (const locale of locales) {
    const label = locale === "en" ? "English" : "Arabic";
    const posts = await getAllPosts(locale);
    lines.push(`## Posts (${label})`);
    lines.push("");
    if (posts.length === 0) lines.push("Nothing published yet.");
    for (const post of posts) {
      const link = absolute(`/${locale}/blog/${post.slug}`);
      const topics = post.topics.map((id) => topicLabel(id, locale)).join(", ");
      lines.push(
        `- [${post.title}](${link}): ${post.excerpt} (${topics}, ${post.date}) [Markdown](${link}.md)`,
      );
    }
    lines.push("");
  }

  lines.push("## Optional");
  lines.push("");
  lines.push(`- [Sitemap](${SITE}/sitemap.xml)`);
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
