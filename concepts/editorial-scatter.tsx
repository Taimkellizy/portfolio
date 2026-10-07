"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, usePrefersReducedMotion } from "@/lib/motion";
import { Plate } from "@/components/plate";
import { person, projects, credentials, posts } from "@/lib/content";
import "./editorial-scatter.css";

export function EditorialScatter() {
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

      gsap.from("[data-hero-word]", {
        yPercent: 24,
        opacity: 0,
        duration: 1.35,
        ease: "expo.out",
        stagger: 0.05,
      });

      gsap.from("[data-hero-plate]", {
        y: 90,
        opacity: 0,
        rotate: (i: number) => (i % 2 ? 7 : -7),
        duration: 1.5,
        ease: "expo.out",
        stagger: 0.09,
        delay: 0.15,
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 46,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 86%" },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div className="ed" ref={root}>
      <header className="ed-nav">
        <a className="ed-nav__mark u-label" href="#top">
          {person.name}
        </a>
        <nav className="ed-nav__links" aria-label="Primary">
          <a href="#work">Work</a>
          <a href="#credentials">Credentials</a>
          <a href="#writing">Writing</a>
          <a href="#contact">Contact</a>
        </nav>
        <span className="ed-nav__meta u-label">Archive · MMXXVI</span>
      </header>

      <main id="top">
        <section className="ed-hero">
          <p className="ed-hero__kicker u-label" data-reveal>
            {person.role} — {person.location}
          </p>

          <h1 className="ed-hero__word" aria-label={person.name}>
            <span data-hero-word>TAIM</span>
            <span data-hero-word className="ed-hero__word-b">
              KELLIZY
            </span>
          </h1>
          <div className="ed-hero__scatter" aria-hidden="true">
            <div className="ed-hero__plate ed-hero__plate--a" data-hero-plate data-drift="1.6">
              <Plate from="#2a2440" to="#673a94" label="Plate 01" />
            </div>
            <div className="ed-hero__plate ed-hero__plate--b" data-hero-plate data-drift="0.7">
              <Plate from="#1d3a2e" to="#788b5f" label="Plate 02" />
            </div>
            <div className="ed-hero__plate ed-hero__plate--c" data-hero-plate data-drift="1.2">
              <Plate from="#402a38" to="#b794e9" label="Plate 03" />
            </div>
            <div className="ed-hero__plate ed-hero__plate--d" data-hero-plate data-drift="0.5">
              <Plate from="#232326" to="#6b6b74" label="Plate 04" />
            </div>
          </div>

          <div className="ed-hero__foot">
            <p className="ed-hero__line">
              Building interfaces with the patience of a translator and the
              curiosity of a first-year CS student.
            </p>
            <a className="ed-plus" href="#work" aria-label="See selected work">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </a>
          </div>
        </section>

        <section className="ed-bio" data-reveal>
          <div className="ed-bio__orbit" aria-hidden="true">
            <div className="ed-bio__tile ed-bio__tile--1" data-drift="1.4">
              <Plate from="#2a2440" to="#673a94" />
            </div>
            <div className="ed-bio__tile ed-bio__tile--2" data-drift="0.8">
              <Plate from="#1d3a2e" to="#788b5f" />
            </div>
            <div className="ed-bio__tile ed-bio__tile--3" data-drift="1.1">
              <Plate from="#402a38" to="#b794e9" />
            </div>
            <div className="ed-bio__tile ed-bio__tile--4" data-drift="0.6">
              <Plate from="#2b2b30" to="#8a8a94" />
            </div>
            <div className="ed-bio__tile ed-bio__tile--5" data-drift="1.3">
              <Plate from="#3a1937" to="#a21e4f" />
            </div>
            <div className="ed-bio__tile ed-bio__tile--6" data-drift="0.9">
              <Plate from="#0e2d3c" to="#2c67a6" />
            </div>
          </div>
          <p className="ed-bio__text">
            I started with HTML and CSS, kept going through CS50x, and now spend
            my time between React components, Flask routes, and translating
            talks that reach millions. Proof over claims — the work below is
            checkable.
          </p>
        </section>

        <section className="ed-work" id="work">
          <header className="ed-sec" data-reveal>
            <h2 className="ed-sec__title">Selected work</h2>
            <span className="ed-sec__count u-label">
              {String(projects.length).padStart(2, "0")} entries
            </span>
          </header>
          <ul className="ed-work__grid">
            {projects.map((p, i) => (
              <li
                key={p.id}
                className={`ed-work__item ed-work__item--${i}`}
                data-reveal
              >
                <a href="#work">
                  <div className="ed-work__media">
                    <Plate
                      from={["#2a2440", "#1d3a2e", "#402a38", "#232326"][i]}
                      to={["#673a94", "#788b5f", "#b794e9", "#6b6b74"][i]}
                      label={p.kind}
                    />
                  </div>
                  <div className="ed-work__meta">
                    <h3>{p.title}</h3>
                    <span className="u-label">{p.year}</span>
                  </div>
                  <p className="ed-work__stack">{p.stack.join(" · ")}</p>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="ed-cred" id="credentials">
          <header className="ed-sec" data-reveal>
            <h2 className="ed-sec__title">Credentials</h2>
            <span className="ed-sec__count u-label">Verified</span>
          </header>
          <ul className="ed-rows">
            {credentials.map((c) => (
              <li key={c.id} className="ed-row" data-reveal>
                <a href={c.href} target="_blank" rel="noreferrer">
                  <span className="ed-row__org u-label">{c.org}</span>
                  <span className="ed-row__title">{c.title}</span>
                  <span className="ed-row__metric">{c.metric}</span>
                  <span className="ed-row__year u-label">{c.year}</span>
                  <span className="ed-row__arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="ed-writing" id="writing">
          <header className="ed-sec" data-reveal>
            <h2 className="ed-sec__title">Writing</h2>
            <span className="ed-sec__count u-label">Journal</span>
          </header>
          <ul className="ed-rows">
            {posts.map((post) => (
              <li key={post.slug} className="ed-row ed-row--post" data-reveal>
                <a href="#writing">
                  <span className="ed-row__org u-label">{post.tag}</span>
                  <span className="ed-row__title">{post.title}</span>
                  <span className="ed-row__excerpt">{post.excerpt}</span>
                  <span className="ed-row__year u-label">
                    {new Date(post.date).getFullYear()}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="ed-foot" id="contact">
        <div className="ed-foot__links" data-reveal>
          <a href={`mailto:${person.email}`}>{person.email}</a>
          <a href={person.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={person.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
        </div>
        <p className="ed-foot__word" aria-hidden="true">
          KELLIZY
        </p>
        <div className="ed-foot__base u-label">
          <span>© MMXXVI {person.name}</span>
          <span>Design exploration — concept A</span>
        </div>
      </footer>
    </div>
  );
}
