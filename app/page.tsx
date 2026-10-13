import { ConceptLab } from "@/components/concept-lab";
import { person, skills } from "@/lib/content";

const SITE = "https://taimkellizy-portfolio.vercel.app";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  jobTitle: person.role,
  url: SITE,
  email: `mailto:${person.email}`,
  homeLocation: { "@type": "Place", name: "Syria" },
  sameAs: [person.github, person.linkedin, person.instagram],
  knowsAbout: skills.flatMap((g) => g.items),
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ConceptLab />
    </>
  );
}
