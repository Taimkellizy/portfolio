"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  gsap,
  ScrollTrigger,
  usePrefersReducedMotion,
  scrollToTop,
} from "@/lib/motion";
import { SplitText } from "gsap/SplitText";
import { Plate } from "@/components/plate";
import { StarGlyph } from "@/components/star-glyph";
import PrismaticBurst from "@/components/prismatic-burst";
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
  { from: "#2c2430", to: "#9b7bb6", ratio: "landscape" },
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
      if (menuPanelRef.current) {
        menuPanelRef.current.style.visibility = menuOpen ? "visible" : "hidden";
        menuPanelRef.current.style.transform = menuOpen
          ? "translateX(0)"
          : "translateX(100%)";
      }
      menuOverlayRef.current.style.opacity = menuOpen ? "1" : "0";
      menuOverlayRef.current.style.pointerEvents = menuOpen ? "auto" : "none";
      return;
    }
    if (menuOpen) {
      if (menuPanelRef.current) menuPanelRef.current.style.visibility = "visible";
      gsap.to(menuOverlayRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
        onStart: () => {
          if (menuOverlayRef.current)
            menuOverlayRef.current.style.pointerEvents = "auto";
        },
      });
      gsap.to(menuPanelRef.current, {
        x: 0,
        duration: 0.65,
        ease: "expo.out",
        overwrite: "auto",
      });
    } else {
      gsap.to(menuOverlayRef.current, {
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
        overwrite: "auto",
        onComplete: () => {
          if (menuOverlayRef.current)
            menuOverlayRef.current.style.pointerEvents = "none";
        },
      });
      gsap.to(menuPanelRef.current, {
        x: "100%",
        duration: 0.55,
        ease: "expo.in",
        overwrite: "auto",
        onComplete: () => {
          if (menuPanelRef.current)
            menuPanelRef.current.style.visibility = "hidden";
        },
      });
    }
  }, [menuOpen, reduced]);

  useEffect(() => {
    if (reduced) return;
    if (menuOverlayRef.current && menuPanelRef.current) {
      gsap.set(menuOverlayRef.current, { opacity: 0, pointerEvents: "none" });
      gsap.set(menuPanelRef.current, { x: "100%", visibility: "hidden" });
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

      /* fade-up for layout blocks (grids/flex) — SplitText must not
         touch these or it shatters their layout into fake "lines" */
      gsap.utils.toArray<HTMLElement>("[data-reveal-fade]").forEach((el) => {
        gsap.from(el, {
          y: 26,
          opacity: 0,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const isTitle = el.hasAttribute("data-reveal-title");
        if (isTitle) {
          const split = new SplitText(el, {
            type: "words, chars",
            autoSplit: true,
            mask: "chars",
            charsClass: "char",
            onSplit: (self) => {
              return gsap.from(self.chars, {
                duration: 1,
                yPercent: -120,
                scale: 1.2,
                stagger: 0.01,
                ease: "expo.out",
                scrollTrigger: { trigger: el, start: "top 88%" },
              });
            },
          });
          el.setAttribute("data-split", "1");
        } else {
          const split = new SplitText(el, {
            type: "lines, words",
            autoSplit: true,
            mask: "lines",
            linesClass: "line",
            onSplit: (self) => {
              return gsap.from(self.lines, {
                duration: 0.9,
                yPercent: 105,
                stagger: 0.04,
                ease: "expo.out",
                scrollTrigger: { trigger: el, start: "top 88%" },
              });
            },
          });
          el.setAttribute("data-split", "1");
        }
      });
    }, root);
    return () => ctx.revert();
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
          /* composited layers drop out of the cursor's difference-blend
             backdrop on the GPU path — keep these unpromoted */
          force3D: false,
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
            force3D: false,
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
              force3D: false,
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
              force3D: false,
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

  /* ---------- menu words: hovered word zone jumps to full size ---------- */

  useEffect(() => {
    if (!root.current || reduced) return;
    const isTouch = matchMedia("(hover: none)").matches;
    if (isTouch) return;

    const container = root.current.querySelector<HTMLElement>("[data-spectrum]");
    if (!container) return;

    const items = Array.from(
      container.querySelectorAll<HTMLElement>("[data-spectrum-item]"),
    );
    if (!items.length) return;

    /* zone = the word's box plus ZONE_PAD on each side, in the vertical
       stack. Words snap to full size within their zone, everything else
       rests — no per-frame ramp. */
    const ZONE_PAD = 22;
    const ACTIVE_SCALE = 3;

    /* must be the untransformed state: a scaled rect would feed the hover
       state back into itself and make everything wiggle */
    let rest: { el: HTMLElement; cy: number; half: number }[] = [];

    const setActive = (el: HTMLElement | null) => {
      const idx = el ? items.indexOf(el) : -1;
      items.forEach((item, j) => {
        if (j === idx) {
          item.style.transform = `scale(${ACTIVE_SCALE})`;
          item.style.opacity = "1";
        } else {
          /* push neighbours away by half the active word's growth so
             nothing collides: up when above the active word, down when below */
          const push = idx === -1 ? 0 : (ACTIVE_SCALE - 1) * (rest[j]?.half ?? 0);
          const dir = j < idx ? -1 : j > idx ? 1 : 0;
          item.style.transform = `translateY(${(push * dir).toFixed(1)}px) scale(1)`;
          item.style.opacity = "0.2";
        }
      });
    };

    const onEnter = () => {
      rest = items.map((el) => {
        const r = el.getBoundingClientRect();
        return { el, cy: r.top + r.height / 2, half: r.height / 2 };
      });
    };

    const onMove = (e: MouseEvent) => {
      let nearest: { el: HTMLElement; half: number; d: number } | null = null;
      for (const entry of rest) {
        const d = Math.abs(e.clientY - entry.cy);
        if (d < (nearest ? nearest.d : Infinity)) {
          nearest = { el: entry.el, half: entry.half, d };
        }
      }
      setActive(nearest && nearest.d <= nearest.half + ZONE_PAD ? nearest.el : null);
    };

    const onLeave = () => setActive(null);

    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);

    return () => {
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
      setActive(null);
    };
  }, [reduced]);

  /* ---------- variable-weight: boldness follows the cursor ---------- */

  useEffect(() => {
    if (!root.current || reduced) return;
    const isTouch = matchMedia("(hover: none)").matches;
    if (isTouch) return;

    const targets = Array.from(
      root.current.querySelectorAll<HTMLElement>("[data-variable-weight]"),
    );
    if (!targets.length) return;

    /* the variable weight rides the SplitText ".char" spans the reveal
       effect already builds, so chars are queried lazily per frame —
       autoSplit rebuilds them on resize */
    const baseOf = new Map<HTMLElement, number>();
    targets.forEach((t) => {
      baseOf.set(t, parseFloat(getComputedStyle(t).fontWeight) || 600);
    });

    const RANGE = 120;
    const PEAK = 860;

    let raf = 0;
    const update = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        targets.forEach((t) => {
          const base = baseOf.get(t) ?? 600;
          t.querySelectorAll<HTMLElement>(".char").forEach((ch) => {
            const r = ch.getBoundingClientRect();
            if (r.width === 0) return;
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);
            let w = base;
            if (dist < RANGE) {
              const lerp = 1 - dist / RANGE;
              w = base + (PEAK - base) * lerp * lerp;
            }
            const wi = Math.round(w);
            if (ch.dataset.w !== String(wi)) {
              ch.dataset.w = String(wi);
              ch.style.fontWeight = String(wi);
            }
          });
        });
      });
    };

    const reset = () => {
      targets.forEach((t) => {
        t.querySelectorAll<HTMLElement>(".char").forEach((ch) => {
          ch.dataset.w = "";
          ch.style.fontWeight = "";
        });
      });
    };

    window.addEventListener("mousemove", update);
    document.documentElement.addEventListener("mouseleave", reset);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", update);
      document.documentElement.removeEventListener("mouseleave", reset);
    };
  }, [reduced]);

  /* ---------- cases: joffreyspitzer vertical slider ---------- */

  useEffect(() => {
    if (!root.current || reduced) return;
    let ctx: ReturnType<typeof gsap.context> | null = null;
    let winW = window.innerWidth;
    let winH = window.innerHeight;

    const setup = () => {
      ctx?.revert();
      ctx = null;
      if (window.innerWidth <= 900) return;

      ctx = gsap.context(() => {
        const items = gsap.utils.toArray<HTMLElement>(".ea-case");
        const titles = gsap.utils.toArray<HTMLElement>(".ea-case-name");
        if (!items.length || !titles.length) return;

        const BASE = 17.55;
        const EXP = 36;
        const scaleExpanded = EXP / BASE;
        const widthCss = `${BASE}vw`;

        const firstOf = new Map<number, HTMLElement>();
        const lastOf = new Map<number, HTMLElement>();
        items.forEach((item) => {
          const idx = Number(item.dataset.projectIndex ?? 0);
          if (!firstOf.has(idx)) firstOf.set(idx, item);
          lastOf.set(idx, item);
        });

        const baseHeights: number[] = [];
        const expHeights: number[] = [];

        items.forEach((item, d) => {
          const media = item.querySelector<HTMLElement>(".ea-case__plate");
          if (!media) return;
          const initScale = d === 0 ? scaleExpanded : 1;
          gsap.set(media, {
            width: widthCss,
            transformOrigin: "left top",
            scaleX: initScale,
            scaleY: initScale,
            force3D: true,
          });
          const scaledHeight = media.getBoundingClientRect().height;
          const baseHeight = scaledHeight / initScale;
          const expHeight = baseHeight * scaleExpanded;
          baseHeights[d] = baseHeight;
          expHeights[d] = expHeight;
          gsap.set(item, { height: initScale === 1 ? baseHeight : expHeight });
        });

        const activeIdx = Number(items[0]?.dataset.projectIndex ?? 0);
        titles.forEach((t, d) => {
          gsap.set(t, {
            opacity: d === activeIdx ? 1 : 0.2,
            fontWeight: d === activeIdx ? 700 : 500,
          });
        });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".ea-cases",
            start: "top-=6.5% center",
            end: "bottom center-=0.5%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        items.forEach((item, d) => {
          const media = item.querySelector<HTMLElement>(".ea-case__plate");
          const projectIdx = Number(item.dataset.projectIndex ?? d);
          const title = titles[projectIdx];
          const baseHeight = baseHeights[d] ?? 0;
          const expHeight = expHeights[d] ?? baseHeight * scaleExpanded;
          if (!media || !title) return;

          const isFirst = firstOf.get(projectIdx) === item;
          const isLast = lastOf.get(projectIdx) === item;

          timeline.to(
            media,
            {
              scaleX: scaleExpanded,
              scaleY: scaleExpanded,
              force3D: true,
              duration: 0.8,
              ease: "none",
            },
            d,
          );
          if (isFirst)
            timeline.to(
              title,
              { opacity: 1, fontWeight: 700, duration: 0.4, ease: "none" },
              "<",
            );
          timeline.to(item, { height: expHeight, duration: 0.8, ease: "none" }, "<");

          timeline.to(
            media,
            {
              scaleX: 1,
              scaleY: 1,
              force3D: true,
              duration: 1.5,
              ease: "none",
              delay: 0.3,
            },
            ">",
          );
          if (isLast)
            timeline.to(
              title,
              { opacity: 0.2, fontWeight: 500, duration: 0.4, ease: "none" },
              "<",
            );
          timeline.to(item, { height: baseHeight, duration: 1.5, ease: "none" }, "<");
        });
      }, root);
    };

    setup();

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const dw = Math.abs(window.innerWidth - winW);
        const dh = Math.abs(window.innerHeight - winH);
        if (dw < 10 && dh < 120) return;
        winW = window.innerWidth;
        winH = window.innerHeight;
        setup();
        ScrollTrigger.refresh();
      }, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
      ctx?.revert();
    };
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
        aria-hidden={!menuOpen}
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
          {!reduced && (
            <div className="ea-hero__prism" aria-hidden="true">
              <PrismaticBurst
                intensity={3.2}
                speed={0.32}
                animationType="rotate3d"
                distort={0.45}
                mixBlendMode="lighten"
                paused={false}
              />
            </div>
          )}

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
          <div className="ea-bio__inner">
            <p className="ea-bio__label u-label">About</p>
            <p className="ea-bio__text" data-reveal>
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
          <div className="ea-cases__grid">
            {/* left: sticky "Cases" label */}
            <div className="ea-cases__left">
              <h2
                className="ea-cases__title"
                data-reveal
                data-reveal-title
                data-variable-weight
              >
                Cases
              </h2>
            </div>

            {/* center: scrolling images */}
            <div className="ea-cases__images">
              {projects.map((p, i) => (
                <div
                  className={`ea-case ea-case--${CASES[i].ratio}`}
                  data-project-index={i}
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
                    className="ea-case-name"
                    data-project-index={i}
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
          <header className="ea-sec">
            <h2
              className="ea-sec__title"
              data-reveal
              data-reveal-title
              data-variable-weight
            >
              credentials
            </h2>
            <span className="ea-sec__count u-label">Verified</span>
          </header>
          <ul className="ea-rows">
            {credentials.map((c) => (
              <li key={c.id} className="ea-row" data-reveal-fade>
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
          <header className="ea-sec">
            <h2
              className="ea-sec__title"
              data-reveal
              data-reveal-title
              data-variable-weight
            >
              writing
            </h2>
            <span className="ea-sec__count u-label">Journal</span>
          </header>
          <ul className="ea-rows">
            {posts.map((post) => (
              <li key={post.slug} className="ea-row" data-reveal-fade>
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
        {!reduced && (
          <div className="ea-foot__burst" aria-hidden="true">
            <PrismaticBurst
              intensity={2.2}
              speed={0.25}
              animationType="rotate3d"
              distort={0.6}
              mixBlendMode="lighten"
              paused={false}
            />
          </div>
        )}
        <div className="ea-foot__cols" data-reveal-fade>
          <div className="ea-foot__col">
            <h3
              className="ea-foot__col-title"
              data-reveal
              data-reveal-title
              data-variable-weight>Sitemap</h3>
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
            <h3
              className="ea-foot__col-title"
              data-reveal
              data-reveal-title
              data-variable-weight>Social</h3>
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
            <h3
              className="ea-foot__col-title"
              data-reveal
              data-reveal-title
              data-variable-weight>Contact</h3>
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
