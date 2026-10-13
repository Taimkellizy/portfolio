import { useEffect } from "react";
import { isTouchLayout } from "./shared";
import type { RefObject } from "react";

const ATTRACTION_RADIUS = 380;
const ATTRACTION_FORCE = 6;

/**
 * The giant wordmark leans toward the cursor: each letter translates up
 * to `ATTRACTION_FORCE` px along the pointer direction, easing back to
 * rest when the pointer leaves.
 */
export function useMagneticWordmark(
  giant: RefObject<HTMLHeadingElement | null>,
  reduced: boolean,
) {
  useEffect(() => {
    if (!giant.current || reduced) return;
    const el = giant.current;
    const letters = el.querySelectorAll<HTMLElement>(".ea-giant__letter");
    if (!letters.length) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        letters.forEach((letter) => {
          const rect = letter.getBoundingClientRect();
          const dx = e.clientX - (rect.left + rect.width / 2);
          const dy = e.clientY - (rect.top + rect.height / 2);
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < ATTRACTION_RADIUS && dist > 0) {
            const force = (1 - dist / ATTRACTION_RADIUS) * ATTRACTION_FORCE;
            const tx = (dx / dist) * force;
            const ty = (dy / dist) * force;
            letter.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`;
          } else {
            letter.style.transform = "translate(0, 0)";
          }
        });
      });
    };
    const onLeave = () => {
      letters.forEach((letter) => {
        letter.style.transform = "translate(0, 0)";
      });
    };

    if (!isTouchLayout()) {
      window.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [giant, reduced]);
}
