"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/motion";
import { findSpans, type SearchSpan } from "@/lib/search";

/* Find-in-page for the post: highlights matches over the article with
   the CSS Custom Highlight API (no DOM mutation â€” nothing for React to
   trip over, no Arabic shaping to break), falling back to wrapping
   text nodes in <mark> where the API is missing. Code blocks are
   searched like any other text (product decision); generated line
   numbers are CSS counters, so they never match. */

const HL_HITS = "post-search-hits";
const HL_ACTIVE = "post-search-active";
/* subtrees never searched: the ToC and topic chips duplicate post copy,
   the code shell bar is chrome, and the search box lives in here too */
const SKIP = ".post-toc, .blog-topics, .code-shell__bar, .post-bar__search";

interface Piece {
  node: Text;
  start: number; // offset into the concatenated article text
}

type HighlightCtor = new (...ranges: Range[]) => object;

type HighlightRegistry = Map<string, unknown>;

function highlightRegistry(): HighlightRegistry | null {
  if (typeof window === "undefined") return null;
  if (typeof (window as unknown as { Highlight?: unknown }).Highlight !== "function")
    return null;
  const registry = (CSS as unknown as { highlights?: HighlightRegistry })
    .highlights;
  return registry ?? null;
}

interface Located {
  node: Text;
  offset: number;
}

function collectText(root: Element): { text: string; pieces: Piece[] } {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || parent.closest(SKIP)) return NodeFilter.FILTER_REJECT;
      return (node as Text).data.length > 0
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  });
  let text = "";
  const pieces: Piece[] = [];
  let current = walker.nextNode();
  while (current) {
    const node = current as Text;
    pieces.push({ node, start: text.length });
    text += node.data;
    current = walker.nextNode();
  }
  return { text, pieces };
}

function locate(pieces: Piece[], target: number): Located | null {
  for (const piece of pieces) {
    const end = piece.start + piece.node.data.length;
    if (target >= piece.start && target <= end) {
      return { node: piece.node, offset: target - piece.start };
    }
  }
  return null;
}

function rangesFor(pieces: Piece[], spans: SearchSpan[]): Range[] {
  const ranges: Range[] = [];
  for (const span of spans) {
    const start = locate(pieces, span.start);
    const end = locate(pieces, span.end);
    if (!start || !end) continue;
    const range = document.createRange();
    range.setStart(start.node, start.offset);
    range.setEnd(end.node, end.offset);
    ranges.push(range);
  }
  return ranges;
}

/* Fallback for engines without the Highlight API: split text nodes and
   wrap each match in a <mark>. Spans never cut Arabic words mid-word
   (findSpans word-aligns them), so shaping survives the split. */
function wrapMarks(pieces: Piece[], spans: SearchSpan[]): HTMLElement[] {
  const byNode = new Map<Text, Array<{ start: number; end: number }>>();
  for (const span of spans) {
    for (const piece of pieces) {
      const nodeEnd = piece.start + piece.node.data.length;
      if (span.end <= piece.start || span.start >= nodeEnd) continue;
      const list = byNode.get(piece.node) ?? [];
      list.push({
        start: Math.max(span.start - piece.start, 0),
        end: Math.min(span.end, nodeEnd) - piece.start,
      });
      byNode.set(piece.node, list);
    }
  }
  const marks: HTMLElement[] = [];
  for (const [node, ops] of byNode) {
    const local: HTMLElement[] = [];
    /* backwards keeps the earlier offsets valid while splitting */
    for (const op of [...ops].sort((a, b) => b.start - a.start)) {
      node.splitText(op.end);
      const mid = op.start > 0 ? node.splitText(op.start) : node;
      const mark = document.createElement("mark");
      mark.className = "post-search-hit";
      mid.parentNode?.replaceChild(mark, mid);
      mark.appendChild(mid);
      local.push(mark);
    }
    marks.push(...local.reverse());
  }
  return marks;
}

export interface PostSearchLabels {
  findInPost: string;
  searchPrev: string;
  searchNext: string;
  searchClear: string;
  searchNoMatches: string;
}

type SearchState = { count: number; active: number } | null;

/**
 * In-post word search: input + match counter + prev/next, rendered as a
 * slot inside the post bar (see BlogPostBar's searchSlot).
 */
export function PostSearch({ labels }: { labels: PostSearchLabels }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const piecesRef = useRef<Piece[]>([]);
  const rangesRef = useRef<Range[]>([]);
  const marksRef = useRef<HTMLElement[]>([]);
  const [state, setState] = useState<SearchState>(null);
  const [value, setValue] = useState("");
  const reducedMotion = usePrefersReducedMotion();

  const registry = useCallback(
    (name: string, ranges: Range[]) => {
      const highlights = highlightRegistry();
      if (!highlights) return;
      highlights.delete(name);
      if (ranges.length > 0) {
        const ctor = (window as unknown as { Highlight: HighlightCtor })
          .Highlight;
        highlights.set(name, new ctor(...ranges));
      }
    },
    [],
  );

  const clearVisual = useCallback(() => {
    const highlights = highlightRegistry();
    highlights?.delete(HL_HITS);
    highlights?.delete(HL_ACTIVE);
    for (const mark of marksRef.current) {
      mark.replaceWith(document.createTextNode(mark.textContent ?? ""));
      mark.parentElement?.normalize();
    }
    marksRef.current = [];
    rangesRef.current = [];
    piecesRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      window.clearTimeout(timer.current);
      clearVisual();
    };
  }, [clearVisual]);

  function setActive(index: number, scroll: boolean) {
    setState((current) =>
      current ? { ...current, active: index } : current,
    );
    const ranges = rangesRef.current;
    const marks = marksRef.current;
    if (ranges.length > 0) {
      const range = ranges[index];
      if (range) registry(HL_ACTIVE, [range]);
      if (scroll) {
        const at = range?.startContainer.parentElement;
        at?.scrollIntoView({
          block: "center",
          behavior: reducedMotion ? "auto" : "smooth",
        });
      }
    } else {
      marks.forEach((mark, i) =>
        mark.classList.toggle("post-search-hit--active", i === index),
      );
      const mark = marks[index];
      if (mark && scroll) {
        mark.scrollIntoView({
          block: "center",
          behavior: reducedMotion ? "auto" : "smooth",
        });
      }
    }
  }

  function apply(rawQuery: string) {
    const query = rawQuery.trim();
    clearVisual();
    if (!query) {
      setState(null);
      return;
    }
    const root = wrapRef.current?.closest("article.blog-post");
    if (!root) {
      setState(null);
      return;
    }
    const { text, pieces } = collectText(root);
    piecesRef.current = pieces;
    const spans = findSpans(text, query);
    if (spans.length === 0) {
      setState({ count: 0, active: -1 });
      return;
    }
    if (highlightRegistry()) {
      rangesRef.current = rangesFor(pieces, spans);
      registry(HL_HITS, rangesRef.current);
    } else {
      marksRef.current = wrapMarks(pieces, spans);
    }
    setState({ count: spans.length, active: 0 });
  }

  function commit(next: string) {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => apply(next), 200);
  }

  function clearAll() {
    window.clearTimeout(timer.current);
    setValue("");
    setState(null);
    clearVisual();
    inputRef.current?.focus();
  }

  function step(delta: number) {
    if (!state || state.count === 0) return;
    const next = (state.active + delta + state.count) % state.count;
    setActive(next, true);
  }

  const hasQuery = state !== null;

  return (
    <div
      ref={wrapRef}
      className="post-bar__search"
      role="search"
      aria-label={labels.findInPost}
    >
      <Search size={14} strokeWidth={1.5} aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        placeholder={labels.findInPost}
        aria-label={labels.findInPost}
        onChange={(event) => {
          setValue(event.target.value);
          commit(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            clearAll();
            return;
          }
          if (event.key === "Enter") {
            event.preventDefault();
            step(event.shiftKey ? -1 : 1);
          }
        }}
      />
      {hasQuery ? (
        <>
          <span className="u-label post-bar__count" aria-live="polite">
            {state.count === 0
              ? labels.searchNoMatches
              : `${state.active + 1}/${state.count}`}
          </span>
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={state.count === 0}
            aria-label={labels.searchPrev}
          >
            <ChevronUp size={14} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={state.count === 0}
            aria-label={labels.searchNext}
          >
            <ChevronDown size={14} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button type="button" onClick={clearAll} aria-label={labels.searchClear}>
            <X size={14} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </>
      ) : null}
    </div>
  );
}
