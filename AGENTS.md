# AGENTS.md

Entry point for AI agents working on this repo. Read this first.

## What this is

Taim Kellizy's personal portfolio — Next.js 16 (App Router) + TypeScript, one live page built as a design "concept" (`editorial-var-a`, class prefix `ea-`) with GSAP motion. Deployed on Vercel; production on `main`, design phase archived on `design/exploration`.

## Commands

- `npm run dev` — dev server on localhost:3000
- `npm run build` — production build, must pass
- `npm run lint` — ESLint (flat config, `eslint-config-next`), must stay error-free
- `npm run typecheck` — `tsc --noEmit`, must pass

## Map

- `app/` — Next router; `page.tsx` renders ConceptLab only
- `components/concept-lab.tsx` — mounts loading screen + the live concept
- `concepts/editorial-var-a.tsx` — composition root: hook wiring + page order
- `concepts/editorial-var-a/` — one hook file per motion system
  (`use-menu-dialog`, `use-entrance-reveals`, `use-hero-cursor`,
  `use-magnetic-wordmark`, `use-menu-spectrum`, `use-variable-weight`,
  `use-cases-slider`), `sections.tsx` (all section markup), `shared.ts`
  (constants, `newTabProps`, `isTouchLayout`); CSS stays one file at
  `concepts/editorial-var-a.css`
- `components/prismatic-burst.*` — WebGL chromatic backdrop (ogl shader, React Bits origin)
- `components/lattice-loader*` — loading screen (React Bits origin)
- `components/plate.tsx`, `star-glyph.tsx` — gradient placeholder plate, star glyph
- `lib/content.ts` — ALL content: person, skills, credentials, experience, projects, posts. Real data.
- `lib/motion.ts` — GSAP/ScrollTrigger exports, Lenis hook, `usePrefersReducedMotion`, `useMediaQuery`
- `DESIGN.md` — design system (tokens, type, motion inventory)
- `GUIDELINES.md` — conventions and traps
- `PRODUCT.md` — positioning and product principles
- `assets/` — certificate PDFs (tracked). The resume PDF is intentionally not linked or served.
- `PROD-PLAN.md` — temp handoff doc: prod-readiness phases, status, decisions, verification recipe. Read it first for multi-phase work; delete when all phases ship.

## Current state / pending

- Page order: hero → bio → skills → cases → experience → credentials → writing → footer
- Experience is a featured role dossier (`ea-xp`), one entry per role; skills are hairline groups (`ea-skill-row`); rows (`ea-row`) carry credentials/writing only
- Cases slider renders one plate per entry in `projects[].images` (two per project: hero + detail/brand). Screenshots are shipped in `public/cases/` (Arabify, Shaghal, Meridian + logo SVG); the `Plate` gradient + kind label remains the load-error fallback. Image entries carry `src`/`ratio`/`fit`/`alt`
- Mobile (≤900px) is in scope (phase 1 + polish done): hero = bio top + vertical "taim" up the right edge (`min(72vw, 32svh)`, scroll link bottom-left), per-case caption cards instead of the sticky name list, rows stacked with ALL fields visible ≤620px, menu = bottom-right FAB, footer word is full-bleed (`font-size: 52vw`) over a reserved bottom band — phones only, desktop footer keeps the original word size + absolute base row. No slider ≤900px. `PrismaticBurst` mounts at all widths with a lite tier on ≤900 (`renderScale` 0.55) — keep those numbers.
- Content hierarchy is software-dev-first; keep it that way (experience ≠ certificates)

## Hard-won gotchas — do not re-break

1. Never rewrite whole files with PowerShell `Get-Content | Set-Content`; it re-encodes UTF-8 as cp1252 → mojibake (`â€"`, `Â©`). Use UTF-8-safe edit tools.
2. GSAP SplitText (`mask`) only on pure text containers. Never on flex/grid layout containers (footer columns, section headers, row links) — it shatters layout into fake "lines". Layout blocks use `data-reveal-fade` (opacity + y) instead.
3. Entrance/reveal tweens use `gsap.fromTo` with explicit end values — never `gsap.from`. Under React, `from` can capture its end state after the from-state is applied, freezing letters/links mid-entrance (seen: letters stuck at `yPercent: 55`, links at `opacity: 0`).
4. The cursor bubble is `mix-blend-mode: difference`; `.ea` has `isolation: isolate` and cursor-driven tweens set `force3D: false`. Don't add `will-change`/force3D to nearby text or the inversion drops out of the blend backdrop.
5. `PrismaticBurst` perf is tuned for weak machines: render scale 0.65 (dpr cap 1), shader steps 24, adaptive 2–4 rAF cadence, IntersectionObserver pause. Don't raise the defaults. Phones use the lite tier (`renderScale` 0.55, read at mount — gate mounting on `useMediaQuery(...)` `!== null`).
6. React Bits components: take CSS/plain variants only (no Tailwind here); add deps explicitly (`ogl` already present).
7. Menu hover is zone-based (word snaps to scale 3 inside its band, neighbours pushed away). Band centres are measured untransformed on mouseenter — don't "simplify" it back into a continuous falloff (it wiggles).
8. `credentials` = verifiable certificates/education; `experience` = roles. Never mix.
9. All visible copy is English only (no Arabic script) for now.
10. The global reduced-motion `transition-duration: 0.01ms !important` makes any element with the initial `transition-property: all` transition `visibility` — computed visibility goes stale on descendants and `focus()` silently fails. The menu dialog relies on `.ea-menu-panel, .ea-menu-panel * { transition: none !important }` under reduced motion + a double-rAF focus retry; don't remove either.
11. `next/og` (OG/apple-icon image routes) cannot parse variable-font `fvar` tables — it must use the static Outfit TTFs in `public/fonts/static/` (Medium/SemiBold/ExtraBold); don't swap `Outfit-Variable.ttf` back in.

## Verify before committing

`npx tsc --noEmit && npm run build`, then a dev-server smoke test (HTTP 200 + expected strings in HTML).
