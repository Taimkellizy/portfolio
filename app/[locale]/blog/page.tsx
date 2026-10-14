import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogBar } from "./blog-bar";
import { BlogFooter } from "./blog-footer";
import "../../../concepts/editorial-var-a.css";
import "./blog.css";
import { getAllPosts } from "@/lib/blog";
import { content, isLocale, locales, type Locale } from "@/lib/i18n";

const SITE = "https://taimkellizy-portfolio.vercel.app";

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
  const title = `${person.name} — ${ui.writingTitle}`;

  return {
    title: ui.writingTitle,
    description: ui.metaDescription,
    alternates: {
      canonical: siteUrl,
      languages: { en: `${SITE}/en/blog`, ar: `${SITE}/ar/blog` },
    },
    openGraph: {
      type: "website",
      url: siteUrl,
      siteName: person.name,
      title,
      description: ui.metaDescription,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: ui.metaDescription,
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

  return (
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

        {posts.length > 0 ? (
          <ul className="ea-rows">
            {posts.map((post) => (
              <li key={post.id} className="ea-row">
                <a href={`/${locale}/blog/${post.slug}`}>
                  <span className="ea-row__org u-label">{post.tags[0]}</span>
                  <span className="ea-row__title">{post.title}</span>
                  <span className="ea-row__excerpt">{post.excerpt}</span>
                  <span className="ea-row__year u-label">
                    {new Date(post.date).getFullYear()}
                  </span>
                  <span className="ea-row__arrow" aria-hidden="true">
                    <ArrowUpRight size={16} strokeWidth={1.5} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="blog-empty">{ui.blogEmpty}</p>
        )}
      </main>

      <BlogFooter locale={locale} />
    </div>
  );
}
