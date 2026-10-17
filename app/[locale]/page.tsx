import { ConceptLab } from "@/components/concept-lab";
import { writingRowsFor } from "@/lib/blog";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { graph, jsonLdScript, profilePageNode } from "@/lib/seo";

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

  /* Person + WebSite JSON-LD comes from the locale layout's @graph; the
     home page adds the ProfilePage wrapper (mainEntity = that same
     Person) so Google can treat it as a creator profile. */
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(graph(profilePageNode(locale))),
        }}
      />
      <ConceptLab locale={locale} writingRows={writingRows} />
    </>
  );
}
