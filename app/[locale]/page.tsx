import { ConceptLab } from "@/components/concept-lab";
import { content, isLocale, locales } from "@/lib/i18n";

const SITE = "https://taimkellizy-portfolio.vercel.app";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "en";
  const dict = content[locale];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: dict.person.name,
    jobTitle: dict.person.role,
    url: `${SITE}/${locale}`,
    email: `mailto:${dict.person.email}`,
    homeLocation: { "@type": "Place", name: dict.person.location },
    sameAs: [dict.person.github, dict.person.linkedin, dict.person.instagram],
    knowsAbout: dict.skills.flatMap((g) => g.items),
  };

  return (
    <>
      <script
        type="application/ld+json"
        /* `</` escaping keeps the embedded JSON script-safe */
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ConceptLab locale={locale} />
    </>
  );
}
