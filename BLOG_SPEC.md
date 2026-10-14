# BLOG_SPEC.md — handoff spec for the blog system (temporary)

> TEMPORARY handoff document for the agent implementing the bilingual blog.
> Delete (or fold the still-relevant parts into AGENTS.md) once the blog ships.
> Read AGENTS.md and DESIGN.md first — this spec assumes the i18n layer described
> there already exists.

## Mission

Add a bilingual (en/ar) blog that ingests `.md` / `.mdx` files, matches the
existing editorial-var-a design language, and reuses the locale infrastructure
shipped with the Arabic i18n phase (commit `feat: app/[locale] + Arabic/RTL`,
proxy routing, `lib/i18n.ts`).

## Non-goals / constraints

- No client-side fetch, no CMS, no external i18n library (`next-intl` etc.) —
  the repo is deliberately hand-rolled (`lib/i18n.ts`).
- Content hierarchy stays software-dev-first; posts are the "writing" section,
  currently stubbed with placeholder anchors in `WritingSection` (sections.tsx).
- Respect every gotcha in AGENTS.md — especially: UTF-8-safe edits only (#1),
  `fromTo` never `from` (#3), no char-level SplitText on Arabic (#9),
  `[dir="rtl"]` mirrors instead of physical rewrites.
- GSAP is used throughout; do not introduce another scroll/animation library.
- Blog prose must stay server-rendered/static (SSG), matching the existing
  build output (everything static except the OG image routes).

## Architecture

### 1. Routing (already reserved by the locale phase)

```
app/[locale]/blog/page.tsx          — listing (locale-aware)
app/[locale]/blog/[slug]/page.tsx   — post page (locale-aware)
```

- `generateStaticParams()` twice: locales × slugs (per-locale file existence
  decides what is generated).
- `dynamicParams = false` (mirrors `[locale]/layout.tsx`); missing translation
  → generate the EN canonical under both locales OR 404 — pick one policy and
  document it; recommended: post exists in a locale iff its file exists
  (honest availability), listing pages show per-locale lists only.
- `generateMetadata` per post page: title/description/OG/twitter, canonical
  `/en/blog/<slug>` / `/ar/blog/<slug>` + `alternates.languages` pair (follow
  the pattern in `app/[locale]/layout.tsx`).

### 2. Content format (post bundles)

```
content/posts/<bundle-id>/
├── meta.json     # shared: id, dates, tags (en/ar), cover (optional), hrefs
├── en.mdx        # body (English)
└── ar.mdx        # body (Arabic) — optional; absence = en-only post
```

- Display copy (title, excerpt) lives in per-locale frontmatter at the top of
  each `.mdx` file, not in meta.json — one file per locale keeps authoring
  linear. meta.json carries only locale-invariant data (id, canonical dates,
  cover asset path, other-locale slugs if needed).
- Frontmatter schema: `id` (== bundle dir), `title`, `excerpt`, `date` (ISO),
  `updated` (optional), `tags: string[]`, `cover: string` (optional,
  `public/posts/<id>/...`), `slug` (optional per-locale override; default = id).
- Keep ids/slug invariant across locales (shared anchors, like
  `credentials[].id`), translated *slug* only if SEO requires it later.

### 3. Loader — `lib/blog.ts`

- Pure build-time fs reading (like `next/og` routes do with `fs/promises`):
  `getAllPosts(locale)`, `getPost(locale, id)` returning typed
  `{ meta, body(mdx source) }`.
- Parse frontmatter with `gray-matter`; bring no other heavy deps.
- Sort by `date` desc; expose `getAdjacent(locale, id)` for prev/next links.
- A small shape assertion (`content.ar.ts`-style structural contract) so
  missing frontmatter fields fail the type check / build, not production.

### 4. MDX rendering

- `next-mdx-remote/rsc` (RSC edition) — compile the body at build time from
  the fs source. Add: `next-mdx-remote`, `gray-matter`, `remark-gfm`.
- Custom components: `Link` (external links keep the `newTabProps` behaviour
  from `concepts/editorial-var-a/shared.ts`), `PostImage`, code styling only.
- Keep plugins minimal; no rehype-pretty-code until a post needs it.

### 5. The "writing" section on the one-pager

- Replace the placeholder `href="#ea-writing"` anchors with locale-aware
  links: `/en/blog/<slug>` / `/ar/blog/<slug>` (trial: `href="/${locale}/blog/${post.slug}"`).
- Row markup stays `ea-row`; only the anchor href changes. If a post is
  missing in the current locale: prefer showing the OTHER-locale post with its
  title (never machine-translate display copy) — list sections merge
  available locales and mark availability.

### 6. RTL prose rules (bilingual pages)

- Post body wrapper gets `dir` from the page locale; Arabic posts use
  `[dir="rtl"]` block styles (see the existing mirror block pattern in
  `concepts/editorial-var-a.css` — physical LTR up top, `[dir="rtl"]` at the
  bottom).
- Code blocks/inline code stay LTR (`direction: ltr; text-align: left`) even
  inside Arabic posts — the classic mixed-direction trap.
- Arabic long-form body face: `thmanyahsans` is authored for UI/prose; if a
  serif reading face is wanted later, `thmanyahseriftext` woff2s exist in the
  Thmanyah typeface release (same machine folder the shipped woff2s came from).

### 7. SEO / feeds (finish the loop)

- `app/sitemap.ts`: add `/[locale]/blog` + each generated post URL.
- hreflang via `alternates.languages` on every blog metadata (both locales).
- RSS (optional phase): one feed per locale (`/en/rss.xml`, `/ar/rss.xml`).

## Suggested execution order

1. `lib/blog.ts` loader + `content/posts/` sample bundle (one en + one ar post
   reused from the current `posts` stubs: "On Learning C Twice" ×2 locales is
   enough to prove everything).
2. `app/[locale]/blog/page.tsx` listing (ea-row styling, locale-aware).
3. `app/[locale]/blog/[slug]/page.tsx` post page + MDX pipeline + RTL prose.
4. Wire the one-pager WritingSection rows to real hrefs.
5. sitemap + hreflang + (optional) RSS.
6. Delete `BLOG_SPEC.md`; move the durable parts into AGENTS.md
   (map + gotchas) and DESIGN.md (typographic tokens).

## Verification (same gate as the repo)

`npx tsc --noEmit && npm run lint && npm run build`, then a dev-server smoke
test: `/en/blog`, `/ar/blog`, a post page in both locales, and the one-pager
writing rows linking through. Confirm no client-bundle regression on the
existing page (the concept's motion systems must stay untouched).

## Known open questions (decide while building, don't block)

- Policy for partial translations (hide en-only posts from /ar listing vs
  show with availability note) — start with "only show what exists".
- Post OG images: reuse the static OG layout (`app/[locale]/opengraph-image`)
  or per-post cards later; NOT in critical path.
- Comments/newsletter: out of scope.
