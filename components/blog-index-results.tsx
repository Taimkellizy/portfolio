"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildSnippets, findSpans, markdownToText } from "@/lib/search";
import { useQueryParam, useTopicParam } from "./blog-filters";
import type { BlogRow } from "./blog-index-list";

type Doc = { slug: string; text: string };

type Hit = {
  slug: string;
  title: string;
  href: string;
  count: number;
  snippets: Array<Array<{ text: string; hit: boolean }>>;
};

/* Full-text matches across the post bodies, rendered as a highlighted
   results section under the rows. Body text is fetched lazily from the
   per-post markdown exports on the first real query — zero payload cost
   until someone actually searches — and cached for the session. */
export function BlogIndexResults({
  rows,
  locale,
  labels,
}: {
  rows: BlogRow[];
  locale: string;
  labels: {
    hitsTitle: string;
    hitsCount: string;
    searching: string;
    noMatches: string;
  };
}) {
  const rawQuery = useQueryParam();
  const topic = useTopicParam();
  const query = rawQuery.trim();

  /* topic AND query: the pool narrows like the row list does */
  const pool = useMemo(
    () =>
      topic
        ? rows.filter((row) => row.topics.some((t) => t.id === topic))
        : rows,
    [rows, topic],
  );

  const [docs, setDocs] = useState<Doc[] | null>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    if (!query || docs || loadingRef.current) return;
    loadingRef.current = true;
    let cancelled = false;
    void (async () => {
      try {
        const loaded = await Promise.all(
          rows.map(async (row) => {
            const response = await fetch(`/${locale}/blog/${row.slug}.md`);
            if (!response.ok) throw new Error(String(response.status));
            return {
              slug: row.slug,
              text: markdownToText(await response.text()),
            };
          }),
        );
        if (!cancelled) setDocs(loaded);
      } catch {
        if (!cancelled) setDocs([]);
      } finally {
        loadingRef.current = false;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [query, docs, rows, locale]);

  const hits = useMemo<Hit[] | null>(() => {
    if (!query || !docs) return null;
    const poolSlugs = new Set(pool.map((row) => row.slug));
    const bySlug = new Map(rows.map((row) => [row.slug, row]));
    const found: Hit[] = [];
    for (const doc of docs) {
      if (!poolSlugs.has(doc.slug)) continue;
      const spans = findSpans(doc.text, query);
      if (spans.length === 0) continue;
      const row = bySlug.get(doc.slug);
      if (!row) continue;
      found.push({
        slug: doc.slug,
        title: row.title,
        href: `/${locale}/blog/${row.slug}`,
        count: spans.length,
        snippets: buildSnippets(doc.text, spans),
      });
    }
    return found;
  }, [query, docs, pool, rows, locale]);

  if (!query) return null;

  const total = hits?.reduce((n, hit) => n + hit.count, 0) ?? 0;

  return (
    <section className="blog-hits" aria-label={labels.hitsTitle}>
      <header className="blog-hits__head">
        <h3 className="u-label blog-hits__title">{labels.hitsTitle}</h3>
        <span className="u-label blog-hits__count" aria-live="polite">
          {docs
            ? labels.hitsCount.replace("{n}", String(total))
            : labels.searching}
        </span>
      </header>

      {docs && hits && hits.length === 0 ? (
        <p className="blog-empty">{labels.noMatches}</p>
      ) : null}

      <ul className="blog-hits__list">
        {(hits ?? []).map((hit) => (
          <li key={hit.slug} className="blog-hits__item">
            <a href={hit.href}>
              <span className="blog-hits__post">{hit.title}</span>
              <span className="u-label blog-hits__n">{hit.count}</span>
            </a>
            {hit.snippets.map((segments, index) => (
              <p key={index} className="blog-hits__snip">
                {segments.map((seg, i) =>
                  seg.hit ? <mark key={i}>{seg.text}</mark> : <span key={i}>{seg.text}</span>,
                )}
              </p>
            ))}
          </li>
        ))}
      </ul>
    </section>
  );
}
