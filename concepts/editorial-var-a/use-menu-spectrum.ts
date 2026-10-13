import { useEffect } from "react";
import { isTouchLayout } from "./shared";
import type { RefObject } from "react";

/* zone = the word's box plus ZONE_PAD on each side, in the vertical
   stack. Words snap to full size within their zone, everything else
   rests — no per-frame ramp. */
const ZONE_PAD = 22;
const ACTIVE_SCALE = 3;
const IDLE_OPACITY = "0.2";

interface Zone {
  el: HTMLElement;
  cy: number;
  half: number;
}

/**
 * Menu word zones: the hovered word snaps to scale 3 with full opacity
 * inside its ±22px band; neighbours get pushed away by half the active
 * word's growth so nothing collides.
 *
 * Zone centres are measured on mouseenter, deliberately untransformed —
 * a scaled rect would feed the hover state back into itself and make
 * everything wiggle. Keep this zone-based; a continuous falloff doesn't
 * hold up (it wiggles).
 */
export function useMenuSpectrum(
  root: RefObject<HTMLDivElement | null>,
  reduced: boolean,
) {
  useEffect(() => {
    if (!root.current || reduced) return;
    if (isTouchLayout()) return;

    const container = root.current.querySelector<HTMLElement>("[data-spectrum]");
    if (!container) return;

    const items = Array.from(
      container.querySelectorAll<HTMLElement>("[data-spectrum-item]"),
    );
    if (!items.length) return;

    let rest: Zone[] = [];

    const setActive = (el: HTMLElement | null) => {
      const idx = el ? items.indexOf(el) : -1;
      items.forEach((item, j) => {
        if (j === idx) {
          item.style.transform = `scale(${ACTIVE_SCALE})`;
          item.style.opacity = "1";
        } else {
          const push = idx === -1 ? 0 : (ACTIVE_SCALE - 1) * (rest[j]?.half ?? 0);
          const dir = j < idx ? -1 : j > idx ? 1 : 0;
          item.style.transform = `translateY(${(push * dir).toFixed(1)}px) scale(1)`;
          /* dimmed only while the zone hover is live; on leave everything
             rests at full opacity again (matches the pre-hover CSS state) */
          item.style.opacity = idx === -1 ? "1" : IDLE_OPACITY;
        }
      });
    };

    const onEnter = () => {
      rest = items.map((el) => {
        const r = el.getBoundingClientRect();
        return { el, cy: r.top + r.height / 2, half: r.height / 2 };
      });
    };

    const onMove = (e: MouseEvent) => {
      let nearest: (Zone & { d: number }) | null = null;
      for (const entry of rest) {
        const d = Math.abs(e.clientY - entry.cy);
        if (d < (nearest ? nearest.d : Infinity)) {
          nearest = { ...entry, d };
        }
      }
      setActive(
        nearest && nearest.d <= nearest.half + ZONE_PAD ? nearest.el : null,
      );
    };

    const onLeave = () => setActive(null);

    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);

    return () => {
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
      setActive(null);
    };
  }, [root, reduced]);
}
