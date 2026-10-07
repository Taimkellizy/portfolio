"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

/**
 * Lenis smooth scroll driven from the GSAP ticker so a single clock
 * governs scroll and animation. Disabled entirely under reduced motion.
 */
let _lenis: import("lenis").default | null = null;

export function scrollToTop() {
  if (_lenis) {
    _lenis.scrollTo(0, { duration: 1.8, easing: (t: number) => 1 - Math.pow(1 - t, 3) });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

export function useSmoothScroll(enabled = true) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!enabled || reduced) return;
    let cleanup = () => {};

    (async () => {
      const { default: Lenis } = await import("lenis");

      const lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.4,
      });

      _lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);

      const tick = (time: number) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        _lenis = null;
      };
    })();

    return () => cleanup();
  }, [enabled, reduced]);
}

/**
 * Scoped GSAP context so every timeline a concept creates is reverted
 * when the concept unmounts (the lab swaps concepts on the same page).
 */
export function useGsapScope<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {}, el);
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger && el.contains(st.trigger as Node)) st.kill();
      });
    };
  }, []);

  return ref;
}

export { gsap, ScrollTrigger };
