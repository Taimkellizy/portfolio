"use client";

import { useEffect, useState } from "react";
import { useSmoothScroll } from "@/lib/motion";
import { EditorialScatter } from "@/concepts/editorial-scatter";
import { GrainyBloom } from "@/concepts/grainy-bloom";
import { SwissMonoFlood } from "@/concepts/swiss-monoflood";
import { SlideRack } from "@/concepts/slide-rack";
import { CracktroVoid } from "@/concepts/cracktro-void";

type ConceptId = "editorial" | "bloom" | "swiss" | "rack" | "void";

const CONCEPTS: {
  id: ConceptId;
  name: string;
  key: string;
  dot: string;
  blurb: string;
  Component: React.ComponentType;
}[] = [
  {
    id: "editorial",
    name: "Editorial Scatter",
    key: "1",
    dot: "#b794e9",
    blurb: "Giant type, drifting rotated plates, asymmetric calm",
    Component: EditorialScatter,
  },
  {
    id: "bloom",
    name: "Grainy Bloom",
    key: "2",
    dot: "#ed7aba",
    blurb: "Dithered gradient field, slab lettering, star marquees",
    Component: GrainyBloom,
  },
  {
    id: "swiss",
    name: "Swiss MonoFlood",
    key: "3",
    dot: "#4ba7c6",
    blurb: "One saturated flood, product precision, ticker",
    Component: SwissMonoFlood,
  },
  {
    id: "rack",
    name: "Slide Rack",
    key: "4",
    dot: "#fcae1e",
    blurb: "Raked glass slides, one type size, traveling light",
    Component: SlideRack,
  },
  {
    id: "void",
    name: "Cracktro Void",
    key: "5",
    dot: "#97affe",
    blurb: "Depth as rank, drifting dust fields, emissive black",
    Component: CracktroVoid,
  },
];

export function ConceptLab() {
  const [active, setActive] = useState<ConceptId>("editorial");
  useSmoothScroll(true);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get(
      "c"
    ) as ConceptId | null;
    if (fromUrl && CONCEPTS.some((c) => c.id === fromUrl)) setActive(fromUrl);
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("c", active);
    window.history.replaceState(null, "", url.toString());
  }, [active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const idx = CONCEPTS.findIndex((c) => c.key === e.key);
      if (idx >= 0 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const el = document.activeElement;
        if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;
        setActive(CONCEPTS[idx].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [active]);

  const current = CONCEPTS.find((c) => c.id === active)!;
  const Current = current.Component;

  return (
    <>
      <div key={active} data-concept={active}>
        <Current />
      </div>

      <nav className="lab-switch" aria-label="Design concept switcher">
        <div className="lab-switch__title">
          <b>Concept Lab</b>
          <span className="lab-switch__sep" />
        </div>
        {CONCEPTS.map((c) => (
          <button
            key={c.id}
            type="button"
            className="lab-switch__btn"
            aria-pressed={active === c.id}
            onClick={() => setActive(c.id)}
            title={c.blurb}
          >
            <span
              className="lab-switch__dot"
              style={{ background: c.dot }}
              aria-hidden="true"
            />
            {c.name}
            <span className="lab-switch__key">{c.key}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
