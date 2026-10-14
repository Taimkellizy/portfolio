"use client";

import { Languages } from "lucide-react";
import PrismaticBurst from "@/components/prismatic-burst";
import { content, type Locale } from "@/lib/i18n";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/motion";

/* Slim chrome shared by both blog pages: wordmark home link, writing
   index link, sibling-locale switch, and the burst glow leaking from
   the top-start corner behind the wordmark (the hero's bookend,
   downsized). The burst needs the same mount gates as the footer's. */

export function BlogBar({
  locale,
  langHref,
  showIndexLink,
}: {
  locale: Locale;
  langHref: string;
  showIndexLink: boolean;
}) {
  const { ui } = content[locale];
  const reduced = usePrefersReducedMotion();
  /* null until measured, so the burst mounts with the right tier */
  const narrow = useMediaQuery("(max-width: 900px)");
  const renderBurst = !reduced && narrow !== null;

  const other = locale === "ar" ? "en" : "ar";
  const switchLabel = other === "ar" ? "عربي" : "English";

  return (
    <div className="blog-bar">
      {renderBurst ? (
        <div className="blog-bar__prism" aria-hidden="true">
          <PrismaticBurst
            intensity={2.8}
            speed={0.3}
            animationType="rotate3d"
            distort={0.45}
            mixBlendMode="lighten"
            paused={false}
            renderScale={narrow ? 0.55 : undefined}
          />
        </div>
      ) : null}

      <a className="blog-bar__word" href={`/${locale}`}>
        {ui.heroWord}
      </a>
      <div className="blog-bar__links">
        {showIndexLink ? (
          <a className="blog-bar__link u-label" href={`/${locale}/blog`}>
            {ui.blogAllPosts}
          </a>
        ) : null}
        <a className="blog-bar__link u-label" href={`/${locale}`}>
          {ui.blogHome}
        </a>
        <a
          className={
            [
              "blog-bar__link",
              "u-label",
              "blog-bar__lang",
              /* the عربي label rides the Arabic face in English builds
                 (Work Sans carries no Arabic glyphs) */
              other === "ar" ? "blog-bar__lang--ar" : "",
            ]
              .filter(Boolean)
              .join(" ")
          }
          href={langHref}
          hrefLang={other}
          aria-label={locale === "ar" ? "English" : "عربي"}
        >
          <Languages size={14} strokeWidth={1.5} />
          {switchLabel}
        </a>
      </div>
    </div>
  );
}
