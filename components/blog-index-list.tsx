"use client";

import { useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import { hasMatch } from "@/lib/search";
import { selectTopic, useQueryParam, useTopicParam } from "./blog-filters";

export type BlogRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  year: string;
  topics: Array<{ id: string; label: string }>;
};

/**
 * Topic chips + post rows for the blog index. Rows filter by `?topic=`
 * AND `?q=` (title/excerpt) — both live in the URL via blog-filters.
 */
export function BlogIndexList({
  rows,
  allLabel,
  topicsLabel,
  emptyLabel,
  noMatchesLabel,
  locale,
}: {
  rows: BlogRow[];
  allLabel: string;
  topicsLabel: string;
  emptyLabel: string;
  noMatchesLabel: string;
  locale: string;
}) {
  const rawTopic = useTopicParam();
  const rawQuery = useQueryParam();
  const query = rawQuery.trim();

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of rows) {
      for (const topic of row.topics) {
        map.set(topic.id, (map.get(topic.id) ?? 0) + 1);
      }
    }
    return map;
  }, [rows]);

  const labelFor = (id: string) =>
    rows.flatMap((row) => row.topics).find((t) => t.id === id)?.label ?? id;

  /* a ?topic= that matches nothing real falls back to the full list */
  const active = rawTopic && counts.has(rawTopic) ? rawTopic : null;

  const shown = rows.filter((row) => {
    if (active && !row.topics.some((t) => t.id === active)) return false;
    if (
      query &&
      !hasMatch(`${row.title} ${row.excerpt}`, query)
    ) {
      return false;
    }
    return true;
  });

  if (rows.length === 0) {
    return <p className="blog-empty">{emptyLabel}</p>;
  }

  return (
    <>
      <nav className="blog-topics" aria-label={topicsLabel}>
        <button
          type="button"
          className="blog-chip"
          aria-pressed={active === null}
          onClick={() => selectTopic(null)}
        >
          {allLabel}
          <span className="blog-chip__count">{rows.length}</span>
        </button>
        {[...counts.entries()].map(([id, count]) => (
          <button
            key={id}
            type="button"
            className="blog-chip"
            aria-pressed={active === id}
            onClick={() => selectTopic(active === id ? null : id)}
          >
            {labelFor(id)}
            <span className="blog-chip__count">{count}</span>
          </button>
        ))}
      </nav>

      {shown.length > 0 ? (
        <ul className="ea-rows">
          {shown.map((row) => (
            <li key={row.id} className="ea-row">
              <a href={`/${locale}/blog/${row.slug}`}>
                <span className="ea-row__org u-label">{row.topics[0]?.label}</span>
                <span className="ea-row__title">{row.title}</span>
                <span className="ea-row__excerpt">{row.excerpt}</span>
                <span className="ea-row__year u-label">{row.year}</span>
                <span className="ea-row__arrow" aria-hidden="true">
                  <ArrowUpRight size={16} strokeWidth={1.5} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="blog-empty">{noMatchesLabel}</p>
      )}
    </>
  );
}
