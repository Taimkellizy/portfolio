import type { MetadataRoute } from "next";
import { getAllPosts, getPost } from "@/lib/blog";
import { locales } from "@/lib/i18n";
import { SITE } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const rootLanguages = {
    en: `${SITE}/en`,
    ar: `${SITE}/ar`,
    "x-default": `${SITE}/`,
  };

  for (const locale of locales) {
    entries.push({
      url: `${SITE}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: rootLanguages },
    });
    entries.push({
      url: `${SITE}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          en: `${SITE}/en/blog`,
          ar: `${SITE}/ar/blog`,
          "x-default": `${SITE}/`,
        },
      },
    });

    for (const post of await getAllPosts(locale)) {
      const other = locale === "en" ? "ar" : "en";
      /* twin found by bundle id — its slug may differ per locale */
      const twin = await getPost(other, post.id);
      entries.push({
        url: `${SITE}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.updated ?? post.date),
        changeFrequency: "yearly",
        priority: 0.7,
        alternates: {
          languages: twin
            ? {
                en:
                  locale === "en"
                    ? `${SITE}/en/blog/${post.slug}`
                    : `${SITE}/en/blog/${twin.slug}`,
                ar:
                  locale === "ar"
                    ? `${SITE}/ar/blog/${post.slug}`
                    : `${SITE}/ar/blog/${twin.slug}`,
                "x-default": `${SITE}/`,
              }
            : {
                [locale]: `${SITE}/${locale}/blog/${post.slug}`,
                "x-default": `${SITE}/`,
              },
        },
      });
    }
  }

  return entries;
}
