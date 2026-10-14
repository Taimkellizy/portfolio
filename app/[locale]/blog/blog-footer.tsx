"use client";

import { ArrowUp } from "lucide-react";
import PrismaticBurst from "@/components/prismatic-burst";
import { content, type Locale } from "@/lib/i18n";
import { scrollToTop, useMediaQuery, usePrefersReducedMotion } from "@/lib/motion";
import { newTabProps } from "@/concepts/editorial-var-a/shared";

/* Blog footer: the one-pager's footer, rebuilt for blog pages — same
   burst bookend, columns, giant word and base row on the `.ea-foot`
   classes (RTL mirror + phone band rules come free). The only
   functional difference is the sitemap column: the concept's in-page
   anchors are remapped onto the one-pager URL so the links still land. */

export function BlogFooter({ locale }: { locale: Locale }) {
  const { ui } = content[locale];
  const reduced = usePrefersReducedMotion();
  /* null until measured, so the burst mounts with the right tier */
  const narrow = useMediaQuery("(max-width: 900px)");
  const renderBurst = !reduced && narrow !== null;

  const [sitemap, social, contact] = ui.footerColumns;

  return (
    <footer className="ea-foot" id="ea-contact">
      {renderBurst ? (
        <div className="ea-foot__burst" aria-hidden="true">
          <PrismaticBurst
            intensity={2.2}
            speed={0.25}
            animationType="rotate3d"
            distort={0.6}
            mixBlendMode="lighten"
            paused={false}
            renderScale={narrow ? 0.55 : undefined}
          />
        </div>
      ) : null}

      <div className="ea-foot__cols">
        <div className="ea-foot__col">
          <h3 className="ea-foot__col-title">{sitemap.title}</h3>
          <ul>
            {sitemap.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href.startsWith("#") ? `/${locale}${link.href}` : link.href}
                  className={link.active ? "is-active" : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {[
          { title: social.title, links: social.links },
          { title: contact.title, links: contact.links },
        ].map((column) => (
          <div className="ea-foot__col" key={column.title}>
            <h3 className="ea-foot__col-title">{column.title}</h3>
            <ul>
              {column.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} {...newTabProps(link.href)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="ea-giant ea-foot__word" aria-hidden="true">
        {ui.heroWord}
      </p>

      <div className="ea-foot__base">
        <button className="ea-foot__top" type="button" onClick={scrollToTop}>
          {ui.backToTop}
          <ArrowUp size={16} strokeWidth={1.5} />
        </button>
        <span className="ea-foot__copy">{ui.copyright}</span>
      </div>
    </footer>
  );
}
