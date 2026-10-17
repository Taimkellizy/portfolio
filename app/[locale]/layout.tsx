import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import {
  thmanyahSans,
  thmanyahSerifDisplay,
  thmanyahSerif,
  workSans,
  officeCode,
} from "../fonts";
import { content, dirOf, isLocale, locales } from "@/lib/i18n";
import {
  SITE,
  absolute,
  graph,
  jsonLdScript,
  OG_LOCALE,
  personNode,
  webSiteNode,
} from "@/lib/seo";
import "../globals.css";

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
  const locale = isLocale(raw) ? raw : "en";
  const { person, ui } = content[locale];
  const siteUrl = `${SITE}/${locale}`;
  const title = `${person.name} — ${person.role}`;

  return {
    metadataBase: new URL(SITE),
    applicationName: person.name,
    title: {
      default: title,
      template: `%s — ${person.name}`,
    },
    description: ui.metaDescription,
    authors: [{ name: person.name, url: siteUrl }],
    creator: person.name,
    alternates: {
      canonical: siteUrl,
      languages: {
        en: `${SITE}/en`,
        ar: `${SITE}/ar`,
        /* root 308s to the visitor's locale — Google's preferred x-default */
        "x-default": `${SITE}/`,
      },
      types: {
        "application/rss+xml": absolute(`/${locale}/rss.xml`),
      },
    },
    openGraph: {
      type: "website",
      url: siteUrl,
      siteName: person.name,
      locale: OG_LOCALE[locale],
      alternateLocale: [OG_LOCALE[locale === "en" ? "ar" : "en"]],
      title,
      description: ui.metaDescription,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: ui.metaDescription,
    },
    robots: { index: true, follow: true },
  };
}

export const viewport = {
  themeColor: "#060607",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
} as const;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as "en" | "ar";

  return (
    <html
      lang={locale}
      dir={dirOf(locale)}
      /* the reading-size restore script (blog post pages) stamps a
         data-reading-size on <html> before hydration — suppress the
         attribute diff on this element so the DOM value wins (see
         AGENTS.md gotcha 25) */
      suppressHydrationWarning
      className={[
        workSans.variable,
        officeCode.variable,
        thmanyahSans.variable,
        thmanyahSerifDisplay.variable,
        thmanyahSerif.variable,
      ].join(" ")}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript(graph(personNode(), webSiteNode())),
          }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
