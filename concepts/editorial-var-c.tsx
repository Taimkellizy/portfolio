"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, usePrefersReducedMotion } from "@/lib/motion";
import { Plate } from "@/components/plate";
import { StarGlyph } from "@/components/star-glyph";
import { person, projects, credentials, posts } from "@/lib/content";
import "./editorial-var-c.css";

export function EditorialVarC() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!root.current || reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-part]",
        { clipPath: "inset(0% 0% 100% 0%)", y: 28, opacity: 0 },
        {
          clipPath: "inset(-30% -10% -30% -10%)",
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: "expo.out",
          stagger: 0.15,
          delay: 0.2,
        }
      );

      gsap.from("[data-hero-role]", {
        opacity: 0,
        y: 18,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.1,
        delay: 0.8,
      });

      gsap.from("[data-hero-fade]", {
        opacity: 0,
        y: 14,
        duration: 1.3,
        ease: "expo.out",
        stagger: 0.08,
        delay: 1.1,
      });

      gsap.to("[data-hero-bg]", {
        yPercent: 14,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-hero]",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      document.querySelectorAll<HTMLElement>("[data-type]").forEach((el) => {
        const text = el.dataset.type || "";
        const obj = { n: 0 };
        gsap.to(obj, {
          n: text.length,
          duration: Math.max(0.8, text.length * 0.055),
          ease: "steps(" + text.length + ")",
          delay: 1.4,
          onUpdate: () => {
            el.textContent = text.slice(0, Math.round(obj.n));
          },
          onComplete: () => {
            el.textContent = text;
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 48,
          opacity: 0,
          duration: 1.35,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-quote-line]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(0% 0% 100% 0%)", y: 24, opacity: 0 },
          {
            clipPath: "inset(-30% -8% -30% -8%)",
            y: 0,
            opacity: 1,
            duration: 1.4,
            ease: "expo.out",
            delay: i * 0.12,
            scrollTrigger: { trigger: el, start: "top 88%" },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-work-media]").forEach((el) => {
        const plate = el.querySelector(".plate");
        if (!plate) return;
        gsap.fromTo(
          plate,
          { scale: 1.14 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  const coordL = "26\u00b049'N";
  const coordR = "31\u00b032'E";

  return (
    <div className="ec" ref={root}>
      <header className="ec-nav">
        <a className="ec-nav__mark" href="#top">
          <span className="ec-nav__mark-a">Taim</span>
          <span className="ec-nav__mark-b">Kellizy</span>
        </a>
        <nav className="ec-nav__links" aria-label="Primary">
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#credentials">Credentials</a>
          <a href="#writing">Writing</a>
          <a href="#contact">Contact</a>
        </nav>
        <span className="ec-nav__meta">MMXXVI</span>
      </header>

      <main id="top">
        {/* ── HERO ─────────────────────────────────────── */}
        <section className="ec-hero" data-hero>
          <div className="ec-hero__bg" data-hero-bg aria-hidden="true">
            <Plate from="#0a0a0e" to="#1a1525" angle={160} />
          </div>
          <div className="ec-hero__veil" aria-hidden="true" />

          <h1 className="ec-hero__name" aria-label={person.name}>
            <span className="ec-hero__name-a" data-hero-part>
              Taim
            </span>
            <span className="ec-hero__name-b" data-hero-part>
              Kellizy
            </span>
          </h1>

          <ul className="ec-hero__roles" aria-label="Roles">
            <li className="ec-hero__role ec-hero__role--1" data-hero-role>
              <span className="ec-hero__num">01</span>
              <em className="ec-i">the</em>
              <span className="ec-hero__role-name">Developer</span>
            </li>
            <li className="ec-hero__role ec-hero__role--2" data-hero-role>
              <span className="ec-hero__num">02</span>
              <em className="ec-i">the</em>
              <span className="ec-hero__role-name">CS Student</span>
            </li>
            <li className="ec-hero__role ec-hero__role--3" data-hero-role>
              <span className="ec-hero__num">03</span>
              <em className="ec-i">the</em>
              <span className="ec-hero__role-name">Translator</span>
            </li>
          </ul>

          <p className="ec-hero__bio" data-hero-fade>
            Interfaces, tools, and translated talks reaching millions.
            Available for builds, collaboration, and technical writing.
            Proof over claims — the work below is checkable.
          </p>

          <div className="ec-hero__base" data-hero-fade>
            <span
              className="ec-hero__coord"
              data-type={coordL}
            >
              {reduced ? coordL : "\u00a0"}
            </span>
            <span className="ec-hero__region">Egypt · Syria · Worldwide</span>
            <span
              className="ec-hero__coord"
              data-type={coordR}
            >
              {reduced ? coordR : "\u00a0"}
            </span>
          </div>
        </section>

        {/* ── ABOUT ────────────────────────────────────── */}
        <section className="ec-about" id="about">
          <div className="ec-about__meta" data-reveal>
            <span>Origin — Damascus</span>
            <span>N 33°30&rsquo; · E 36°18&rsquo;</span>
            <span>C · JS · Python · React · Flask</span>
          </div>
          <blockquote className="ec-about__quote">
            <p data-quote-line>
              I started with HTML and CSS, kept going through CS50x,
            </p>
            <p data-quote-line>
              and now spend my time between{" "}
              <em className="ec-i">React components</em>,
            </p>
            <p data-quote-line>
              <em className="ec-i">Flask routes</em>, and translating talks
            </p>
            <p data-quote-line>
              that reach <em className="ec-i">millions</em>.
            </p>
          </blockquote>
          <div className="ec-about__foot" data-reveal>
            <StarGlyph />
            <span>Proof over claims</span>
            <StarGlyph />
          </div>
        </section>

        {/* ── WORK ─────────────────────────────────────── */}
        <section className="ec-work" id="work">
          <header className="ec-sec" data-reveal>
            <h2 className="ec-sec__title">
              Selected <em className="ec-i">work</em>
            </h2>
            <span className="ec-sec__meta">
              {String(projects.length).padStart(2, "0")} entries
            </span>
          </header>
          <ul className="ec-work__list">
            {projects.map((p, i) => (
              <li
                key={p.id}
                className={"ec-work__item ec-work__item--" + (i % 2)}
                data-reveal
              >
                <a href="#work">
                  <div className="ec-work__media" data-work-media>
                    <Plate
                      from={
                        ["#14101c", "#0e1418", "#180e14", "#101014"][i % 4]
                      }
                      to={
                        ["#2a2040", "#1a2a35", "#351a28", "#252530"][i % 4]
                      }
                      label={
                        "Plate " +
                        String(i + 1).padStart(2, "0") +
                        " · " +
                        p.kind
                      }
                    />
                    <div className="ec-work__shade" />
                    <div className="ec-work__caption">
                      <div className="ec-work__row">
                        <h3 className="ec-work__title">{p.title}</h3>
                        <span className="ec-work__year">{p.year}</span>
                      </div>
                      <p className="ec-work__stack">{p.stack.join(" · ")}</p>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* ── CREDENTIALS ──────────────────────────────── */}
        <section className="ec-cred" id="credentials">
          <header className="ec-sec" data-reveal>
            <h2 className="ec-sec__title">
              <em className="ec-i">Verified</em> credentials
            </h2>
            <span className="ec-sec__meta">Verified</span>
          </header>
          <ul className="ec-rows">
            {credentials.map((c) => (
              <li key={c.id} className="ec-row" data-reveal>
                <a href={c.href} target="_blank" rel="noreferrer">
                  <span className="ec-row__org">{c.org}</span>
                  <span className="ec-row__title">{c.title}</span>
                  <span className="ec-row__metric">{c.metric}</span>
                  <span className="ec-row__year">{c.year}</span>
                  <span className="ec-row__arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* ── WRITING ──────────────────────────────────── */}
        <section className="ec-writing" id="writing">
          <header className="ec-sec" data-reveal>
            <h2 className="ec-sec__title">
              Recent <em className="ec-i">writing</em>
            </h2>
            <span className="ec-sec__meta">Journal</span>
          </header>
          <ul className="ec-rows">
            {posts.map((post) => (
              <li key={post.slug} className="ec-row ec-row--post" data-reveal>
                <a href="#writing">
                  <span className="ec-row__org">{post.tag}</span>
                  <span className="ec-row__title">{post.title}</span>
                  <span className="ec-row__excerpt">{post.excerpt}</span>
                  <span className="ec-row__year">
                    {new Date(post.date).getFullYear()}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer className="ec-foot" id="contact">
        <span className="ec-foot__label">Contact</span>
        <div className="ec-foot__head" data-reveal>
          <h2 className="ec-foot__title">
            <span className="ec-foot__t-a">Let&rsquo;s build</span>
            <br />
            <em className="ec-i">something</em>{" "}
            <span className="ec-foot__t-a">real</span>
          </h2>
          <div>
            <p className="ec-foot__note">
              Open to international work and collaboration. Based in{" "}
              <em className="ec-i">Egypt</em>, originally from{" "}
              <em className="ec-i">Syria</em> — building for the web from
              anywhere.
            </p>
          </div>
          <div className="ec-foot__links" data-reveal>
            <a href={"mailto:" + person.email}>{person.email}</a>
            <a href={person.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={person.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
          </div>
        </div>
        <div className="ec-foot__base">
          <a className="ec-foot__mark" href="#top">
            <span className="ec-foot__mark-a">Taim</span>
            <span className="ec-foot__mark-b">Kellizy</span>
          </a>
          <span className="ec-foot__copy">© MMXXVI All rights reserved</span>
          <a className="ec-foot__top" href="#top">
            Back to top
          </a>
        </div>
      </footer>
    </div>
  );
}
