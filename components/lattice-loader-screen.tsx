"use client";

import { useEffect, useState } from "react";
import LatticeLoader from "./lattice-loader";
import "./lattice-loader-screen.css";

const MIN_SHOW = 1200;
const SAFETY = 4000;
const FADE = 600;

export function LatticeLoaderScreen() {
  const [faded, setFaded] = useState(false);
  const [gone, setGone] = useState(false);

  /* hold the screen at least MIN_SHOW, then reveal as soon as the page
     has actually loaded; anything weird triggers the SAFETY cap */
  useEffect(() => {
    let cancelled = false;
    const start = performance.now();
    const reveal = () => {
      const wait = Math.max(0, MIN_SHOW - (performance.now() - start));
      window.setTimeout(() => {
        if (!cancelled) setFaded(true);
      }, wait);
    };
    if (document.readyState === "complete") {
      reveal();
      return () => {
        cancelled = true;
      };
    }
    window.addEventListener("load", reveal, { once: true });
    const safety = window.setTimeout(reveal, SAFETY);
    return () => {
      cancelled = true;
      window.removeEventListener("load", reveal);
      window.clearTimeout(safety);
    };
  }, []);

  useEffect(() => {
    if (!faded) return;
    const id = window.setTimeout(() => setGone(true), FADE);
    return () => window.clearTimeout(id);
  }, [faded]);

  if (gone) return null;
  return (
    <div
      className={`ea-loading-screen${faded ? " ea-loading-screen--faded" : ""}`}
      aria-hidden="true"
    >
      <LatticeLoader
        label=""
        doneLabel=""
        errorLabel=""
        showTimer={false}
        grid={4}
        pattern="sweep"
        shape="round"
        cellSize={8}
        gap={3}
        glow
        glowColor="#9b7bb6"
      />
    </div>
  );
}
