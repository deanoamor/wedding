"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const LINKS = [
  ["#tentang", "Tentang"],
  ["#layanan", "Layanan"],
  ["#paket", "Paket"],
  ["#gedung", "Gedung"],
  ["#galeri", "Gallery"],
  ["#testimoni", "Testimoni"],
] as const;

/** Full-width menu panel for mobile and tablet. Anchor clicks are smooth-scrolled by Effects (Lenis). */
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const btn = btnRef.current;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      } else if (e.key === "Tab" && panelRef.current) {
        const items = panelRef.current.querySelectorAll<HTMLElement>("a[href], button");
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const mq = window.matchMedia("(min-width: 901px)");
    const onMq = () => mq.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      html.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
      btn?.focus({ preventScroll: true });
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="mnav">
      <button ref={btnRef} type="button" className="mnav-btn" aria-expanded={open} aria-controls="menu-seluler" onClick={() => setOpen(true)}>
        Menu
      </button>
      {mounted &&
        open &&
        createPortal(
          <div className="mmenu-layer">
            <div className="mmenu-backdrop" data-lenis-prevent onClick={close} />
            <div ref={panelRef} id="menu-seluler" className="mmenu" role="dialog" aria-modal="true" aria-label="Menu navigasi">
              <svg className="mmenu-art" viewBox="0 0 320 320" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
                <circle cx="230" cy="240" r="130" />
                <circle cx="300" cy="240" r="130" />
              </svg>
              <div className="mmenu-top">
                <a href="#top" className="mmenu-logo" onClick={close} aria-label="Boenda Ida, ke atas halaman">
                  <svg width="30" height="19" viewBox="0 0 34 22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <circle cx="11" cy="11" r="9" />
                    <circle cx="23" cy="11" r="9" />
                  </svg>
                  <span>Boenda Ida</span>
                </a>
                <button ref={closeRef} type="button" className="mmenu-close" aria-label="Tutup menu" onClick={close}>
                  <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="M2 2l10 10M12 2L2 12" />
                  </svg>
                </button>
              </div>
              <nav aria-label="Navigasi seluler" className="mmenu-links">
                {LINKS.map(([href, label]) => (
                  <a key={href} href={href} onClick={close}>
                    {label}
                  </a>
                ))}
              </nav>
              <a href="#kontak" className="mmenu-cta" onClick={close}>
                Cek tanggalmu
              </a>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
