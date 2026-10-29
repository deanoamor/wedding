"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Scroll behaviours: stacking panels, Foto horizontal slide, Lenis smooth scroll. */
export default function Effects() {
  useEffect(() => {
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

    // 2) Foto: vertical scroll drives the horizontal strip
    let raf = 0;
    const slide = () => {
      const sec = document.getElementById("galeri");
      const st = sec?.querySelector<HTMLElement>(".strip");
      if (sec && st && sec.parentElement) {
        const se = document.scrollingElement || document.documentElement;
        const y = Math.max(window.scrollY || 0, se.scrollTop || 0);
        let top = 0;
        let n = sec.parentElement.firstElementChild as HTMLElement | null;
        while (n && n !== sec) {
          top += n.offsetHeight;
          n = n.nextElementSibling as HTMLElement | null;
        }
        top += sec.parentElement.offsetTop || 0;
        const gap = document.getElementById("galeri-gap");
        const span = gap ? gap.offsetHeight : window.innerHeight * 0.9;
        const p = Math.min(1, Math.max(0, (y - (top - 12)) / span));
        st.scrollLeft = p * (st.scrollWidth - st.clientWidth);
      }
      raf = requestAnimationFrame(slide);
    };
    raf = requestAnimationFrame(slide);

    // 3) Lenis smooth scroll + smooth anchors
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true });
    let lraf = 0;
    const tick = (t: number) => {
      lenis.raf(t);
      lraf = requestAnimationFrame(tick);
    };
    lraf = requestAnimationFrame(tick);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
      const id = a?.getAttribute("href");
      const target = id && id.length > 1 && id !== "#top" ? document.querySelector<HTMLElement>(id) : null;
      if (id === "#top") {
        // The hero is sticky, so scrolling to its element lands mid-page; go to 0.
        e.preventDefault();
        lenis.scrollTo(0, { duration: 1.4 });
      } else if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -12, duration: 1.4 });
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("resize", fit);
      window.removeEventListener("load", fit);
      window.clearInterval(iv);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(lraf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return null;
}
