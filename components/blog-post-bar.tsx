"use client";

import { useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Copy, FileText, Link2 } from "lucide-react";

const SIZE_DEFAULT = 1;
const SIZE_MAX = 3;
const SIZE_EVENT = "reading-size-change";

/* The reading size lives on documentElement (dataset + localStorage), not
   in component state: the inline head snippet restores it before paint,
   and the store keeps that source and the buttons in sync. */
function readSize(): number {
  const value = Number(document.documentElement.dataset.readingSize);
  return Number.isFinite(value) && value >= 0 && value <= SIZE_MAX
    ? value
    : SIZE_DEFAULT;
}

function subscribeSize(onChange: () => void) {
  window.addEventListener(SIZE_EVENT, onChange);
  return () => window.removeEventListener(SIZE_EVENT, onChange);
}

type Status = { key: string; ok: boolean } | null;

/**
 * Post toolbar: copy-as-markdown, view-as-markdown, copy-link, text size.
 */
export function BlogPostBar({
  mdHref,
  canonical,
  labels,
  searchSlot,
}: {
  mdHref: string;
  canonical: string;
  labels: {
    copyMarkdown: string;
    viewMarkdown: string;
    copyLink: string;
    copied: string;
    failed: string;
    smaller: string;
    larger: string;
    readingSize: string;
  };
  searchSlot?: ReactNode;
}) {
  const [status, setStatus] = useState<Status>(null);
  const size = useSyncExternalStore(subscribeSize, readSize, () => SIZE_DEFAULT);
  const timer = useRef<number | undefined>(undefined);

  function flash(key: string, ok: boolean) {
    setStatus({ key, ok });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus(null), 2000);
  }

  function applySize(next: number) {
    const clamped = Math.min(SIZE_MAX, Math.max(0, next));
    document.documentElement.dataset.readingSize = String(clamped);
    try {
      localStorage.setItem("reading-size", String(clamped));
    } catch {
      /* storage blocked — the size still applies for this page view */
    }
    window.dispatchEvent(new Event(SIZE_EVENT));
  }

  async function copyText(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      flash(key, true);
    } catch {
      flash(key, false);
    }
  }

  async function copyMarkdown() {
    try {
      const response = await fetch(mdHref);
      if (!response.ok) throw new Error(String(response.status));
      await copyText("markdown", await response.text());
    } catch {
      flash("markdown", false);
    }
  }

  const labelFor = (key: string, base: string) => {
    if (status?.key !== key) return base;
    return status.ok ? labels.copied : labels.failed;
  };

  return (
    <div className="post-bar">
      <div className="post-bar__actions">
        <button type="button" onClick={copyMarkdown}>
          <Copy size={15} strokeWidth={1.5} aria-hidden="true" />
          <span aria-live="polite">{labelFor("markdown", labels.copyMarkdown)}</span>
        </button>
        <span className="post-bar__rule" aria-hidden="true" />
        <a href={mdHref}>
          <FileText size={15} strokeWidth={1.5} aria-hidden="true" />
          <span>{labels.viewMarkdown}</span>
        </a>
        <span className="post-bar__rule" aria-hidden="true" />
        <button type="button" onClick={() => copyText("url", canonical)}>
          <Link2 size={15} strokeWidth={1.5} aria-hidden="true" />
          <span aria-live="polite">{labelFor("url", labels.copyLink)}</span>
        </button>
      </div>
      {searchSlot}
      <div
        className="post-bar__size"
        role="group"
        aria-label={labels.readingSize}
      >
        <button
          type="button"
          onClick={() => applySize(size - 1)}
          disabled={size === 0}
          aria-label={labels.smaller}
        >
          <span className="post-bar__a post-bar__a--small" aria-hidden="true">
            A
          </span>
        </button>
        <span className="post-bar__rule" aria-hidden="true" />
        <button
          type="button"
          onClick={() => applySize(size + 1)}
          disabled={size === SIZE_MAX}
          aria-label={labels.larger}
        >
          <span className="post-bar__a post-bar__a--large" aria-hidden="true">
            A
          </span>
        </button>
      </div>
    </div>
  );
}
