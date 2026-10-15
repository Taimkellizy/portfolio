/**
 * Canonical site origin + JSON-LD builders.
 *
 * Every URL-emitting surface (layout metadata, sitemap, robots, OG cards,
 * feeds, llms.txt) must import `SITE` from here — never redeclare it.
 * Swap `NEXT_PUBLIC_SITE_URL` (or this fallback) the day a custom domain lands.
 */
import { content, type Locale } from "./i18n";

export const SITE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://taimkellizy-portfolio.vercel.app";

export function absolute(path: string): string {
  return `${SITE}${path.startsWith("/") ? path : `/${path}`}`;
}

/** `</` escaping keeps the embedded JSON script-safe. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** `2025-11-02` -> `2025-11-02T00:00:00.000Z` */
export function isoDate(date: string): string {
  const t = Date.parse(date);
  return Number.isNaN(t) ? date : new Date(t).toISOString();
}

const PERSON_ID = `${SITE}/#person`;
const WEBSITE_ID = `${SITE}/#website`;

export function personNode(locale: Locale) {
  const dict = content[locale];
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: dict.person.name,
    jobTitle: dict.person.role,
    url: absolute(`/${locale}`),
    email: `mailto:${dict.person.email}`,
    homeLocation: { "@type": "Place", name: dict.person.location },
    sameAs: [dict.person.github, dict.person.linkedin, dict.person.instagram],
    knowsAbout: dict.skills.flatMap((g) => g.items),
  };
}

export function webSiteNode(locale: Locale) {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE,
    name: content[locale].person.name,
    inLanguage: locale,
    publisher: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID },
  };
}

export function breadcrumbNode(
  locale: Locale,
  trail: Array<{ name: string; path: string }>,
) {
  const id = absolute(`/${locale}${trail.at(-1)?.path ?? ""}`);
  return {
    "@type": "BreadcrumbList",
    "@id": `${id}#breadcrumb`,
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absolute(`/${locale}${item.path}`),
    })),
  };
}

export function blogPostingNode(input: {
  locale: Locale;
  canonical: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  keywords: string[];
  wordCount: number;
  image?: string;
}) {
  return {
    "@type": "BlogPosting",
    "@id": `${input.canonical}#article`,
    headline: input.title,
    description: input.description,
    url: input.canonical,
    datePublished: isoDate(input.date),
    dateModified: isoDate(input.updated ?? input.date),
    ...(input.image ? { image: input.image } : {}),
    inLanguage: input.locale,
    keywords: input.keywords.join(", "),
    wordCount: input.wordCount,
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
    mainEntityOfPage: input.canonical,
  };
}

/** The one true `<script type="application/ld+json">` payload: `@graph`. */
export function graph(...nodes: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
