/* Shared constants and trivial helpers for the editorial-var-a concept. */

export const HERO_WORD = "taim";

export const BIO_WORDS =
  "I'm Taim Kellizy — a software developer and CS student based in Syria, building web apps and browser extensions with React and TypeScript.".split(
    " ",
  );

/* Plate gradients cycling across the case media. */
export const PLATE_PALETTES = [
  { from: "#23203a", to: "#5d4b8a" },
  { from: "#1e2b28", to: "#6f8a7d" },
  { from: "#2c2430", to: "#4f3d6b" },
  { from: "#242428", to: "#6e6e78" },
];

export const MENU_LINKS = [
  { label: "Work", href: "#ea-work" },
  { label: "Experience", href: "#ea-experience" },
  { label: "Credentials", href: "#ea-credentials" },
  { label: "Writing", href: "#ea-writing" },
  { label: "Contact", href: "#ea-contact" },
];

/* Pointer-driven effects must not run on touch layouts, where there is no
   hover. Checked at effect time (not reactive) — same behaviour as before. */
export function isTouchLayout() {
  return matchMedia("(hover: none)").matches;
}

/* External links open in a new tab, un-refererred. Internal anchors get
   an empty attrs object so spreads stay uniform. */
export function newTabProps(href: string): { target?: string; rel?: string } {
  return href.startsWith("http")
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
}
