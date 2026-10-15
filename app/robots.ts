import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

/* Explicit rules beat the bare `*` default: answer engines and AI crawlers
   are welcome here, and each gets a named rule so nothing is inferred. */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
  "Amazonbot",
  "Meta-ExternalAgent",
  "DuckAssistBot",
  "cohere-ai",
  "YouBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
