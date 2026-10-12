# AGENTS.md

Entry point for AI agents working on this repo. Read this first.

## What this is

Taim Kellizy's personal portfolio — Next.js 16 (App Router) + TypeScript, one live page built as a design "concept" (`editorial-var-a`, class prefix `ea-`) with GSAP motion. Deployed on Vercel; production on `main`, design phase archived on `design/exploration`.

## Commands

- `npm run dev` — dev server on localhost:3000
- `npm run build` — production build, must pass
- `npx tsc --noEmit` — typecheck, must pass

## Map

- `app/` — Next router; `page.tsx` renders ConceptLab only
- `components/concept-lab.tsx` — mounts loading screen + the live concept
- `concepts/editorial-var-a.tsx` / `.css` — the entire site
- `components/prismatic-burst.*` — WebGL chromatic backdrop (ogl shader, React Bits origin)
- `components/lattice-loader*` — loading screen (React Bits origin)
- `components/plate.tsx`, `star-glyph.tsx` — gradient placeholder plate, star glyph
- `lib/content.ts` — ALL content: person, skills, credentials, experience, projects, posts. Real data.
- `lib/motion.ts` — GSAP/ScrollTrigger exports, Lenis hook, `usePrefersReducedMotion`
- `DESIGN.md` — design system (tokens, type, motion inventory)
- `GUIDELINES.md` — conventions and traps
- `PRODUCT.md` — positioning and product principles
- `assets/` — certificate PDFs (tracked). The resume PDF is intentionally not linked or served.

## Current state / pending

- Page order: hero → bio → skills → cases → experience → credentials → writing → footer
- Experience is a featured role dossier (`ea-xp`), one entry per role; skills are hairline groups (`ea-skill-row`); rows (`ea-row`) carry credentials/writing only
- Cases slider renders one plate per entry in `projects[].images` (two per project: hero + detail/brand). Screenshots are shipped in `public/cases/` (Arabify, Shaghal, Meridian + logo SVG); the `Plate` gradient + kind label remains the load-error fallback. Image entries carry `src`/`ratio`/`fit`/`alt`
- Mobile (≤900px) is explicitly out of scope: static stacked layout, no slider, no hero backdrop
- Content hierarchy is software-dev-first; keep it that way (experience ≠ certificates)

## Hard-won gotchas — do not re-break

1. Never rewrite whole files with PowerShell `Get-Content | Set-Content`; it re-encodes UTF-8 as cp1252 → mojibake (`â€"`, `Â©`). Use UTF-8-safe edit tools.
2. GSAP SplitText (`mask`) only on pure text containers. Never on flex/grid layout containers (footer columns, section headers, row links) — it shatters layout into fake "lines". Layout blocks use `data-reveal-fade` (opacity + y) instead.
3. The cursor bubble is `mix-blend-mode: difference`; `.ea` has `isolation: isolate` and cursor-driven tweens set `force3D: false`. Don't add `will-change`/force3D to nearby text or the inversion drops out of the blend backdrop.
4. `PrismaticBurst` perf is tuned for weak machines: render scale 0.65 (dpr cap 1), shader steps 24, adaptive 2–4 rAF cadence, IntersectionObserver pause. Don't raise the defaults.
5. React Bits components: take CSS/plain variants only (no Tailwind here); add deps explicitly (`ogl` already present).
6. Menu hover is zone-based (word snaps to scale 3 inside its band, neighbours pushed away). Band centres are measured untransformed on mouseenter — don't "simplify" it back into a continuous falloff (it wiggles).
7. `credentials` = verifiable certificates/education; `experience` = roles. Never mix.
8. All visible copy is English only (no Arabic script) for now.

## Verify before committing

`npx tsc --noEmit && npm run build`, then a dev-server smoke test (HTTP 200 + expected strings in HTML).
