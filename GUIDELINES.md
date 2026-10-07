# Development Guidelines

## Stack

- **Next.js 16** (App Router) + TypeScript
- **GSAP 3** + ScrollTrigger (animation)
- **Lenis** (smooth scroll, driven from GSAP ticker)
- **Lucide React** (icons)
- **Vercel** (deployment target)

## Project structure

```
app/            Next.js app router (layout, page, fonts, globals)
components/     Shared components (Plate, StarGlyph, ConceptLab)
concepts/       Design concept implementations (editorial-var-a)
lib/            Content data, motion utilities
public/fonts/   Self-hosted fonts (Outfit, YoungSerifVF)
assets/         PDFs, images (certificates, headshot)
Colors/         Palette reference files
fonts/          Original font collection (source of truth)
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
- `usePrefersReducedMotion()` hook gates all motion
- Lenis instance exposed via `scrollToTop()` from `lib/motion.ts`
- No `will-change` on elements using `mix-blend-mode` (creates stacking context)

### Content
- All data in `lib/content.ts` (person, skills, credentials, projects, posts)
- Projects/posts are synthetic placeholders — replace with real content
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

## Performance

- Fonts: `font-display: swap`, self-hosted in `public/fonts/`
- Images: `Plate` component (CSS gradients, no image files for placeholders)
- Animations: transform/opacity only (no layout properties in transitions)
- Icons: tree-shakeable Lucide imports
- Core Web Vitals are a priority

## Accessibility

- `prefers-reduced-motion` respected everywhere
- WCAG AA contrast on text over any grain/noise treatment
- Semantic HTML (header, main, footer, nav, section)
- Focus states on interactive elements
- `aria-label` on icon-only buttons
