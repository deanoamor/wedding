"use client";

import { useEffect, useState } from "react";

/** Floating back-to-top button, shown once the hero has scrolled out of view. Smooth scroll is handled by Effects (Lenis) via the #top anchor. */
export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a href="#top" className={`to-top${show ? " is-visible" : ""}`} aria-label="Kembali ke atas" tabIndex={show ? 0 : -1}>
      <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M7 13V1M2 6l5-5 5 5" />
      </svg>
    </a>
  );
}
