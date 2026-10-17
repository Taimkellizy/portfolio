import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/code-block";
import { BlogPostBar } from "@/components/blog-post-bar";
import { PostSearch } from "@/components/post-search";
import { PostToc } from "@/components/post-toc";
import { ReadingProgress } from "@/components/reading-progress";
import {
  getAdjacent,
  getAllPosts,
  getPost,
  readingMinutes,
  wordCount,
  type PostMeta,
} from "@/lib/blog";
import { content, isLocale, locales } from "@/lib/i18n";
import {
  SITE,
  absolute,
  blogPostingNode,
  breadcrumbNode,
  graph,
  jsonLdScript,
  OG_LOCALE,
} from "@/lib/seo";
import { topicLabel } from "@/lib/topics";
import { newTabProps } from "@/concepts/editorial-var-a/shared";
import { BlogBar } from "../blog-bar";
import { BlogFooter } from "../blog-footer";
import "../../../../concepts/editorial-var-a.css";
import "../blog.css";

export const dynamicParams = false;

type PostParams = { locale: string; slug: string };

export async function generateStaticParams(): Promise<PostParams[]> {
  const params: PostParams[] = [];
  for (const locale of locales) {
    for (const post of await getAllPosts(locale)) {
      params.push({ locale, slug: post.slug });
    }
  }
  return params;
}

async function resolvePost(rawLocale: string, slug: string) {
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as "en" | "ar";
  const post = (await getAllPosts(locale)).find((candidate) => candidate.slug === slug);
  if (!post) notFound();
  return { locale, post };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PostParams>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const { locale, post } = await resolvePost(raw, slug);
  const { person } = content[locale];
  const siteUrl = `${SITE}/${locale}/blog/${post.slug}`;
  const other = locale === "en" ? "ar" : "en";
  const otherPost = await getPost(other, post.id);
  const languages = {
    [locale]: siteUrl,
    ...(otherPost ? { [other]: `${SITE}/${other}/blog/${otherPost.slug}` } : {}),
  };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: siteUrl,
      languages: {
        ...languages,
        "x-default": `${SITE}/`,
      },
      types: {
        "text/markdown": `${siteUrl}.md`,
        "application/rss+xml": `${SITE}/${locale}/rss.xml`,
      },
    },
    openGraph: {
      type: "article",
      url: siteUrl,
      siteName: person.name,
      locale: OG_LOCALE[locale],
      alternateLocale: [OG_LOCALE[other]],
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      ...(post.updated ? { modifiedTime: post.updated } : {}),
      authors: [person.name],
      tags: post.topics.map((id) => topicLabel(id, locale)),
      ...(post.cover ? { images: [{ url: post.cover }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      ...(post.cover ? { images: [{ url: post.cover }] } : {}),
    },
  };
}

/* External links open in a new tab (the shared newTabProps behaviour);
   internal anchors — heading links, relative hrefs — stay in place. */
function PostLink({
  href = "",
  children,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href={href} {...newTabProps(href)} {...rest}>
      {children}
    </a>
  );
}

function formatDate(date: string, locale: "en" | "ar"): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", {
    dateStyle: "long",
  }).format(new Date(date));
}

export default async function PostPage({
  params,
}: {
  params: Promise<PostParams>;
}) {
  const { locale: raw, slug } = await params;
  const { locale, post } = await resolvePost(raw, slug);
  const { ui, person } = content[locale];

  const [{ content: mdxContent }, adjacentAndSibling] = await Promise.all([
    compileMDX({
      source: post.body,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            /* VS Code Dark+ tokens, rendered at build time — code stays
               real selectable text, never a canvas or client-side repaint. */
            [rehypePrettyCode, { theme: "dark-plus", keepBackground: false }],
          ],
        },
      },
      components: {
        a: PostLink,
        pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
          <CodeBlock {...props} copyLabel={ui.copyCode} copiedLabel={ui.copied} />
        ),
      },
    }),
    Promise.all([
      getAdjacent(locale, post.id),
      getPost(locale === "en" ? "ar" : "en", post.id),
    ]),
  ]);
  const [adjacent, otherLocalePost] = adjacentAndSibling;
  const other = locale === "ar" ? "en" : "ar";

  const postUrl = (locale: string, meta: PostMeta) =>
    `/${locale}/blog/${meta.slug}`;

  const canonical = absolute(`/${locale}/blog/${post.slug}`);
  const jsonLd = graph(
    blogPostingNode({
      locale,
      canonical,
      title: post.title,
      description: post.excerpt,
      date: post.date,
      updated: post.updated,
      keywords: post.topics.map((id) => topicLabel(id, locale)),
      wordCount: wordCount(post.body),
      image:
        post.cover ??
        absolute(`/${locale}/blog/${post.slug}/opengraph-image`),
    }),
    breadcrumbNode(locale, [
      { name: person.name, path: "" },
      { name: ui.writingTitle, path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      {/* restore the reading-size choice before paint — the post bar owns
          the control, but the prose must not flash at the wrong scale */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            'try{var s=localStorage.getItem("reading-size");if(s)document.documentElement.dataset.readingSize=s}catch{}',
        }}
      />
      <div className="ea ea--blog">
        <a className="ea-skip" href="#blog-main">
          {ui.skipToContent}
        </a>

        <BlogBar
          locale={locale}
          showIndexLink
          langHref={
            otherLocalePost
              ? postUrl(other, otherLocalePost)
              : `/${other}/blog`
          }
        />

        <main className="blog-main" id="blog-main" tabIndex={-1}>
          <ReadingProgress />
          <article className="blog-post">
            <header className="blog-post__head">
              <nav className="blog-topics blog-topics--post" aria-label={ui.topicsLabel}>
                {post.topics.map((id) => (
                  <a
                    key={id}
                    className="blog-chip"
                    href={`/${locale}/blog?topic=${id}`}
                  >
                    {topicLabel(id, locale)}
                  </a>
                ))}
              </nav>
              <h1 className="blog-post__title">{post.title}</h1>
              <p className="blog-post__standfirst">{post.excerpt}</p>
              <p className="u-label blog-post__meta">
                <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
                {post.updated
                  ? `  ·  ${ui.blogUpdated}: ${formatDate(post.updated, locale)}`
                  : ""}
                {"  ·  "}
                {`${readingMinutes(post.body, locale)} ${ui.minRead}`}
                {"  ·  "}
                {person.name}
              </p>
            </header>

            <BlogPostBar
              mdHref={`/${locale}/blog/${post.slug}.md`}
              canonical={canonical}
              labels={{
                copyMarkdown: ui.copyAsMarkdown,
                viewMarkdown: ui.viewAsMarkdown,
                copyLink: ui.copyLink,
                copied: ui.copied,
                failed: ui.copyFailed,
                smaller: ui.smallerText,
                larger: ui.largerText,
                readingSize: ui.readingSize,
              }}
              searchSlot={
                <PostSearch
                  labels={{
                    findInPost: ui.findInPost,
                    searchPrev: ui.searchPrev,
                    searchNext: ui.searchNext,
                    searchClear: ui.searchClear,
                    searchNoMatches: ui.searchNoMatches,
                  }}
                />
              }
            />

            <div className="blog-post__layout">
              <PostToc
                summaryLabel={ui.blogContents}
                navIcons={post.navIcons ?? {}}
              />
              <div className="ea-prose">{mdxContent}</div>
            </div>
          </article>

        {adjacent.prev || adjacent.next ? (
          <nav className="blog-xnav" aria-label={ui.blogAllPosts}>
            {adjacent.prev ? (
              <Link
                href={postUrl(locale, adjacent.prev)}
                className="blog-xnav__link blog-xnav__link--prev"
              >
                <span className="u-label blog-xnav__dir">
                  <ArrowLeft size={14} strokeWidth={1.5} />
                  {ui.blogPrev}
                </span>
                <span className="blog-xnav__title">{adjacent.prev.title}</span>
              </Link>
            ) : null}
            <Link
              className="blog-xnav__link blog-xnav__link--index u-label"
              href={`/${locale}/blog`}
            >
              {ui.blogAllPosts}
              <ArrowUpRight size={14} strokeWidth={1.5} />
            </Link>
            {adjacent.next ? (
              <Link
                href={postUrl(locale, adjacent.next)}
                className="blog-xnav__link blog-xnav__link--next"
              >
                <span className="u-label blog-xnav__dir">
                  {ui.blogNext}
                  <ArrowRight size={14} strokeWidth={1.5} />
                </span>
                <span className="blog-xnav__title">{adjacent.next.title}</span>
              </Link>
            ) : null}
          </nav>
        ) : null}
        </main>

        <BlogFooter locale={locale} />
      </div>
    </>
  );
}
