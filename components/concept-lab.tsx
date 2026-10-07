"use client";

import { useSmoothScroll } from "@/lib/motion";
import { EditorialVarA } from "@/concepts/editorial-var-a";

export function ConceptLab() {
  useSmoothScroll(true);
  return <EditorialVarA />;
}
