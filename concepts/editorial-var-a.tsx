"use client";

import { useRef } from "react";
import { usePrefersReducedMotion, useMediaQuery } from "@/lib/motion";
import { useMenuDialog } from "./editorial-var-a/use-menu-dialog";
import { useEntranceReveals } from "./editorial-var-a/use-entrance-reveals";
import { useHeroCursor } from "./editorial-var-a/use-hero-cursor";
import { useMagneticWordmark } from "./editorial-var-a/use-magnetic-wordmark";
import { useMenuSpectrum } from "./editorial-var-a/use-menu-spectrum";
import { useVariableWeight } from "./editorial-var-a/use-variable-weight";
import { useCasesSlider } from "./editorial-var-a/use-cases-slider";
import {
  MenuDialog,
  HeroSection,
  BioSection,
  SkillsSection,
  CasesSection,
  ExperienceSection,
  CredentialsSection,
  WritingSection,
  SiteFooter,
} from "./editorial-var-a/sections";
import "./editorial-var-a.css";

/**
 * editorial-var-a: the live design concept. Side effects are grouped into
 * single-purpose hooks (all scoped to the concept root and keyed on the
 * reduced-motion flag); sections.tsx holds the markup.
 */
export function EditorialVarA() {
  const root = useRef<HTMLDivElement>(null);
  const giantRef = useRef<HTMLHeadingElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const reduced = usePrefersReducedMotion();
  /* phones/tablets get the lite render tier (≈3x fewer pixels); null
     until measured so the bursts mount with the right scale */
  const narrow = useMediaQuery("(max-width: 900px)");

  /* hook order doubles as effect order — the menu's visibility effect
     must run before its dialog effect (initial focus needs a visible
     panel), and the entrance reveals must come before the cursor's
     char-splitting so the hero words are still intact when the timeline
     captures them */
  const menu = useMenuDialog();
  useEntranceReveals(root, reduced);
  useHeroCursor({ root, cursor: cursorRef, reduced });
  useMagneticWordmark(giantRef, reduced);
  useMenuSpectrum(root, reduced);
  useVariableWeight(root, reduced);
  useCasesSlider(root, reduced);

  return (
    <div className="ea" ref={root}>
      {/* keyboard: fixed chrome comes first in DOM order, so jump
          straight past it to the content */}
      <a className="ea-skip" href="#ea-main" inert={menu.menuOpen}>
        Skip to content
      </a>

      {/* cursor bubble */}
      <div
        className="ea-cursor"
        ref={cursorRef}
        aria-hidden="true"
        hidden={reduced}
      />

      <MenuDialog menu={menu} />

      <main id="ea-main" tabIndex={-1} inert={menu.menuOpen}>
        <HeroSection
          reduced={reduced}
          narrow={narrow}
          giantRef={giantRef}
        />
        <BioSection />
        <SkillsSection />
        <CasesSection />
        <ExperienceSection />
        <CredentialsSection />
        <WritingSection />
      </main>

      <SiteFooter
        reduced={reduced}
        narrow={narrow}
        menuOpen={menu.menuOpen}
      />
    </div>
  );
}
