"use client";

import { useSyncExternalStore } from "react";

/* URL-backed filter stores for the blog index (gotcha 23): filter state
   lives in the URL, never in React state — the pages stay statically
   generated, and chips, the search box, back/forward and shared links
   all read one source. */

const TOPIC_EVENT = "blog-topic-change";
const QUERY_EVENT = "blog-query-change";

function readParam(key: string): string | null {
  return new URLSearchParams(window.location.search).get(key);
}

function subscribeParam(key: string, event: string) {
  return (onChange: () => void) => {
    window.addEventListener("popstate", onChange);
    window.addEventListener(event, onChange);
    return () => {
      window.removeEventListener("popstate", onChange);
      window.removeEventListener(event, onChange);
    };
  };
}

function replaceParam(key: string, value: string | null, event: string) {
  const url = new URL(window.location.href);
  if (value) url.searchParams.set(key, value);
  else url.searchParams.delete(key);
  window.history.replaceState(null, "", url);
  window.dispatchEvent(new Event(event));
}

export function useTopicParam(): string | null {
  return useSyncExternalStore(
    subscribeParam("topic", TOPIC_EVENT),
    () => readParam("topic"),
    () => null,
  );
}

export function selectTopic(topic: string | null): void {
  replaceParam("topic", topic, TOPIC_EVENT);
}

export function useQueryParam(): string {
  return useSyncExternalStore(
    subscribeParam("q", QUERY_EVENT),
    () => readParam("q") ?? "",
    () => "",
  );
}

export function selectQuery(query: string): void {
  replaceParam("q", query.trim() || null, QUERY_EVENT);
}
