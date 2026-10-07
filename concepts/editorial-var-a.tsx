"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap, ScrollTrigger, usePrefersReducedMotion } from "@/lib/motion";
import { Plate } from "@/components/plate";
import { StarGlyph } from "@/components/star-glyph";
import { person, projects, credentials, posts } from "@/lib/content";
import "./editorial-var-a.css";

const HERO_WORD = "taim";

const BIO_WORDS =
  "I'm Taim Kellizy — a developer and CS student based in Egypt, originally from Syria. I build interfaces with React and Flask, and translate TED talks that reach millions.".split(
    " ",
  );

const CASES = [
  { from: "#23203a", to: "#5d4b8a" },
  { from: "#1e2b28", to: "#6f8a7d" },
  { from: "#2c2430", to: "#9b7bb6" },
  { from: "#242428", to: "#6e6e78" },
];

const MENU_LINKS = [
  { label: "Work", href: "#ea-work" },
  { label: "Credentials", href: "#ea-credentials" },
  { label: "Writing", href: "#ea-writing" },
  { label: "Contact", href: "#ea-contact" },
];

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

export function EditorialVarA() {
  const root = useRef<HTMLDivElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const giantRef = useRef<HTMLHeadingElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduced = usePrefersReducedMotion();

  /* ---------- menu ---------- */

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    if (!menuPanelRef.current || !menuOverlayRef.current) return;
    if (reduced) return;
    if (menuOpen) {
      gsap.to(menuOverlayRef.current, {
        opacity: 1,
        duration: 0.35,
        onStart: () => {
          if (menuOverlayRef.current)
            menuOverlayRef.current.style.pointerEvents = "auto";
        },
      });
      gsap.to(menuPanelRef.current, { x: 0, duration: 0.55, ease: "expo.out" });
    } else {
      gsap.to(menuOverlayRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          if (menuOverlayRef.current)
            menuOverlayRef.current.style.pointerEvents = "none";
        },
      });
      gsap.to(menuPanelRef.current, {
        x: "100%",
        duration: 0.45,
        ease: "expo.in",
      });
    }
  }, [menuOpen, reduced]);

  useEffect(() => {
    if (reduced) return;
    if (menuOverlayRef.current && menuPanelRef.current) {
      gsap.set(menuOverlayRef.current, { opacity: 0, pointerEvents: "none" });
      gsap.set(menuPanelRef.current, { x: "100%" });
    }
  }, [reduced]);

  /* ---------- hero entrance ---------- */

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
        .from(
          "[data-hero-letter]",
          {
            yPercent: 55,
            opacity: 0,
            duration: 1.35,
            stagger: 0.055,
          },
          0.18,
        )
        .from("[data-hero-star]", { scale: 0, opacity: 0, duration: 0.9 }, 0.55)
        .from("[data-hero-scroll]", { y: 18, opacity: 0, duration: 0.9 }, 0.75);

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

  /* ---------- cursor bubble + text interaction ---------- */

  useEffect(() => {
    if (!root.current || reduced) return;
    const bubble = cursorRef.current;
    const isTouch = matchMedia("(hover: none)").matches;
    if (!bubble || isTouch) return;

    const words = root.current.querySelectorAll<HTMLElement>("[data-hero-word]");
    const originals = new Map<HTMLElement, { x: number; y: number }>();
    words.forEach((w) => originals.set(w, { x: 0, y: 0 }));

    let mouseX = -100;
    let mouseY = -100;
    let bubbleX = -100;
    let bubbleY = -100;
    let raf = 0;

    const scrambleWord = (el: HTMLElement) => {
      const original = el.textContent || "";
      if (!original || el.dataset.scrambling === "1") return;
      el.dataset.scrambling = "1";
      let iteration = 0;
      const maxIterations = 8;
      const interval = setInterval(() => {
        el.textContent = original
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (i < iteration) return original[i];
            return SCRAMBLE_CHARS[
              Math.floor(Math.random() * SCRAMBLE_CHARS.length)
            ];
          })
          .join("");
        iteration += 1;
        if (iteration >= maxIterations) {
          clearInterval(interval);
          el.textContent = original;
          el.dataset.scrambling = "0";
        }
      }, 40);
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const loop = () => {
      bubbleX += (mouseX - bubbleX) * 0.12;
      bubbleY += (mouseY - bubbleY) * 0.12;
      bubble.style.transform = `translate(${bubbleX - 24}px, ${bubbleY - 24}px)`;

      words.forEach((word) => {
        const rect = word.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mouseX - cx;
        const dy = mouseY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 180;

        if (dist < radius) {
          const force = (1 - dist / radius) * 18;
          const tx = (dx / dist) * -force;
          const ty = (dy / dist) * -force;
          gsap.to(word, {
            x: tx,
            y: ty,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          });

          if (dist < 70 && word.dataset.scrambling !== "1") {
            scrambleWord(word);
          }
        } else {
          const orig = originals.get(word);
          if (orig) {
            gsap.to(word, {
              x: orig.x,
              y: orig.y,
              duration: 0.5,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        }
      });

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, [reduced]);

  /* ---------- magnetic wordmark ---------- */

  useEffect(() => {
    if (!giantRef.current || reduced) return;
    const el = giantRef.current;
    const letters = el.querySelectorAll<HTMLElement>(".ea-giant__letter");
    if (!letters.length) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        letters.forEach((letter) => {
          const rect = letter.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const radius = 380;
          if (dist < radius && dist > 0) {
            const force = (1 - dist / radius) * 6;
            const tx = (dx / dist) * force;
            const ty = (dy / dist) * force;
            letter.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`;
          } else {
            letter.style.transform = "translate(0, 0)";
          }
        });
      });
    };
    const onLeave = () => {
      letters.forEach((l) => (l.style.transform = "translate(0, 0)"));
    };

    const isTouch = matchMedia("(hover: none)").matches;
    if (!isTouch) {
      window.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced]);

  /* ---------- cases scroll animation ---------- */

  useEffect(() => {
    if (!root.current || reduced) return;
    const ctx = gsap.context(() => {
      const track = document.querySelector(".ea-cases__track");
      const windowEl = document.querySelector(".ea-cases__window");
      const names = document.querySelectorAll(".ea-cases__name");
      const bgLayers = document.querySelectorAll<HTMLElement>(".ea-cases__bg");

      if (!track || !windowEl) return;

      const slides = track.querySelectorAll(".ea-cases__slide");
      const slideHeight = slides[0]
        ? (slides[0] as HTMLElement).offsetHeight
        : 300;
      const scrollDist = (slides.length - 1) * slideHeight;

      const st = gsap.to(track, {
        y: -scrollDist,
        ease: "none",
        scrollTrigger: {
          trigger: ".ea-cases",
          start: "top top",
          end: () => `+=${scrollDist + windowEl.clientHeight}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(
              projects.length - 1,
              Math.floor(self.progress * projects.length),
            );
            names.forEach((n, i) => {
              n.classList.toggle("is-active", i === idx);
            });
          },
        },
      });

      bgLayers.forEach((layer) => {
        const speed = parseFloat(layer.dataset.speed || "1");
        gsap.to(layer, {
          y: () => -200 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: ".ea-cases",
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
    <div className="ea" ref={root}>
      {/* cursor bubble */}
      <div
        className="ea-cursor"
        ref={cursorRef}
        aria-hidden="true"
        hidden={reduced}
      />

      {/* right-side menu button */}
      <button
        className="ea-menu-btn"
        type="button"
        onClick={openMenu}
        aria-label="Open menu"
      >
        menu
      </button>

      {/* slide-in menu */}
      <div
        className="ea-menu-overlay"
        ref={menuOverlayRef}
        onClick={closeMenu}
        aria-hidden="true"
      />
      <div
        className="ea-menu-panel"
        ref={menuPanelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        hidden={!menuOpen}
      >
        <div className="ea-menu-panel__inner">
          <button
            className="ea-menu-panel__close"
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            close
          </button>
          <nav className="ea-menu-panel__nav" aria-label="Site navigation">
            {MENU_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="ea-menu-panel__link"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a
            className="ea-menu-panel__cta"
            href={`mailto:${person.email}`}
            onClick={closeMenu}
          >
            Get in touch
          </a>
          <div className="ea-menu-panel__foot">
            <p className="ea-menu-panel__status">Available for work</p>
            <a href={`mailto:${person.email}`}>{person.email}</a>
            <div className="ea-menu-panel__social">
              <a href={person.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
              <a href={person.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>

      <main>
        {/* ===================== HERO ===================== */}
        <section className="ea-hero" id="ea-top">
          <div className="ea-hero__glow" aria-hidden="true" />
          <div className="ea-hero__grain" aria-hidden="true" />

          <p className="ea-hero__bio">
            {BIO_WORDS.map((w, i) => (
              <span
                className="ea-hero__word"
                data-hero-word
                key={`${w}-${i}`}
              >
                {w}
              </span>
            ))}
          </p>

          <h1
            className="ea-giant ea-hero__giant"
            aria-label={person.name}
            ref={giantRef}
          >
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

        {/* ===================== BIO ===================== */}
        <section className="ea-bio" id="ea-bio">
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

        {/* ===================== CASES ===================== */}
        <section className="ea-cases" id="ea-work">
          <div className="ea-cases__bg-wrap" aria-hidden="true">
            <div className="ea-cases__bg ea-cases__bg--1" data-speed="0.4">
              <Plate from="#23203a" to="#5d4b8a" />
            </div>
            <div className="ea-cases__bg ea-cases__bg--2" data-speed="0.8">
              <Plate from="#1e2b28" to="#6f8a7d" />
            </div>
            <div className="ea-cases__bg ea-cases__bg--3" data-speed="0.2">
              <Plate from="#2c2430" to="#9b7bb6" />
            </div>
          </div>

          <div className="ea-cases__card">
            <div className="ea-cases__card-header">
              <span className="ea-cases__card-name">taim kellizy</span>
              <span className="ea-cases__card-nav">work</span>
              <span className="ea-cases__card-nav">about</span>
              <span className="ea-cases__card-role">
                Developer & CS Student
                <br />
                Egypt
              </span>
            </div>

            <div className="ea-cases__window">
              <div className="ea-cases__track">
                {projects.map((p, i) => (
                  <div className="ea-cases__slide" key={p.id}>
                    <Plate
                      from={CASES[i].from}
                      to={CASES[i].to}
                      label={p.kind}
                    />
                  </div>
                ))}
              </div>
            </div>

            <span className="ea-cases__title">Cases</span>

            <ul className="ea-cases__names" aria-label="Projects">
              {projects.map((p, i) => (
                <li
                  key={p.id}
                  className={`ea-cases__name${i === 0 ? " is-active" : ""}`}
                >
                  {p.title}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ===================== CREDENTIALS ===================== */}
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

        {/* ===================== WRITING ===================== */}
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

      {/* ===================== FOOTER ===================== */}
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
