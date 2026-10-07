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
3. **Cursor bubble** — white `mix-blend-mode: difference`, scales 2.2× over interactive elements
4. **Cases spectrum scroll** — images scale 1.0→1.5× at viewport center (cubic falloff)
5. **Menu spectrum hover** — links scale up to 4× at cursor with cubic falloff to neighbors

All animations respect `prefers-reduced-motion`.

## Components

### Right-side menu
- Trigger: fixed circular button (right-center), `Menu` icon
- Panel: 50vw, slides from right (`expo.out`, 650ms)
- Light bg `#f0eeeb`, dark text `#111`
- Nav links with spectrum hover (scale + opacity falloff)
- CTA pill, contact info, social links

### Cases section (joffreyspitzer.com layout)
- 16-column grid, `column-gap: 0.75rem`
- "Cases" label: `col-span-3`, sticky at `top: 55svh`, `margin-top: -30rem`
- Images: `col-start-7, col-span-6`, width `17.55vw`, gap `12px`
- Project names: `col-start-14, col-span-2`, sticky `bottom: 20px`, opacity `0.2→0.5` hover
- Image aspect ratios: `16/9` (showreel), `520/370` (others)

### Hairline rows (credentials/writing)
- 5-column grid: org / title / metric / year / arrow
- Hover: `translateX(10px)`, arrow shifts `translate(3px, -3px)`
- Arrow: Lucide `ArrowUpRight`, 16px, 1.5 stroke

### Footer
- Giant lowercase wordmark bleeding off left/bottom
- Link columns (Sitemap / Social / Contact)
- "Back to top" with `ArrowUp` icon, smooth Lenis scroll

## Icons

Lucide React (`lucide-react` v1.52). Stroke width 1.5, size 16-24.
Used: `Menu`, `X`, `ArrowUpRight`, `ArrowUp`, `Mail`.

## Placeholder content

Projects and posts are synthetic (labeled in `lib/content.ts`). Replace with real work. Assets in `assets/`.
