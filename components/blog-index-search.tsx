"use client";

import { useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { selectQuery, useQueryParam } from "./blog-filters";

/* Search box for the blog index — filters rows by title/excerpt and
   drives the full-text results below (both read `?q=` from the URL
   store, never React state). Local draft state only smooths typing;
   the committed value lands in the URL debounced. */
export function BlogIndexSearch({
  placeholder,
  clearLabel,
}: {
  placeholder: string;
  clearLabel: string;
}) {
  const query = useQueryParam();
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState("");
  const timer = useRef<number | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const value = focused ? draft : query;

  function commit(next: string) {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => selectQuery(next), 220);
  }

  function clear() {
    window.clearTimeout(timer.current);
    setDraft("");
    selectQuery("");
    inputRef.current?.focus();
  }

  return (
    <form
      className="blog-search"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        selectQuery(value);
        inputRef.current?.blur();
      }}
    >
      <Search size={14} strokeWidth={1.5} aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(event) => {
          setDraft(event.target.value);
          commit(event.target.value);
        }}
        onFocus={() => {
          setDraft(query);
          setFocused(true);
        }}
        onBlur={() => setFocused(false)}
        onKeyDown={(event) => {
          if (event.key === "Escape") clear();
        }}
      />
      {value ? (
        <button type="button" onClick={clear} aria-label={clearLabel}>
          <X size={14} strokeWidth={1.5} aria-hidden="true" />
        </button>
      ) : null}
    </form>
  );
}
