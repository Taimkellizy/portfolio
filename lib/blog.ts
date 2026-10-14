import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { content, type Locale } from "./i18n";

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
  tags: string[];
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
  tags?: unknown;
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
  tags: string[];
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
    !Array.isArray(data.tags) ||
    data.tags.some((tag) => typeof tag !== "string")
  )
    fail("tags");
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
    tags: data.tags,
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

/* ===================== one-pager "writing" rows ===================== */

/* One link row in the one-pager's writing section. Posts with a bundle
   link through to their page; untranslated posts show the other
   locale's copy (never machine-translated) and are marked; stubs with
   no bundle at all keep their placeholder anchor. */
export interface WritingRow {
  href: string;
  tag: string;
  title: string;
  excerpt: string;
  year: string;
}

const otherLocale = (locale: Locale): Locale => (locale === "en" ? "ar" : "en");

const toRow = (post: PostMeta): Omit<WritingRow, "href"> => ({
  tag: post.tags[0] ?? "",
  title: post.title,
  excerpt: post.excerpt,
  year: new Date(post.date).getFullYear().toString(),
});

export async function writingRowsFor(locale: Locale): Promise<WritingRow[]> {
  const other = otherLocale(locale);
  const [mine, theirs] = await Promise.all([getAllPosts(locale), getAllPosts(other)]);
  const mineById = new Map(mine.map((post) => [post.id, post]));
  const theirsById = new Map(theirs.map((post) => [post.id, post]));

  return content[locale].posts.map((stub) => {
    const localPost = mineById.get(stub.slug);
    if (localPost) {
      return { href: `/${locale}/blog/${localPost.slug}`, ...toRow(localPost) };
    }
    const foreignPost = theirsById.get(stub.slug);
    if (foreignPost) {
      const row = toRow(foreignPost);
      return {
        href: `/${other}/blog/${foreignPost.slug}`,
        /* availability mark: the copy belongs to the other locale */
        tag: `${row.tag} · ${other}`,
        title: row.title,
        excerpt: row.excerpt,
        year: row.year,
      };
    }
    return {
      href: "#ea-writing",
      tag: stub.tag,
      title: stub.title,
      excerpt: stub.excerpt,
      year: new Date(stub.date).getFullYear().toString(),
    };
  });
}
