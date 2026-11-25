"use client";

import { useEffect, useRef, useState } from "react";
import { TEMPLATES, type TemplateItem } from "@/lib/templates";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const thumb = (id: string) => `${BASE}/template-previews/${id}.webp`;
const view = (id: string) => `${BASE}/template-view/${id}.html`;

/**
 * Galeri template (hanya lihat). "Pratinjau" membuka contoh template utuh di iframe
 * (HTML statis dari /template-view/{id}.html) yang bisa di-scroll, mode HP atau desktop.
 */
export default function TemplateGallery() {
  const [open, setOpen] = useState<TemplateItem | null>(null);
  const [device, setDevice] = useState<"hp" | "desktop">("hp");
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <>
      <ul className="tpl-grid">
        {TEMPLATES.map((t, i) => (
          <li key={t.id} className="tpl-card">
            <div className="tpl-thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumb(t.id)} alt={`Tampilan awal template ${t.name}`} width={780} height={1248} loading={i < 4 ? "eager" : "lazy"} />
            </div>
            <h2 className="tpl-name">{t.name}</h2>
            <p className="tpl-note">{t.note}</p>
            <button type="button" className="tpl-btn" onClick={() => setOpen(t)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Pratinjau
            </button>
          </li>
        ))}
      </ul>

      <dialog ref={dialog} className="tpl-dialog" onClose={() => setOpen(null)} aria-label={open ? `Pratinjau ${open.name}` : "Pratinjau"}>
        {open && (
          <div className="tpl-dialog-in">
            <div className="tpl-dialog-bar">
              <div className="tpl-dialog-title">
                <strong>Pratinjau: {open.name}</strong>
                <span>Contoh tampilan. Musik dan form ucapan tidak aktif.</span>
              </div>
              <div className="tpl-seg" role="group" aria-label="Ukuran layar">
                <button type="button" aria-pressed={device === "hp"} onClick={() => setDevice("hp")}>HP</button>
                <button type="button" aria-pressed={device === "desktop"} onClick={() => setDevice("desktop")}>Desktop</button>
              </div>
              <a className="tpl-newtab" href={view(open.id)} target="_blank" rel="noopener noreferrer">Tab baru</a>
              <button type="button" className="tpl-close" onClick={() => setOpen(null)} aria-label="Tutup pratinjau">
                ×
              </button>
            </div>
            <div className="tpl-stage">
              <iframe
                key={`${open.id}-${device}`}
                className={device === "hp" ? "tpl-frame tpl-frame-hp" : "tpl-frame"}
                src={view(open.id)}
                title={`Pratinjau ${open.name}`}
              />
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
