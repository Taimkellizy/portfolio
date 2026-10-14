import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  thmanyahSans,
  thmanyahSerifDisplay,
  workSans,
  officeCode,
} from "../fonts";
import { content, dirOf, isLocale, locales } from "@/lib/i18n";
import "../globals.css";

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
  const locale = isLocale(raw) ? raw : "en";
  const { person, ui } = content[locale];
  const siteUrl = `${SITE}/${locale}`;
  const title = `${person.name} — ${person.role}`;

  return {
    metadataBase: new URL(SITE),
    title: {
      default: title,
      template: `%s — ${person.name}`,
    },
    description: ui.metaDescription,
    authors: [{ name: person.name, url: siteUrl }],
    creator: person.name,
    alternates: {
      canonical: siteUrl,
      languages: { en: `${SITE}/en`, ar: `${SITE}/ar` },
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
      className={[
        workSans.variable,
        officeCode.variable,
        thmanyahSans.variable,
        thmanyahSerifDisplay.variable,
      ].join(" ")}
    >
      <body>{children}</body>
    </html>
  );
}
