"use client";

import { useEffect, useRef } from "react";
import { gsap, usePrefersReducedMotion } from "@/lib/motion";
import { StarGlyph } from "@/components/star-glyph";
import { Plate } from "@/components/plate";
import { person, projects, credentials, posts, skills } from "@/lib/content";
import "./grainy-bloom.css";

function Marquee({
  words,
  reverse = false,
  speed = 26,
}: {
  words: string[];
  reverse?: boolean;
  speed?: number;
}) {
  const line = [...words, ...words, ...words];
  return (
    <div className="bl-marquee" aria-hidden="true">
      <div
        className="bl-marquee__track"
        style={{
          animationDirection: reverse ? "reverse" : "normal",
          animationDuration: `${speed}s`,
        }}
      >
        {line.map((w, i) => (
          <span key={i} className="bl-marquee__cell">
            <StarGlyph />
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}

export function GrainyBloom() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!root.current || reduced) return;
    const ctx = gsap.context(() => {
      gsap.to(".bl-hero__field", {
        backgroundPosition: "62% 38%",
        filter: "hue-rotate(34deg) saturate(118%)",
        ease: "none",
        scrollTrigger: {
          trigger: ".bl-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.from(".bl-hero__title span", {
        yPercent: 118,
        duration: 1.25,
        ease: "expo.out",
        stagger: 0.07,
      });

      gsap.utils.toArray<HTMLElement>("[data-bloom]").forEach((el) => {
        gsap.from(el, {
          y: 56,
          opacity: 0,
          duration: 1.05,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      gsap.utils.toArray<HTMLElement>(".bl-card").forEach((el) => {
        gsap.to(el, {
          yPercent: -7,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div className="bl" ref={root}>
      <header className="bl-nav">
        <a className="bl-nav__mark" href="#top" aria-label={person.name}>
          <StarGlyph />
          TK
        </a>
        <nav className="bl-nav__links" aria-label="Primary">
          <a href="#work">Work</a>
          <a href="#creds">Proof</a>
          <a href="#notes">Notes</a>
          <a href="#hi">Say hi</a>
        </nav>
        <a className="bl-nav__cta" href={`mailto:${person.email}`}>
          {person.email}
        </a>
      </header>

      <main id="top">
        <section className="bl-hero u-grain u-dither">
          <div className="bl-hero__field" aria-hidden="true" />
          <div className="bl-hero__veil" aria-hidden="true" />

          <div className="bl-hero__inner">
            <p className="bl-hero__kicker u-label">
              Portfolio · MMXXVI · {person.location}
            </p>

            <h1 className="bl-hero__title">
              <span>DESIGN</span>
              <span className="bl-hero__title-rule">
                <StarGlyph /> IN MOTION <StarGlyph />
              </span>
              <span>ENGINEER</span>
            </h1>

            <p className="bl-hero__sub">
              Taim Kellizy — CS student, developer, and translator. Grainy
              gradients, checkable proof, and interfaces that move like they
              mean it.
            </p>

            <div className="bl-hero__chips" aria-label="Skills">
              {skills.flatMap((s) => s.items).map((item) => (
                <span key={item} className="bl-chip">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <a className="bl-hero__scroll" href="#work">
            <StarGlyph />
            Scroll
          </a>
        </section>

        <Marquee words={["PROOF OVER CLAIMS", "GRAIN IS A MATERIAL", "MOTION WITH INTENT"]} speed={30} />

        <section className="bl-work" id="work">
          <header className="bl-head" data-bloom>
            <h2>
              Selected <em>work</em>
            </h2>
            <span className="u-label">{projects.length} entries</span>
          </header>

          <div className="bl-grid">
            {projects.map((p, i) => (
              <article
                key={p.id}
                className={`bl-card bl-card--${i}`}
                data-bloom
              >
                <a href="#work">
                  <div className="bl-card__media u-grain">
                    <Plate
                      from={["#a21e4f", "#0e2d3c", "#673a94", "#f85b3f"][i]}
                      to={["#ed7aba", "#2c67a6", "#b794e9", "#f29d3c"][i]}
                      angle={160 - i * 18}
                      label={p.kind}
                    />
                    <span className="bl-card__badge">
                      <StarGlyph />
                      {p.year}
                    </span>
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.stack.join(" · ")}</p>
                </a>
              </article>
            ))}
          </div>
        </section>

        <Marquee
          words={["CS50X HARVARD", "TED TRANSLATORS", "EF SET C2", "MCKINSEY FORWARD"]}
          reverse
          speed={34}
        />

        <section className="bl-creds" id="creds">
          <header className="bl-head" data-bloom>
            <h2>
              Checkable <em>proof</em>
            </h2>
            <span className="u-label">Verified</span>
          </header>

          <ul className="bl-stack">
            {credentials.map((c, i) => (
              <li key={c.id} className="bl-tile" data-bloom>
                <a href={c.href} target="_blank" rel="noreferrer">
                  <span className="bl-tile__idx">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="bl-tile__body">
                    <h3>{c.title}</h3>
                    <p>{c.detail}</p>
                  </div>
                  <span className="bl-tile__metric">
                    <StarGlyph />
                    {c.metric}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="bl-notes" id="notes">
          <header className="bl-head" data-bloom>
            <h2>
              From the <em>bench</em>
            </h2>
            <span className="u-label">Journal</span>
          </header>

          <ul className="bl-notes__list">
            {posts.map((post) => (
              <li key={post.slug} data-bloom>
                <a href="#notes">
                  <span className="bl-notes__tag u-label">{post.tag}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <time className="u-label" dateTime={post.date}>
                    {post.date}
                  </time>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="bl-hi u-grain u-dither" id="hi">
          <div className="bl-hi__field" aria-hidden="true" />
          <div className="bl-hi__inner">
            <h2 data-bloom>
              LET&apos;S BUILD
              <br />
              SOMETHING LOUD
            </h2>
            <div className="bl-hi__links" data-bloom>
              <a href={`mailto:${person.email}`}>{person.email}</a>
              <a href={person.linkedin} target="_blank" rel="noreferrer">
                LinkedIn <StarGlyph />
              </a>
              <a href={person.instagram} target="_blank" rel="noreferrer">
                Instagram <StarGlyph />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bl-foot">
        <Marquee words={["TAIM KELLIZY", "DESIGN IN MOTION"]} speed={22} />
        <div className="bl-foot__base u-label">
          <span>© MMXXVI {person.name}</span>
          <span>Design exploration — concept B</span>
        </div>
      </footer>
    </div>
  );
}
