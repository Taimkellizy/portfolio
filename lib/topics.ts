import type { Locale } from "./i18n";

/**
 * The fixed post vocabulary — the only topic ids a post may declare.
 *
 * This is a closed list on purpose: unknown ids fail the build (see
 * `assertFrontmatter` in lib/blog.ts), so the filter chips, the JSON-LD
 * keywords and the OG tags can never drift apart. Adding a topic = one
 * entry here; each id carries its display label per locale so a post's
 * frontmatter stays locale-neutral (ids shared by en/ar bundles).
 */
export const TOPICS = [
  { id: "notes", label: { en: "Notes", ar: "ملاحظات" } },
  { id: "cs", label: { en: "Computer Science", ar: "علوم الحاسوب" } },
  { id: "web-dev", label: { en: "Web Development", ar: "تطوير الويب" } },
  { id: "tooling", label: { en: "Tooling", ar: "الأدوات" } },
  { id: "arabic-tech", label: { en: "Arabic Tech", ar: "التقنية العربية" } },
  { id: "design", label: { en: "Design", ar: "التصميم" } },
  { id: "career", label: { en: "Career", ar: "المسيرة المهنية" } },
  { id: "writing", label: { en: "Writing", ar: "الكتابة" } },
] as const;

export type Topic = (typeof TOPICS)[number];
export type TopicId = Topic["id"];

const BY_ID = new Map<string, Topic>(TOPICS.map((topic) => [topic.id, topic]));

export function isTopicId(value: unknown): value is TopicId {
  return typeof value === "string" && BY_ID.has(value);
}

export function topicLabel(id: string, locale: Locale): string {
  return BY_ID.get(id)?.label[locale] ?? id;
}

/** for error messages and llms.txt */
export const topicIds: readonly string[] = TOPICS.map((topic) => topic.id);
