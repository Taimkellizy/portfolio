import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { type Locale } from "./i18n";
import { isTopicId, topicIds, topicLabel, type TopicId } from "./topics";

/* Build-time blog loader — server-only fs reading, no runtime fetching.
   A "bundle" is one post: content/posts/<bundleId>/ holds meta.json plus
   an .mdx body per locale (ar.mdx optional; its absence means the post
   exists in en only and that is the honest availability shown). */

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export interface PostMeta {
  /* bundle directory name — invariant across locales */
  id: string;
  /* URL segment: frontmatter override or the bundle id */
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  updated?: string;
  /* fixed vocabulary ids (lib/topics.ts) — shared by every locale bundle */
  topics: TopicId[];
  cover?: string;
  /* ToC branch icon names, keyed by heading slug (lib/post-icons) */
  navIcons?: Record<string, string>;
}

export interface Post extends PostMeta {
  /* raw MDX source, ready for compileMDX at build time */
  body: string;
}

export interface AdjacentPosts {
  prev?: PostMeta;
  next?: PostMeta;
}

interface RawFrontmatter {
  id?: unknown;
  title?: unknown;
  excerpt?: unknown;
  date?: unknown;
  updated?: unknown;
  topics?: unknown;
  cover?: unknown;
  slug?: unknown;
  navIcons?: unknown;
}

const BODY_FILE: Record<string, string> = { en: "en.mdx", ar: "ar.mdx" };

/* Structural contract — a malformed frontmatter field must fail the
   build, not ship a broken page (same spirit as the ar content mirror). */
function assertFrontmatter(
  locale: string,
  bundleId: string,
  data: RawFrontmatter,
): asserts data is {
  title: string;
  excerpt: string;
  date: string;
  updated?: string;
  topics: TopicId[];
  cover?: string;
  slug?: string;
  navIcons?: Record<string, string>;
} {
  const fail = (field: string) => {
    throw new Error(
      `content/posts/${bundleId}/${locale}.mdx: frontmatter field "${field}" is missing or malformed`,
    );
  };
  if (typeof data.title !== "string" || data.title.length === 0) fail("title");
  if (typeof data.excerpt !== "string" || data.excerpt.length === 0)
    fail("excerpt");
  if (typeof data.date !== "string" || Number.isNaN(Date.parse(data.date)))
    fail("date");
  if (data.updated !== undefined && typeof data.updated !== "string")
    fail("updated");
  if (
    !Array.isArray(data.topics) ||
    data.topics.length === 0 ||
    data.topics.some((topic) => typeof topic !== "string")
  )
    fail("topics");
  /* the vocabulary is closed — an unknown id is a build error, not a new topic */
  const unknown = (data.topics as string[]).filter((topic) => !isTopicId(topic));
  if (unknown.length > 0) {
    throw new Error(
      `content/posts/${bundleId}/${locale}.mdx: unknown topic id(s) ${unknown.join(", ")} — valid ids: ${topicIds.join(", ")}`,
    );
  }
  if (data.cover !== undefined && typeof data.cover !== "string") fail("cover");
  if (data.slug !== undefined && typeof data.slug !== "string") fail("slug");
  if (data.navIcons !== undefined) {
    const icons = data.navIcons;
    if (
      typeof icons !== "object" ||
      icons === null ||
      Object.values(icons).some((icon) => typeof icon !== "string")
    )
      fail("navIcons");
  }
}

/* Absent files are honest availability; malformed frontmatter throws and
   fails the build (via the structural contract above). */
function isMissingFile(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "ENOENT"
  );
}

async function readPost(locale: string, bundleId: string): Promise<Post> {
  const file = path.join(POSTS_DIR, bundleId, BODY_FILE[locale]);
  const source = await readFile(file, "utf8");
  const { data, content } = matter(source);
  assertFrontmatter(locale, bundleId, data);

  return {
    id: bundleId,
    slug: data.slug ?? bundleId,
    title: data.title,
    excerpt: data.excerpt,
    date: data.date,
    updated: data.updated,
    topics: data.topics as TopicId[],
    cover: data.cover,
    navIcons: data.navIcons,
    body: content,
  };
}

async function bundleIds(): Promise<string[]> {
  try {
    const entries = await readdir(POSTS_DIR, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((d) => d.name);
  } catch {
    return [];
  }
}

/* Posts existing in the given locale, newest first. */
export async function getAllPosts(locale: string): Promise<Post[]> {
  const ids = await bundleIds();
  const posts = await Promise.all(
    ids.map(async (id) => {
      try {
        return await readPost(locale, id);
      } catch (error) {
        if (isMissingFile(error)) {
          /* no file for this locale — the bundle simply doesn't exist here */
          return null;
        }
        throw error;
      }
    }),
  );
  return posts
    .filter((post): post is Post => post !== null)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

export async function getPost(
  locale: string,
  bundleId: string,
): Promise<Post | undefined> {
  try {
    return await readPost(locale, bundleId);
  } catch (error) {
    if (isMissingFile(error)) return undefined;
    throw error;
  }
}

export async function getAdjacent(
  locale: string,
  bundleId: string,
): Promise<AdjacentPosts> {
  const posts = await getAllPosts(locale);
  const index = posts.findIndex((post) => post.id === bundleId);
  if (index < 0) return {};
  return {
    prev: posts[index + 1],
    next: posts[index - 1],
  };
}

/* ===================== reading time ===================== */

/** Prose words — fenced/inline code and mdx punctuation don't count. */
export function wordCount(body: string): number {
  const prose = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`\n]*`/g, " ")
    .replace(/[#>*_[\]()!-]/g, " ");
  return prose.split(/\s+/).filter(Boolean).length;
}

/**
 * Minutes to read — 225 wpm English, 180 Arabic (connected script reads
 * slower). Never renders as "0 min read".
 */
export function readingMinutes(body: string, locale: Locale): number {
  return Math.max(1, Math.round(wordCount(body) / (locale === "ar" ? 180 : 225)));
}

/* ===================== markdown exports ===================== */

/* Raw-body surfaces (.md route, llms-full.txt) serve plain markdown —
   a JSX embed tag there is noise, so it folds back into a plain link. */
export function toMarkdownBody(body: string): string {
  return body.replace(
    /<YouTubeEmbed\s+([^>]*?)\/>/g,
    (_tag: string, attrs: string) => {
      const id = /id="([^"]+)"/.exec(attrs)?.[1] ?? "";
      const title =
        /title="([^"]+)"/.exec(attrs)?.[1] ?? "Watch the video on YouTube";
      return `[${title}](https://www.youtube.com/watch?v=${id})`;
    },
  );
}

/* ===================== one-pager "writing" rows ===================== */

/* One link row in the one-pager's writing section — the latest three
   bundled posts, most recent first. A bundle that exists only in the
   other locale keeps its honest availability row (untranslated copy,
   never machine-translated). No placeholder stubs: the section is real
   posts only, so it grows with the blog. */
export interface WritingRow {
  href: string;
  tag: string;
  title: string;
  excerpt: string;
  year: string;
}

const otherLocale = (locale: Locale): Locale => (locale === "en" ? "ar" : "en");

const WRITING_ROW_LIMIT = 3;

const toRow = (post: PostMeta, locale: Locale): Omit<WritingRow, "href"> => ({
  tag: topicLabel(post.topics[0], locale),
  title: post.title,
  excerpt: post.excerpt,
  year: new Date(post.date).getFullYear().toString(),
});

export async function writingRowsFor(locale: Locale): Promise<WritingRow[]> {
  const other = otherLocale(locale);
  const [mine, theirs] = await Promise.all([getAllPosts(locale), getAllPosts(other)]);
  const mineById = new Map(mine.map((post) => [post.id, post]));

  const latest = [...mine, ...theirs.filter((post) => !mineById.has(post.id))]
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, WRITING_ROW_LIMIT);

  return latest.map((post) => {
    const local = mineById.get(post.id);
    if (local) {
      return {
        href: `/${locale}/blog/${local.slug}`,
        ...toRow(local, locale),
      };
    }
    const row = toRow(post, locale);
    return {
      href: `/${other}/blog/${post.slug}`,
      /* availability mark: the copy belongs to the other locale */
      tag: `${row.tag} · ${other}`,
      title: row.title,
      excerpt: row.excerpt,
      year: row.year,
    };
  });
}
