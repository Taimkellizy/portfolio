/* Pure search helpers for the blog — client + server safe, no deps.
   Matching folds case and strips Arabic diacritics/tatweel through an
   index map, so highlight offsets stay exact in the ORIGINAL string.
   Arabic matches are word-aligned: an inline highlight that starts or
   ends inside an Arabic word severs contextual joining (same spirit as
   the char-split ban, gotcha 9), so spans grow to word bounds. */

export interface SearchSpan {
  start: number;
  end: number;
}

export interface SearchSeg {
  text: string;
  hit: boolean;
}

/* harakat 064B-065F, tatweel 0640, superscript alef 0670 */
function isDiacritic(code: number): boolean {
  return (code >= 0x64b && code <= 0x65f) || code === 0x640 || code === 0x670;
}

function isArabicChar(code: number): boolean {
  return code >= 0x600 && code <= 0x6ff;
}

function fold(text: string): { folded: string; map: number[] } {
  const out: string[] = [];
  const map: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (isDiacritic(code)) continue;
    out.push(text[i].toLowerCase());
    map.push(i);
  }
  return { folded: out.join(""), map };
}

/* Grow a raw match outward so its edges never cut an Arabic word. */
function alignToWords(text: string, start: number, end: number): SearchSpan {
  let s = start;
  let e = end;
  if (
    s > 0 &&
    s < text.length &&
    isArabicChar(text.charCodeAt(s)) &&
    isArabicChar(text.charCodeAt(s - 1))
  ) {
    while (s > 0 && isArabicChar(text.charCodeAt(s - 1))) s -= 1;
  }
  if (
    e > 0 &&
    e < text.length &&
    isArabicChar(text.charCodeAt(e - 1)) &&
    isArabicChar(text.charCodeAt(e))
  ) {
    while (e < text.length && isArabicChar(text.charCodeAt(e))) e += 1;
  }
  return { start: s, end: e };
}

/* All match spans (original string indices), merged when word alignment
   makes neighbours overlap. Empty query → []. */
export function findSpans(text: string, query: string): SearchSpan[] {
  const needle = query.trim();
  if (!needle) return [];
  const haystack = fold(text);
  const target = fold(needle).folded;
  if (!target) return [];
  const spans: SearchSpan[] = [];
  let from = 0;
  for (;;) {
    const at = haystack.folded.indexOf(target, from);
    if (at < 0) break;
    const start = haystack.map[at];
    const last = at + target.length - 1;
    const end =
      last + 1 < haystack.map.length ? haystack.map[last] + 1 : text.length;
    const aligned = alignToWords(text, start, end);
    const prev = spans[spans.length - 1];
    if (prev && aligned.start <= prev.end) {
      prev.end = Math.max(prev.end, aligned.end);
    } else {
      spans.push({ ...aligned });
    }
    from = at + target.length;
  }
  return spans;
}

export function hasMatch(text: string, query: string): boolean {
  return findSpans(text, query).length > 0;
}

/* Highlight segments for a bounded slice of the text. */
function segmentsFor(
  text: string,
  spans: SearchSpan[],
  from: number,
  to: number,
): SearchSeg[] {
  const segs: SearchSeg[] = [];
  let cursor = from;
  for (const span of spans) {
    if (span.end <= from || span.start >= to) continue;
    const start = Math.max(span.start, from);
    if (start > cursor) {
      segs.push({ text: text.slice(cursor, start), hit: false });
    }
    segs.push({ text: text.slice(start, Math.min(span.end, to)), hit: true });
    cursor = Math.min(span.end, to);
  }
  if (cursor < to) segs.push({ text: text.slice(cursor, to), hit: false });
  return segs;
}

/* Cut a snippet window at word boundaries so it never opens or closes
   mid-word. */
function windowBounds(
  text: string,
  start: number,
  end: number,
): [number, number] {
  let from = start;
  let to = end;
  if (from > 0) {
    const at = text.indexOf(" ", from);
    const next = at < 0 ? from : at + 1;
    from = next < to ? next : start;
  }
  if (to < text.length) {
    const at = text.lastIndexOf(" ", to);
    if (at > from) to = at;
  }
  return [from, to];
}

/* Snippets around the first `limit` matches (overlapping matches share
   one window); ellipses mark the trimmed edges. */
export function buildSnippets(
  text: string,
  spans: SearchSpan[],
  radius = 110,
  limit = 3,
): SearchSeg[][] {
  const windows: SearchSpan[] = [];
  for (const span of spans.slice(0, limit)) {
    const start = Math.max(0, span.start - radius);
    const end = Math.min(text.length, span.end + radius);
    const prev = windows[windows.length - 1];
    if (prev && start <= prev.end) {
      prev.end = Math.max(prev.end, end);
    } else {
      windows.push({ start, end });
    }
  }
  return windows.map((window) => {
    const [from, to] = windowBounds(text, window.start, window.end);
    const segs = segmentsFor(text, spans, from, to);
    if (from > 0) segs.unshift({ text: "… ", hit: false });
    if (to < text.length) segs.push({ text: " …", hit: false });
    return segs;
  });
}

/* Markdown export body → plain searchable text: drops the API route's
   YAML header, fence markers and link/image URLs; keeps code content
   (posts are searched with their code, per the product decision). */
export function markdownToText(markdown: string): string {
  let body = markdown.replace(/^---\n[\s\S]*?\n---\n/, "");
  body = body
    .replace(/```[^\n]*\n?/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/[*_`|]/g, " ")
    .replace(/^\s*[-+]\s+/gm, " ")
    .replace(/\s+/g, " ");
  return body;
}
