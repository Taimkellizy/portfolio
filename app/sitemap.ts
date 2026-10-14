import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";

const SITE = "https://taimkellizy-portfolio.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${SITE}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1,
  }));
}
