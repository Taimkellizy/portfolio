"use client";

import { useSmoothScroll } from "@/lib/motion";
import { EditorialVarA } from "@/concepts/editorial-var-a";
import { LatticeLoaderScreen } from "@/components/lattice-loader-screen";

export function ConceptLab() {
  useSmoothScroll(true);
  return (
    <>
      <LatticeLoaderScreen />
      <EditorialVarA />
    </>
  );
}
