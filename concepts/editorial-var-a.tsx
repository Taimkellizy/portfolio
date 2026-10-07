"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  gsap,
  ScrollTrigger,
  usePrefersReducedMotion,
  scrollToTop,
} from "@/lib/motion";
import { Plate } from "@/components/plate";
import { StarGlyph } from "@/components/star-glyph";
import { Menu, X, ArrowUpRight, ArrowUp, Mail } from "lucide-react";
import { person, projects, credentials, posts } from "@/lib/content";
import "./editorial-var-a.css";

const HERO_WORD = "taim";

const BIO_WORDS =
  "I'm Taim Kellizy — a developer and CS student based in Egypt, originally from Syria. I build interfaces with React and Flask, and translate TED talks that reach millions.".split(
    " ",
  );

const CASES = [
  { from: "#23203a", to: "#5d4b8a", ratio: "wide" },
  { from: "#1e2b28", to: "#6f8a7d", ratio: "landscape" },
  { from: "#2c2430", to: "#9b7bb6", ratio: "portrait" },
  { from: "#242428", to: "#6e6e78", ratio: "landscape" },
];

const MENU_LINKS = [
  { label: "Work", href: "#ea-work" },
  { label: "Credentials", href: "#ea-credentials" },
  { label: "Writing", href: "#ea-writing" },
  { label: "Contact", href: "#ea-contact" },
];

export function EditorialVarA() {
  const root = useRef<HTMLDivElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const giantRef = useRef<HTMLHeadingElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
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
    if (reduced) {
      menuPanelRef.current.style.transform = menuOpen
        ? "translateX(0)"
        : "translateX(100%)";
      menuOverlayRef.current.style.opacity = menuOpen ? "1" : "0";
      menuOverlayRef.current.style.pointerEvents = menuOpen ? "auto" : "none";
      return;
    }
    if (menuOpen) {
      gsap.to(menuOverlayRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
        onStart: () => {
          if (menuOverlayRef.current)
            menuOverlayRef.current.style.pointerEvents = "auto";
        },
      });
      gsap.to(menuPanelRef.current, {
        x: 0,
        duration: 0.65,
        ease: "expo.out",
      });
    } else {
      gsap.to(menuOverlayRef.current, {
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => {
          if (menuOverlayRef.current)
            menuOverlayRef.current.style.pointerEvents = "none";
        },
      });
      gsap.to(menuPanelRef.current, {
        x: "100%",
        duration: 0.55,
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

  /* ---------- hero particles ---------- */

  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas || reduced) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const particles: {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      a: number;
    }[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      w = rect.width;
      h = rect.height;
    };
    resize();
    window.addEventListener("resize", resize);

    const count = 35;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.3,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.12,
        a: Math.random() * 0.18 + 0.04,
      });
    }

    const draw = () => {
      ctx2d.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx2d.beginPath();
        ctx2d.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx2d.fillStyle = `rgba(232, 230, 225, ${p.a})`;
        ctx2d.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  /* ---------- cursor + letter disassembly ---------- */

  useEffect(() => {
    if (!root.current || reduced) return;
    const bubble = cursorRef.current;
    const isTouch = matchMedia("(hover: none)").matches;
    if (!bubble || isTouch) return;

    let mouseX = -100;
    let mouseY = -100;
    let bubbleX = -100;
    let bubbleY = -100;
    let scale = 1;
    let targetScale = 1;
    let raf = 0;
    let frame = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const words =
      root.current.querySelectorAll<HTMLElement>("[data-hero-word]");
    words.forEach((word) => {
      const text = word.textContent || "";
      word.innerHTML = text
        .split("")
        .map(
          (ch) =>
            `<span class="ea-hero__ch"${ch === " " ? ' data-space="1"' : ""}>${ch === " " ? "&nbsp;" : ch}</span>`,
        )
        .join("");
    });

    const disassemble = (word: HTMLElement) => {
      if (word.dataset.busy === "1") return;
      word.dataset.busy = "1";
      const chars = word.querySelectorAll<HTMLElement>(
        ".ea-hero__ch:not([data-space])",
      );
      const n = chars.length;
      if (n === 0) {
        word.dataset.busy = "0";
        return;
      }
      chars.forEach((ch, i) => {
        const angle = (i / n) * Math.PI * 2;
        const radius = 22 + Math.random() * 16;
        gsap.to(ch, {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          rotation: (Math.random() - 0.5) * 50,
          opacity: 0.3,
          duration: 0.3,
          ease: "power2.out",
          delay: i * 0.012,
        });
      });
      gsap.delayedCall(0.5, () => {
        chars.forEach((ch, i) => {
          gsap.to(ch, {
            x: 0,
            y: 0,
            rotation: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power2.inOut",
            delay: i * 0.015,
            onComplete:
              i === n - 1
                ? () => {
                    word.dataset.busy = "0";
                  }
                : undefined,
          });
        });
      });
    };

    const loop = () => {
      bubbleX += (mouseX - bubbleX) * 0.18;
      bubbleY += (mouseY - bubbleY) * 0.18;
      scale += (targetScale - scale) * 0.12;
      bubble.style.transform = `translate(${bubbleX - 22}px, ${bubbleY - 22}px) scale(${scale})`;

      frame++;
      if (frame % 3 === 0) {
        words.forEach((word) => {
          const rect = word.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = mouseX - cx;
          const dy = mouseY - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const radius = 160;

          if (dist < radius) {
            const force = (1 - dist / radius) * 12;
            const tx = (dx / dist) * -force;
            const ty = (dy / dist) * -force;
            gsap.to(word, {
              x: tx,
              y: ty,
              duration: 0.4,
              ease: "power2.out",
              overwrite: "auto",
            });
            if (dist < 75) {
              disassemble(word);
            }
          } else {
            gsap.to(word, {
              x: 0,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        });

        const el = document.elementFromPoint(mouseX, mouseY);
        targetScale = el && el.closest("a, button") ? 2.2 : 1;
      }

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

  /* ---------- spectrum hover for menu + cases ---------- */

  useEffect(() => {
    if (!root.current || reduced) return;
    const isTouch = matchMedia("(hover: none)").matches;
    if (isTouch) return;

    const containers =
      root.current.querySelectorAll<HTMLElement>("[data-spectrum]");
    const rafMap = new Map<HTMLElement, number>();

    containers.forEach((container) => {
      const items = container.querySelectorAll<HTMLElement>(
        "[data-spectrum-item]",
      );
      if (!items.length) return;

      const onMove = (e: MouseEvent) => {
        cancelAnimationFrame(rafMap.get(container) || 0);
        rafMap.set(
          container,
          requestAnimationFrame(() => {
            items.forEach((item) => {
              const rect = item.getBoundingClientRect();
              const cx = rect.left + rect.width / 2;
              const cy = rect.top + rect.height / 2;
              const dx = e.clientX - cx;
              const dy = e.clientY - cy;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const radius = 280;
              if (dist < radius) {
                const t = 1 - dist / radius;
                const peak = t * t; /* quadratic falloff */
                const s = 1 + peak * 2;
                item.style.transform = `scale(${s.toFixed(4)})`;
                item.style.opacity = String(0.2 + peak * 0.8);
              } else {
                item.style.transform = "scale(1)";
                item.style.opacity = "0.2";
              }
            });
          }),
        );
      };

      const onLeave = () => {
        items.forEach((item) => {
          item.style.transform = "scale(1)";
          item.style.opacity = "0.2";
        });
      };

      container.addEventListener("mousemove", onMove);
      container.addEventListener("mouseleave", onLeave);
    });

    return () => {
      containers.forEach((container) => {
        cancelAnimationFrame(rafMap.get(container) || 0);
      });
    };
  }, [reduced]);

  /* ---------- cases: spectrum on scroll (like menu hover) ---------- */

  useEffect(() => {
    if (!root.current || reduced) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".ea-case");
      const names = document.querySelectorAll(".ea-case-name");

      if (!items.length) return;

      ScrollTrigger.create({
        trigger: ".ea-cases",
        start: "top 80%",
        end: "bottom 20%",
        onUpdate: () => {
          const mid = window.innerHeight * 0.5;
          let bestIdx = 0;
          let bestDist = Infinity;

          items.forEach((item, i) => {
            const rect = item.getBoundingClientRect();
            const cy = rect.top + rect.height / 2;
            const dist = Math.abs(cy - mid);

            if (dist < bestDist) {
              bestDist = dist;
              bestIdx = i;
            }

            /* spectrum: peak at center, falloff with distance */
            const radius = window.innerHeight * 0.35;
            const t = Math.max(0, 1 - dist / radius);
            const peak = t * t;
            const s = 1 + peak * 0.6;
            const opacity = 0.15 + peak * 0.85;
            item.style.transform = `scale(${s.toFixed(4)})`;
            item.style.opacity = String(opacity.toFixed(3));
          });

          names.forEach((n, i) => {
            n.classList.toggle("is-active", i === bestIdx);
          });
        },
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

      {/* menu button */}
      <button
        className="ea-menu-btn"
        type="button"
        onClick={openMenu}
        aria-label="Open menu"
      >
        <Menu size={20} strokeWidth={1.5} />
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
            <X size={24} strokeWidth={1.5} />
          </button>
          <nav
            className="ea-menu-panel__nav"
            aria-label="Site navigation"
            data-spectrum
          >
            {MENU_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="ea-menu-panel__link"
                data-spectrum-item
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
            <Mail size={16} strokeWidth={1.5} />
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
          <canvas
            className="ea-hero__particles"
            ref={particleCanvasRef}
            aria-hidden="true"
          />

          <p className="ea-hero__bio">
            {BIO_WORDS.map((w, i) => (
              <span className="ea-hero__word" data-hero-word key={`${w}-${i}`}>
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
            Scroll to explore
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

        {/* ===================== CASES (joffreyspitzer.com layout) ===================== */}
        <section className="ea-cases" id="ea-work">
          <div className="ea-cases__line" aria-hidden="true" />
          <div className="ea-cases__grid">
            {/* left: sticky "Cases" label */}
            <div className="ea-cases__left">
              <h2 className="ea-cases__title">Cases</h2>
            </div>

            {/* center: scrolling images */}
            <div className="ea-cases__images">
              {projects.map((p, i) => (
                <div
                  className={`ea-case ea-case--${CASES[i].ratio}`}
                  key={p.id}
                >
                  <div className="ea-case__plate">
                    <Plate
                      from={CASES[i].from}
                      to={CASES[i].to}
                      label={p.kind}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* right: sticky project names */}
            <div className="ea-cases__names">
              <div className="ea-cases__names-inner">
                {projects.map((p, i) => (
                  <a
                    key={p.id}
                    className={`ea-case-name${i === 0 ? " is-active" : ""}`}
                    href="#ea-work"
                  >
                    {p.title}
                  </a>
                ))}
              </div>
            </div>
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
                    <ArrowUpRight size={16} strokeWidth={1.5} />
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
                    <ArrowUpRight size={16} strokeWidth={1.5} />
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
          <button className="ea-foot__top" type="button" onClick={scrollToTop}>
            Back to top
            <ArrowUp size={16} strokeWidth={1.5} />
          </button>
          <span className="ea-foot__copy">© 2026 {person.name}</span>
        </div>
      </footer>
    </div>
  );
}
