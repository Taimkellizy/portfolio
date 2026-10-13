# Production-readiness plan (handoff file)

Temp working doc — delete once all phases ship. Written so another agent can pick
up mid-stream when the context window fills.

## Goal

Make the portfolio prod-ready in five phases: **accessibility, SEO, share
preview (OG), code quality, phone support**. Live concept is `editorial-var-a`
(prefix `ea-`), all content in `lib/content.ts`.

## Status

| Phase | Scope | Status |
| --- | --- | --- |
| 1 | Phone support | **DONE** |
| 1.5 | Mobile polish (user review round) | **DONE** (this session) |
| 2 | Accessibility | **DONE** (this session) |
| 3 | SEO + share preview | **DONE** (this session) |
| 4 | Code quality + perf | **DONE** (this session) |
| 5 | Verify + docs sweep | NOT STARTED |

## Decisions made (do not re-litigate)

- Writing posts keep placeholder anchors (`href="#ea-writing"`), real post pages later.
- Share preview = **auto-generated** OG card (`app/opengraph-image.tsx`, next/og), not a static PNG.
- Dead weight gets **removed** (unused fonts, dead CSS, tracked junk folders `fonts/`, `Colors/`).
- Mobile menu button = **bottom-right FAB**.
- `PrismaticBurst` **stays on phones** at a lite render tier (see below).
- Hero wordmark on phones is **vertical up the right edge** (`left: calc(100% - 0.78em)`, `min(72vw, 32svh)`); the star glyph next
  to "taim" is **removed** (hero + footer). `StarGlyph` component file stays.
- Footer wordmark is **full-bleed (`font-size: 52vw`) on phones only**;
  desktop keeps the original `.ea-giant` clamp + absolute bottom-right base row.
- Skills Tooling group includes `OpenCode` and `Antigravity`.

## Phase 1 + 1.5 — what is already done

- Cases on phones: per-case caption cards (`.ea-case__caption`, shown ≤900px,
  hidden on desktop where the sticky name list lives). Plate px-widths from the
  1080 block are reset to 100% at ≤900.
- Rows: stacked ≤620px, ALL fields visible (org/title/metric/excerpt/year).
- Hero (≤900): flow layout, bio top, **vertical "taim"** bottom-left
  (`transform: translateY(0.05em) rotate(-90deg)`, origin top-left, anchored
  `top: 100%; left: 0`), scroll link bottom-right. Word size
  `min(58vw, 23svh)` — tuned so it never collides with the bio at 360×640.
- Footer: base row in flow (right-aligned desktop, `space-between` ≤620),
  `.ea-foot` reserves `calc(38.6vw + 24px + safe-area)` for the giant word.
  Word is full-bleed: `.ea-foot__word { font-size: 52vw }` ("taim" ≈ 2.03em
  wide in Outfit 800; verify visually if Outfit ever changes).
- Menu = bottom-right FAB ≤900 (48px, safe-area insets). `viewportFit: cover`.
- Touch: `:active` feedback + stuck-`:hover` resets under `@media (hover: none)`.
- `PrismaticBurst`: mounts at **all** widths (`narrow !== null` gate), mobile
  passes `renderScale={0.55}` (≈3.3× fewer pixels than the desktop path).
  Desktop default untouched: `min(1, dpr * 0.65)`, 24 shader steps, adaptive
  2–4 rAF cadence, IntersectionObserver pause. **Do not raise these.**
  Research verdict: keeping it on phones is feasible — the shader is one
  fullscreen 24-step ray march, ~2–3x cheaper at the 0.55 tier, already
  degrades to 15fps via adaptive cadence, pauses offscreen/hidden. Battery
  cost is real but acceptable for a portfolio; worst case drop the footer
  instance on mobile (`narrow` already scopes it).
- `useMediaQuery` (lib/motion.ts) returns `boolean | null` (null until
  measured) — mount-sensitive effects must gate on `!== null`.
- `lib/content.ts` Tooling: + OpenCode, + Antigravity.
- **Entrance/reveal tweens converted to `gsap.fromTo` with explicit ends**
  (hero letters, scroll link, `data-reveal-fade`, SplitText reveals) — the old
  `gsap.from` versions froze at their from-state under React (letters stuck at
  `yPercent: 55`, scroll link stuck at `opacity: 0`). Also removed the dead
  `[data-hero-nav]` tween and the star glyphs (hero + footer word).
- Mobile "Scroll to explore" has `margin-right: 56px` so it clears the
  bottom-right menu FAB.

## Phase 2 — accessibility (done this session)

1. Skip-to-content link (top of `layout` or concept root) → `#ea-top`/main.
2. Global `:focus-visible` treatment (nothing exists today).
3. Menu dialog hardening (`concepts/editorial-var-a.tsx` menu block):
   - CSS `visibility: hidden` default on `.ea-menu-panel` (pre-hydration the
     offscreen panel's links are keyboard-focusable — bug),
   - focus trap + initial focus on close button + focus return to opener,
   - `aria-expanded` on the menu toggle, `inert`-like handling for background,
   - Lenis-aware scroll lock (export stop/start from `lib/motion.ts`).
4. Contrast: inactive `.ea-case-name` `opacity: 0.2` → ~0.55 (and keep the
   active state distinct); small `u-label`/`--ea-ink-mute` text → verify 4.5:1.
5. SplitText accessible names (GSAP 3.15 does this automatically — verify,
   add `aria-label` to `data-reveal-title` if not); sr-only full name inside
   the hero `<h1>` ("taim" alone is thin for screen readers/SEO).
6. `rel="noopener noreferrer"` on external links.

### Phase 2 notes (shipped this session)

- Skip link `.ea-skip` → `#ea-main` (`<main>` gets `tabIndex={-1}`), visually
  hidden until focused. `main:focus` ring suppressed (it is only a jump target).
- `:focus-visible`: 2px `--ea-ink` ring + 3px offset globally; dark
  `--ea-menu-ink` ring inside the light menu panel.
- Menu dialog: CSS `visibility: hidden` default **+ `inert`** on panel /
  menu button / main / footer / skip link while open (React 19 renders
  `inert` server-side, so the pre-hydration tab bug is gone even before JS).
  Focus trap (Tab/Shift+Tab wrap inside the panel), Escape closes, initial
  focus on the close button, focus returns to the opener on close. Scroll
  lock = `stopSmoothScroll()` / `startSmoothScroll()` (new exports in
  `lib/motion.ts`) + `body.overflow: hidden`.
- Contrast: `.ea-case-name` inactive `0.2 → 0.55` (CSS + both slider JS
  sites), hover `0.5 → 0.85`; `--ea-ink-mute` `0.5 → 0.58` (~5.8:1 on
  `--ea-bg`); `.ea-sec__count` `0.5 → 0.62`. Menu spectrum hover dim
  (neighbours at 0.2) kept — transient design state per gotcha 7 — but the
  leave state now restores full opacity (it used to leave all links stuck
  at 0.2 after the first hover).
- SplitText 3.15 sets `aria-label` + `aria-hidden` on split parts
  automatically (`aria: "auto"` default — verified in
  `node_modules/gsap/SplitText.js`). Hero `<h1>` instead carries an
  `u-sr-only` full name (`person.name`) + aria-hidden letter spans.
- `rel="noopener noreferrer"` on all external links, including the spread
  `{ target: "_blank", rel }` forms in the cases block.
- Verified via CDP (headless Edge, `menu-check.js` pattern): initial focus
  lands, trap holds over 12 tabs, Escape closes + returns focus, background
  `inert` flips both ways, scroll lock clears; HTTP 200 + expected strings
  in prerendered HTML; no horizontal overflow at 390 and 1440.

## Phase 3 — SEO + share preview (done this session)

1. `app/opengraph-image.tsx` + `app/twitter-image.tsx` (next/og ImageResponse,
   1200×630, load Outfit-Variable.ttf via fs in the route).
2. Metadata (`app/layout.tsx`): OG `images/url/siteName`, twitter
   images/title/description, `alternates.canonical`, authors. Icons:
   `app/icon.svg` + `apple-icon`.
3. `app/robots.ts`, `app/sitemap.ts`.
4. JSON-LD `Person` schema from `lib/content.ts`.
5. Verify crawler-visible HTML keeps all sections (page is statically
   prerendered — keep it that way).

### Phase 3 notes (shipped this session)

- `app/opengraph-image.tsx` + `app/twitter-image.tsx` (re-export): 1200×630
  PNG built with next/og from `lib/content.ts` — dark card, caps name row,
  800-weight "taim" wordmark, hairline bottom row with role/location.
- **`next/og`'s bundled opentype parser cannot read variable-font `fvar`
  tables** — Outfit-Variable.ttf and WorkSans-Variable.ttf both fail with
  `parseFvarAxis` TypeError at prerender. Static instances live in
  `public/fonts/static/` (Outfit-Medium/SemiBold/ExtraBold.ttf, from Google
  Fonts; request the css2 API with a plain `Mozilla/5.0` UA to get real TTFs
  — MSIE UA returns EOT, modern UA returns woff2, both useless to satori).
- `app/layout.tsx`: full OG/twitter metadata (url/siteName/title/
  description), `alternates.canonical`, authors + creator. og/twitter image
  entries come from the file conventions (never set `images` explicitly —
  it overrides them).
- Icons: `app/icon.svg` (star glyph on the dark token) +
  `app/apple-icon.tsx` (generated 180×180 "t" in Outfit ExtraBold).
- `app/robots.ts` (allow all + sitemap) and `app/sitemap.ts` (single entry,
  monthly).
- JSON-LD `Person` in `app/page.tsx` (name/jobTitle/url/email/homeLocation/
  sameAs/knowsAbout) — prerendered into the static HTML.
- Verified: all 7 routes prerender statically (/ , apple-icon, icon.svg,
  opengraph-image, twitter-image, robots.txt, sitemap.xml); head carries
  canonical, full og/twitter set, icon links; JSON-LD present in body;
  OG/twitter/apple serve real PNGs (magic bytes checked); card renders the
  heavy Outfit 800 correctly.

## Phase 4 — code quality + perf (done this session)

1. Split `concepts/editorial-var-a.tsx` (~1.2k lines) into hooks
   (`useMenu`, `useHeroCursor`, `useMagnetic`, `useSpectrum`,
   `useVariableWeight`, `useCasesSlider`) + section components. Preserve the
   GSAP gotchas below — behavior-identical refactor only.
2. Remove: unused fonts (`app/fonts/` Array ×3, ArrayWide ×3, ChunkFive,
   Nimbus = ~4.5MB; keep WorkSans + OfficeCode), `fonts.ts` entries, `git rm
   fonts/ Colors/` (tracked junk), dead CSS in `app/globals.css`
   (`.lab-switch*`, `.u-grain`, `.u-dither`, `.u-caps`; keep `.u-star`),
   `useGsapScope` in `lib/motion.ts`, `public/fonts/YoungSerifVF.ttf`.
   Resolve unused `public/cases/arabify-audit.png` + `shaghal-panel.png`
   (use in cases or drop). `concepts/editorial-var-a.css` star-wrap rules
   already removed; `components/star-glyph.tsx` is now unused (keep or drop).
3. ESLint (`eslint-config-next`) + `lint`/`typecheck` scripts; `width`/`height`
   on case `<img>` (CLS); optional WebP for the ~300KB PNGs
   (`shaghal-hero.png`, `meridian-report.png`).
4. Consider `loading="lazy"` only below the fold (first case image is LCP-ish).

### Phase 4 notes (shipped this session)

- **Split `concepts/editorial-var-a.tsx`** (1262 lines → a ~100-line
  composition root): one hook per motion system in `concepts/editorial-var-a/`
  (`use-menu-dialog`, `use-entrance-reveals`, `use-hero-cursor`,
  `use-magnetic-wordmark`, `use-menu-spectrum`, `use-variable-weight`,
  `use-cases-slider`), `sections.tsx` for all markup, `shared.ts` for
  constants/helpers (`PLATE_PALETTES`, `newTabProps`, `isTouchLayout`).
  Hook order in the composition root doubles as effect order (menu
  visibility → dialog; entrance → cursor). Behavior verified identical:
  same page heights (desktop 6707, mobile 7534), hero entrance lands,
  slider initializes, no horizontal overflow at 1440/390, menu dialog
  pass unchanged.
- **Removed**: `app/fonts/` Array×3 + ArrayWide×3 + ChunkFive + Nimbus
  (~4.5MB), their `fonts.ts` exports + `next/font` preloads + `--font-*`
  vars in `globals.css`; tracked junk folders root `fonts/` + `Colors/`
  (Fontsource-era copies); `useGsapScope` from `lib/motion.ts`;
  `public/fonts/YoungSerifVF.ttf`; dead CSS (`.lab-switch*`, `.u-grain` +
  keyframes + reduced-motion reference, `.u-dither`, `.u-caps`,
  `--lab-pad`/`--lab-h`); unused case shots `arabify-audit.png` +
  `shaghal-hero2.png` (the swap's leftover). `star-glyph.tsx` + `.u-star`
  **kept** — the phase-1 decision stands.
- **ESLint**: `eslint-config-next@16` flat config (`eslint.config.mjs`,
  `core-web-vitals` array — no eslintrc compat), `lint` + `typecheck`
  scripts, lint is error-free. Two flags from the React-hooks-compiler
  rules were fixed for real: `lattice-loader`'s ref-during-render check-mark
  became the documented render-phase adjustment pattern (settled status
  state); `prismatic-burst`'s second effect reads the canvas from the
  container DOM instead of back through `rendererRef`. Two waivers carry
  inline reasons: the burst's mount-only dep array and the loader's
  announcement effect.
- **Images**: `shaghal-hero`/`meridian-report` converted to WebP
  (407KB→78KB, 293KB→79KB, sharp via `scripts/convert-cases-webp.cjs`),
  content entries now carry intrinsic `width`/`height` on raster images
  (aspect hint for crawlers; the absolute-plate layout has no CLS).
- **Deferred, on purpose**: `next/image` migration (would change serving +
  the plate's onError fallback interplay; lint rule off with a comment
  pointing here); case-file PNG→WebP for the arabify JPG is already small.
- **Known dev-tooling flaw** (accepted): `@next/eslint-plugin-next` pulls
  a vulnerable `braces` advisory through `fast-glob` — dev-only, and
  `npm audit fix --force` would downgrade eslint-config-next to v14.
  Re-visit when Next ships a newer plugin.

## Phase 5 — verify + docs

`npx tsc --noEmit && npm run build`, then dev/prod smoke test (HTTP 200 +
expected strings in HTML), manual QA at 360×800, 390×844, 768×1024, 1440×900,
keyboard pass, reduced-motion pass. Update `AGENTS.md`/`DESIGN.md`/
`GUIDELINES.md` if conventions drifted. Delete this file.

## Verification recipe (used this session)

- `npx tsc --noEmit` + `npm run build` must pass.
- Headless-Edge screenshots via CDP (script pattern in temp `shot.js`):
  launch `msedge --headless=new --remote-debugging-port=9333`,
  `Emulation.setDeviceMetricsOverride` per viewport,
  `Emulation.setEmulatedMedia` with `prefers-reduced-motion: reduce` (so GSAP
  reveal states don't hide content) + `hover/pointer` for touch emulation,
  force `img[loading=lazy]` eager, then `Page.captureScreenshot` with
  `captureBeyondViewport` + clip = full scrollHeight. Assert
  `scrollWidth <= width` (horizontal overflow check).
- Note: a `next dev` server on :3000 shows the Next.js dev-tools "N" badge
  bottom-left — it is NOT site chrome. Use `npm start -- -p 3001` for shots.

## Gotchas (AGENTS.md + new)

1. Never rewrite files with PowerShell `Get-Content | Set-Content` (mojibake).
2. GSAP SplitText `mask` only on pure text containers — layout blocks use
   `data-reveal-fade`.
3. Cursor bubble `mix-blend-mode: difference` + `.ea` `isolation: isolate`;
   cursor tweens use `force3D: false`. Don't add will-change/force3D near text.
4. PrismaticBurst defaults are tuned for weak machines (0.65 scale / 24 steps /
   adaptive cadence). Mobile lite tier = `renderScale` 0.55 via the `narrow`
   gate — don't raise the desktop defaults; `renderScale` is read at mount.
5. Menu hover is zone-based — don't "simplify" the falloff.
6. `credentials` = verifiable certificates; `experience` = roles. Never mix.
7. Visible copy stays English-only for now.
8. Cases slider (desktop >900px) measures plate heights via
   `getBoundingClientRect` and sets explicit item heights — don't restructure
   that DOM; mobile presentation is layered on top (captions + CSS resets).
9. The global reduced-motion `transition-duration: 0.01ms !important`
   (`app/globals.css`) lands on every element's initial
   `transition-property: all` — a `visibility` flip then resolves **stale on
   descendants for seconds** and `focus()` on them silently fails. The menu
   dialog kills its transitions under reduced motion
   (`.ea-menu-panel, .ea-menu-panel * { transition: none !important }`) and
   its initial focus retries after a double rAF. Don't remove either.
10. `next/og` (the bundled satori/opentype) cannot parse variable fonts —
   OG/apple-icon routes must use the static TTFs in `public/fonts/static/`.
   Don't swap them back to `Outfit-Variable.ttf`; if a new weight is needed,
   download another static instance (plain `Mozilla/5.0` UA on the css2 API).
