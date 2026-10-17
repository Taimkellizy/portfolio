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

- `proxy.ts` — locale routing: every page path is prefixed (`/en`, `/ar`); unprefixed paths 308-redirect to `/en`. Files (dotted paths), `/_next` and asset routes pass through
- `app/[locale]/` — `layout.tsx` (html `lang`/`dir` + fonts + per-locale metadata/hreflang + the Person/WebSite JSON-LD `@graph` + Vercel Analytics/SpeedInsights), `page.tsx` (ConceptLab; also builds the one-pager writing rows via `writingRowsFor` and emits the home-only ProfilePage JSON-LD), `blog/page.tsx` + `blog/[slug]/page.tsx` (blog, imports the concept css itself), OG/twitter-image per-locale routes AND per-post routes (`blog/[slug]/opengraph-image.tsx`). `app/apple-icon.tsx`, `app/icon.svg`, `app/icon.png`, `public/favicon.ico`, `app/sitemap.ts`, `app/robots.ts` stay at root (site-wide). Favicon = the Arabic teh (wordmark's first letter, Thmanyah Serif Display Black) as a baked path shared by all three icons; `app/icon.svg` is the source, `node scripts/make-favicon.cjs` rebuilds `app/icon.png` (192) + `public/favicon.ico` (16/32/48)
- `lib/blog.ts` — server-only build-time blog loader over `content/posts/<bundleId>/{meta.json,en.mdx,ar.mdx}`; `getAllPosts`/`getPost`/`getAdjacent` (per-locale file existence = honest availability), structural contract throws on malformed frontmatter; `writingRowsFor` merges one-pager stubs × bundles; `wordCount`/`readingMinutes` (en 225 wpm, ar 180)
- `lib/seo.ts` — the ONLY place `SITE` may be declared (env `NEXT_PUBLIC_SITE_URL` fallback) + JSON-LD node builders (`personNode`, `webSiteNode`, `profilePageNode`, `blogPostingNode`, `breadcrumbNode`, `graph`, `jsonLdScript`) + `OG_LOCALE`. `personNode`/`webSiteNode` are deliberately **locale-neutral** (same bytes on `/en` and `/ar`: Latin `name`, Arabic name in `alternateName`) — see gotcha 26
- `lib/topics.ts` — the closed post-topic vocabulary (id + en/ar labels). Unknown frontmatter topic ids FAIL the build; labels translate per locale so bundles stay locale-neutral
- `lib/i18n.ts` — `locales`, `Locale`, `dirOf`, the `content` locale record and the `Ui` contract (typed; the ar mirror is checked structurally)
- `lib/content.ts` — English content + `ui` (all chrome/section copy); `lib/content-ar.ts` — the Arabic mirror: SAME ids/slugs/hrefs/images, translated display copy
- `components/concept-lab.tsx` — mounts loading screen + the live concept (`locale`, `writingRows` props)
- `concepts/editorial-var-a.tsx` — composition root: hook wiring + page order; `locale` threads to sections and flips the motion system for Arabic
- `concepts/editorial-var-a/` — one hook file per motion system
  (`use-menu-dialog`, `use-entrance-reveals`, `use-hero-cursor`,
  `use-magnetic-wordmark`, `use-menu-spectrum`, `use-variable-weight`,
  `use-cases-slider`), `sections.tsx` (all section markup, `locale`
  prop), `shared.ts` (palettes, `newTabProps`, `isTouchLayout`); CSS
  stays one file at `concepts/editorial-var-a.css` (physical LTR rules
  up top, the `[dir="rtl"]` mirror block at the bottom)
- `components/prismatic-burst.*` — WebGL chromatic backdrop (ogl shader, React Bits origin)
- `components/post-toc.tsx` — post table of contents: built client-side
  from the rendered article headings (rehype-slug ids; no server
  extraction — `next-mdx-remote/rsc` returns a function element whose
  tree only exists after render), scroll-spy + sticky aside on the
  inline-start side, `<details>` fold on phones
- Blog extras: `components/code-block.tsx` (client `pre` override — copy
  button + language chip around shiki output), `components/blog-index-list.tsx`
  (topic chips + rows; `?topic=` lives in the URL via `useSyncExternalStore`,
  never in state), `components/blog-post-bar.tsx` (copy-as-markdown / view-as-
  markdown / copy-link / text size), `components/reading-progress.tsx`
- Machine-readable routes: `app/[locale]/rss.xml/route.ts`, `app/llms.txt/route.ts`,
  `app/[locale]/llms-full.txt/route.ts`, `app/api/markdown/[locale]/[slug]/route.ts`
  (serves `/en/blog/{slug}.md` via the rewrite in `next.config.ts`)
- `components/branched-menu.tsx` + `.css` — vendored React Bits BranchedMenu
  (TS-CSS variant), adapted: `@hugeicons` dropped, `activeValue` prop added
  (controlled active for scroll-spy), `[dir="rtl"]` mirror appended
- `app/[locale]/blog/blog-bar.tsx`, `blog-footer.tsx` — static-chrome shared by
  blog pages: top bar (wordmark + lang switch, `عربي` rides Thmanyah Sans in the
  EN build) and a footer mirroring the one-pager's (burst, columns with
  `#ea-*` anchors remapped to `/{locale}#ea-*`, giant word, base row)
- `app/[locale]/blog/blog.css` — blog chrome/prose/ToC CSS; imports the
  concept css itself (blog roots wear `.ea`, plus `.ea--blog` for the
  native-cursor guard)
- `components/lattice-loader*` — loading screen (React Bits origin)
- `components/plate.tsx`, `star-glyph.tsx` — gradient placeholder plate, star glyph
- `lib/motion.ts` — GSAP/ScrollTrigger exports, Lenis hook, `usePrefersReducedMotion`, `useMediaQuery`
- `app/fonts.ts` — WorkSans-Variable (en), OfficeCodePro (code), Thmanyah Sans woff2 ×5 (Arabic; `--font-thmanyah`); OG image statics live in `public/fonts/static/` (Outfit + Thmanyah TTFs, see gotcha 19)
- `DESIGN.md` — design system (tokens, type, motion inventory)
- `GUIDELINES.md` — conventions and traps
- `PRODUCT.md` — positioning and product principles
- `assets/` — certificate PDFs (tracked). The resume PDF is intentionally not linked or served.

## Current state / pending

- Locales: two pages × two locales (`en` LTR / `ar` RTL): the one-pager
  (statically generated per locale) and the blog (listing + post pages,
  SSG, per-locale file existence = honest availability); language
  switcher lives in the menu panel foot (`ea-menu-panel__lang`) on the
  one-pager and in the blog top bar (`blog-bar.tsx`); content hierarchy
  is developer-first (Arabic titles use word-level SplitText — no
  char-split, no variable-weight)
- Page order: hero → bio → skills → cases → experience → credentials → writing → footer
- Experience is a featured role dossier (`ea-xp`), one entry per role; skills are hairline groups (`ea-skill-row`); rows (`ea-row`) carry credentials/writing only
- Cases slider renders one plate per entry in `projects[].images` (two per project: hero + detail/brand). Screenshots are shipped in `public/cases/` (Arabify, Shaghal, Meridian + logo SVG); the `Plate` gradient + kind label remains the load-error fallback. Image entries carry `src`/`ratio`/`fit`/`alt`
- Mobile (≤900px) is in scope (phase 1 + polish done): hero = bio top + vertical "taim" up the right edge (`min(72vw, 32svh)`, scroll link bottom-left), per-case caption cards instead of the sticky name list, rows stacked with ALL fields visible ≤620px, menu = bottom-right FAB, footer word is full-bleed (`font-size: 52vw`) over a reserved bottom band — phones only, desktop footer keeps the original word size + absolute base row. No slider ≤900px. `PrismaticBurst` mounts at all widths with a lite tier on ≤900 (`renderScale` 0.55) — keep those numbers.
- Content hierarchy is software-dev-first; keep it that way (experience ≠ certificates)
- Blog/SEO layer (2026-10): shiki syntax highlighting via `rehype-pretty-code`
  (theme `dark-plus`, `keepBackground: false` — panel bg is CSS) + copy button
  (`components/code-block.tsx`); fixed topics (lib/topics.ts) with filter chips
  (`?topic=` in the URL); JSON-LD `@graph` on every page (Person/WebSite in the
  layout, BlogPosting/BreadcrumbList per page); `x-default` hreflang; per-post
  OG cards; RSS per locale; llms.txt + llms-full.txt + per-post `.md` exports;
  post bar (copy/view markdown, copy link, text size via `zoom`); reading time
  + progress bar; Vercel Analytics + SpeedInsights. Custom domain NOT yet
  attached — `SITE` is still the vercel.app host (one-line switch in lib/seo.ts)

## Hard-won gotchas — do not re-break

1. Never rewrite whole files with PowerShell `Get-Content | Set-Content`; it re-encodes UTF-8 as cp1252 → mojibake (`â€"`, `Â©`). Use UTF-8-safe edit tools.
2. GSAP SplitText (`mask`) only on pure text containers. Never on flex/grid layout containers (footer columns, section headers, row links) — it shatters layout into fake "lines". Layout blocks use `data-reveal-fade` (opacity + y) instead.
3. Entrance/reveal tweens use `gsap.fromTo` with explicit end values — never `gsap.from`. Under React, `from` can capture its end state after the from-state is applied, freezing letters/links mid-entrance (seen: letters stuck at `yPercent: 55`, links at `opacity: 0`).
4. The cursor bubble is `mix-blend-mode: difference`; `.ea` has `isolation: isolate` and cursor-driven tweens set `force3D: false`. Don't add `will-change`/force3D to nearby text or the inversion drops out of the blend backdrop.
5. `PrismaticBurst` perf is tuned for weak machines: render scale 0.65 (dpr cap 1), shader steps 24, adaptive 2–4 rAF cadence, IntersectionObserver pause. Don't raise the defaults. Phones use the lite tier (`renderScale` 0.55, read at mount — gate mounting on `useMediaQuery(...)` `!== null`).
6. React Bits components: take CSS/plain variants only (no Tailwind here); add deps explicitly (`ogl` already present).
7. Menu hover is zone-based (word snaps to scale 3 inside its band, neighbours pushed away). Band centres are measured untransformed on mouseenter — don't "simplify" it back into a continuous falloff (it wiggles).
8. `credentials` = verifiable certificates/education; `experience` = roles. Never mix.
9. GSAP SplitText `chars` mask, the per-letter hero split, the cursor
   char-split/letter-disassembly in `use-hero-cursor` (word-level repel
   stays on for both locales) and the cursor-weight effect are LTR-only: Arabic must NOT be char-split
   (it breaks contextual joining). Arabic titles go through the
   word-level mask (`applyWordMaskReveal`), the Arabic `تيم` wordmark is
   ONE `.ea-giant__letter` span (magnet/entrance move the whole word),
   and `data-variable-weight` is rendered only for `en`. Mirror the
   `[dir="rtl"]` CSS block, not the LTR rules.
10. The global reduced-motion `transition-duration: 0.01ms !important` makes any element with the initial `transition-property: all` transition `visibility` — computed visibility goes stale on descendants and `focus()` silently fails. The menu dialog relies on `.ea-menu-panel, .ea-menu-panel * { transition: none !important }` under reduced motion + a double-rAF focus retry; don't remove either.
11. `next/og` (OG/twitter-image routes) cannot parse variable-font `fvar` tables — it must use the static Outfit TTFs in `public/fonts/static/` (Medium/SemiBold/ExtraBold); don't swap `Outfit-Variable.ttf` back in. `apple-icon.tsx` reads no font at all — it draws the baked teh glyph path (same as `app/icon.svg`); keep it path-based.
12. Next 16 uses the `proxy.ts` convention (not `middleware.ts`) for the locale redirect; the function is a default export named `proxy`.
13. A `next/font` `variable:` value is a full fallback LIST (`parent, fallback…`). Placing one list-var after another never intercepts per-glyph — e.g. `var(--font-outfit), var(--font-thmanyah)` stays Latin-only: Arial's built-in Arabic satisfies matching first. Whenever mixed scripts must split, list the script-specific face FIRST: `var(--font-thmanyah), var(--font-outfit)`.
14. Blog pages wear the `.ea` root (tokens/rows/type layer) but NO cursor bubble mounts there — `blog.css` carries `.ea.ea--blog { cursor: auto !important }` (double class beats the concept's `cursor: none` under `(hover: hover)`). Don't drop the guard on the dot.
15. Post prose code blocks/inline code must stay physical LTR even in Arabic posts (`direction: ltr; unicode-bidi: isolate` in `blog.css`); RTL mirrors live only in the blog css mirror block.
16. Blog authoring: a post is `content/posts/<bundleId>/{meta.json,en.mdx,ar.mdx}` — display copy (title/excerpt/date) lives in per-locale frontmatter and `topics: [...]` are ids from the CLOSED vocabulary in `lib/topics.ts` (shared across locale bundles; an unknown id fails the build — labels translate via `topicLabel`), meta.json carries only the bundle id; `ar.mdx` optional (absence = en-only, honestly surfaced). Missing frontmatter fields fail the build by contract.
17. `PrismaticBurst` renders with `alpha: false` — an opaque black canvas whose black is knocked out by the canvas' own `mix-blend-mode: lighten`. Any `mask-image` on a wrapper isolates the group and strands that opaque ground (seen: a dark veil fading over the post title). Keep the glow's mask, but park the whole glow layer BELOW the flow content (`z-index: -1` inside the `.ea` isolation group) — its ground then only hides the near-black page background, never text.
18. The Thmanyah font variable names carry an "m" after "th" (`--font-thmanyah`). Dropping that m ((`--font-thanyah` with the m omitted) yields a valid-looking CSS var that resolves to nothing at computed time — the declaration silently drops and the text falls back to Arial's glyphs. Several blog rules shipped with it; when a font change "doesn't apply", byte-check the var spelling first (console displays also normalize the two spellings — verify with string-concatenated searches).
19. `next/og` (OG/twitter-image routes) reads only plain TTF statics in `public/fonts/static/` (variable-font `fvar` parse errors + satori can't read woff2). Arabic card faces are the Thmanyah statics decompressed from the woff2 sources in `app/fonts/` (wawoff2); if a Thmanyah weight is swapped/updated, regenerate its TTF. `alt`/`size`/`contentType` exports must be plain strings/objects — function exports throw DataCloneError on prerender. Keep Arabic card strings pure-Arabic per element (satori mismeasures joined Arabic — no letterSpacing/textTransform on Arabic spans); the Thmanyah Display descender runs deep, so the Arabic giant word sits at 280 vs the Latin 330. Satori has NO bidi: it draws multi-word Arabic in logical order left-to-right, so every multi-word Arabic card string is word-reversed before render (`rtlWords` in `opengraph-image.tsx`) — reverse words only, never characters (that severs joins). The joined-glyph box also renders wider than the drawn ink (isolated vs shaped advances), so the giant تيم carries a tuned `translateX` nudge;    both constants were calibrated by ink-profile measurement of the rendered PNG — re-tune on font/size/word changes.
20. A child route's `alternates` metadata REPLACES the parent layout's `alternates` — it does not deep-merge. The blog pages must restate `types` (`application/rss+xml`, and `text/markdown` on posts) themselves or the `<link rel="alternate">` silently disappears from those pages only (seen in a smoke test).
21. `/en/blog/{slug}.md` cannot be a route segment (a dynamic segment can't carry a literal `.md` suffix) — it is a `next.config.ts` rewrite onto `app/api/markdown/[locale]/[slug]`. Keep `api` out of the proxy matcher or the rewrite loops into the locale redirect. The post bar's "Copy as Markdown" fetches this URL.
22. `components/code-block.tsx` copies via `codeText()` — it joins the `[data-line]` rows with newlines. Never "simplify" it back to `innerText`: line numbers are CSS counters (`::before` in blog.css) and some engines fold generated content into `innerText`, which would put the numbers in the clipboard. The button/bar must also stay OUTSIDE the `<pre>` (in `.code-shell`), or the label text lands in the clipboard with the code.
23. React 19's lint (react-hooks) forbids synchronous `setState` inside `useEffect`. External sources — the `?topic=` URL (`blog-index-list.tsx`) and the reading-size dataset (`blog-post-bar.tsx`) — go through `useSyncExternalStore` with a server snapshot matching the SSR render; never "read on mount" into state.
24. `lib/seo.ts` owns `SITE`. Re-declaring the origin string in a page/route file is how the six-fold duplication happened; new URL-emitting surfaces import it (or `absolute()`).
25. The post page's inline reading-size restore script stamps `data-reading-size` onto `<html>` before React hydrates, so `<html>` carries `suppressHydrationWarning` (in `app/[locale]/layout.tsx`). Don't remove it: React flags the attribute diff (the server HTML never has the attribute) and logs a hydration warning on any visit where localStorage holds a size.
26. The `personNode`/`webSiteNode` JSON-LD must stay locale-neutral: the SAME `@id` (`SITE/#person`, `SITE/#website`) is emitted on `/en` and `/ar`, so per-locale `name`/`url` values are an entity conflict that makes Google drop the node — that node is the site-name signal, so "vercel.app" shows instead of "Taim Kellizy". Latin `name` everywhere, Arabic name rides `alternateName`; per-locale info goes in `profilePageNode` (`inLanguage`) or page copy. Also: a page-level `openGraph` object REPLACES the parent segment's file-convention `og:image` wholesale (unlike `alternates`, it isn't even shallow-merged) — `app/[locale]/blog/page.tsx` must restate `images`, or the blog index ships with no card (seen in a smoke test; post pages are fine because their `opengraph-image.tsx` lives in their own segment).

## Verify before committing

`npx tsc --noEmit && npm run build`, then a dev-server smoke test (HTTP 200 + expected strings in HTML).
