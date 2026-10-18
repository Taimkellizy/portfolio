"use client";

import { useEffect, useState } from "react";
import BranchedMenu, { type BranchedMenuItem } from "./branched-menu";
import { navIcon } from "@/lib/post-icons";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/motion";

/* Table of contents for a blog post: one branch per h2, nested h3
   leaves. Built client-side from the rendered article headings (they
   carry rehype-slug ids), so the tree can never drift from the prose;
   branch icons come from the post's navIcons frontmatter map keyed by
   the same slugs. Scroll-spy drives the traced line; a branch click
   scrolls the article to that heading. Sits on the inline-start side
   (grid column 1); collapses behind a <details> on phones. */

interface PostTocProps {
  summaryLabel: string;
  navIcons: Record<string, string>;
}

/* Active-section rule, scored by how much of the viewport each section
   occupies. Every section claims its own heading: spans start a lead
   cushion (LEAD) above the heading top, and the first section extends
   up to the post title (h1) so the lead region counts from page top.
   Precedence: a section seated entirely inside the viewport wins (the
   first of those if several), otherwise the largest visible portion —
   and at the very end of the document the last section is current
   (trailing short sections can never out-measure the one above them). */
const LEAD = 140;
const END_SLACK = 16;

function buildItems(
  headings: HTMLElement[],
  navIcons: Record<string, string>,
): BranchedMenuItem[] {
  const items: BranchedMenuItem[] = [];
  for (const heading of headings) {
    const label = (heading.textContent ?? "").trim();
    if (label.length === 0) continue;
    const icon = navIcon(navIcons[heading.id]);
    if (heading.tagName === "H3" && items.length > 0) {
      const parent = items[items.length - 1];
      (parent.children ??= []).push({ value: heading.id, label, icon });
    } else {
      items.push({ label, value: heading.id, icon });
    }
  }
  return items;
}

export function PostToc({ summaryLabel, navIcons }: PostTocProps) {
  const reduced = usePrefersReducedMotion();
  const narrow = useMediaQuery("(max-width: 900px)");
  const [items, setItems] = useState<BranchedMenuItem[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const collect = () => {
  const heads = Array.from(
    document.querySelectorAll<HTMLElement>(".ea-prose :is(h2[id], h3[id])"),
  );
  if (heads.length === 0) return;
  setItems(buildItems(heads, navIcons));
      return heads;
    };
    const heads = collect();
    if (!heads) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const viewport = window.innerHeight;
      const tops = heads.map((heading) => heading.getBoundingClientRect().top);
      const documentEnd = document.documentElement.scrollHeight - window.scrollY;

      /* at the end the reader is in the last section — trailing short
         sections can never out-measure the one above them */
      if (documentEnd <= viewport + END_SLACK) {
        setActiveId(heads[heads.length - 1].id);
        return;
      }

      /* the first section spans from the post title down */
      const article = document.querySelector<HTMLElement>(".blog-post");
      const lead = article ? Math.min(tops[0], article.getBoundingClientRect().top) : tops[0];

      let firstFull = -1;
      let best = 0;
      let bestIndex = 0;
      for (let i = 0; i < heads.length; i++) {
        const top = i === 0 ? lead : tops[i] - LEAD;
        const bottom = i + 1 < heads.length ? tops[i + 1] - LEAD : documentEnd;
        if (top >= 0 && bottom <= viewport && firstFull < 0) {
          firstFull = i;
        }
        const visible = Math.max(0, Math.min(bottom, viewport) - Math.max(top, 0));
        if (visible > best) {
          best = visible;
          bestIndex = i;
        }
      }
      setActiveId(
        firstFull >= 0 ? heads[firstFull].id : heads[bestIndex].id,
      );
    };

    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, [navIcons]);

  const select = (value: string) => {
    document
      .getElementById(value)
      ?.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
  };

  if (narrow === null || items.length === 0) return null;

  const menu = (
    <BranchedMenu
      items={items}
      defaultOpen={items.map((_, index) => index)}
      activeValue={activeId}
      onSelect={select}
    />
  );

  if (narrow) {
    return (
      <details className="post-toc post-toc--folded">
        <summary className="u-label">{summaryLabel}</summary>
        {menu}
      </details>
    );
  }

  return (
    <aside className="post-toc" aria-label={summaryLabel}>
      {menu}
    </aside>
  );
}
