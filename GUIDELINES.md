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
app/            Next.js app router (layout, page, fonts, globals)
components/     ConceptLab, Plate, StarGlyph, prismatic-burst, lattice-loader(+screen)
concepts/       Design concept implementation (editorial-var-a — the whole site)
lib/            Content data (content.ts), motion utilities (motion.ts)
public/fonts/   Self-hosted fonts (Outfit, YoungSerifVF)
public/cases/   (pending) case-study screenshots
assets/         Certificate PDFs (tracked); resume PDF present but intentionally unserved
Colors/         Palette reference files
fonts/          Original font collection (source of truth for font files)
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
- Strict mode; `npx tsc --noEmit` must pass

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
- Case-study images go in `public/cases/` and are referenced via `images` on a project (entries carry `src`/`ratio`/`fit`/`alt`; two plates per project; Plate gradient is fallback only)
- Never fabricate facts; only use verified credentials

## Workflow

1. `npm run dev` — local development
2. `npm run build` — production build (must pass)
3. `npx tsc --noEmit` — type check
4. `npx prettier --write <files>` — format before commit
5. Commit to `design/exploration` branch during design phase
6. Merge to `main` for production

## Design process

- Taste references in `Taste and examples/` are the source of truth
- `taste-notes.md` documents the design DNA
- `DESIGN.md` is the implementation reference
- Concept lab switcher (keys 1-6) for comparing directions
- Always verify against reference sites pixel-for-pixel when matching layouts

## Known traps

- **Never bulk-rewrite files with PowerShell** (`Get-Content | Set-Content`): it re-encodes UTF-8 as cp1252 → mojibake (`â€"`, `Â©`). Use UTF-8-safe editors only.
- **Prettier is not installed** despite the workflow note — formatting is by hand (match surrounding style).
- **Blend cursor**: `.ea` root keeps `isolation: isolate`; don't add stacking-context hints (`will-change`, `transform`, `filter`) to text the difference bubble needs to invert.
- **WebGL budget**: PrismaticBurst runs at 0.65× render scale, 24 march steps, adaptive 2–4 rAF cadence with offscreen pause — tuned so the site runs on weak machines; don't raise.

## Performance

- Fonts: `font-display: swap`, self-hosted in `public/fonts/`
- Images: `Plate` component as gradient fallback; real screenshots via `<img class="ea-case__img">` (`loading="lazy"`, `object-fit: cover`)
- Animations: transform/opacity only (no layout properties in transitions)
- Icons: tree-shakeable Lucide imports
- Core Web Vitals are a priority

## Accessibility

- `prefers-reduced-motion` respected everywhere
- WCAG AA contrast on text over any grain/noise treatment
- Semantic HTML (header, main, footer, nav, section)
- Focus states on interactive elements
- `aria-label` on icon-only buttons
