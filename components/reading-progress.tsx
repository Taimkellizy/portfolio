"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-linked reading progress (aria-hidden — decorative).
 *
 * Maps scroll position to a scaleX bar over the prose column. The
 * transform is set directly from a rAF-throttled scroll listener — no
 * tween, so there is nothing for reduced-motion to disable.
 */
export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let ticking = false;

    /* arrow consts so the `bar` narrowing survives into the closures */
    const measure = () => {
      ticking = false;
      const article = document.querySelector(".ea-prose");
      const end = article
        ? article.getBoundingClientRect().bottom + window.scrollY
        : document.documentElement.scrollHeight;
      const range = end - window.innerHeight;
      const progress = range > 0 ? window.scrollY / range : 1;
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="reading-progress" aria-hidden="true">
      <div ref={barRef} className="reading-progress__bar" />
    </div>
  );
}
