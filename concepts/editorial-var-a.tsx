"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, usePrefersReducedMotion } from "@/lib/motion";
import { Plate } from "@/components/plate";
import { StarGlyph } from "@/components/star-glyph";
import { person, projects, credentials, posts } from "@/lib/content";
import "./editorial-var-a.css";

const FIRST = person.firstName.toUpperCase().split("");
const LAST = person.lastName.toUpperCase().split("");

const W_MIN = 260;
const W_MAX = 900;
const S_MIN = 1.5;
const S_MAX = 5.4;
const F_MAX = 0.9;

export function EditorialVarA() {
  const root = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
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

      gsap.from("[data-hero-a]", {
        xPercent: -16,
        yPercent: -14,
        opacity: 0,
        duration: 1.35,
        ease: "expo.out",
      });

      gsap.from("[data-hero-b]", {
        xPercent: 16,
        yPercent: 14,
        opacity: 0,
        duration: 1.35,
        ease: "expo.out",
        delay: 0.14,
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

      gsap.to("[data-pull='a']", {
        xPercent: -11,
        yPercent: -17,
        ease: "none",
        scrollTrigger: {
          trigger: ".ea-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to("[data-pull='b']", {
        xPercent: 11,
        yPercent: 17,
        ease: "none",
        scrollTrigger: {
          trigger: ".ea-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
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

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    const word = wordRef.current;
    if (!word) return;

    const chars = Array.from(
      word.querySelectorAll<HTMLElement>("[data-vchar]")
    );
    const state = chars.map(() => ({
      w: W_MIN,
      s: S_MIN,
      f: 0,
      tw: W_MIN,
      ts: S_MIN,
      tf: 0,
    }));
    let raf = 0;
    let hovering = false;

    const retarget = (mx: number, my: number | null) => {
      chars.forEach((el, i) => {
        const st = state[i];
        if (my === null) {
          st.tw = W_MIN;
          st.ts = S_MIN;
          st.tf = 0;
          return;
        }
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const radius = Math.max(220, r.height * 2.4);
        const t = Math.min(
          1,
          Math.max(0, 1 - Math.hypot(mx - cx, my - cy) / radius)
        );
        const p = t * t * (3 - 2 * t);
        st.tw = W_MIN + (W_MAX - W_MIN) * p;
        st.ts = S_MIN + (S_MAX - S_MIN) * p;
        st.tf = F_MAX * p;
      });
    };

    const tick = () => {
      let settling = false;
      chars.forEach((el, i) => {
        const st = state[i];
        st.w += (st.tw - st.w) * 0.16;
        st.s += (st.ts - st.s) * 0.16;
        st.f += (st.tf - st.f) * 0.16;
        if (
          Math.abs(st.tw - st.w) > 0.4 ||
          Math.abs(st.ts - st.s) > 0.01 ||
          Math.abs(st.tf - st.f) > 0.002
        ) {
          settling = true;
        }
        el.style.setProperty("--ea-w", String(Math.round(st.w)));
        el.style.setProperty("--ea-stroke", `${st.s.toFixed(2)}px`);
        el.style.setProperty("--ea-fill", st.f.toFixed(3));
      });
      if (hovering || settling) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const onMove = (e: MouseEvent) => {
      hovering = true;
      retarget(e.clientX, e.clientY);
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      hovering = false;
      retarget(0, null);
      if (!raf) raf = requestAnimationFrame(tick);
    };

    word.addEventListener("mousemove", onMove);
    word.addEventListener("mouseleave", onLeave);

    return () => {
      word.removeEventListener("mousemove", onMove);
      word.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div className="ea" ref={root}>
      <header className="ea-nav">
        <a className="ea-nav__mark u-label" href="#top">
          {person.name}
        </a>
        <nav className="ea-nav__links" aria-label="Primary">
          <a href="#work">Work</a>
          <a href="#credentials">Credentials</a>
          <a href="#writing">Writing</a>
          <a href="#contact">Contact</a>
        </nav>
        <span className="ea-nav__meta u-label">Archive · MMXXVI</span>
      </header>

      <main id="top">
        <section className="ea-hero">
          <p className="ea-hero__kicker u-label">
            <StarGlyph />
            <span>
              {person.role} — {person.location}
            </span>
          </p>

          <h1 className="ea-hero__title" aria-label={person.name}>
            <span className="ea-hero__word ea-hero__word-a" data-pull="a">
              <span className="ea-hero__word-a-in" data-hero-a>
                {FIRST.join("")}
              </span>
            </span>
            <span className="ea-hero__word ea-hero__word-b" data-pull="b">
              <span className="ea-hero__word-b-in" data-hero-b ref={wordRef}>
                {LAST.map((ch, i) => (
                  <span key={`${ch}-${i}`} className="ea-char" data-vchar>
                    {ch}
                  </span>
                ))}
              </span>
            </span>
          </h1>

          <div className="ea-hero__scatter" aria-hidden="true">
            <div
              className="ea-hero__plate ea-hero__plate--a ea-hero__plate--front"
              data-hero-plate
              data-drift="1.6"
            >
              <Plate from="#2a2440" to="#673a94" label="Plate 01" />
            </div>
            <div
              className="ea-hero__plate ea-hero__plate--b ea-hero__plate--back"
              data-hero-plate
              data-drift="0.7"
            >
              <Plate from="#1d3a2e" to="#788b5f" label="Plate 02" />
            </div>
            <div
              className="ea-hero__plate ea-hero__plate--c ea-hero__plate--front"
              data-hero-plate
              data-drift="1.2"
            >
              <Plate from="#402a38" to="#b794e9" label="Plate 03" />
            </div>
            <div
              className="ea-hero__plate ea-hero__plate--d ea-hero__plate--back"
              data-hero-plate
              data-drift="0.5"
            >
              <Plate from="#232326" to="#6b6b74" label="Plate 04" />
            </div>
          </div>

          <div className="ea-hero__foot">
            <p className="ea-hero__line">
              Building interfaces with the patience of a translator and the
              curiosity of a first-year CS student.
            </p>
            <a className="ea-plus" href="#work" aria-label="See selected work">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </a>
          </div>
        </section>

        <section className="ea-bio" data-reveal>
          <div className="ea-bio__orbit" aria-hidden="true">
            <div className="ea-bio__tile ea-bio__tile--1" data-drift="1.4">
              <Plate from="#2a2440" to="#673a94" />
            </div>
            <div className="ea-bio__tile ea-bio__tile--2" data-drift="0.8">
              <Plate from="#1d3a2e" to="#788b5f" />
            </div>
            <div className="ea-bio__tile ea-bio__tile--3" data-drift="1.1">
              <Plate from="#402a38" to="#b794e9" />
            </div>
            <div className="ea-bio__tile ea-bio__tile--4" data-drift="0.6">
              <Plate from="#2b2b30" to="#8a8a94" />
            </div>
            <div className="ea-bio__tile ea-bio__tile--5" data-drift="1.3">
              <Plate from="#3a1937" to="#a21e4f" />
            </div>
            <div className="ea-bio__tile ea-bio__tile--6" data-drift="0.9">
              <Plate from="#0e2d3c" to="#2c67a6" />
            </div>
          </div>
          <p className="ea-bio__text">
            I started with HTML and CSS, kept going through CS50x, and now spend
            my time between React components, Flask routes, and translating
            talks that reach millions. Proof over claims — the work below is
            checkable.
          </p>
        </section>

        <section className="ea-work" id="work">
          <header className="ea-sec" data-reveal>
            <h2 className="ea-sec__title">Selected work</h2>
            <span className="ea-sec__count u-label">
              <StarGlyph />
              {String(projects.length).padStart(2, "0")} entries
            </span>
          </header>
          <ul className="ea-work__grid">
            {projects.map((p, i) => (
              <li
                key={p.id}
                className={`ea-work__item ea-work__item--${i}`}
                data-reveal
              >
                <a href="#work">
                  <div className="ea-work__media">
                    <Plate
                      from={["#2a2440", "#1d3a2e", "#402a38", "#232326"][i]}
                      to={["#673a94", "#788b5f", "#b794e9", "#6b6b74"][i]}
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

        <section className="ea-cred" id="credentials">
          <header className="ea-sec" data-reveal>
            <h2 className="ea-sec__title">Credentials</h2>
            <span className="ea-sec__count u-label">
              <StarGlyph />
              Verified
            </span>
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
                    &#8599;
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="ea-writing" id="writing">
          <header className="ea-sec" data-reveal>
            <h2 className="ea-sec__title">Writing</h2>
            <span className="ea-sec__count u-label">
              <StarGlyph />
              Journal
            </span>
          </header>
          <ul className="ea-rows">
            {posts.map((post) => (
              <li key={post.slug} className="ea-row ea-row--post" data-reveal>
                <a href="#writing">
                  <span className="ea-row__org u-label">{post.tag}</span>
                  <span className="ea-row__title">{post.title}</span>
                  <span className="ea-row__excerpt">{post.excerpt}</span>
                  <span className="ea-row__year u-label">
                    {new Date(post.date).getFullYear()}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="ea-foot" id="contact">
        <div className="ea-foot__links" data-reveal>
          <a href={`mailto:${person.email}`}>{person.email}</a>
          <a href={person.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={person.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
        </div>
        <p className="ea-foot__word" aria-hidden="true">
          {LAST.map((ch, i) => (
            <span key={`${ch}-${i}`} className="ea-char">
              {ch}
            </span>
          ))}
        </p>
        <div className="ea-foot__base u-label">
          <span>
            © MMXXVI {person.name} <StarGlyph />
          </span>
          <span>Design exploration — Variable Stroke</span>
        </div>
      </footer>
    </div>
  );
}

