/* Arabic locale mirror of lib/content.ts. Same shapes; ids, slugs,
   hrefs and image entries identical (anchors/keys stay aligned across
   locales); display copy is translated. */
export const person = {
  name: "تيم كليزي",
  firstName: "تيم",
  lastName: "كليزي",
  role: "مطوّر برمجيات وطالب علوم حاسوب",
  location: "سوريا",
  email: "taimkellizy@gmail.com",
  linkedin: "https://www.linkedin.com/in/taimkellizy",
  github: "https://github.com/Taimkellizy",
  instagram: "https://www.instagram.com/taimkellizy/",
};

export const skills = [
  {
    group: "اللغات",
    items: ["Python", "C++", "JavaScript", "TypeScript", "HTML", "CSS", "SQL"],
  },
  {
    group: "الأُطُر",
    items: ["React", "Next.js", "Node.js", "Flask", "GSAP", "i18next"],
  },
  {
    group: "الأدوات",
    items: [
      "Vitest",
      "Playwright",
      "Testing Library",
      "Git",
      "Figma",
      "OpenCode",
      "Antigravity",
    ],
  },
];

export const credentials = [
  {
    id: "education",
    title: "بكالوريوس علوم حاسوب وذكاء اصطناعي",
    org: "جامعة MTI",
    year: "2029",
    metric: "معدل 3.75 / 4.0",
    detail:
      "التخرج المتوقع سبتمبر 2029 — هياكل بيانات، خوارزميات، قواعد بيانات، أنظمة حاسوب.",
    /* no verifiable link — renders as a static row */
    href: "",
    mark: "verified",
  },
  {
    id: "arabify",
    title: "عرّب — المركز الأول",
    org: "هاكاثون قمّة",
    year: "2026",
    metric: "‏$500 · الأول من +120",
    detail:
      "محلّل الجاهزية العربية لتطبيقات الويب — React وPostCSS AST وتدقيق RTL/ARIA/أداء، مفتوح المصدر برخصة MIT.",
    href: "https://github.com/Taimkellizy",
    mark: "verified",
  },
  {
    id: "cs50x",
    title: "Harvard CS50x",
    org: "جامعة هارفارد",
    year: "2024",
    metric: "علوم الحاسوب",
    detail:
      "مقدمة في علوم الحاسوب — خوارزميات، هياكل بيانات، C وPython وSQL وFlask.",
    href: "https://certificates.cs50.io/a1cc4b6b-d7b6-48b4-acc3-77402de15cdf.pdf?size=letter",
    mark: "verified",
  },
  {
    id: "prompters",
    title: "مليون خبير لأوامر الذكاء الاصطناعي",
    org: "dub.ai",
    year: "2026",
    metric: "برنامج",
    detail: "برنامج تطبيقي في هندسة أوامر الذكاء الاصطناعي.",
    href: "https://omp.dub.ai/certificate/m9emGCV1fE9E?locale=en",
    mark: "verified",
  },
  {
    id: "msft",
    title: "الذكاء الاصطناعي التوليدي",
    org: "مايكروسوفت × LinkedIn",
    year: "2025",
    metric: "أساسيات المسار الوظيفي",
    detail: "مفاهيم الذكاء الاصطناعي الأساسية وسير عمل التوليد التطبيقية.",
    href: "https://www.linkedin.com/learning/certificates/23d0bf8d06bddbd9634f0cfffa5b07ed79cbaeebab084a755bb2f032741c7b53",
    mark: "verified",
  },
  {
    id: "mckinsey",
    title: "McKinsey Forward",
    org: "ماكنزي وشركاه",
    year: "2025",
    metric: "برنامج",
    detail: "حل المشكلات، التفكير الهيكلي، والفعالية المهنية.",
    href: "https://www.credly.com/badges/d271ec72-79c6-48fb-bd08-fc515524f44a/public_url",
    mark: "verified",
  },
  {
    id: "efset",
    title: "EF SET للإنجليزية",
    org: "إجادة (C2)",
    year: "2025",
    metric: "77 / 100",
    detail: "كفاءة شبه أصلية في الإنجليزية، بشهادة C2.",
    href: "https://cert.efset.org/e8uY2e",
    mark: "verified",
  },
  {
    id: "ted",
    title: "مترجم TED",
    org: "مشرف لغوي",
    year: "2024–26",
    metric: "+140 مشروعًا",
    detail:
      "أكثر من 140 مشروعًا و350 ساعة ترجمة وتدقيق TED/TEDx إلى العربية. مراجع ومشرف لغوي؛ ربع نهائي Review Cup 2026 (الأول 30 من 106).",
    href: "https://www.credential.net/0286fbbb-391f-4a5e-a6cd-9a9576ac481b",
    mark: "verified",
  },
];

/* Roles — kept apart from certificates, since a job is not a credential. */
export const experience = [
  {
    id: "unblock-dev",
    title: "مطوّر برمجيات",
    org: "سوريا بدون حدود",
    period: "2026 — الآن",
    bullets: [
      "إضافة شغال للمتصفح بـ React وTypeScript — اختبار الخدمة، الإبلاغ، التصحيحات، لقطات الشاشة، تكامل واجهات API، و التعريب والـ RTL.",
      "تغطية اختبارات المكوّنات والاختبارات الشاملة بـ Vitest وTesting Library وPlaywright، مدمجة في CI.",
      "فحص الأخطاء وتحقيقات تكامل واجهات API، وتصميم التنفيذ، والتعاون في القرارات التقنية.",
      "الجاهزية للإصدار والتحضير لتطوير المشروع مفتوح المصدر للعموم.",
    ],
    stack: ["React", "TypeScript", "Vitest", "Playwright", "CI"],
    credit: "بالتعاون مع Omar Albeik",
    href: "https://github.com/unblocksyria/shaghal-extension",
  },
];

/* Real projects — image entries unchanged (same files); display copy
   translated. All comments from en version apply. */
export const projects = [
  {
    id: "arabify",
    title: "عرّب",
    kind: "أدوات",
    year: "2026",
    stack: ["React", "TypeScript", "PostCSS"],
    note: "محلّل الجاهزية العربية لتطبيقات الويب — المركز الأول، هاكاثون قمّة.",
    href: "https://github.com/Taimkellizy",
    images: [
      {
        src: "/cases/arabify-logo-4.svg",
        ratio: "landscape",
        fit: "cover",
        alt: "لوجو عرّب",
      },
      {
        src: "/cases/arabify-report.jpg",
        ratio: "banner",
        fit: "cover",
        alt: "صفحة عرّب الرئيسية — RTL وSEO عربي، بُساطة",
        width: 1280,
        height: 593,
      },
    ],
  },
  {
    id: "shaghal",
    title: "شغال",
    kind: "إضافة متصفح",
    year: "2026",
    stack: ["React", "TypeScript", "Playwright"],
    note: "إضافة متصفح من سوريا بدون حدود، بالتعاون مع Omar Albeik.",
    href: "https://github.com/unblocksyria/shaghal-extension",
    images: [
      {
        src: "/cases/Shaghal logo.svg",
        ratio: "landscape",
        fit: "contain",
        alt: "لوجو شغال",
      },
      {
        src: "/cases/shaghal-hero.webp",
        ratio: "landscape",
        fit: "cover",
        alt: "صفحة شغال الرئيسية — هل يعمل هذا الموقع من سوريا؟",
        width: 1800,
        height: 1281,
      },
    ],
  },
  {
    id: "meridian",
    title: "Meridian",
    kind: "أتمتة التعريب",
    year: "2026",
    stack: ["Node.js", "Babel", "PostCSS"],
    note: "حزمة أتمتة i18n مفتوحة المصدر لReact — تستخرج النصوص الصرّية، وتترجمها عبر واجهات محلية أو سحابية (LibreTranslate وGoogle وDeepL)، وتضبط i18next، وتفرض CSS منطقيًا جاهزًا للـ RTL.",
    href: "https://github.com/Taimkellizy/meridian-suite",
    images: [
      {
        src: "/cases/Meridian_Full_Logo_no_bg_full_color.svg",
        ratio: "banner",
        fit: "contain",
        alt: "Meridian لوجو",
      },
      {
        src: "/cases/meridian-report.webp",
        ratio: "banner",
        fit: "cover",
        alt: "Meridian CLI يضبط i18next وترجم تطبيقًا إلى العربية",
        width: 1544,
        height: 792,
      },
    ],
  },
];

export const posts = [
  {
    slug: "on-learning-c-twice",
    title: "عن تعلّم C مرتين",
    date: "2025-11-02",
    excerpt: "ما أحسنَه CS50x في المؤشرات، وما أخذ جولة ثانية ليهبَ بفعلًا.",
    tag: "ملاحظات",
  },
  {
    slug: "translating-at-scale",
    title: "الترجمة على نطاق واسع",
    date: "2025-09-14",
    excerpt:
      "850 دقيقة من محادثات TED علّمتني عن جودة المنتجات أكثر من أي ورقة مواصفات.",
    tag: "مقالة",
  },
  {
    slug: "grain-dither-and-taste",
    title: "الحُبيبات، وتفريق التدرج، والذوق",
    date: "2025-07-30",
    excerpt: "سطح الواجهة جزء من هندستها، لا زخرفة فوقها.",
    tag: "تصميم",
  },
];

export const MENU_LINKS = [
  { label: "الأعمال", href: "#ea-work" },
  { label: "الخبرة", href: "#ea-experience" },
  { label: "الشهادات", href: "#ea-credentials" },
  { label: "الكتابة", href: "#ea-writing" },
  { label: "تواصل", href: "#ea-contact" },
];

export const FOOTER_COLUMNS = [
  {
    title: "الخريطة",
    links: [
      { label: "الرئيسية", href: "#ea-top", active: true },
      { label: "الأعمال", href: "#ea-work" },
      { label: "الخبرة", href: "#ea-experience" },
      { label: "الشهادات", href: "#ea-credentials" },
      { label: "الكتابة", href: "#ea-writing" },
    ],
  },
  {
    title: "التواصل الاجتماعي",
    links: [
      { label: "GitHub", href: "https://github.com/Taimkellizy" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/taimkellizy" },
      { label: "Instagram", href: "https://www.instagram.com/taimkellizy/" },
    ],
  },
  {
    title: "البريد",
    links: [
      {
        label: "taimkellizy@gmail.com",
        href: "mailto:taimkellizy@gmail.com",
      },
    ],
  },
];

export const ui = {
  heroWord: "تيم",
  heroBio:
    "أنا تيم كليزي — مطوّر برمجيات وطالب علوم حاسوب في سوريا، أطوّر تطبيقات ويب وإضافات متصفح بـ React وTypeScript.",
  menuOpen: "افتح القائمة",
  menuClose: "أغلق القائمة",
  menuLabel: "قائمة الموقع",
  menuNavLabel: "تنقّل الموقع",
  menuLinks: MENU_LINKS,
  getInTouch: "تواصل معي",
  availableForWork: "متاح للعمل",
  socialLabels: { github: "GitHub", linkedin: "LinkedIn", instagram: "Instagram" },
  skipToContent: "تخطَّ إلى المحتوى",
  scrollHint: "استكشف بالتمرير",
  aboutLabel: "نبذة",
  aboutText: `علوم الحاسوب والذكاء الاصطناعي في جامعة MTI — بمعدل 3.75 GPA. أطوّر شغال، إضافة
المتصفح لسوريا بدون حدود، بـ Vitest وPlaywright وCI؛ و عرّب، الذي نال المركز الأول في هاكاثون قمّة. بعيداً عن لوحة المفاتيح، أكثر من 140
مشروع TED وTEDx تُرجم ودُقّق إلى العربية — أكثر من 350 ساعة. EF SET C2.
البرهان قبل الادّعاء: كل ما يلي قابل للتحقق.`,
  skillsTitle: "المهارات",
  skillsCount: "التقنيات",
  casesTitle: "الأعمال",
  xpTitle: "الخبرة",
  xpCount: "الأدوار · 01",
  githubLink: "GitHub",
  credentialsTitle: "الشهادات",
  credentialsCount: "موثّقة",
  writingTitle: "الكتابة",
  writingCount: "سجل",
  blogHome: "الرئيسية",
  blogAllPosts: "كل المقالات",
  blogContents: "المحتويات",
  blogPrev: "السابقة",
  blogNext: "التالية",
  blogEmpty: "لا شيء منشورًا بعد.",
  blogUpdated: "محدَّثة",
  copyCode: "نسخ الكود",
  copied: "تم النسخ",
  copyFailed: "تعذّر النسخ",
  allTopics: "الكل",
  topicsLabel: "الموضوعات",
  minRead: "دقائق قراءة",
  copyAsMarkdown: "نسخ بصيغة Markdown",
  viewAsMarkdown: "عرض بصيغة Markdown",
  copyLink: "نسخ الرابط",
  smallerText: "تصغير النص",
  largerText: "تكبير النص",
  readingSize: "حجم النص",
  footerColumns: FOOTER_COLUMNS,
  backToTop: "عودة للأعلى",
  copyright: `© 2026 تيم كليزي`,
  metaDescription:
    "ملف تيم كليزي، مطوّر برمجيات وطالب علوم حاسوب — أعمال مختارة، شهادات، وكتابة.",
};
