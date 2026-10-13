import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/motion";
import type { RefObject } from "react";

/* The plate is authored at 17.55vw and expands to 36vw at the viewport
   centre; the expanded/base ratio drives every scale and height. */
const BASE_VW = 17.55;
const EXPANDED_VW = 36;
const IDLE_NAME_OPACITY = 0.55;

/**
 * The joffreyspitzer vertical cases slider (desktop >900px only).
 *
 * It measures each plate's rect and sets explicit item heights; a
 * scrubbed timeline then scales plates base → expanded → base while the
 * active project name syncs opacity/weight. A resize beyond the drift
 * thresholds tears the context down and re-measures from scratch — don't
 * restructure that DOM; the mobile presentation is layered on top.
 */
export function useCasesSlider(
  root: RefObject<HTMLDivElement | null>,
  reduced: boolean,
) {
  useEffect(() => {
    if (!root.current || reduced) return;
    let ctx: ReturnType<typeof gsap.context> | null = null;
    let trackedWidth = window.innerWidth;
    let trackedHeight = window.innerHeight;

    const setup = () => {
      ctx?.revert();
      ctx = null;
      if (window.innerWidth <= 900) return;

      ctx = gsap.context(() => {
        const items = gsap.utils.toArray<HTMLElement>(".ea-case");
        const titles = gsap.utils.toArray<HTMLElement>(".ea-case-name");
        if (!items.length || !titles.length) return;
        buildSliderTimeline(items, titles);
      }, root);
    };

    setup();

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const dw = Math.abs(window.innerWidth - trackedWidth);
        const dh = Math.abs(window.innerHeight - trackedHeight);
        /* ignore small resizes (mobile URL bars, devtools toggles) */
        if (dw < 10 && dh < 120) return;
        trackedWidth = window.innerWidth;
        trackedHeight = window.innerHeight;
        setup();
        ScrollTrigger.refresh();
      }, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
      ctx?.revert();
    };
  }, [root, reduced]);
}

function buildSliderTimeline(
  items: HTMLElement[],
  titles: HTMLElement[],
) {
  const scaleExpanded = EXPANDED_VW / BASE_VW;

  const { firstOf, lastOf } = projectBoundaries(items);

  const baseHeights: number[] = [];
  const expHeights: number[] = [];

  items.forEach((item, d) => {
    const media = item.querySelector<HTMLElement>(".ea-case__plate");
    if (!media) return;
    const initScale = d === 0 ? scaleExpanded : 1;
    gsap.set(media, {
      width: `${BASE_VW}vw`,
      transformOrigin: "left top",
      scaleX: initScale,
      scaleY: initScale,
      force3D: true,
    });
    const scaledHeight = media.getBoundingClientRect().height;
    const baseHeight = scaledHeight / initScale;
    baseHeights[d] = baseHeight;
    expHeights[d] = baseHeight * scaleExpanded;
    gsap.set(item, { height: initScale === 1 ? baseHeight : expHeights[d] });
  });

  const activeIdx = Number(items[0]?.dataset.projectIndex ?? 0);
  titles.forEach((t, d) => {
    gsap.set(t, {
      opacity: d === activeIdx ? 1 : IDLE_NAME_OPACITY,
      fontWeight: d === activeIdx ? 700 : 500,
    });
  });

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".ea-cases",
      start: "top-=6.5% center",
      end: "bottom center-=0.5%",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  items.forEach((item, d) => {
    const media = item.querySelector<HTMLElement>(".ea-case__plate");
    const projectIdx = Number(item.dataset.projectIndex ?? d);
    const title = titles[projectIdx];
    const baseHeight = baseHeights[d] ?? 0;
    const expHeight = expHeights[d] ?? baseHeight * scaleExpanded;
    if (!media || !title) return;

    const isFirst = firstOf.get(projectIdx) === item;
    const isLast = lastOf.get(projectIdx) === item;

    timeline.to(
      media,
      {
        scaleX: scaleExpanded,
        scaleY: scaleExpanded,
        force3D: true,
        duration: 0.8,
        ease: "none",
      },
      d,
    );
    if (isFirst)
      timeline.to(
        title,
        { opacity: 1, fontWeight: 700, duration: 0.4, ease: "none" },
        "<",
      );
    timeline.to(item, { height: expHeight, duration: 0.8, ease: "none" }, "<");

    timeline.to(
      media,
      {
        scaleX: 1,
        scaleY: 1,
        force3D: true,
        duration: 1.5,
        ease: "none",
        delay: 0.3,
      },
      ">",
    );
    if (isLast)
      timeline.to(
        title,
        { opacity: IDLE_NAME_OPACITY, fontWeight: 500, duration: 0.4, ease: "none" },
        "<",
      );
    timeline.to(item, { height: baseHeight, duration: 1.5, ease: "none" }, "<");
  });
}

/* A project can span several plates; the name lights up when its first
   plate expands and dims when its last one collapses. */
function projectBoundaries(items: HTMLElement[]) {
  const firstOf = new Map<number, HTMLElement>();
  const lastOf = new Map<number, HTMLElement>();
  items.forEach((item) => {
    const idx = Number(item.dataset.projectIndex ?? 0);
    if (!firstOf.has(idx)) firstOf.set(idx, item);
    lastOf.set(idx, item);
  });
  return { firstOf, lastOf };
}
