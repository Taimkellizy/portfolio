import { useEffect } from "react";
import { isTouchLayout } from "./shared";
import type { RefObject } from "react";

const RANGE = 120;
const PEAK = 860;

/**
 * Variable-weight titles: boldness follows the cursor.
 *
 * The weight rides the SplitText ".char" spans the reveal effect already
 * builds, so chars are queried lazily on every frame — autoSplit rebuilds
 * them on resize.
 */
export function useVariableWeight(
  root: RefObject<HTMLDivElement | null>,
  reduced: boolean,
  arabic: boolean = false,
) {
  useEffect(() => {
    if (!root.current || reduced) return;
    if (arabic) return; /* static-weight face, no .char spans */
    if (isTouchLayout()) return;

    const targets = Array.from(
      root.current.querySelectorAll<HTMLElement>("[data-variable-weight]"),
    );
    if (!targets.length) return;

    const baseOf = new Map<HTMLElement, number>();
    targets.forEach((t) => {
      baseOf.set(t, parseFloat(getComputedStyle(t).fontWeight) || 600);
    });

    let raf = 0;
    const update = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        targets.forEach((t) => setWeightNearCursor(t, baseOf.get(t) ?? 600, e));
      });
    };

    const reset = () => {
      targets.forEach(resetTitleWeights);
    };

    window.addEventListener("mousemove", update);
    document.documentElement.addEventListener("mouseleave", reset);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", update);
      document.documentElement.removeEventListener("mouseleave", reset);
    };
  }, [root, reduced, arabic]);
}

function charsOf(title: HTMLElement) {
  return title.querySelectorAll<HTMLElement>(".char");
}

function setWeightNearCursor(
  title: HTMLElement,
  base: number,
  e: MouseEvent,
) {
  charsOf(title).forEach((ch) => {
    const r = ch.getBoundingClientRect();
    if (r.width === 0) return;
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);
    let w = base;
    if (dist < RANGE) {
      const lerp = 1 - dist / RANGE;
      w = base + (PEAK - base) * lerp * lerp;
    }
    const wi = Math.round(w);
    if (ch.dataset.w !== String(wi)) {
      ch.dataset.w = String(wi);
      ch.style.fontWeight = String(wi);
    }
  });
}

function resetTitleWeights(title: HTMLElement) {
  charsOf(title).forEach((ch) => {
    ch.dataset.w = "";
    ch.style.fontWeight = "";
  });
}
