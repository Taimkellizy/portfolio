"use client";

import { useEffect, useRef } from "react";
import { gsap, usePrefersReducedMotion } from "@/lib/motion";
import { person, projects, skills, posts } from "@/lib/content";
import "./void-signal.css";

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

const METER_SEGS = 8;

export function VoidSignal() {
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
    const segs = Array.from(
      root.current?.querySelectorAll<HTMLElement>(".vs-meter__seg") ?? []
    );
    if (!segs.length) return;

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const lit = Math.round(progress * segs.length);
      segs.forEach((seg, i) => seg.classList.toggle("is-lit", i < lit));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (!root.current || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(".vs-line", {
        x: -46,
        opacity: 0,
        duration: 1.15,
        ease: "expo.out",
        stagger: 0.07,
      });

      gsap.utils.toArray<HTMLElement>("[data-vs-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 34,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });

      gsap.utils.toArray<HTMLElement>(".vs-queue__list").forEach((list) => {
        gsap.from(list.querySelectorAll(".vs-queue__row"), {
          x: -46,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.07,
          scrollTrigger: { trigger: list, start: "top 88%" },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-vs-section]").forEach((sec) => {
        const line = sec.querySelector<HTMLElement>(".vs-scan");
        if (!line) return;
        gsap.fromTo(
          line,
          { y: 0, opacity: 0.85 },
          {
            y: () => sec.offsetHeight,
            opacity: 0.85,
            duration: 1.15,
            ease: "power1.in",
            immediateRender: false,
            scrollTrigger: { trigger: sec, start: "top 82%" },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div className="vs" ref={root}>
      <canvas className="vs-dust vs-dust--far" data-dust="far" aria-hidden="true" />
      <canvas className="vs-dust vs-dust--mid" data-dust="mid" aria-hidden="true" />
      <canvas className="vs-dust vs-dust--near" data-dust="near" aria-hidden="true" />

      <header className="vs-nav">
        <a className="vs-nav__mark" href="#top">
          TAIM_KELLIZY
        </a>
        <nav className="vs-nav__links" aria-label="Primary">
          <a href="#queue">QUEUE</a>
          <a href="#work">WORK</a>
          <a href="#notes">NOTES</a>
          <a href="#ping">PING</a>
        </nav>
        <div className="vs-meter-wrap" aria-hidden="true">
          <span className="vs-meter__tag">SIG</span>
          <div className="vs-meter">
            {Array.from({ length: METER_SEGS }).map((_, i) => (
              <span key={i} className="vs-meter__seg" />
            ))}
          </div>
        </div>
      </header>

      <main id="top">
        <section className="vs-hero" data-vs-section>
          <span className="vs-scan" aria-hidden="true" />
          <p className="vs-line vs-line--1">
            {person.role.toUpperCase()} · {person.location.toUpperCase()} · MMXXVI
          </p>
          <h1 className="vs-line vs-line--2">TAIM KELLIZY</h1>
          <p className="vs-line vs-line--3">
            INTERFACES THAT HOLD UP UNDER CLOSE READING — PROOF OVER CLAIMS —
            MOTION WITH A REASON — GRAIN AS MATERIAL
          </p>
          <p className="vs-line vs-line--4">
            C / JAVASCRIPT / PYTHON / REACT / FLASK / SQLITE / HTML / CSS
          </p>
          <p className="vs-line vs-line--5">
            <span className="vs-caret vs-caret--big" aria-hidden="true" />
            SCROLL TO READ THE QUEUE
          </p>
        </section>

        <section className="vs-queue" id="queue" data-vs-section>
          <span className="vs-scan" aria-hidden="true" />
          <p className="vs-sec__label" data-vs-reveal>
            ── QUEUE / CREDENTIALS ────────────────────────────────────────────
          </p>
          <ol className="vs-queue__list">
            {QUEUE.map((l, i) => (
              <li
                key={l.label}
                className={`vs-queue__row vs-depth-${l.depth}`}
              >
                <a href="#queue">
                  <span className="vs-queue__idx">{String(i + 1).padStart(2, "0")}</span>
                  <span className="vs-queue__label">{l.label}</span>
                  <span className="vs-queue__detail">{l.detail}</span>
                  <span className="vs-queue__mark">
                    {l.depth === 1 ? "█" : l.depth === 2 ? "▓" : "░"}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </section>

        <section className="vs-work" id="work" data-vs-section>
          <span className="vs-scan" aria-hidden="true" />
          <p className="vs-sec__label" data-vs-reveal>
            ── WORK / SELECTED ────────────────────────────────────────────────
          </p>
          <ul className="vs-queue__list">
            {WORK.map((l, i) => (
              <li
                key={l.label}
                className={`vs-queue__row vs-depth-${l.depth}`}
              >
                <a href="#work">
                  <span className="vs-queue__idx">{String(i + 1).padStart(2, "0")}</span>
                  <span className="vs-queue__label">{l.label}</span>
                  <span className="vs-queue__detail">{l.detail}</span>
                  <span className="vs-queue__mark">
                    {l.depth === 1 ? "█" : "▓"}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="vs-stack" data-vs-section>
          <span className="vs-scan" aria-hidden="true" />
          <p className="vs-sec__label" data-vs-reveal>
            ── STACK ─────────────────────────────────────────────────────────
          </p>
          <p className="vs-stack__line">
            {skills
              .map((s) => `${s.group.toUpperCase()}: ${s.items.join(" / ")}`)
              .join("  ·  ")}
          </p>
        </section>

        <section className="vs-notes" id="notes" data-vs-section>
          <span className="vs-scan" aria-hidden="true" />
          <p className="vs-sec__label" data-vs-reveal>
            ── NOTES / JOURNAL ────────────────────────────────────────────────
          </p>
          <ul className="vs-queue__list">
            {posts.map((p, i) => (
              <li key={p.slug} className="vs-queue__row vs-depth-2">
                <a href="#notes">
                  <span className="vs-queue__idx">{String(i + 1).padStart(2, "0")}</span>
                  <span className="vs-queue__label">{p.title.toUpperCase()}</span>
                  <span className="vs-queue__detail">{p.excerpt}</span>
                  <span className="vs-queue__mark">▓</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="vs-ping" id="ping" data-vs-section>
          <span className="vs-scan" aria-hidden="true" />
          <p className="vs-line vs-line--2 vs-line--soft">GET IN TOUCH</p>
          <p className="vs-line vs-line--3">
            <span className="vs-block" aria-hidden="true" />
            <a href={`mailto:${person.email}`}>{person.email.toUpperCase()}</a>
          </p>
          <p className="vs-line vs-line--4">
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

      <footer className="vs-foot">
        <p>© MMXXVI {person.name.toUpperCase()} — DESIGN EXPLORATION — CONCEPT E1 · SIGNAL CHAIN</p>
        <p>END OF TRANSMISSION ▪ CARRIER STABLE ▪ NO RULES ▪ NO BOXES</p>
      </footer>
    </div>
  );
}
