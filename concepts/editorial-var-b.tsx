"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, usePrefersReducedMotion } from "@/lib/motion";
import { Plate } from "@/components/plate";
import { StarGlyph } from "@/components/star-glyph";
import { person, projects, credentials, posts } from "@/lib/content";
import "./editorial-var-b.css";

const FIRST = person.firstName.toUpperCase().split("");
const LAST = person.lastName.toUpperCase().split("");

export function EditorialVarB() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!root.current || reduced) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((el) => {
        const speed = parseFloat(el.dataset.drift || "1");
        gsap.to(el, {
          yPercent: -14 * speed,
          rotate: `+=${speed > 1 ? 2.4 : -1.8}`,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.1,
          },
        });
      });

      gsap.from("[data-bchar]", {
        xPercent: (i: number, el: HTMLElement) =>
          el.dataset.dir === "1" ? 52 : -52,
        opacity: 0,
        "--eb-w": 120,
        duration: 1.25,
        ease: "expo.out",
        stagger: 0.055,
      });

      gsap.from("[data-layer-mid]", {
        opacity: 0,
        scale: 1.05,
        duration: 1.6,
        ease: "expo.out",
        delay: 0.24,
      });

      gsap.from("[data-layer-ghost]", {
        opacity: 0,
        scale: 1.09,
        duration: 1.9,
        ease: "expo.out",
        delay: 0.38,
      });

      gsap.from("[data-hero-plate]", {
        y: 70,
        opacity: 0,
        rotate: (i: number) => (i % 2 ? 5 : -5),
        duration: 1.6,
        ease: "expo.out",
        stagger: 0.12,
        delay: 0.2,
      });

      const layers: [string, number, number][] = [
        ["[data-layer-ghost]", -30, -8],
        ["[data-layer-mid]", -14, -3],
        ["[data-layer-front]", 10, 3],
      ];
      layers.forEach(([sel, y, x]) => {
        gsap.to(sel, {
          yPercent: y,
          xPercent: x,
          ease: "none",
          scrollTrigger: {
            trigger: ".eb-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      });

      gsap.to("[data-hero-word-a]", {
        yPercent: 22,
        ease: "none",
        scrollTrigger: {
          trigger: ".eb-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 42,
          opacity: 0,
          duration: 1.05,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div className="eb" ref={root}>
      <header className="eb-nav">
        <a className="eb-nav__mark u-label" href="#top">
          {person.name}
        </a>
        <nav className="eb-nav__links" aria-label="Primary">
          <a href="#work">Work</a>
          <a href="#credentials">Credentials</a>
          <a href="#writing">Writing</a>
          <a href="#contact">Contact</a>
        </nav>
        <span className="eb-nav__meta u-label">Archive · MMXXVI</span>
      </header>

      <main id="top">
        <section className="eb-hero">
          <p className="eb-hero__kicker u-label">
            <StarGlyph />
            <span>
              {person.role} — {person.location}
            </span>
          </p>

          <h1 className="eb-hero__title" aria-label={person.name}>
            <span className="eb-hero__word-a" data-hero-word-a>
              {FIRST.map((ch, i) => (
                <span
                  key={`${ch}-${i}`}
                  className="eb-char eb-char--a"
                  data-bchar
                  data-dir={i % 2 ? "1" : "-1"}
                >
                  {ch}
                </span>
              ))}
            </span>
            <span className="eb-hero__stack">
              <span
                className="eb-layer eb-layer--ghost"
                data-layer-ghost
                aria-hidden="true"
              >
                {LAST.map((ch, i) => (
                  <span key={`${ch}-${i}`} className="eb-char">
                    {ch}
                  </span>
                ))}
              </span>
              <span
                className="eb-layer eb-layer--mid"
                data-layer-mid
                aria-hidden="true"
              >
                {LAST.map((ch, i) => (
                  <span key={`${ch}-${i}`} className="eb-char">
                    {ch}
                  </span>
                ))}
              </span>
              <span className="eb-layer eb-layer--front" data-layer-front>
                {LAST.map((ch, i) => (
                  <span
                    key={`${ch}-${i}`}
                    className="eb-char"
                    data-bchar
                    data-dir={i % 2 ? "1" : "-1"}
                  >
                    {ch}
                  </span>
                ))}
              </span>
            </span>
          </h1>

          <div className="eb-hero__scatter" aria-hidden="true">
            <div
              className="eb-hero__plate eb-hero__plate--l eb-hero__plate--front"
              data-hero-plate
              data-drift="1.5"
            >
              <Plate from="#2a2440" to="#673a94" label="Plate 01" />
            </div>
            <div
              className="eb-hero__plate eb-hero__plate--r eb-hero__plate--back"
              data-hero-plate
              data-drift="0.8"
            >
              <Plate from="#1d3a2e" to="#788b5f" label="Plate 02" />
            </div>
            <div
              className="eb-hero__plate eb-hero__plate--c eb-hero__plate--front"
              data-hero-plate
              data-drift="1.1"
            >
              <Plate from="#402a38" to="#b794e9" label="Plate 03" />
            </div>
          </div>

          <div className="eb-hero__foot">
            <p className="eb-hero__line">
              Building interfaces with the patience of a translator and the
              curiosity of a first-year CS student.
            </p>
            <a className="eb-plus" href="#work" aria-label="See selected work">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </a>
          </div>
        </section>

        <section className="eb-bio" data-reveal>
          <div className="eb-bio__orbit" aria-hidden="true">
            <div className="eb-bio__tile eb-bio__tile--1" data-drift="1.3">
              <Plate from="#2a2440" to="#673a94" />
            </div>
            <div className="eb-bio__tile eb-bio__tile--2" data-drift="0.7">
              <Plate from="#1d3a2e" to="#788b5f" />
            </div>
            <div className="eb-bio__tile eb-bio__tile--3" data-drift="1.1">
              <Plate from="#402a38" to="#b794e9" />
            </div>
            <div className="eb-bio__tile eb-bio__tile--4" data-drift="0.6">
              <Plate from="#2b2b30" to="#8a8a94" />
            </div>
            <div className="eb-bio__tile eb-bio__tile--5" data-drift="1.2">
              <Plate from="#0e2d3c" to="#2c67a6" />
            </div>
          </div>
          <p className="eb-bio__text">
            I started with HTML and CSS, kept going through CS50x, and now spend
            my time between React components, Flask routes, and translating
            talks that reach millions. Proof over claims — the work below is
            checkable.
          </p>
        </section>

        <section className="eb-work" id="work">
          <header className="eb-sec" data-reveal>
            <h2 className="eb-sec__title">Selected work</h2>
            <span className="eb-sec__count u-label">
              <StarGlyph />
              {String(projects.length).padStart(2, "0")} entries
            </span>
          </header>
          <ul className="eb-work__grid">
            {projects.map((p, i) => (
              <li
                key={p.id}
                className={`eb-work__item eb-work__item--${i}`}
                data-reveal
              >
                <a href="#work">
                  <div className="eb-work__media">
                    <Plate
                      from={["#2a2440", "#1d3a2e", "#402a38", "#232326"][i]}
                      to={["#673a94", "#788b5f", "#b794e9", "#6b6b74"][i]}
                      label={p.kind}
                    />
                  </div>
                  <div className="eb-work__meta">
                    <h3>{p.title}</h3>
                    <span className="u-label">{p.year}</span>
                  </div>
                  <p className="eb-work__stack">{p.stack.join(" · ")}</p>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="eb-cred" id="credentials">
          <header className="eb-sec" data-reveal>
            <h2 className="eb-sec__title">Credentials</h2>
            <span className="eb-sec__count u-label">
              <StarGlyph />
              Verified
            </span>
          </header>
          <ul className="eb-rows">
            {credentials.map((c) => (
              <li key={c.id} className="eb-row" data-reveal>
                <a href={c.href} target="_blank" rel="noreferrer">
                  <span className="eb-row__org u-label">{c.org}</span>
                  <span className="eb-row__title">{c.title}</span>
                  <span className="eb-row__metric">{c.metric}</span>
                  <span className="eb-row__year u-label">{c.year}</span>
                  <span className="eb-row__arrow" aria-hidden="true">
                    &#8599;
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="eb-writing" id="writing">
          <header className="eb-sec" data-reveal>
            <h2 className="eb-sec__title">Writing</h2>
            <span className="eb-sec__count u-label">
              <StarGlyph />
              Journal
            </span>
          </header>
          <ul className="eb-rows">
            {posts.map((post) => (
              <li key={post.slug} className="eb-row eb-row--post" data-reveal>
                <a href="#writing">
                  <span className="eb-row__org u-label">{post.tag}</span>
                  <span className="eb-row__title">{post.title}</span>
                  <span className="eb-row__excerpt">{post.excerpt}</span>
                  <span className="eb-row__year u-label">
                    {new Date(post.date).getFullYear()}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="eb-foot" id="contact">
        <div className="eb-foot__links" data-reveal>
          <a href={`mailto:${person.email}`}>{person.email}</a>
          <a href={person.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={person.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
        </div>
        <p className="eb-foot__word" aria-hidden="true">
          <span className="eb-foot__word-ghost">
            {LAST.map((ch, i) => (
              <span key={`${ch}-${i}`} className="eb-char">
                {ch}
              </span>
            ))}
          </span>
          <span className="eb-foot__word-front">
            {LAST.map((ch, i) => (
              <span key={`${ch}-${i}`} className="eb-char">
                {ch}
              </span>
            ))}
          </span>
        </p>
        <div className="eb-foot__base u-label">
          <span>
            © MMXXVI {person.name} <StarGlyph />
          </span>
          <span>Design exploration — Layered Depth</span>
        </div>
      </footer>
    </div>
  );
}

