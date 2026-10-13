# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + TypeScript, deployed on Vercel. Blog posts authored as `.md`/`.mdx` files in the repo (user-confirmed choice over Astro, 2026-10-06). Animation stack locked: GSAP + ScrollTrigger + SplitText, Lenis smooth scroll, ogl for WebGL backdrops (PrismaticBurst).

## Users

Primary: recruiters, employers, and potential clients. They scan fast, judge credibility in seconds, and need a clear picture of skills, proof, and how to contact. Secondary: peers and the dev community (blog readers).

## Product Purpose

The personal portfolio of Taim Kellizy — a developer and CS student. Its job is to convert a recruiter's 30-second visit into contact/interview interest: skills and proof first, story and blog as depth. Success = inbound inquiries and a memorable, distinctive impression versus template portfolios.

## Positioning

A software developer and CS student (based in Syria) with verifiable credentials (Unblock Syria developer role, 1st place Qimma Hackathon for Arabify, Harvard CS50x, TED Translators language supervisor, EF SET C2, Microsoft Gen-AI certificate) and an authored blog — presented through award-caliber, motion-rich design that itself demonstrates front-end skill. Software development leads; translation and language work are secondary proof, not the headline.

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
Fonts (self-hosted): Outfit (variable, `public/fonts/`) with static instances for the OG card, Work Sans (variable), Office Code Pro (data/labels only).

## Evidence on Hand

- `assets/`: certificate PDFs (CS50x, EF SET, Unblock Syria contribution, others). The resume PDF (`Taimullah Resume (Unblock Syria 2026).pdf`) is present but intentionally not linked or served.
- Real facts (as of 2026-10, from the resume): MTI University B.Sc. CS & AI, GPA 3.75/4.0, expected Sep 2029; Unblock Syria — Software Developer (Shaghal browser extension with Omar Albeik: React/TypeScript, Vitest/Testing Library/Playwright, CI); Qimma Hackathon 1st place ($500) for Arabify (Arabic-readiness analyzer, open source MIT); TED Translators — Arabic Language Supervisor & Linguistic Reviewer (140+ projects, 350+ hours, Review Cup 2026 Quarterfinalist); Harvard CS50x; EF SET C2 (77/100); Microsoft Career Essentials in Generative AI; McKinsey.org Forward; 1 Million Prompters (dub.ai). Skills: Python, C++, JavaScript, TypeScript, HTML, CSS, SQL; React, Next.js, Node.js, Flask, GSAP, i18next; Vitest, Playwright, Git, Figma; Arabic native, English C2. Contact: taimkellizy@gmail.com, linkedin.com/in/taimkellizy, github.com/Taimkellizy, instagram.com/taimkellizy.
- Case-study screenshots supplied 2026-10-11 in `public/cases/` (Arabify, Shaghal, Meridian incl. logo SVG); `Plate` gradients remain the load-error fallback. All content is real and shipped.

## Product Principles

1. Proof over claims — every section shows verifiable work or skills a recruiter can check.
2. Speed and beauty are not a trade-off — animation-rich but Core-Web-Vitals-clean.
3. The design itself is a portfolio piece — the site demonstrates the front-end craft it advertises.
4. Easy authoring — a new blog post is one file drop, never a code change.
5. Distinct, not trendy — a memorable identity that doesn't read as a template.

## Accessibility & Inclusion

All motion must respect `prefers-reduced-motion`; WCAG AA contrast on text over any grain/noise treatment.
