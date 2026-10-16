# Development Guidelines

## Stack

- **Next.js 16** (App Router) + TypeScript
- **GSAP 3** + ScrollTrigger + SplitText (animation)
- **Lenis** (smooth scroll, driven from GSAP ticker)
- **ogl** (WebGL shaders — PrismaticBurst backdrop)
- **React Bits** (origin of PrismaticBurst + LatticeLoader; use CSS/plain variants only — this repo has no Tailwind — and declare deps explicitly)
- **Lucide React** (icons)
- **Vercel** (deployment target)

## Project structure

```
app/            Next.js router (layout, page, metadata routes, fonts, globals)
components/     ConceptLab, LatticeLoader(+screen), Plate, StarGlyph, PrismaticBurst
concepts/       Design concept — `editorial-var-a.tsx` composition root,
                `editorial-var-a/` (one hook per motion system, sections.tsx, shared.ts, one CSS file)
lib/            Content data (content.ts), motion utilities (motion.ts)
public/fonts/   Outfit variable + `static/` instances (OG card — next/og can't parse fvar)
public/cases/   Case-study images (WebP/JPG/SVG)
scripts/        One-off asset tooling (convert-cases-webp.cjs)
assets/         Certificate PDFs (tracked); resume PDF present but intentionally unserved
AGENTS.md       Agent entry point — read this first
LICENSE         GPL-3.0
```

## Conventions

### CSS
- Class prefix: `ea-` (editorial-var-a)
- CSS custom properties for tokens (colors, spacing, easing)
- No CSS-in-JS; plain CSS files imported in components
- `@font-face` declarations in component CSS (not globals)
- Respect `prefers-reduced-motion` — gate all GSAP animations

### TypeScript
- `"use client"` on all interactive components
- Named exports (no default exports for components)
- Strict mode; `npm run typecheck` (`tsc --noEmit`) and `npm run lint`
  (ESLint flat config, `eslint-config-next` core-web-vitals) must stay clean

### Animation
- Use `gsap.context()` for scoped animations (auto-cleanup on unmount)
- `usePrefersReducedMotion()` hook gates all motion; WebGL and the loading screen skip rendering entirely
- Lenis instance exposed via `scrollToTop()` from `lib/motion.ts`
- No `will-change` on elements using `mix-blend-mode` (creates stacking context)
- SplitText (`mask`) targets **text containers only** — never flex/grid layout containers; layout blocks get `data-reveal-fade`
- GSAP child tweens near the cursor bubble: set `force3D: false` (composited layers can drop out of a difference-blend backdrop)

### Content
- All data in `lib/content.ts` (person, skills, credentials, experience, projects, posts) — all **real**
- `credentials` = verifiable certificates/education; `experience` = roles; never mix them
- Copy is English only (no Arabic script) for now
- Case-study images go in `public/cases/` and are referenced via `images` on a project (entries carry `src`/`ratio`/`fit`/`alt`; raster shots also carry intrinsic `width`/`height` and ship as tuned WebP — rerun `scripts/convert-cases-webp.cjs` after edits; two plates per project; Plate gradient is fallback only)
- Never fabricate facts; only use verified credentials

## Workflow

1. `npm run dev` — local development
2. `npm run lint` + `npm run typecheck` — must stay clean
3. `npm run build` — production build (must pass)
4. Norm is a quick prod-server smoke test + screenshot sweep before committing (see AGENTS.md)
5. `main` is production (Vercel deploys on push)

## Design process

- `taste-notes.md` documents the design DNA
- `DESIGN.md` is the implementation reference
- Always verify against reference sites pixel-for-pixel when matching layouts

## Known traps

- **Never bulk-rewrite files with PowerShell** (`Get-Content | Set-Content`): it re-encodes UTF-8 as cp1252 → mojibake (`â€"`, `Â©`). Use UTF-8-safe editors only. (Also: PowerShell `-Encoding utf8` appends a BOM that breaks tools parsing JSON — `Set-Content`/`Add-Content` only with plain ASCII, or `WriteAllText` BOM-free.)
- **Prettier is not installed** despite old workflow notes — formatting is by hand (match surrounding style).
- **Blend cursor**: `.ea` root keeps `isolation: isolate`; don't add stacking-context hints (`will-change`, `transform`, `filter`) to text the difference bubble needs to invert.
- **WebGL budget**: PrismaticBurst runs at 0.65× render scale, 24 march steps, adaptive 2–4 rAF cadence with offscreen pause — tuned so the site runs on weak machines; don't raise.
- **Reduced-motion transition trap**: the global `transition-duration: 0.01ms !important` meets every element's initial `transition-property: all`, so a `visibility` flip resolves stale on descendants and `focus()` silently fails. The menu dialog kills its own transitions under reduced motion + retries focus after a double rAF — don't remove either.
- **next/og + variable fonts**: the bundled opentype parser can't read `fvar` — OG/twitter-image routes must use the static TTFs in `public/fonts/static/` (the apple icon reads no font; it draws a baked glyph path).

## Performance

- Fonts: `font-display: swap`, Outfit variable self-hosted in `public/fonts/` (+ static instances for the OG card); Work Sans / Office Code Pro via `next/font/local` in `app/fonts/`
- Images: `Plate` component as gradient fallback; real screenshots via `<img class="ea-case__img">` (`loading="lazy"`, `object-fit: cover`, intrinsic `width`/`height` attrs, WebP for the large shots)
- Animations: transform/opacity only (no layout properties in transitions)
- Icons: tree-shakeable Lucide imports
- Core Web Vitals are a priority

## Accessibility

- `prefers-reduced-motion` respected everywhere
- WCAG AA contrast on text over any grain/noise treatment (labels sit at ≥0.55 opacity, `--ea-ink-mute` at 0.58)
- Semantic HTML (header, main, footer, nav, section), skip link to `#ea-main`
- Global `:focus-visible` rings (dark ring inside the light menu panel)
- Menu dialog: `inert` background, focus trap, Escape to close, focus returns to the opener; `aria-expanded`/`aria-controls` on the opener
- `aria-label` on icon-only buttons; hero `<h1>` carries the full sr-only name
