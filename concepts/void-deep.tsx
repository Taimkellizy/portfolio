"use client";

import { useEffect, useRef } from "react";
import { gsap, usePrefersReducedMotion } from "@/lib/motion";
import { person, projects, skills, posts } from "@/lib/content";
import "./void-deep.css";

type Layer = {
  label: string;
  detail: string;
  depth: number;
};

const QUEUE: Layer[] = [
  { label: "HARVARD CS50X", detail: "ALGORITHMS / C / PYTHON / SQL / FLASK", depth: 1 },
  { label: "TED TRANSLATORS SUPERVISOR", detail: "850+ MIN · 17M+ VIEWS · REVIEWER", depth: 1 },
  { label: "EF SET C2 PROFICIENT", detail: "77 / 100 — NEAR-NATIVE ENGLISH", depth: 2 },
  { label: "MCKINSEY FORWARD", detail: "PROBLEM SOLVING / PROFESSIONAL EFFECTIVENESS", depth: 2 },
  { label: "MICROSOFT GENERATIVE AI", detail: "CAREER ESSENTIALS CERTIFICATE", depth: 3 },
  { label: "UNBLOCK SYRIA", detail: "CERTIFICATE OF CONTRIBUTION", depth: 3 },
];

const WORK: Layer[] = projects.map((p) => ({
  label: p.title.toUpperCase(),
  detail: `${p.kind.toUpperCase()} · ${p.stack.join(" / ").toUpperCase()} · ${p.year}`,
  depth: p.id === "p1" ? 1 : 2,
}));

const WIPE_LINES = 6;

export function VoidDeep() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!root.current) return;

    const canvases = Array.from(
      root.current.querySelectorAll<HTMLCanvasElement>("canvas[data-dust]")
    );

    let raf = 0;
    let w = 0;
    let h = 0;

    const fields = canvases.map((canvas, i) => {
      const speed = [0.12, 0.28, 0.5][i] ?? 0.2;
      const density = [220, 130, 70][i] ?? 60;
      const ctx = canvas.getContext("2d");

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);
        w = rect.width;
        h = rect.height;
        if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resize();
      window.addEventListener("resize", resize);

      return {
        ctx,
        speed,
        dots: Array.from({ length: density }, () => ({
          x: Math.random(),
          y: Math.random(),
          r: Math.random() * (i === 0 ? 1.1 : 1.8) + 0.3,
          a: Math.random() * (i === 2 ? 0.85 : 0.4) + 0.08,
        })),
        resize,
      };
    });

    let t = 0;
    const draw = () => {
      fields.forEach((f) => {
        const ctx = f.ctx;
        if (!ctx) return;
        ctx.clearRect(0, 0, w, h);
        f.dots.forEach((d) => {
          const y = (d.y + (t * f.speed) / 2400) % 1;
          const x = (d.x + Math.sin((y + t / 3200) * Math.PI * 2) * 0.012) % 1;
          ctx.beginPath();
          ctx.arc(x * w, y * h, d.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(156, 168, 184, ${d.a})`;
          ctx.fill();
        });
      });
    };

    const loop = () => {
      t += 1;
      draw();
      raf = requestAnimationFrame(loop);
    };

    if (reduced) draw();
    else loop();

    return () => {
      cancelAnimationFrame(raf);
      fields.forEach((f) => window.removeEventListener("resize", f.resize));
    };
  }, [reduced]);

  useEffect(() => {
    const canvas = root.current?.querySelector<HTMLCanvasElement>("canvas[data-stream]");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let raf = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      w = rect.width;
      h = rect.height;
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const parts = Array.from({ length: 64 }, () => ({
      x: Math.random(),
      y: Math.random(),
      len: Math.random() * 11 + 5,
      v: Math.random() * 0.12 + 0.05,
      a: Math.random() * 0.13 + 0.05,
      amber: Math.random() < 0.18,
      sway: Math.random() * Math.PI * 2,
    }));

    let flow = 0;
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      flow += (y - lastY) * 0.00025;
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let t = 0;
    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      parts.forEach((p) => {
        const y = (((p.y + (t * p.v) / 3600 + flow) % 1) + 1) % 1;
        const x = p.x + Math.sin((y * 2 + p.sway) * Math.PI) * 0.015;
        const px = x * w;
        const py = y * h;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + Math.sin(p.sway) * 1.2, py + p.len);
        ctx.strokeStyle = p.amber
          ? `rgba(255, 176, 32, ${p.a})`
          : `rgba(156, 168, 184, ${p.a})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    };

    const loop = () => {
      t += 1;
      draw();
      raf = requestAnimationFrame(loop);
    };

    if (reduced) draw();
    else loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced]);

  useEffect(() => {
    if (!root.current || reduced) return;

    const rows = Array.from(
      root.current.querySelectorAll<HTMLElement>(".vd-queue__row")
    );
    if (!rows.length) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight || 1;
      rows.forEach((row) => {
        const rect = row.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        const d = Math.min(1, Math.abs(mid - vh / 2) / (vh / 2));
        row.style.setProperty("--vd-blur", `${(d * 2.6).toFixed(2)}px`);
        row.style.setProperty("--vd-op", `${(1 - d * 0.5).toFixed(3)}`);
      });
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  useEffect(() => {
    if (!root.current || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(".vd-line", {
        x: -46,
        opacity: 0,
        duration: 1.15,
        ease: "expo.out",
        stagger: 0.07,
      });

      gsap.utils.toArray<HTMLElement>("[data-vd-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 34,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });

      gsap.utils.toArray<HTMLElement>(".vd-queue__list").forEach((list) => {
        gsap.from(list.querySelectorAll(".vd-queue__row"), {
          x: -46,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.07,
          scrollTrigger: { trigger: list, start: "top 88%" },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-vd-section]").forEach((sec) => {
        const wipe = sec.querySelector<HTMLElement>(".vd-wipe");
        const lines = wipe
          ? Array.from(wipe.querySelectorAll<HTMLElement>(".vd-wipe__line"))
          : [];
        if (!wipe || !lines.length) return;

        const tl = gsap.timeline({
          scrollTrigger: { trigger: sec, start: "top 82%" },
        });
        tl.set(wipe, { opacity: 1 })
          .fromTo(
            lines,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.5,
              ease: "power2.out",
              stagger: 0.06,
            }
          )
          .to(wipe, { opacity: 0, duration: 0.45, ease: "power1.out" }, "-=0.1");
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div className="vd" ref={root}>
      <canvas className="vd-dust vd-dust--far" data-dust="far" aria-hidden="true" />
      <canvas className="vd-dust vd-dust--mid" data-dust="mid" aria-hidden="true" />
      <canvas className="vd-dust vd-dust--near" data-dust="near" aria-hidden="true" />
      <canvas className="vd-stream" data-stream aria-hidden="true" />

      <header className="vd-nav">
        <a className="vd-nav__mark" href="#top">
          <span className="vd-block" aria-hidden="true" />
          TAIM_KELLIZY
        </a>
        <nav className="vd-nav__links" aria-label="Primary">
          <a href="#queue">QUEUE</a>
          <a href="#work">WORK</a>
          <a href="#notes">NOTES</a>
          <a href="#ping">PING</a>
        </nav>
      </header>

      <main id="top">
        <section className="vd-hero" data-vd-section>
          <div className="vd-wipe" aria-hidden="true">
            {Array.from({ length: WIPE_LINES }).map((_, i) => (
              <span key={i} className="vd-wipe__line" />
            ))}
          </div>
          <p className="vd-line vd-line--1">
            {person.role.toUpperCase()} · {person.location.toUpperCase()} · MMXXVI
          </p>
          <h1 className="vd-line vd-line--2">TAIM KELLIZY</h1>
          <p className="vd-line vd-line--3">
            INTERFACES THAT HOLD UP UNDER CLOSE READING — PROOF OVER CLAIMS —
            MOTION WITH A REASON — GRAIN AS MATERIAL
          </p>
          <p className="vd-line vd-line--4">
            C / JAVASCRIPT / PYTHON / REACT / FLASK / SQLITE / HTML / CSS
          </p>
          <p className="vd-line vd-line--5">
            <span className="vd-caret vd-caret--big" aria-hidden="true" />
            SCROLL TO READ THE QUEUE
          </p>
        </section>

        <section className="vd-queue" id="queue" data-vd-section>
          <div className="vd-wipe" aria-hidden="true">
            {Array.from({ length: WIPE_LINES }).map((_, i) => (
              <span key={i} className="vd-wipe__line" />
            ))}
          </div>
          <p className="vd-sec__label" data-vd-reveal>
            ── QUEUE / CREDENTIALS ────────────────────────────────────────────
          </p>
          <ol className="vd-queue__list">
            {QUEUE.map((l, i) => (
              <li
                key={l.label}
                className={`vd-queue__row vd-depth-${l.depth}`}
              >
                <a href="#queue">
                  <span className="vd-queue__idx">{String(i + 1).padStart(2, "0")}</span>
                  <span className="vd-queue__label">{l.label}</span>
                  <span className="vd-queue__detail">{l.detail}</span>
                  <span className="vd-queue__mark">
                    {l.depth === 1 ? "█" : l.depth === 2 ? "▓" : "░"}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </section>

        <section className="vd-work" id="work" data-vd-section>
          <div className="vd-wipe" aria-hidden="true">
            {Array.from({ length: WIPE_LINES }).map((_, i) => (
              <span key={i} className="vd-wipe__line" />
            ))}
          </div>
          <p className="vd-sec__label" data-vd-reveal>
            ── WORK / SELECTED ────────────────────────────────────────────────
          </p>
          <ul className="vd-queue__list">
            {WORK.map((l, i) => (
              <li
                key={l.label}
                className={`vd-queue__row vd-depth-${l.depth}`}
              >
                <a href="#work">
                  <span className="vd-queue__idx">{String(i + 1).padStart(2, "0")}</span>
                  <span className="vd-queue__label">{l.label}</span>
                  <span className="vd-queue__detail">{l.detail}</span>
                  <span className="vd-queue__mark">
                    {l.depth === 1 ? "█" : "▓"}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="vd-stack" data-vd-section>
          <div className="vd-wipe" aria-hidden="true">
            {Array.from({ length: WIPE_LINES }).map((_, i) => (
              <span key={i} className="vd-wipe__line" />
            ))}
          </div>
          <p className="vd-sec__label" data-vd-reveal>
            ── STACK ─────────────────────────────────────────────────────────
          </p>
          <p className="vd-stack__line">
            {skills
              .map((s) => `${s.group.toUpperCase()}: ${s.items.join(" / ")}`)
              .join("  ·  ")}
          </p>
        </section>

        <section className="vd-notes" id="notes" data-vd-section>
          <div className="vd-wipe" aria-hidden="true">
            {Array.from({ length: WIPE_LINES }).map((_, i) => (
              <span key={i} className="vd-wipe__line" />
            ))}
          </div>
          <p className="vd-sec__label" data-vd-reveal>
            ── NOTES / JOURNAL ────────────────────────────────────────────────
          </p>
          <ul className="vd-queue__list">
            {posts.map((p, i) => (
              <li key={p.slug} className="vd-queue__row vd-depth-2">
                <a href="#notes">
                  <span className="vd-queue__idx">{String(i + 1).padStart(2, "0")}</span>
                  <span className="vd-queue__label">{p.title.toUpperCase()}</span>
                  <span className="vd-queue__detail">{p.excerpt}</span>
                  <span className="vd-queue__mark">▓</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="vd-ping" id="ping" data-vd-section>
          <div className="vd-wipe" aria-hidden="true">
            {Array.from({ length: WIPE_LINES }).map((_, i) => (
              <span key={i} className="vd-wipe__line" />
            ))}
          </div>
          <p className="vd-line vd-line--2 vd-line--soft">GET IN TOUCH</p>
          <p className="vd-line vd-line--3">
            <span className="vd-block vd-block--big" aria-hidden="true" />
            <a href={`mailto:${person.email}`}>{person.email.toUpperCase()}</a>
          </p>
          <p className="vd-line vd-line--4">
            <a href={person.linkedin} target="_blank" rel="noreferrer">
              LINKEDIN
            </a>
            {"  ·  "}
            <a href={person.instagram} target="_blank" rel="noreferrer">
              INSTAGRAM
            </a>
          </p>
        </section>
      </main>

      <footer className="vd-foot">
        <p>© MMXXVI {person.name.toUpperCase()} — DESIGN EXPLORATION — CONCEPT E2 · DEEP STACK</p>
        <p>END OF TRANSMISSION ▪ FOCUS HELD ▪ NO RULES ▪ NO BOXES</p>
      </footer>
    </div>
  );
}
