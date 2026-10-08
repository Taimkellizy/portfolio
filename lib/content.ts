export const person = {
  name: "Taim Kellizy",
  firstName: "Taim",
  lastName: "Kellizy",
  role: "Software Developer & CS Student",
  location: "Based in Syria",
  email: "taimkellizy@gmail.com",
  linkedin: "https://www.linkedin.com/in/taimkellizy",
  github: "https://github.com/Taimkellizy",
  instagram: "https://www.instagram.com/taimkellizy/",
};

export const skills = [
  {
    group: "Languages",
    items: ["Python", "C++", "JavaScript", "TypeScript", "HTML", "CSS", "SQL"],
  },
  {
    group: "Frameworks",
    items: ["React", "Next.js", "Node.js", "Flask", "GSAP", "i18next"],
  },
  {
    group: "Tooling",
    items: ["Vitest", "Playwright", "Testing Library", "Git", "Figma"],
  },
];

export const credentials = [
  {
    id: "education",
    title: "B.Sc. Computer Science & AI",
    org: "MTI University",
    year: "2029",
    metric: "GPA 3.75 / 4.0",
    detail:
      "Expected September 2029. Data Structures, Algorithms, Databases, Computer Systems.",
    href: "#",
    mark: "verified",
  },
  {
    id: "arabify",
    title: "Arabify — 1st Place",
    org: "Qimma Hackathon",
    year: "2026",
    metric: "$500 · 1st of 120+",
    detail:
      "Arabic-readiness analyzer for web apps — React, PostCSS AST parsing, RTL/ARIA/performance audits, open source under MIT.",
    href: "https://github.com/Taimkellizy",
    mark: "verified",
  },
  {
    id: "cs50x",
    title: "Harvard CS50x",
    org: "Harvard University",
    year: "2024",
    metric: "Computer Science",
    detail:
      "Introduction to computer science — algorithms, data structures, C, Python, SQL, Flask.",
    href: "https://certificates.cs50.io/a1cc4b6b-d7b6-48b4-acc3-77402de15cdf.pdf?size=letter",
    mark: "verified",
  },
  {
    id: "prompters",
    title: "1 Million Prompters",
    org: "dub.ai",
    year: "2026",
    metric: "Program",
    detail: "Applied AI prompt engineering program.",
    href: "https://omp.dub.ai/certificate/m9emGCV1fE9E?locale=en",
    mark: "verified",
  },
  {
    id: "msft",
    title: "Generative AI",
    org: "Microsoft × LinkedIn",
    year: "2025",
    metric: "Career Essentials",
    detail: "Core AI concepts and applied generative AI workflows.",
    href: "https://www.linkedin.com/learning/certificates/23d0bf8d06bddbd9634f0cfffa5b07ed79cbaeebab084a755bb2f032741c7b53",
    mark: "verified",
  },
  {
    id: "mckinsey",
    title: "McKinsey Forward",
    org: "McKinsey & Company",
    year: "2025",
    metric: "Program",
    detail: "Problem solving, structured thinking, and professional effectiveness.",
    href: "https://www.credly.com/badges/d271ec72-79c6-48fb-bd08-fc515524f44a/public_url",
    mark: "verified",
  },
  {
    id: "efset",
    title: "EF SET English",
    org: "C2 Proficient",
    year: "2025",
    metric: "77 / 100",
    detail: "Near-native English proficiency, certified C2.",
    href: "https://cert.efset.org/e8uY2e",
    mark: "verified",
  },
  {
    id: "ted",
    title: "TED Translators",
    org: "Language Supervisor",
    year: "2024–26",
    metric: "140+ projects",
    detail:
      "140+ projects and 350+ hours of TED/TEDx translated to Arabic. Reviewer and language supervisor; Quarterfinalist, Review Cup 2026 (top 30 of 106).",
    href: "https://www.credential.net/0286fbbb-391f-4a5e-a6cd-9a9576ac481b",
    mark: "verified",
  },
];

/* Roles — kept apart from certificates, since a job is not a credential. */
export const experience = [
  {
    id: "unblock-dev",
    title: "Software Developer",
    org: "Unblock Syria",
    year: "2026–",
    metric: "Extension · Tests · CI",
    detail:
      "Contribute to Unblock Syria's web and browser-based tools, working directly with the project team on product features, reliability, and tester workflows. Develop and maintain the Shaghal browser extension using React and TypeScript — service testing, reporting, corrections, screenshots, API integration, and Arabic/RTL localization. Build component and end-to-end test coverage with Vitest, Testing Library, and Playwright, and integrate testing into CI. Investigate bugs and API integration issues, design implementation approaches, and collaborate on technical decisions and product improvements. Contribute to release readiness and prepare the project for public open-source development. Built with Omar Albeik.",
    href: "https://github.com/unblocksyria/shaghal-extension",
  },
];

/* Real projects — `image` paths resolve under public/cases/ and render
   on top of the Plate fallback until screenshots are dropped in. */
export const projects = [
  {
    id: "arabify",
    title: "Arabify",
    kind: "Tooling",
    year: "2026",
    stack: ["React", "TypeScript", "PostCSS"],
    note: "Arabic-readiness analyzer for web apps — 1st place, Qimma Hackathon.",
    image: "",
  },
  {
    id: "shaghal",
    title: "Shaghal",
    kind: "Browser Extension",
    year: "2026",
    stack: ["React", "TypeScript", "Playwright"],
    note: "Unblock Syria browser extension, built with Omar Albeik.",
    image: "",
  },
  {
    id: "portfolio",
    title: "This Portfolio",
    kind: "Site",
    year: "2026",
    stack: ["Next.js", "GSAP", "WebGL"],
    note: "Editorial concept with variable-font motion and shader backdrops.",
    image: "",
  },
];

export const posts = [
  {
    slug: "on-learning-c-twice",
    title: "On Learning C Twice",
    date: "2025-11-02",
    excerpt:
      "What CS50x got right about pointers, and what took a second pass to actually understand.",
    tag: "Notes",
  },
  {
    slug: "translating-at-scale",
    title: "Translating at Scale",
    date: "2025-09-14",
    excerpt:
      "850 minutes of TED talks taught me more about product quality than any spec sheet.",
    tag: "Essay",
  },
  {
    slug: "grain-dither-and-taste",
    title: "Grain, Dither, and Taste",
    date: "2025-07-30",
    excerpt:
      "Why the surface of an interface is part of its engineering, not decoration on top.",
    tag: "Design",
  },
];
