"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, usePrefersReducedMotion } from "@/lib/motion";
import { Plate } from "@/components/plate";
import { StarGlyph } from "@/components/star-glyph";
import { person, projects, credentials, posts } from "@/lib/content";
import "./editorial-var-b.css";

const PLATE = [
  { from: "#2a2440", to: "#673a94" },
  { from: "#1d3a2e", to: "#788b5f" },
  { from: "#402a38", to: "#b794e9" },
  { from: "#232326", to: "#6b6b74" },
];

export function EditorialVarB() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!root.current || reduced) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-hero-line]", {
        yPercent: 34,
        opacity: 0,
        duration: 1.3,
        ease: "expo.out",
        stagger: 0.14,
      });

      gsap.from("[data-hero-pill]", {
        scale: 0.5,
        opacity: 0,
        duration: 0.85,
        ease: "back.out(2.6)",
        stagger: 0.07,
        delay: 0.45,
      });

      gsap.from("[data-hero-plate]", {
        y: 72,
        opacity: 0,
        duration: 1.45,
        ease: "expo.out",
        stagger: 0.1,
        delay: 0.2,
      });

      gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((el) => {
        const speed = parseFloat(el.dataset.drift || "1");
        gsap.to(el, {
          yPercent: -13 * speed,
          rotate: `+=${speed > 1 ? 2.2 : -1.7}`,
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
          y: 40,
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
          <StarGlyph className="eb-nav__star" />
        </a>
        <nav className="eb-nav__pills" aria-label="Primary">
          <a className="eb-nav__pill" href="#top">
            Home
          </a>
          <a className="eb-nav__pill" href="#work">
            Work
          </a>
          <a className="eb-nav__pill" href="#about">
            About
          </a>
          <a className="eb-nav__pill" href="#contact">
            Contact
          </a>
        </nav>
        <span className="eb-nav__meta u-label">Concept lab · B</span>
      </header>

      <main id="top">
        <section className="eb-hero">
          <div className="eb-hero__top">
            <p className="u-label">
              {person.role} — {person.location}
            </p>
            <p className="u-label eb-hero__top-end">Portfolio · MMXXVI</p>
          </div>

          <h1
            className="eb-hero__type"
            aria-label={`${person.firstName}, creative developer and CS student`}
          >
            <span className="eb-hero__line" data-hero-line>
              <span className="eb-hero__word">HI</span>
              <span className="eb-chip" data-hero-pill>
                Hey there
              </span>
              <span className="eb-hero__word">
                I&apos;M {person.firstName.toUpperCase()}!
              </span>
            </span>
            <span className="eb-hero__line eb-hero__line--mid" data-hero-line>
              <span className="eb-hero__word">CREATIVE</span>
              <span className="eb-chip" data-hero-pill>
                CS Student
              </span>
              <span className="eb-hero__word">DEVELOPER</span>
            </span>
            <span className="eb-hero__line" data-hero-line>
              <span className="eb-chip" data-hero-pill>
                Based in Egypt
              </span>
              <span className="eb-hero__word">&amp; ENGINEER</span>
            </span>
          </h1>

          <div className="eb-hero__scatter" aria-hidden="true">
            <div
              className="eb-hero__plate eb-hero__plate--a"
              data-hero-plate
              data-drift="1.5"
            >
              <Plate from={PLATE[0].from} to={PLATE[0].to} label="Plate 01" />
            </div>
            <div
              className="eb-hero__plate eb-hero__plate--b"
              data-hero-plate
              data-drift="0.7"
            >
              <Plate from={PLATE[1].from} to={PLATE[1].to} label="Plate 02" />
            </div>
            <div
              className="eb-hero__plate eb-hero__plate--c"
              data-hero-plate
              data-drift="1.2"
            >
              <Plate from={PLATE[2].from} to={PLATE[2].to} label="Plate 03" />
            </div>
            <div
              className="eb-hero__plate eb-hero__plate--d"
              data-hero-plate
              data-drift="0.55"
            >
              <Plate from={PLATE[3].from} to={PLATE[3].to} label="Plate 04" />
            </div>
            <span className="eb-chip eb-chip--float eb-chip--a" data-hero-pill>
              Taim Kellizy
            </span>
            <span className="eb-chip eb-chip--float eb-chip--b" data-hero-pill>
              Egypt
            </span>
          </div>

          <div className="eb-hero__foot">
            <p className="eb-hero__blurb">
              First-year CS student who ships interfaces. React and Flask on the
              desk, 850+ minutes of TED talks translated behind me, and a habit
              of checking claims against the work.
            </p>
            <a className="eb-hero__cue u-label" href="#work">
              <StarGlyph className="eb-hero__cue-star" />
              Selected work
            </a>
          </div>
        </section>

        <section className="eb-about" id="about" data-reveal>
          <p className="eb-about__label u-label">About</p>
          <p className="eb-about__text">
            I started with HTML and CSS, moved through CS50x, and now spend my
            days between React components, Flask routes, and translating talks
            that reach millions. Proof over claims — every link below opens.
          </p>
          <ul className="eb-about__chips">
            <li>
              <span className="eb-chip">Taim Kellizy</span>
            </li>
            <li>
              <span className="eb-chip">CS Student</span>
            </li>
            <li>
              <span className="eb-chip">Developer</span>
            </li>
            <li>
              <span className="eb-chip">Egypt</span>
            </li>
          </ul>
        </section>

        <section className="eb-work" id="work">
          <header className="eb-sec" data-reveal>
            <h2 className="eb-sec__title">
              <StarGlyph className="eb-sec__star" />
              Selected work
            </h2>
            <span className="eb-sec__count u-label">
              {String(projects.length).padStart(2, "0")} entries
            </span>
          </header>
          <ul className="eb-work__grid">
            {projects.map((p, i) => (
              <li
                key={p.id}
                className={`eb-work__card eb-work__card--${i}`}
                data-reveal
              >
                <a href="#work">
                  <div className="eb-work__media">
                    <Plate
                      from={PLATE[i % PLATE.length].from}
                      to={PLATE[i % PLATE.length].to}
                      label={p.kind}
                    />
                  </div>
                  <p className="eb-card__caption">
                    <span className="eb-card__num">
                      [{String(i + 1).padStart(2, "0")}]
                    </span>
                    <span className="eb-card__name">{p.title}</span>
                    <span className="eb-card__kind">— {p.kind}</span>
                  </p>
                  <ul className="eb-card__tags">
                    {p.stack.map((s) => (
                      <li key={s} className="eb-tag">
                        {s}
                      </li>
                    ))}
                  </ul>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="eb-cred" id="credentials">
          <header className="eb-sec" data-reveal>
            <h2 className="eb-sec__title">
              <StarGlyph className="eb-sec__star" />
              Credentials
            </h2>
            <span className="eb-sec__count u-label">Verified</span>
          </header>
          <ul className="eb-rows">
            {credentials.map((c) => (
              <li key={c.id} className="eb-row eb-row--cred" data-reveal>
                <a href={c.href} target="_blank" rel="noreferrer">
                  <span className="eb-row__title">{c.title}</span>
                  <span className="eb-row__org u-label">{c.org}</span>
                  <span className="eb-row__metric">{c.metric}</span>
                  <span className="eb-row__year u-label">{c.year}</span>
                  <span className="eb-badge">{c.mark}</span>
                  <span className="eb-row__arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="eb-writing" id="writing">
          <header className="eb-sec" data-reveal>
            <h2 className="eb-sec__title">
              <StarGlyph className="eb-sec__star" />
              Writing
            </h2>
            <span className="eb-sec__count u-label">Journal</span>
          </header>
          <ul className="eb-rows">
            {posts.map((post) => (
              <li key={post.slug} className="eb-row eb-row--post" data-reveal>
                <a href="#writing">
                  <span className="eb-tag eb-tag--solid">{post.tag}</span>
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
        <div className="eb-foot__row" data-reveal>
          <p className="eb-foot__say">
            <StarGlyph className="eb-foot__star" />
            Let&apos;s build something checkable.
          </p>
          <a className="eb-foot__mail eb-chip" href={`mailto:${person.email}`}>
            {person.email}
          </a>
        </div>
        <div className="eb-foot__links" data-reveal>
          <a href={person.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={person.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href={person.resume} target="_blank" rel="noreferrer">
            Resume
          </a>
        </div>
        <p className="eb-foot__word" aria-hidden="true">
          KELLIZY
        </p>
        <div className="eb-foot__base u-label">
          <span>© MMXXVI {person.name}</span>
          <span>Design exploration — concept B</span>
        </div>
      </footer>
    </div>
  );
}
