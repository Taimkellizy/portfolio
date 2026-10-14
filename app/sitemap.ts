import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { locales } from "@/lib/i18n";

const SITE = "https://taimkellizy-portfolio.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: `${SITE}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    });
    entries.push({
      url: `${SITE}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
    for (const post of await getAllPosts(locale)) {
      entries.push({
        url: `${SITE}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.updated ?? post.date),
        changeFrequency: "yearly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
