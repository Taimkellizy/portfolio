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

/** `og:locale` per site locale (ll_CC). */
export const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  ar: "ar_SY",
};

/**
 * One locale-neutral Person entity — byte-identical on /en and /ar so the
 * two pages never publish contradictory values under the same @id (a `name`
 * that flips per locale is the kind of conflict that makes Google drop the
 * node, and with it the site-name signal). The Arabic name rides
 * `alternateName`; page copy stays localized.
 */
export function personNode() {
  const en = content.en.person;
  const education = content.en.credentials.find((c) => c.id === "education");
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: en.name,
    alternateName: [content.ar.person.name],
    description: content.en.ui.metaDescription,
    image: absolute("/en/opengraph-image"),
    jobTitle: en.role,
    url: absolute("/en"),
    email: `mailto:${en.email}`,
    homeLocation: { "@type": "Place", name: en.location },
    sameAs: [en.github, en.linkedin, en.instagram],
    knowsAbout: content.en.skills.flatMap((g) => g.items),
    ...(education
      ? { alumniOf: { "@type": "CollegeOrUniversity", name: education.org } }
      : {}),
    hasOccupation: {
      "@type": "Occupation",
      name: "Software Developer",
      occupationLocation: { "@type": "Country", name: "Syria" },
    },
  };
}

/**
 * Also locale-neutral (same reasoning as personNode). `name` is the one
 * brand string Google is asked to show instead of the host ("vercel.app"
 * on this domain); `alternateName` carries the searchable variants.
 */
export function webSiteNode() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE,
    name: content.en.person.name,
    alternateName: ["Taim Kellizy Portfolio", content.ar.person.name],
    inLanguage: ["en", "ar"],
    description: content.en.ui.metaDescription,
    publisher: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID },
  };
}

/** Google's ProfilePage markup — the home page IS the person's profile. */
export function profilePageNode(locale: Locale) {
  return {
    "@type": "ProfilePage",
    "@id": `${absolute(`/${locale}`)}#profile`,
    url: absolute(`/${locale}`),
    inLanguage: locale,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    mainEntity: personNode(),
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
