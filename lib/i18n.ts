import {
  credentials as credentialsEn,
  experience as experienceEn,
  person as personEn,
  projects as projectsEn,
  skills as skillsEn,
  ui as uiEn,
} from "./content";
import {
  credentials as credentialsAr,
  experience as experienceAr,
  person as personAr,
  projects as projectsAr,
  skills as skillsAr,
  ui as uiAr,
} from "./content-ar";
import type { FOOTER_COLUMNS, MENU_LINKS } from "./content";

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function dirOf(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

/* Cross-locale display contract — TS enforces the ar mirror structurally. */
export interface Ui {
  heroWord: string;
  heroBio: string;
  menuOpen: string;
  menuClose: string;
  menuLabel: string;
  menuNavLabel: string;
  menuLinks: typeof MENU_LINKS;
  getInTouch: string;
  availableForWork: string;
  socialLabels: { github: string; linkedin: string; instagram: string };
  skipToContent: string;
  scrollHint: string;
  aboutLabel: string;
  aboutText: string;
  skillsTitle: string;
  skillsCount: string;
  casesTitle: string;
  xpTitle: string;
  xpCount: string;
  githubLink: string;
  credentialsTitle: string;
  credentialsCount: string;
  writingTitle: string;
  writingCount: string;
  blogHome: string;
  blogAllPosts: string;
  blogContents: string;
  blogPrev: string;
  blogNext: string;
  blogEmpty: string;
  blogUpdated: string;
  copyCode: string;
  copied: string;
  copyFailed: string;
  allTopics: string;
  topicsLabel: string;
  minRead: string;
  blogSearchPlaceholder: string;
  blogHitsTitle: string;
  blogHitsCount: string;
  blogSearching: string;
  blogNoTextMatches: string;
  blogNoQueryMatches: string;
  findInPost: string;
  searchPrev: string;
  searchNext: string;
  searchClear: string;
  searchNoMatches: string;
  copyAsMarkdown: string;
  viewAsMarkdown: string;
  copyLink: string;
  smallerText: string;
  largerText: string;
  readingSize: string;
  footerColumns: typeof FOOTER_COLUMNS;
  backToTop: string;
  copyright: string;
  metaDescription: string;
  blogMetaTitle: string;
  blogMetaDescription: string;
}

export interface LocaleContent {
  person: typeof personEn;
  skills: typeof skillsEn;
  credentials: typeof credentialsEn;
  experience: typeof experienceEn;
  projects: typeof projectsEn;
  ui: Ui;
}

/* Typed record keyed by locale — TS enforces every key carries a full
   locale content object shaped exactly like the en export. */
export const content: Record<Locale, LocaleContent> = {
  en: {
    person: personEn,
    skills: skillsEn,
    credentials: credentialsEn,
    experience: experienceEn,
    projects: projectsEn,
    ui: uiEn,
  },
  ar: {
    person: personAr,
    skills: skillsAr,
    credentials: credentialsAr,
    experience: experienceAr,
    projects: projectsAr,
    ui: uiAr,
  },
};
