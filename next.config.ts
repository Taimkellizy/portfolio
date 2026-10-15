import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      /* `/en/blog/{slug}.md` -> the markdown export route. A dynamic
         segment can't carry a literal `.md` suffix, so the pretty URL is
         a rewrite; `api` is outside the proxy's matcher so the request
         can't bounce back into the locale redirect. */
      {
        source: "/:locale(en|ar)/blog/:slug(.+)\\.md",
        destination: "/api/markdown/:locale/:slug",
      },
    ];
  },
};

export default nextConfig;
