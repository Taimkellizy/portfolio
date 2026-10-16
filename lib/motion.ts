"use client";

import { useEffect, useState } from "react";
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
 * SSR-safe media query state. Returns `null` until measured (never on the
 * server), then the live match. Mount-dependent effects (WebGL quality
 * tiers) must gate on `!== null` so they read the right value on first
 * mount.
 */
export function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return matches;
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

/**
 * Pause/resume the shared Lenis clock for modal scroll locks (menu
 * dialog). No-ops when Lenis is absent (reduced motion / not yet
 * mounted) — pair with `document.body.style.overflow` for the lock.
 */
export function stopSmoothScroll() {
  _lenis?.stop();
}

export function startSmoothScroll() {
  _lenis?.start();
}

export function useSmoothScroll(enabled = true) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!enabled || reduced) return;
    let cleanup = () => {};
    let cancelled = false;

    (async () => {
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;

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

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [enabled, reduced]);
}

export { gsap, ScrollTrigger };
