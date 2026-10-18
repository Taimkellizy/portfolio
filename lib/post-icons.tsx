import type { LucideIcon } from "lucide-react";
import {
  AtSign,
  BookOpen,
  Box,
  Calendar,
  Compass,
  Lock,
  Repeat,
  RotateCw,
  Sparkles,
  Star,
  Wrench,
} from "lucide-react";
import type { ReactNode } from "react";

/* Icon vocabulary for post table-of-contents branches. Keys are plain
   author-facing names referenced from a post's frontmatter navIcons
   map (keyed by heading slug); unknown names resolve to no icon, so a
   stale key degrades silently instead of breaking the page. Adding a
   new glyph is one registry entry — posts never change.

   lucide-react keeps the site's 1.5 stroke language; swap entries for
   hand-authored SVGs if a tighter brand set is ever wanted. */

const registry: Record<string, LucideIcon> = {
  calendar: Calendar,
  "at-sign": AtSign,
  sparkles: Sparkles,
  box: Box,
  compass: Compass,
  lock: Lock,
  star: Star,
  repeat: Repeat,
  "rotate-cw": RotateCw,
  "book-open": BookOpen,
  wrench: Wrench,
};

function ToCIcon(name: string | undefined): ReactNode {
  if (!name) return null;
  const Icon = registry[name];
  return Icon ? <Icon size={16} strokeWidth={1.5} aria-hidden="true" /> : null;
}

export { ToCIcon as navIcon };
