"use client";

import { useEffect, useRef, useState } from "react";
import { TEMPLATES, type TemplateItem } from "@/lib/templates";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const src = (id: string) => `${BASE}/template-previews/${id}.webp`;

/** Galeri template (hanya lihat). "Pratinjau" membuka gambar hero lebih besar. */
export default function TemplateGallery() {
  const [open, setOpen] = useState<TemplateItem | null>(null);
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
              <img src={src(t.id)} alt={`Tampilan awal template ${t.name}`} width={780} height={1248} loading={i < 4 ? "eager" : "lazy"} />
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
              <div>
                <strong>{open.name}</strong>
                <span>{open.note}</span>
              </div>
              <button type="button" className="tpl-close" onClick={() => setOpen(null)} aria-label="Tutup pratinjau">
                ×
              </button>
            </div>
            <div className="tpl-dialog-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src(open.id)} alt={`Tampilan awal template ${open.name}`} width={780} height={1248} />
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
