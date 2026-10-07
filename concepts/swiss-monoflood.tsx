"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, usePrefersReducedMotion } from "@/lib/motion";
import { StarGlyph } from "@/components/star-glyph";
import { Plate } from "@/components/plate";
import { person, projects, credentials, skills } from "@/lib/content";
import "./swiss-monoflood.css";

const TICKER = "AVAILABLE FOR WORK · CS STUDENT · DEVELOPER · TRANSLATOR · ";

function Ticker() {
  return (
    <div className="sw-ticker" aria-hidden="true">
      <div className="sw-ticker__track">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="sw-ticker__cell">
            <StarGlyph />
            {TICKER}
          </span>
        ))}
      </div>
    </div>
  );
}

const SPECS = [
  {
    id: "s1",
    q: "What do you actually build?",
    a: "Web interfaces — React on the front, Flask behind it, SQLite when a single file will do. I care about the seams: loading states, error copy, motion that explains rather than decorates.",
  },
  {
    id: "s2",
    q: "How do you work?",
    a: "Spec first, then build to the spec. Proof over claims — every capability listed here links to something checkable.",
  },
  {
    id: "s3",
    q: "Languages?",
    a: "English at C2 (77/100 EF SET), Arabic native. Three years translating TED talks — 850+ minutes, 17M+ views — taught me more about product quality than any spec sheet.",
  },
];

export function SwissMonoFlood() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState<string | null>("s1");
  const [swatch, setSwatch] = useState(0);

  useEffect(() => {
    if (!root.current || reduced) return;
    const ctx = gsap.context(() => {
      gsap.from(".sw-hero__name span", {
        yPercent: 112,
        duration: 1.15,
        ease: "expo.out",
        stagger: 0.06,
      });

      gsap.from(".sw-hero__aside > *", {
        y: 34,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.08,
        delay: 0.25,
      });

      gsap.utils.toArray<HTMLElement>("[data-sw-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 44,
          opacity: 0,
          duration: 0.95,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      gsap.utils.toArray<HTMLElement>(".sw-row").forEach((el) => {
        gsap.from(el, {
          scaleY: 0,
          transformOrigin: "top",
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 92%" },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  const hue = [0, 28, -34, 156][swatch];

  return (
    <div
      className="sw"
      ref={root}
      data-swatch={swatch}
      style={{ "--sw-hue": `${hue}deg` } as React.CSSProperties}
    >
      <Ticker />

      <header className="sw-nav">
        <a className="sw-nav__mark" href="#top">
          <StarGlyph />
          <span>TK</span>
        </a>
        <nav className="sw-nav__links" aria-label="Primary">
          <a href="#work">Work</a>
          <a href="#specs">Specs</a>
          <a href="#proof">Proof</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="sw-nav__cta" href={`mailto:${person.email}`}>
          Hire me
        </a>
      </header>

      <main id="top">
        <section className="sw-hero">
          <div className="sw-hero__stage">
            <div className="sw-hero__object">
              <Plate
                from="#4ba7c6"
                to="#3e307a"
                angle={125}
                label="Headshot — replace in /assets"
              />
              <span className="sw-hero__badge">
                <StarGlyph />
                MMXXVI
              </span>
            </div>

            <div className="sw-hero__aside">
              <p className="u-label sw-hero__kicker">
                Portfolio — Edition 01 — {person.location}
              </p>

              <h1 className="sw-hero__name" aria-label={person.name}>
                <span>TAIM</span>
                <span>KELLIZY</span>
              </h1>

              <p className="sw-hero__desc">
                A developer and CS student who treats interfaces like
                products: measured, specified, and finished properly.
              </p>

              <div className="sw-hero__price">
                <span className="sw-hero__amount">CS 50x</span>
                <span className="sw-hero__strike">Harvard</span>
                <span className="sw-hero__stars" aria-label="5 out of 5">
                  <StarGlyph />
                  <StarGlyph />
                  <StarGlyph />
                  <StarGlyph />
                  <StarGlyph />
                </span>
                <span className="u-label sw-hero__reviews">
                  (17M+ views)
                </span>
              </div>

              <div className="sw-hero__swatches" role="group" aria-label="Color">
                <span className="u-label">Focus</span>
                {[
                  { c: "#4ba7c6", n: "Frontend" },
                  { c: "#fcae1e", n: "Systems" },
                  { c: "#f83639", n: "Language" },
                  { c: "#2a7a4a", n: "Open source" },
                ].map((s, i) => (
                  <button
                    key={s.n}
                    type="button"
                    aria-label={s.n}
                    aria-pressed={swatch === i}
                    className={`sw-dot${swatch === i ? " is-on" : ""}`}
                    style={{ background: s.c }}
                    onClick={() => setSwatch(i)}
                  />
                ))}
              </div>

              <a className="sw-hero__cta" href="#work">
                View the work
                <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </section>

        <section className="sw-work" id="work">
          <header className="sw-head" data-sw-reveal>
            <h2>Selected work</h2>
            <span className="u-label">{projects.length} products</span>
          </header>

          <ul className="sw-products">
            {projects.map((p, i) => (
              <li key={p.id} className="sw-row" data-sw-reveal>
                <a href="#work">
                  <span className="sw-row__idx">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="sw-row__media">
                    <Plate
                      from={["#3e307a", "#2a7a4a", "#f85b3f", "#1b2741"][i]}
                      to={["#4ba7c6", "#788b5f", "#f29d3c", "#97affe"][i]}
                      label={p.kind}
                    />
                  </div>
                  <div className="sw-row__body">
                    <h3>{p.title}</h3>
                    <p>{p.stack.join(" · ")}</p>
                  </div>
                  <span className="sw-row__year u-label">{p.year}</span>
                  <span className="sw-row__plus" aria-hidden="true">
                    +
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="sw-specs" id="specs">
          <header className="sw-head" data-sw-reveal>
            <h2>Specifications</h2>
            <span className="u-label">FAQ</span>
          </header>

          <ul className="sw-acc">
            {SPECS.map((s) => {
              const isOpen = open === s.id;
              return (
                <li key={s.id} className={`sw-acc__item${isOpen ? " is-open" : ""}`}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : s.id)}
                  >
                    <span>{s.q}</span>
                    <span className="sw-acc__plus" aria-hidden="true">
                      +
                    </span>
                  </button>
                  <div className="sw-acc__panel" hidden={!isOpen}>
                    <p>{s.a}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="sw-proof" id="proof">
          <header className="sw-head" data-sw-reveal>
            <h2>Proof</h2>
            <span className="u-label">Verified credentials</span>
          </header>

          <ul className="sw-proof__list">
            {credentials.map((c) => (
              <li key={c.id} data-sw-reveal>
                <a href={c.href} target="_blank" rel="noreferrer">
                  <div>
                    <h3>{c.title}</h3>
                    <p className="u-label">{c.org}</p>
                  </div>
                  <span className="sw-proof__metric">{c.metric}</span>
                  <span className="u-label sw-proof__year">{c.year}</span>
                  <span className="sw-proof__arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="sw-skills" data-sw-reveal>
            {skills.map((s) => (
              <div key={s.group}>
                <p className="u-label">{s.group}</p>
                <ul>
                  {s.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="sw-foot" id="contact">
        <div className="sw-foot__top">
          <h2 data-sw-reveal>
            TAIM
            <br />
            KELLIZY
          </h2>
          <div className="sw-foot__links" data-sw-reveal>
            <a href={`mailto:${person.email}`}>{person.email}</a>
            <a href={person.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={person.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
          </div>
        </div>
        <div className="sw-foot__base u-label">
          <span>© MMXXVI {person.name}</span>
          <span>Design exploration — concept C</span>
        </div>
      </footer>
    </div>
  );
}
