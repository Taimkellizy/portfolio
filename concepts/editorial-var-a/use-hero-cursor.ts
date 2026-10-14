import { useEffect } from "react";
import { gsap } from "@/lib/motion";
import { isTouchLayout } from "./shared";
import type { RefObject } from "react";

const CHAR_CLASS = "ea-hero__ch";

/**
 * The cursor bubble: an eased follower that grows over links/buttons,
 * repels the hero bio words, and disassembles a word's letters in a ring
 * when it gets very close.
 *
 * Every word repulsion/disassembly tween runs with force3D false — the
 * composited layers drop out of the cursor's difference-blend backdrop
 * on the GPU path, so nothing near this text may be layer-promoted.
 */
export function useHeroCursor({
  root,
  cursor,
  reduced,
  arabic,
}: {
  root: RefObject<HTMLDivElement | null>;
  cursor: RefObject<HTMLDivElement | null>;
  reduced: boolean;
  arabic: boolean;
}) {
  useEffect(() => {
    if (!root.current || reduced) return;
    const bubble = cursor.current;
    if (!bubble || isTouchLayout()) return;

    const words =
      root.current.querySelectorAll<HTMLElement>("[data-hero-word]");
    /* per-char split and letter disassembly are LTR-only: Arabic loses
       contextual joining and bidi order under element-level splits, so
       words stay whole and only repel */
    if (!arabic) words.forEach(splitIntoChars);

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

    const disassemble = (word: HTMLElement) => {
      if (word.dataset.busy === "1") return;
      word.dataset.busy = "1";
      const chars = word.querySelectorAll<HTMLElement>(
        `.${CHAR_CLASS}:not([data-space])`,
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

    const repel = (word: HTMLElement) => {
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
        if (!arabic && dist < 75) {
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
    };

    const loop = () => {
      bubbleX += (mouseX - bubbleX) * 0.18;
      bubbleY += (mouseY - bubbleY) * 0.18;
      scale += (targetScale - scale) * 0.12;
      bubble.style.transform = `translate(${bubbleX - 22}px, ${bubbleY - 22}px) scale(${scale})`;

      /* motion evaluation runs at a third of the frame rate */
      frame++;
      if (frame % 3 === 0) {
        words.forEach(repel);
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
  }, [root, cursor, reduced, arabic]);
}

/* Wrap each hero-word character in a span so the tweens can move them
   individually; spaces render as &nbsp; and are marked data-space so the
   disassembly can skip them. */
function splitIntoChars(word: HTMLElement) {
  const text = word.textContent || "";
  word.innerHTML = text
    .split("")
    .map(
      (ch) =>
        `<span class="${CHAR_CLASS}"${ch === " " ? ' data-space="1"' : ""}>${ch === " " ? "&nbsp;" : ch}</span>`,
    )
    .join("");
}
