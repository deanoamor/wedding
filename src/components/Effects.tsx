"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Scroll behaviours:
 *  1. stacking panels (sticky `top` per section)
 *  2. Gallery marquee: auto-scroll, pause on hover, drag with mouse / touch
 *  3. Lenis smooth scroll + smooth anchor links
 * Everything respects prefers-reduced-motion.
 */
export default function Effects() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1) sticky `top` for stacking sections
    const fit = () => {
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>(".stack").forEach((el) => {
        const h = el.offsetHeight;
        el.style.top = (h > vh - 24 ? vh - h - 12 : 12) + "px";
      });
    };
    fit();
    window.addEventListener("resize", fit);
    window.addEventListener("load", fit);
    const iv = window.setInterval(fit, 400);

    // 2) Gallery marquee
    const state = new WeakMap<HTMLElement, { x: number; rev: boolean }>();
    let drag: { t: HTMLElement; px: number } | null = null;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      document.querySelectorAll<HTMLElement>(".mq-track").forEach((t) => {
        let s = state.get(t);
        if (!s) {
          s = { x: 0, rev: t.classList.contains("rev") };
          state.set(t, s);
        }
        const half = t.scrollWidth / 2;
        if (!half) return;
        const held = (drag && drag.t === t) || (t.parentElement?.matches(":hover") ?? false);
        if (!held && !reduce) s.x += (s.rev ? 1 : -1) * (half / (s.rev ? 70 : 60)) * dt;
        s.x = ((s.x % half) - half) % half;
        t.style.transform = `translate3d(${s.x}px,0,0)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const down = (e: PointerEvent) => {
      const m = (e.target as Element | null)?.closest?.(".mq");
      if (!m || (e.pointerType === "mouse" && e.button !== 0)) return;
      const t = m.querySelector<HTMLElement>(".mq-track");
      if (!t) return;
      drag = { t, px: e.clientX };
      m.classList.add("dragging");
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      const s = state.get(drag.t);
      if (s) s.x += e.clientX - drag.px;
      drag.px = e.clientX;
    };
    const end = () => {
      document.querySelectorAll(".mq.dragging").forEach((m) => m.classList.remove("dragging"));
      drag = null;
    };
    document.addEventListener("pointerdown", down);
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", end);
    document.addEventListener("pointercancel", end);

    // 3) Lenis smooth scroll + smooth anchors
    const lenis = reduce ? null : new Lenis({ lerp: 0.12, wheelMultiplier: 1, smoothWheel: true });
    let lraf = 0;
    const lt = (t: number) => {
      lenis?.raf(t);
      lraf = requestAnimationFrame(lt);
    };
    if (lenis) lraf = requestAnimationFrame(lt);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
      const id = a?.getAttribute("href");
      if (!id || id.length < 1) return;
      const target = id === "#top" ? null : document.querySelector<HTMLElement>(id);
      if (id === "#top") {
        e.preventDefault();
        lenis ? lenis.scrollTo(0, { duration: 1.1 }) : window.scrollTo({ top: 0 });
      } else if (target) {
        e.preventDefault();
        lenis ? lenis.scrollTo(target, { offset: -12, duration: 1.1 }) : target.scrollIntoView();
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("resize", fit);
      window.removeEventListener("load", fit);
      window.clearInterval(iv);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(lraf);
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", end);
      document.removeEventListener("pointercancel", end);
      document.removeEventListener("click", onClick);
      lenis?.destroy();
    };
  }, []);

  return null;
}
