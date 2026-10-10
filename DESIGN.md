# Design System

Design authority for Taim Kellizy's portfolio. Derived from taste references and the Ollef-inspired editorial world.

---

## Color

| Token | Value | Use |
|-------|-------|-----|
| `--ea-bg` | `#0c0c0e` | Page background (near-black) |
| `--ea-ink` | `#e8e6e1` | Primary text (warm off-white) |
| `--ea-ink-soft` | `rgba(232, 230, 225, 0.78)` | Secondary text |
| `--ea-ink-mute` | `rgba(232, 230, 225, 0.5)` | Tertiary text, labels |
| `--ea-line` | `rgba(232, 230, 225, 0.14)` | Hairline borders |
| `--ea-menu-bg` | `#f0eeeb` | Slide-in menu panel (light) |
| `--ea-menu-ink` | `#111` | Menu panel text (dark) |

Selection: `#f2f0ec` on `#060607`.

## Typography

Primary: **Outfit** (variable 100-900) — display, headings, wordmark.
Body: **Work Sans** (variable 100-900) — paragraphs, data.
Mono: **Office Code Pro** — labels, metadata, code.

| Role | Font | Weight | Size |
|------|------|--------|------|
| Giant wordmark | Outfit | 800 | `clamp(120px, 31vw, 640px)` |
| Section title | Outfit | 600 | `clamp(30px, 4.2vw, 58px)` |
| Hero bio | Outfit | 600 | `clamp(20px, 2.1vw, 34px)` |
| Body text | Work Sans | 420 | `clamp(19px, 2vw, 28px)` |
| Row title | Outfit | 600 | `21px` |
| Small label | Work Sans | 600 | `11px`, `letter-spacing: 0.14em`, uppercase |
| Menu link | Outfit | 700 | `clamp(16px, 1.8vw, 24px)` |
| Menu panel nav | Outfit | 700 | `clamp(28px, 3vw, 38px)` |

## Layout

- Max content width: `680px` (bio text)
- Page padding: `32px` (desktop), `20px` (mobile)
- Section margin-top: `clamp(110px, 16vh, 200px)`
- Hairline rows: `1px` bottom border, `24px` vertical padding
- Footer: full-viewport height with giant wordmark bleeding off edges

## Motion

Easing tokens:
- `--ease-out`: `cubic-bezier(0.16, 1, 0.3, 1)` (primary)
- `--ease-in-out`: `cubic-bezier(0.65, 0, 0.35, 1)`

Signature animations:
1. **Magnetic wordmark** — letters displace up to 6px near cursor (380px radius)
2. **Letter disassembly** — hero words burst outward in circular pattern on cursor proximity
3. **Cursor bubble** — 44px white circle, `mix-blend-mode: difference`, scales 2.2× over links/buttons; native cursor is `cursor: none` site-wide (hover-capable devices only). `.ea` root carries `isolation: isolate` so the blend resolves against one group.
4. **Cases vertical slider** (joffreyspitzer technique) — ScrollTrigger scrub timeline; each plate scales 17.55vw→36vw (`scaleX/scaleY`, left-top origin) at viewport centre, then collapses; active name syncs opacity 1/0.2 + weight 700/500
5. **Menu word zones** — hovered word snaps to scale 3 + full opacity inside its ±22px band; neighbours push away by half the growth (measured untransformed on mouseenter)
6. **Spectral row sweep** — 1px underline over rows on hover, cycling the burst shader's hue ramp (sampled stops paled toward ground) with a travelling white hotspot; animation paused at rest
7. **Variable-weight headers** — sub-headers (section titles, Cases, footer col titles): per-char `font-weight` lerps toward 860 within 120px of the cursor (quadratic falloff), driven on SplitText `.char` spans
8. **Prismatic Burst** — WebGL (`ogl`) chromatic ray fan: hero top-left corner (centre of the hero suppressed, rays leak through corner mask), footer bottom-right echo at lower intensity
9. **Lattice loading screen** — fixed full-viewport overlay, 4×4 `sweep` wave, violet glow halo, min 1.2s hold + `load` event, 600ms fade, unmounts

All animations respect `prefers-reduced-motion` (WebGL pieces and the loading wave simply don't render/animate).

## Components

### Right-side menu
- Trigger: fixed circular button (right-center), solid `#0c0c0e` fill, `Menu` icon
- Panel: 50vw, slides from right (`expo.out`, 650ms), closes smoothly on X / overlay click / Escape
- Light bg `#f0eeeb`, dark text `#111`
- Nav links: zone-based scale hover (see Motion #5)
- CTA pill, contact info, social links (GitHub, LinkedIn, Instagram)

### Cases section (joffreyspitzer.com layout)
- 3-column grid: `1fr minmax(0, auto) 1fr` — image column centred, sticky title left, sticky names right
- "Cases" title + names both sticky at `top: 55vh / height: 45vh`, `align-self: start`, 20px bottom padding (same level)
- Plates: width `17.55vw`, gap `12px`, scrub-scaled to `36vw` at centre (see Motion #4)
- Names: opacity 0.2 / active 1, weight 500 / active 700 (timeline-driven, no CSS transition)
- Project images: `<img class="ea-case__img">` (`object-fit: cover`) renders over the `Plate` gradient when `image` is set in `lib/content.ts`; gradient is fallback only
- Image aspect ratios: `16/9` (wide), `520/370` (landscape)

### Hairline rows (experience/credentials/writing)
- 5-column grid: org / title / metric / year / arrow
- Hover: `translateX(10px)`, arrow shifts `translate(3px, -3px)`, spectral sweep (see Motion #6)
- Arrow: Lucide `ArrowUpRight`, 16px, 1.5 stroke
- Section titles no longer carry their own border — rows' top/bottom borders do all dividing

### Backdrops & screens
- **Hero Prismatic Burst**: corner-masked (`radial-gradient 80% 90% at 0 0`), `intensity 3.2, speed 0.32`, `mixBlendMode: lighten`
- **Footer burst echo**: mirrored mask (bottom-right), `intensity 2.2, speed 0.25`
- **Loading screen**: `.ea-loading-screen`, z-index 10000, Outfit 15px, `LatticeLoader` grid 4 / sweep / glow `#9b7bb6`

### Footer
- Giant lowercase wordmark bleeding off left/bottom
- Link columns (Sitemap / Social / Contact)
- "Back to top" with `ArrowUp` icon, smooth Lenis scroll

## Icons

Lucide React (`lucide-react` v1.52). Stroke width 1.5, size 16-24.
Used: `Menu`, `X`, `ArrowUpRight`, `ArrowUp`, `Mail`.

## Content

All content lives in `lib/content.ts` and is **real** (no synthetic placeholders): person, skills, credentials (certificates/education), experience (roles), projects (Arabify, Shaghal, This Portfolio), posts. Only the case-study **images** are still pending. Keep the hierarchy software-dev-first.
