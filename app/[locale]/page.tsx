import { ConceptLab } from "@/components/concept-lab";
import { writingRowsFor } from "@/lib/blog";
import { isLocale, locales, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? (raw as Locale) : "en";
  const writingRows = await writingRowsFor(locale);

  /* Person + WebSite JSON-LD comes from the locale layout's @graph. */
  return <ConceptLab locale={locale} writingRows={writingRows} />;
}
