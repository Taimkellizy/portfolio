# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + TypeScript, deployed on Vercel. Blog posts authored as `.md`/`.mdx` files in the repo (user-confirmed choice over Astro, 2026-10-06). Animation stack to be confirmed at design lock (GSAP + Lenis is the leading candidate from research).

## Users

Primary: recruiters, employers, and potential clients. They scan fast, judge credibility in seconds, and need a clear picture of skills, proof, and how to contact. Secondary: peers and the dev community (blog readers).

## Product Purpose

The personal portfolio of Taim Kellizy — a developer and CS student. Its job is to convert a recruiter's 30-second visit into contact/interview interest: skills and proof first, story and blog as depth. Success = inbound inquiries and a memorable, distinctive impression versus template portfolios.

## Positioning

A young developer with verifiable credentials (Harvard CS50x, TED Translators language supervisor, EF SET C2, Microsoft Gen-AI certificate) and an authored blog — presented through award-caliber, motion-rich design that itself demonstrates front-end skill.

## Operating Context

- Blog authoring: drop a `.md`/`.mdx` file with frontmatter into a posts directory; it appears on the blog index and gets its own page. Git-based workflow, no CMS.
- Site structure: header, body sections, footer, dynamic blog pages.
- All content, images, certificates, and text are NEW — nothing carries over from the old portfolio except factual bio/certificate references.

## Capabilities and Constraints

- Header / body / footer layout; dynamic blog fed by `.md`/`.mdx` files.
- SEO and performance are top priorities (Core Web Vitals, metadata, sitemap, OG images).
- Animation is a top priority and must be a unique experience on both PC and mobile; must respect `prefers-reduced-motion`.
- Color palette: dark themed (pinned 2026-10-06); hue world selected via 5 concept previews.

## Brand Commitments

Taste keywords: dither, grainy gradient, modern, clean, minimalistic, professional.
Taste references analyzed 2026-10-06 — authoritative breakdown in `taste-notes.md` (Per Appelgren editorial, OXALEY dark agency, bold grainy folk/riso, Blok monocolor Swiss, Y2K grainy starburst).
Hard pins (2026-10-06): DARK theme only (no white backgrounds); 5 concept previews before production; motion signature = floating rotated photo drift + grainy gradient scrub combined; unique experience on PC and mobile; `prefers-reduced-motion` respected.
Fonts (user-provided, self-hosted in `fonts/`): Array, CabinetGrotesk, ChunkFive, YoungSerif, NimbusSans, Office Code Pro (data/labels only), Outfit, Work Sans.

## Evidence on Hand

- Old portfolio (cloned at `old-portfolio/`): factual baseline for bio, skills, certificate links, contact links. All visual assets replaced.
- `assets/`: new headshot 2026 (white BG PNG), Profile.pdf (CV), CS50x.pdf, EF SET Certificate.pdf, McKinsey Forward Program.png, Certificate of Contribution — Unblock Syria, taimullah-kellizy-certificate (1).pdf.
- Real facts available: Harvard CS50x; TED Translators Language Supervisor (850+ min translated, 17M+ views); EF SET C2 (77/100); Microsoft Career Essentials in Generative AI; McKinsey Forward Program; Unblock Syria contribution. Skills: C, JavaScript, Python, React, Flask, Bootstrap, SQLite, HTML/CSS. Contact: taimkellizy@gmail.com, linkedin.com/in/taimkellizy, instagram.com/taimkellizy.
- Absences that must not be fabricated: project list/write-ups/screenshots (user reports ready but not yet supplied), new bio copy (facts exist, wording is to be authored), blog post drafts, domain name, favicon/logo. Synthetic concept content is labeled and listed for replacement.

## Product Principles

1. Proof over claims — every section shows verifiable work or skills a recruiter can check.
2. Speed and beauty are not a trade-off — animation-rich but Core-Web-Vitals-clean.
3. The design itself is a portfolio piece — the site demonstrates the front-end craft it advertises.
4. Easy authoring — a new blog post is one file drop, never a code change.
5. Distinct, not trendy — a memorable identity that doesn't read as a template.

## Accessibility & Inclusion

All motion must respect `prefers-reduced-motion`; WCAG AA contrast on text over any grain/noise treatment.
