"use client";

import { useEffect, useRef } from "react";
import { gsap, usePrefersReducedMotion } from "@/lib/motion";
import { person, projects, credentials, skills, posts } from "@/lib/content";
import "./slide-rack.css";

type Slide = {
  id: string;
  code: string;
  title: string;
  meta: string;
  body: string;
  state: "done" | "held" | "pending" | "flagged";
};

function buildSlides(): Slide[] {
  const cred: Slide[] = credentials.map((c, i) => ({
    id: c.id,
    code: `${["CS", "TE", "EF", "MS", "MK", "UB"][i]}-${c.year.replace(/\D/g, "").slice(-2)}`,
    title: c.title,
    meta: `${c.org} · ${c.metric}`,
    body: c.detail,
    state: "done",
  }));

  const proj: Slide[] = projects.map((p, i) => ({
    id: p.id,
    code: `WK-${String(i + 1).padStart(2, "0")}`,
    title: p.title,
    meta: `${p.kind} · ${p.year}`,
    body: p.stack.join(" / "),
    state: i === 0 ? "flagged" : i === 1 ? "held" : "pending",
  }));

  return [...cred, ...proj];
}

export function SlideRack() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const slides = buildSlides();

  useEffect(() => {
    if (!root.current || reduced) return;
    const ctx = gsap.context(() => {
      gsap.from(".rk-slide", {
        xPercent: 6,
        opacity: 0,
        duration: 1.05,
        ease: "expo.out",
        stagger: 0.055,
      });

      gsap.utils.toArray<HTMLElement>("[data-rk-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.95,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      gsap.to(".rk-light", {
        xPercent: 140,
        ease: "none",
        scrollTrigger: {
          trigger: ".rk-rack",
          start: "top 80%",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".rk-tick__mark", {
        left: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div className="rk" ref={root}>
      <header className="rk-nav">
        <a className="rk-nav__mark" href="#top">
          <span className="rk-nav__flag" aria-hidden="true" />
          TAIM KELLIZY — SELECT RAIL
        </a>
        <nav className="rk-nav__links" aria-label="Primary">
          <a href="#rack">Rack</a>
          <a href="#prose">Prose</a>
          <a href="#bench">Bench</a>
          <a href="#contact">Contact</a>
        </nav>
        <span className="rk-nav__status">
          <i className="rk-dot rk-dot--done" /> WORKED
          <i className="rk-dot rk-dot--held" /> HELD
          <i className="rk-dot rk-dot--flagged" /> FLAGGED
        </span>
      </header>

      <div className="rk-tick" aria-hidden="true">
        {Array.from({ length: 61 }).map((_, i) => (
          <span key={i} className={`rk-tick__cell${i % 5 === 0 ? " is-tall" : ""}`} />
        ))}
        <span className="rk-tick__mark" />
      </div>

      <main id="top">
        <section className="rk-hero" id="rack">
          <div className="rk-hero__code">
            <span>TK / 2026</span>
            <span>FRAME 001 — 10</span>
            <span>{person.location.toUpperCase()}</span>
          </div>

          <h1 className="rk-hero__title">
            <span>TAKE</span>
            <span>SELECTED</span>
            <span>WORK</span>
          </h1>

          <p className="rk-hero__note">
            One type size. Rank is carried by weight, case, reversal and rule —
            the same discipline a cutting bench uses when the print is already
            trimmed. Every credential below is a punched frame you can open.
          </p>
        </section>

        <section className="rk-rack">
          <div className="rk-light" aria-hidden="true" />
          <ol className="rk-slides">
            {slides.map((s, i) => (
              <li key={s.id} className={`rk-slide rk-slide--${s.state}`}>
                <a href="#rack">
                  <div className="rk-slide__head">
                    <span className="rk-slide__code">{s.code}</span>
                    <span className={`rk-slide__state rk-slide__state--${s.state}`}>
                      {s.state}
                    </span>
                  </div>
                  <h2 className="rk-slide__title">{s.title}</h2>
                  <p className="rk-slide__meta">{s.meta}</p>
                  <div className="rk-slide__pane">
                    <p>{s.body}</p>
                  </div>
                  <div className="rk-slide__perf" aria-hidden="true">
                    {Array.from({ length: 6 }).map((_, k) => (
                      <span key={k} />
                    ))}
                  </div>
                  {s.state === "flagged" ? (
                    <span className="rk-slide__flag" aria-hidden="true" />
                  ) : null}
                  <span className="rk-slide__idx">
                    {String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </section>

        <section className="rk-prose" id="prose">
          <div className="rk-prose__pane" data-rk-reveal>
            <p className="rk-prose__label">PROSE PANE — 01</p>
            <p className="rk-prose__body">
              I started with HTML and CSS, pushed through Harvard&apos;s CS50x,
              and now spend my weeks between React components, Flask routes and
              translating TED talks into Arabic. The through-line is care:
              interfaces that hold up when you look closely, and copy that says
              what it means.
            </p>
          </div>

          <div className="rk-prose__side">
            <div className="rk-prose__panel" data-rk-reveal>
              <p className="rk-prose__label">STACK</p>
              <ul>
                {skills.map((s) => (
                  <li key={s.group}>
                    <b>{s.group.toUpperCase()}</b>
                    {s.items.join(" · ")}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rk-prose__panel" data-rk-reveal>
              <p className="rk-prose__label">RÉSUMÉ</p>
              <p className="rk-prose__file">
                PROFILE.PDF
                <a href={person.resume}>OPEN →</a>
              </p>
            </div>
          </div>
        </section>

        <section className="rk-bench" id="bench">
          <header className="rk-bench__head" data-rk-reveal>
            <h2>Bench notes</h2>
            <span className="rk-prose__label">JOURNAL — DISCARD BIN</span>
          </header>
          <ol className="rk-hung">
            {posts.map((post, i) => (
              <li key={post.slug} className="rk-hung__item" data-rk-reveal>
                <span className="rk-hung__pin" aria-hidden="true" />
                <a href="#bench">
                  <span className="rk-slide__code">
                    {["TRIM-01", "TRIM-02", "TRIM-03"][i]}
                  </span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <span className="rk-prose__label">{post.tag}</span>
                </a>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="rk-foot" id="contact">
        <div className="rk-foot__rail">
          <a href={`mailto:${person.email}`}>{person.email}</a>
          <a href={person.linkedin} target="_blank" rel="noreferrer">
            LINKEDIN
          </a>
          <a href={person.instagram} target="_blank" rel="noreferrer">
            INSTAGRAM
          </a>
        </div>
        <div className="rk-foot__base">
          <span>© MMXXVI {person.name}</span>
          <span>DESIGN EXPLORATION — CONCEPT D</span>
          <span>END OF RAIL</span>
        </div>
      </footer>
    </div>
  );
}
