"use client";

import { useSmoothScroll } from "@/lib/motion";
import { EditorialVarA } from "@/concepts/editorial-var-a";
import { LatticeLoaderScreen } from "@/components/lattice-loader-screen";
import type { WritingRow } from "@/lib/blog";

export function ConceptLab({
  locale,
  writingRows,
}: {
  locale: "en" | "ar";
  writingRows: WritingRow[];
}) {
  useSmoothScroll(true);
  return (
    <>
      <LatticeLoaderScreen />
      <EditorialVarA locale={locale} writingRows={writingRows} />
    </>
  );
}
