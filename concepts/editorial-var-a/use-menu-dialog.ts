import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import {
  gsap,
  usePrefersReducedMotion,
  stopSmoothScroll,
  startSmoothScroll,
} from "@/lib/motion";

/* Everything the menu chrome (button + dialog) needs off the hook. */
export interface MenuDialogState {
  menuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  menuBtnRef: RefObject<HTMLButtonElement | null>;
  menuPanelRef: RefObject<HTMLDivElement | null>;
  menuOverlayRef: RefObject<HTMLDivElement | null>;
}

/**
 * Owns the slide-in menu: open/close state, the gsap visibility + slide,
 * and the dialog behaviour (Lenis-aware scroll lock, Escape to close,
 * focus trap, initial focus on the close button, focus return to the
 * opener).
 *
 * The visibility effect must stay declared before the dialog effect:
 * effects run in order, and initial focus must land on an already
 * visible panel.
 */
export function useMenuDialog(): MenuDialogState {
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduced = usePrefersReducedMotion();

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  /* panel visibility + slide */
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

  /* dialog behaviour: focus trap + focus/scroll bookkeeping */
  useEffect(() => {
    if (!menuOpen) return;
    const panel = menuPanelRef.current;
    const opener = menuBtnRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        return;
      }
      if (e.key === "Tab" && panel) trapTabKey(panel, e);
    };
    window.addEventListener("keydown", onKey);
    stopSmoothScroll();
    document.body.style.overflow = "hidden";
    const closeBtn =
      panel?.querySelector<HTMLElement>(".ea-menu-panel__close") ?? null;
    closeBtn?.focus();
    if (closeBtn && document.activeElement !== closeBtn) {
      /* computed visibility can lag the inline flip by a frame (see the
         .ea-menu-panel transition note) — retry after the style flush */
      requestAnimationFrame(() =>
        requestAnimationFrame(() => closeBtn.focus()),
      );
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      startSmoothScroll();
      document.body.style.overflow = "";
      opener?.focus();
    };
  }, [menuOpen, closeMenu]);

  return {
    menuOpen,
    openMenu,
    closeMenu,
    menuBtnRef,
    menuPanelRef,
    menuOverlayRef,
  };
}

/* Keep Tab inside the dialog: wrap at both ends of the panel's focusables. */
function trapTabKey(panel: HTMLDivElement, e: KeyboardEvent) {
  const focusables = Array.from(
    panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement as HTMLElement | null;
  if (e.shiftKey) {
    if (active === first || !panel.contains(active)) {
      e.preventDefault();
      last.focus();
    }
  } else if (active === last || !panel.contains(active)) {
    e.preventDefault();
    first.focus();
  }
}
