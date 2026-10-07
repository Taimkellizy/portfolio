"use client";

import { useEffect, useRef } from "react";
import { gsap, usePrefersReducedMotion } from "@/lib/motion";
import { person, projects, credentials, skills, posts } from "@/lib/content";
import "./cracktro-void.css";

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

export function CracktroVoid() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!root.current) return;

    const canvases = Array.from(
      root.current.querySelectorAll<HTMLCanvasElement>("canvas[data-dust]")
    );

    const rafIds: number[] = [];
    const handle = {
      ctx: null as CanvasRenderingContext2D | null,
      w: 0,
      h: 0,
    };

    const dustFields = canvases.map((canvas, i) => {
      const speed = [0.12, 0.28, 0.5][i] ?? 0.2;
      const density = [220, 130, 70][i] ?? 60;
      const ctx = canvas.getContext("2d");
      const field = {
        ctx,
        speed,
        dots: Array.from({ length: density }, () => ({
          x: Math.random(),
          y: Math.random(),
          r: Math.random() * (i === 0 ? 1.1 : 1.8) + 0.3,
          a: Math.random() * (i === 2 ? 0.85 : 0.4) + 0.08,
        })),
      };

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);
        handle.w = rect.width;
        handle.h = rect.height;
        if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resize();
      window.addEventListener("resize", resize);
      field.ctx = ctx;

      return { ...field, resize };
    });

    let t = 0;
    const loop = () => {
      t += reduced ? 0 : 1;
      dustFields.forEach((f) => {
        if (!f.ctx) return;
        f.ctx.clearRect(0, 0, handle.w, handle.h);
        f.dots.forEach((d) => {
          const y = (d.y + (t * f.speed) / 2400) % 1;
          const x = (d.x + Math.sin((y + t / 3200) * Math.PI * 2) * 0.012) % 1;
          f.ctx!.beginPath();
          f.ctx!.arc(x * handle.w, y * handle.h, d.r, 0, Math.PI * 2);
          f.ctx!.fillStyle = `rgba(156, 168, 184, ${d.a})`;
          f.ctx!.fill();
        });
      });
      rafIds.push(requestAnimationFrame(loop));
    };
    loop();

    return () => {
      rafIds.forEach((id) => cancelAnimationFrame(id));
      dustFields.forEach((f) => {
        window.removeEventListener("resize", f.resize);
      });
    };
  }, [reduced]);

  useEffect(() => {
    if (!root.current || reduced) return;
    const ctx = gsap.context(() => {
      gsap.from(".vo-line", {
        x: (i: number) => (i % 2 ? 46 : -46),
        opacity: 0,
        duration: 1.15,
        ease: "expo.out",
        stagger: 0.07,
      });

      gsap.utils.toArray<HTMLElement>("[data-vo-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 34,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });

      gsap.utils.toArray<HTMLElement>(".vo-queue__row").forEach((el) => {
        gsap.from(el, {
          scaleX: 0,
          transformOrigin: "left",
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 92%" },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div className="vo" ref={root}>
      <canvas className="vo-dust vo-dust--far" data-dust="far" aria-hidden="true" />
      <canvas className="vo-dust vo-dust--mid" data-dust="mid" aria-hidden="true" />
      <canvas className="vo-dust vo-dust--near" data-dust="near" aria-hidden="true" />

      <header className="vo-nav">
        <a className="vo-nav__mark" href="#top">
          <span className="vo-caret" aria-hidden="true" />
          TAIM_KELLIZY
        </a>
        <nav className="vo-nav__links" aria-label="Primary">
          <a href="#queue">QUEUE</a>
          <a href="#work">WORK</a>
          <a href="#notes">NOTES</a>
          <a href="#ping">PING</a>
        </nav>
      </header>

      <main id="top">
        <section className="vo-hero">
          <p className="vo-line vo-line--1">
            {person.role.toUpperCase()} · {person.location.toUpperCase()} · MMXXVI
          </p>
          <h1 className="vo-line vo-line--2">TAIM KELLIZY</h1>
          <p className="vo-line vo-line--3">
            INTERFACES THAT HOLD UP UNDER CLOSE READING — PROOF OVER CLAIMS —
            MOTION WITH A REASON — GRAIN AS MATERIAL
          </p>
          <p className="vo-line vo-line--4">
            C / JAVASCRIPT / PYTHON / REACT / FLASK / SQLITE / HTML / CSS
          </p>
          <p className="vo-line vo-line--5">
            <span className="vo-caret vo-caret--big" aria-hidden="true" />
            SCROLL TO READ THE QUEUE
          </p>
        </section>

        <section className="vo-queue" id="queue">
          <p className="vo-sec__label" data-vo-reveal>
            ── QUEUE / CREDENTIALS ────────────────────────────────────────────
          </p>
          <ol className="vo-queue__list">
            {QUEUE.map((l, i) => (
              <li
                key={l.label}
                className={`vo-queue__row vo-depth-${l.depth}`}
                data-vo-reveal
              >
                <a href="#queue">
                  <span className="vo-queue__idx">{String(i + 1).padStart(2, "0")}</span>
                  <span className="vo-queue__label">{l.label}</span>
                  <span className="vo-queue__detail">{l.detail}</span>
                  <span className="vo-queue__mark">
                    {l.depth === 1 ? "█" : l.depth === 2 ? "▓" : "░"}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </section>

        <section className="vo-work" id="work">
          <p className="vo-sec__label" data-vo-reveal>
            ── WORK / SELECTED ────────────────────────────────────────────────
          </p>
          <ul className="vo-queue__list">
            {WORK.map((l, i) => (
              <li
                key={l.label}
                className={`vo-queue__row vo-depth-${l.depth}`}
                data-vo-reveal
              >
                <a href="#work">
                  <span className="vo-queue__idx">{String(i + 1).padStart(2, "0")}</span>
                  <span className="vo-queue__label">{l.label}</span>
                  <span className="vo-queue__detail">{l.detail}</span>
                  <span className="vo-queue__mark">
                    {l.depth === 1 ? "█" : "▓"}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="vo-stack" data-vo-reveal>
          <p className="vo-sec__label">── STACK ─────────────────────────────────────────────────────────</p>
          <p className="vo-stack__line">
            {skills
              .map((s) => `${s.group.toUpperCase()}: ${s.items.join(" / ")}`)
              .join("  ·  ")}
          </p>
        </section>

        <section className="vo-notes" id="notes">
          <p className="vo-sec__label" data-vo-reveal>
            ── NOTES / JOURNAL ────────────────────────────────────────────────
          </p>
          <ul className="vo-queue__list">
            {posts.map((p, i) => (
              <li key={p.slug} className="vo-queue__row vo-depth-2" data-vo-reveal>
                <a href="#notes">
                  <span className="vo-queue__idx">{String(i + 1).padStart(2, "0")}</span>
                  <span className="vo-queue__label">{p.title.toUpperCase()}</span>
                  <span className="vo-queue__detail">{p.excerpt}</span>
                  <span className="vo-queue__mark">▓</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="vo-ping" id="ping">
          <p className="vo-line vo-line--2 vo-line--soft">GET IN TOUCH</p>
          <p className="vo-line vo-line--3">
            <span className="vo-caret" aria-hidden="true" />
            <a href={`mailto:${person.email}`}>{person.email.toUpperCase()}</a>
          </p>
          <p className="vo-line vo-line--4">
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

      <footer className="vo-foot">
        <p>© MMXXVI {person.name.toUpperCase()} — DESIGN EXPLORATION — CONCEPT E</p>
        <p>END OF TRANSMISSION ▪ NO RULES ▪ NO BOXES ▪ ONLY DEPTH</p>
      </footer>
    </div>
  );
}
