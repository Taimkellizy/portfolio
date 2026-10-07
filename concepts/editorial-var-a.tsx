"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, usePrefersReducedMotion } from "@/lib/motion";
import { Plate } from "@/components/plate";
import { StarGlyph } from "@/components/star-glyph";
import { person, projects, credentials, posts } from "@/lib/content";
import "./editorial-var-a.css";

const HERO_WORD = "taim";

const WORK_PLATE = [
  { from: "#23203a", to: "#5d4b8a" },
  { from: "#1e2b28", to: "#6f8a7d" },
  { from: "#2c2430", to: "#9b7bb6" },
  { from: "#242428", to: "#6e6e78" },
];

export function EditorialVarA() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!root.current || reduced) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.from("[data-hero-nav]", {
        y: -16,
        opacity: 0,
        duration: 0.95,
        stagger: 0.09,
      })
        .from("[data-hero-bio]", { y: 30, opacity: 0, duration: 1.15 }, 0.12)
        .from(
          "[data-hero-letter]",
          {
            yPercent: 55,
            opacity: 0,
            duration: 1.35,
            stagger: 0.055,
          },
          0.18
        )
        .from(
          "[data-hero-star]",
          { scale: 0, opacity: 0, duration: 0.9 },
          0.55
        )
        .from(
          "[data-hero-plate]",
          {
            y: 84,
            opacity: 0,
            rotate: (i: number) => (i % 2 ? 6.5 : -6.5),
            duration: 1.5,
            stagger: 0.1,
          },
          0.3
        )
        .from(
          "[data-hero-scroll]",
          { y: 18, opacity: 0, duration: 0.9 },
          0.75
        );

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
    <div className="ea" ref={root}>
      <main>
        <section className="ea-hero" id="ea-top">
          <header className="ea-nav">
            <a className="ea-nav__mark" href="#ea-top" data-hero-nav>
              taim kellizy
              <StarGlyph className="ea-nav__star" />
            </a>
            <nav className="ea-nav__links" aria-label="Primary" data-hero-nav>
              <a href="#ea-work">Work</a>
              <a href="#ea-credentials">Credentials</a>
              <a href="#ea-writing">Writing</a>
              <a href="#ea-contact">Contact</a>
            </nav>
            <a
              className="ea-nav__cta"
              href={`mailto:${person.email}`}
              data-hero-nav
            >
              Get in touch
            </a>
          </header>

          <p className="ea-hero__bio" data-hero-bio>
            I&apos;m Taim Kellizy — a developer and CS student based in Egypt,
            originally from Syria. I build interfaces with React and Flask, and
            translate TED talks that reach millions.
          </p>

          <div className="ea-hero__plates" aria-hidden="true">
            <div
              className="ea-hero__plate ea-hero__plate--a"
              data-hero-plate
            >
              <div className="ea-drift" data-drift="1.6">
                <Plate from="#23203a" to="#5d4b8a" label="Plate 01" />
              </div>
            </div>
            <div
              className="ea-hero__plate ea-hero__plate--b"
              data-hero-plate
            >
              <div className="ea-drift" data-drift="0.7">
                <Plate from="#1e2b28" to="#6f8a7d" label="Plate 02" />
              </div>
            </div>
            <div
              className="ea-hero__plate ea-hero__plate--c"
              data-hero-plate
            >
              <div className="ea-drift" data-drift="1.25">
                <Plate from="#2c2430" to="#9b7bb6" label="Plate 03" />
              </div>
            </div>
            <div
              className="ea-hero__plate ea-hero__plate--d"
              data-hero-plate
            >
              <div className="ea-drift" data-drift="0.55">
                <Plate from="#242428" to="#6e6e78" label="Plate 04" />
              </div>
            </div>
          </div>

          <h1 className="ea-giant ea-hero__word" aria-label={person.name}>
            <span aria-hidden="true">
              {HERO_WORD.split("").map((ch, i) => (
                <span
                  className="ea-giant__letter"
                  data-hero-letter
                  key={`${ch}-${i}`}
                >
                  {ch}
                </span>
              ))}
            </span>
            <span className="ea-giant__star-wrap" data-hero-star>
              <StarGlyph className="ea-giant__star" />
            </span>
          </h1>

          <a className="ea-hero__scroll" href="#ea-bio" data-hero-scroll>
            Scroll to explore ↓
          </a>
        </section>

        <section className="ea-bio" id="ea-bio">
          <div className="ea-bio__tiles" aria-hidden="true">
            <div className="ea-bio__tile ea-bio__tile--1" data-drift="1.4">
              <Plate from="#23203a" to="#5d4b8a" />
            </div>
            <div className="ea-bio__tile ea-bio__tile--2" data-drift="0.8">
              <Plate from="#1e2b28" to="#6f8a7d" />
            </div>
            <div className="ea-bio__tile ea-bio__tile--3" data-drift="1.15">
              <Plate from="#2c2430" to="#9b7bb6" />
            </div>
            <div className="ea-bio__tile ea-bio__tile--4" data-drift="0.6">
              <Plate from="#242428" to="#6e6e78" />
            </div>
          </div>
          <div className="ea-bio__inner" data-reveal>
            <p className="ea-bio__label u-label">
              About
              <StarGlyph className="ea-bio__star" />
            </p>
            <p className="ea-bio__text">
              HTML and CSS first, then Harvard&apos;s CS50x, then real work:
              React components, Flask routes, SQLite when the data is honest.
              Alongside the code I&apos;ve translated 850+ minutes of TED and
              TEDx talks into Arabic — 17 million views and counting — and
              reviewed the work of new translators as a language supervisor. EF
              SET C2. Proof over claims: everything below is checkable.
            </p>
          </div>
        </section>

        <section className="ea-block" id="ea-work">
          <header className="ea-sec" data-reveal>
            <h2 className="ea-sec__title">selected work</h2>
            <span className="ea-sec__count u-label">
              {String(projects.length).padStart(2, "0")} entries
            </span>
          </header>
          <ul className="ea-work__grid">
            {projects.map((p, i) => (
              <li key={p.id} className="ea-work__item" data-reveal>
                <a href="#ea-work">
                  <div className="ea-work__media">
                    <Plate
                      from={WORK_PLATE[i].from}
                      to={WORK_PLATE[i].to}
                      label={p.kind}
                    />
                  </div>
                  <div className="ea-work__meta">
                    <h3>{p.title}</h3>
                    <span className="u-label">{p.year}</span>
                  </div>
                  <p className="ea-work__stack">{p.stack.join(" · ")}</p>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="ea-block" id="ea-credentials">
          <header className="ea-sec" data-reveal>
            <h2 className="ea-sec__title">credentials</h2>
            <span className="ea-sec__count u-label">Verified</span>
          </header>
          <ul className="ea-rows">
            {credentials.map((c) => (
              <li key={c.id} className="ea-row" data-reveal>
                <a href={c.href} target="_blank" rel="noreferrer">
                  <span className="ea-row__org u-label">{c.org}</span>
                  <span className="ea-row__title">{c.title}</span>
                  <span className="ea-row__metric">{c.metric}</span>
                  <span className="ea-row__year u-label">{c.year}</span>
                  <span className="ea-row__arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="ea-block" id="ea-writing">
          <header className="ea-sec" data-reveal>
            <h2 className="ea-sec__title">writing</h2>
            <span className="ea-sec__count u-label">Journal</span>
          </header>
          <ul className="ea-rows">
            {posts.map((post) => (
              <li key={post.slug} className="ea-row" data-reveal>
                <a href="#ea-writing">
                  <span className="ea-row__org u-label">{post.tag}</span>
                  <span className="ea-row__title">{post.title}</span>
                  <span className="ea-row__excerpt">{post.excerpt}</span>
                  <span className="ea-row__year u-label">
                    {new Date(post.date).getFullYear()}
                  </span>
                  <span className="ea-row__arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="ea-foot" id="ea-contact">
        <div className="ea-foot__cols" data-reveal>
          <div className="ea-foot__col">
            <h3 className="ea-foot__col-title">Sitemap</h3>
            <ul>
              <li>
                <a className="is-active" href="#ea-top">
                  Home
                </a>
              </li>
              <li>
                <a href="#ea-work">Work</a>
              </li>
              <li>
                <a href="#ea-credentials">Credentials</a>
              </li>
              <li>
                <a href="#ea-writing">Writing</a>
              </li>
            </ul>
          </div>
          <div className="ea-foot__col">
            <h3 className="ea-foot__col-title">Social</h3>
            <ul>
              <li>
                <a href={person.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href={person.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
          <div className="ea-foot__col">
            <h3 className="ea-foot__col-title">Contact</h3>
            <ul>
              <li>
                <a href={`mailto:${person.email}`}>{person.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <p className="ea-giant ea-foot__word" aria-hidden="true">
          {HERO_WORD}
          <span className="ea-giant__star-wrap">
            <StarGlyph className="ea-giant__star" />
          </span>
        </p>

        <div className="ea-foot__base">
          <a className="ea-foot__top" href="#ea-top">
            Back to top ↑
          </a>
          <span className="ea-foot__copy">© 2026 {person.name}</span>
        </div>
      </footer>
    </div>
  );
}
