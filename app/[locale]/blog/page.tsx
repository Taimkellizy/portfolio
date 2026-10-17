import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogBar } from "./blog-bar";
import { BlogFooter } from "./blog-footer";
import "../../../concepts/editorial-var-a.css";
import "./blog.css";
import { getAllPosts } from "@/lib/blog";
import { BlogIndexList, type BlogRow } from "@/components/blog-index-list";
import { BlogIndexSearch } from "@/components/blog-index-search";
import { BlogIndexResults } from "@/components/blog-index-results";
import { content, isLocale, locales, type Locale } from "@/lib/i18n";
import {
  SITE,
  absolute,
  breadcrumbNode,
  graph,
  jsonLdScript,
  OG_LOCALE,
} from "@/lib/seo";
import { topicLabel } from "@/lib/topics";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const { person, ui } = content[locale];
  const siteUrl = `${SITE}/${locale}/blog`;
  const title = `${ui.blogMetaTitle} — ${person.name}`;
  const other = locale === "en" ? "ar" : "en";

  return {
    title: ui.blogMetaTitle,
    description: ui.blogMetaDescription,
    alternates: {
      canonical: siteUrl,
      languages: {
        en: `${SITE}/en/blog`,
        ar: `${SITE}/ar/blog`,
        "x-default": `${SITE}/`,
      },
      types: {
        "application/rss+xml": `${SITE}/${locale}/rss.xml`,
      },
    },
    openGraph: {
      type: "website",
      url: siteUrl,
      siteName: person.name,
      locale: OG_LOCALE[locale],
      alternateLocale: [OG_LOCALE[other]],
      title,
      description: ui.blogMetaDescription,
      /* a page-level `openGraph` object replaces the parent segment's
         file-convention og:image wholesale — restate the card here or
         the blog index ships without one */
      images: [
        {
          url: absolute(`/${locale}/opengraph-image`),
          width: 1200,
          height: 630,
          alt: "Taim Kellizy — portfolio card",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: ui.blogMetaDescription,
      images: [
        {
          url: absolute(`/${locale}/twitter-image`),
          alt: "Taim Kellizy — portfolio card",
        },
      ],
    },
  };
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const { ui } = content[locale];
  const posts = await getAllPosts(locale);
  const other = locale === "en" ? "ar" : "en";
  const rows: BlogRow[] = posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    year: new Date(post.date).getFullYear().toString(),
    topics: post.topics.map((id) => ({ id, label: topicLabel(id, locale) })),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            graph(
              breadcrumbNode(locale, [
                { name: content[locale].person.name, path: "" },
                { name: ui.writingTitle, path: "/blog" },
              ]),
            ),
          ),
        }}
      />
      <div className="ea ea--blog">
        <a className="ea-skip" href="#blog-main">
          {ui.skipToContent}
        </a>

      <BlogBar locale={locale} langHref={`/${other}/blog`} showIndexLink={false} />

      <main className="blog-main blog-index" id="blog-main" tabIndex={-1}>
        <header className="ea-sec">
          <h2 className="ea-sec__title">{ui.writingTitle}</h2>
          <span className="ea-sec__count u-label">{ui.writingCount}</span>
        </header>

        <BlogIndexSearch
          placeholder={ui.blogSearchPlaceholder}
          clearLabel={ui.searchClear}
        />

        <BlogIndexList
          rows={rows}
          allLabel={ui.allTopics}
          topicsLabel={ui.topicsLabel}
          emptyLabel={ui.blogEmpty}
          noMatchesLabel={ui.blogNoQueryMatches}
          locale={locale}
        />

        <BlogIndexResults
          rows={rows}
          locale={locale}
          labels={{
            hitsTitle: ui.blogHitsTitle,
            hitsCount: ui.blogHitsCount,
            searching: ui.blogSearching,
            noMatches: ui.blogNoTextMatches,
          }}
        />
        </main>

        <BlogFooter locale={locale} />
      </div>
    </>
  );
}
