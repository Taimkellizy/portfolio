import { useEffect } from "react";
import { gsap } from "@/lib/motion";
import { SplitText } from "gsap/SplitText";
import type { RefObject } from "react";

const REVEAL_START = "top 88%";

/**
 * Entrance choreography, scoped to the concept root. Motion guidance the
 * old code carried as comments, still true:
 *
 * - Entrance tweens use fromTo with explicit end values — never `from`.
 *   Under React, `from` can capture its end state after the from-state is
 *   applied, freezing letters/links mid-entrance (seen: letters stuck at
 *   yPercent 55, links at opacity 0).
 * - Fade-up handles layout blocks (grids/flex) — SplitText must not touch
 *   those, or it shatters their layout into fake "lines".
 * - Titles split with a chars mask; text blocks split with a lines mask.
 */
export function useEntranceReveals(
  root: RefObject<HTMLDivElement | null>,
  reduced: boolean,
) {
  useEffect(() => {
    if (!root.current || reduced) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.fromTo(
        "[data-hero-letter]",
        { yPercent: 55, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.35,
          stagger: 0.055,
        },
        0.18,
      ).fromTo(
        "[data-hero-scroll]",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        0.75,
      );

      gsap.utils.toArray<HTMLElement>("[data-reveal-fade]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 26, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: REVEAL_START },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        if (el.hasAttribute("data-reveal-title")) {
          applyCharMaskReveal(el);
        } else {
          applyLineMaskReveal(el);
        }
        el.setAttribute("data-split", "1");
      });
    }, root);
    return () => ctx.revert();
  }, [root, reduced]);
}

/* Titles: per-char mask flying down into place. */
function applyCharMaskReveal(el: HTMLElement) {
  return new SplitText(el, {
    type: "words, chars",
    autoSplit: true,
    mask: "chars",
    charsClass: "char",
    onSplit: (self) =>
      gsap.fromTo(
        self.chars,
        { yPercent: -120, scale: 1.2 },
        {
          yPercent: 0,
          scale: 1,
          duration: 1,
          stagger: 0.01,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: REVEAL_START },
        },
      ),
  });
}

/* Paragraphs: per-line mask rising into place. */
function applyLineMaskReveal(el: HTMLElement) {
  return new SplitText(el, {
    type: "lines, words",
    autoSplit: true,
    mask: "lines",
    linesClass: "line",
    onSplit: (self) =>
      gsap.fromTo(
        self.lines,
        { yPercent: 105 },
        {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.04,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: REVEAL_START },
        },
      ),
  });
}
