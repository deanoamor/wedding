"use client";

import { useEffect, useRef, useState } from "react";
import { INV } from "@/lib/invitation";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const HOME = process.env.NEXT_PUBLIC_HOME_HREF ?? `${BASE}/`;
const img = (n: string) => `${BASE}/${n}.webp`;

const GALLERY = [
  { n: "galeri1", w: 600, h: 900, alt: "Pasangan pengantin menunduk di bawah cahaya senja" },
  { n: "galeri5", w: 900, h: 600, alt: "Pasangan pengantin berciuman di bukit saat senja" },
  { n: "galeri4", w: 600, h: 900, alt: "Pasangan pengantin berpelukan di pantai berkerikil" },
  { n: "galeri6", w: 900, h: 600, alt: "Pasangan saling menatap dengan buket bunga kering" },
  { n: "galeri2", w: 466, h: 900, alt: "Pasangan pengantin dengan busana adat" },
  { n: "galeri3", w: 600, h: 900, alt: "Pasangan pengantin berdekatan di antara pepohonan" },
];

const Rings = ({ size = 34 }: { size?: number }) => (
  <svg width={size} height={size * 0.65} viewBox="0 0 34 22" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <circle cx="11" cy="11" r="9" />
    <circle cx="23" cy="11" r="9" />
  </svg>
);

function useCountdown(target: string) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const t = new Date(target).getTime();
    const tick = () => setLeft(Math.max(0, t - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);
  return left;
}

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      window.setTimeout(() => setDone(false), 2000);
    } catch {
      /* clipboard blocked: the number stays visible and selectable */
    }
  };
  return (
    <button type="button" className="inv-btn inv-btn-line" onClick={onClick}>
      {done ? "Tersalin" : "Salin nomor"}
    </button>
  );
}

export default function Invitation() {
  const root = useRef<HTMLDivElement>(null);
  const [guest, setGuest] = useState("");
  const left = useCountdown(INV.startsAt);

  const [wishes, setWishes] = useState(INV.wishes);
  const [form, setForm] = useState({ name: "", attend: "hadir", count: "1", text: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const to = new URLSearchParams(window.location.search).get("to");
    if (to) {
      setGuest(to);
      setForm((f) => ({ ...f, name: to }));
    }
  }, []);

  // Fade sections in as they scroll into view. Content stays visible if JS or IntersectionObserver is unavailable.
  useEffect(() => {
    const el = root.current;
    if (!el || !("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.setAttribute("data-rv", "");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    el.querySelectorAll(".inv-rv").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  const parts = left === null ? null : { d: Math.floor(left / 864e5), h: Math.floor((left / 36e5) % 24), m: Math.floor((left / 6e4) % 60), s: Math.floor((left / 1e3) % 60) };

  const gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Pernikahan ${INV.groom.name} & ${INV.bride.name}`)}&dates=20270220T010000Z/20270220T070000Z&location=${encodeURIComponent(`${INV.venue.name}, ${INV.venue.area}`)}`;
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(INV.venue.mapsQuery)}`;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim() || "Tamu";
    if (form.text.trim()) setWishes((w) => [{ name, text: form.text.trim() }, ...w]);
    setSent(true);
    setForm((f) => ({ ...f, text: "" }));
  };

  return (
    <div className="inv" ref={root}>
      {/* Sampul */}
      <header className="inv-cover" id="sampul">
        <img className="inv-cover-bg" src={img("galeri3")} width={600} height={900} alt="" fetchPriority="high" />
        <div className="inv-cover-shade" aria-hidden="true" />
        <a className="inv-back" href={HOME}>
          <span aria-hidden="true">←</span> Contoh undangan oleh Boenda Ida
        </a>
        <div className="inv-cover-body">
          <Rings size={44} />
          <p className="inv-eyebrow">Undangan Pernikahan</p>
          <h1 className="inv-names">
            <span>{INV.groom.name}</span>
            <em>&amp;</em>
            <span>{INV.bride.name}</span>
          </h1>
          <p className="inv-date">{INV.dateLabel}</p>
          <div className="inv-guest">
            <span>Kepada Yth.</span>
            <strong>{guest || "Bapak/Ibu/Saudara/i"}</strong>
            <small>Tambahkan <code>?to=Nama Tamu</code> di alamat untuk menyapa tamu.</small>
          </div>
          <a className="inv-btn inv-btn-light" href="#sambutan">
            Buka Undangan
          </a>
        </div>
      </header>

      <main>
        {/* Sambutan */}
        <section id="sambutan" className="inv-sec inv-cream" aria-labelledby="inv-sambutan">
          <div className="inv-wrap inv-center inv-rv">
            <Rings />
            <h2 id="inv-sambutan" className="inv-h2">Dengan penuh syukur</h2>
            <p className="inv-lead">
              Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada hari pernikahan kami.
            </p>
          </div>
        </section>

        {/* Mempelai */}
        <section id="mempelai" className="inv-sec inv-sand" aria-labelledby="inv-mempelai">
          <div className="inv-wrap inv-couple">
            <figure className="inv-arch inv-rv">
              <img src={img("galeri1")} width={600} height={900} alt="Rizky dan Putri" loading="lazy" />
            </figure>
            <div className="inv-people">
              <span className="inv-chip">Mempelai</span>
              <h2 id="inv-mempelai" className="inv-h2 inv-left">Rizky <em>&amp;</em> Putri</h2>
              <div className="inv-person inv-rv">
                <h3>{INV.groom.full}</h3>
                <p>{INV.groom.parents}</p>
              </div>
              <div className="inv-person inv-rv">
                <h3>{INV.bride.full}</h3>
                <p>{INV.bride.parents}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Hitung mundur */}
        <section className="inv-sec inv-dark" aria-label="Hitung mundur">
          <div className="inv-wrap inv-center inv-rv">
            <p className="inv-eyebrow">Menuju hari bahagia</p>
            <div className="inv-count" role="timer" aria-live="off">
              {(
                [
                  ["Hari", parts?.d],
                  ["Jam", parts?.h],
                  ["Menit", parts?.m],
                  ["Detik", parts?.s],
                ] as const
              ).map(([label, val]) => (
                <div key={label}>
                  <strong>{val === undefined ? "--" : String(val).padStart(2, "0")}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <p className="inv-dim">{INV.dateLabel}</p>
          </div>
        </section>

        {/* Acara */}
        <section id="acara" className="inv-sec inv-cream" aria-labelledby="inv-acara">
          <div className="inv-wrap">
            <div className="inv-center inv-rv">
              <span className="inv-chip">Acara</span>
              <h2 id="inv-acara" className="inv-h2">Waktu &amp; tempat</h2>
            </div>
            <div className="inv-events">
              {INV.events.map((ev) => (
                <article key={ev.key} className="inv-event inv-rv">
                  <h3>{ev.title}</h3>
                  <p className="inv-event-date">{INV.dateLabel}</p>
                  <p className="inv-event-time">{ev.time}</p>
                  <p className="inv-dim">{ev.note}</p>
                </article>
              ))}
            </div>
            <address className="inv-venue inv-rv">
              <strong>{INV.venue.name}</strong>
              <span>{INV.venue.area}</span>
              <div className="inv-actions">
                <a className="inv-btn inv-btn-dark" href={maps} target="_blank" rel="noopener">Buka peta</a>
                <a className="inv-btn inv-btn-line" href={gcal} target="_blank" rel="noopener">Simpan ke kalender</a>
              </div>
            </address>
          </div>
        </section>

        {/* Galeri */}
        <section id="galeri" className="inv-sec inv-sand" aria-labelledby="inv-galeri">
          <div className="inv-wrap">
            <div className="inv-center inv-rv">
              <span className="inv-chip">Galeri</span>
              <h2 id="inv-galeri" className="inv-h2">Momen kami</h2>
            </div>
            <div className="inv-gallery">
              {GALLERY.map((g) => (
                <figure key={g.n} className="inv-rv" style={{ aspectRatio: `${g.w} / ${g.h}` }}>
                  <img src={img(g.n)} width={g.w} height={g.h} alt={g.alt} loading="lazy" />
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* RSVP */}
        <section id="rsvp" className="inv-sec inv-cream" aria-labelledby="inv-rsvp">
          <div className="inv-wrap inv-rsvp">
            <div className="inv-rv">
              <span className="inv-chip">RSVP</span>
              <h2 id="inv-rsvp" className="inv-h2 inv-left">Konfirmasi kehadiran</h2>
              <form className="inv-form" onSubmit={submit}>
                <label htmlFor="rsvp-name">Nama</label>
                <input id="rsvp-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama lengkap" />
                <div className="inv-row">
                  <div>
                    <label htmlFor="rsvp-attend">Kehadiran</label>
                    <select id="rsvp-attend" value={form.attend} onChange={(e) => setForm({ ...form, attend: e.target.value })}>
                      <option value="hadir">Hadir</option>
                      <option value="tidak">Tidak hadir</option>
                      <option value="ragu">Masih ragu</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="rsvp-count">Jumlah tamu</label>
                    <select id="rsvp-count" value={form.count} onChange={(e) => setForm({ ...form, count: e.target.value })}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>{n} orang</option>
                      ))}
                    </select>
                  </div>
                </div>
                <label htmlFor="rsvp-text">Ucapan &amp; doa</label>
                <textarea id="rsvp-text" rows={4} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="Tulis ucapan untuk kedua mempelai" />
                <button type="submit" className="inv-btn inv-btn-dark">Kirim konfirmasi</button>
                <p className="inv-note" role="status">
                  {sent ? "Terima kasih. Ini contoh undangan, jadi jawaban tidak dikirim ke mana pun." : "Ini contoh undangan: jawaban hanya tampil di halaman ini."}
                </p>
              </form>
            </div>
            <div className="inv-wishes inv-rv">
              <h3>Ucapan untuk mempelai</h3>
              <ul>
                {wishes.map((w, i) => (
                  <li key={`${w.name}-${i}`}>
                    <strong>{w.name}</strong>
                    <p>{w.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Amplop digital */}
        <section id="hadiah" className="inv-sec inv-dark" aria-labelledby="inv-hadiah">
          <div className="inv-wrap">
            <div className="inv-center inv-rv">
              <span className="inv-chip inv-chip-light">Amplop digital</span>
              <h2 id="inv-hadiah" className="inv-h2">Tanda kasih</h2>
              <p className="inv-lead inv-dim">Doa restu Anda adalah hadiah terbaik. Bila ingin memberi tanda kasih, bisa melalui rekening berikut.</p>
            </div>
            <div className="inv-gifts">
              {INV.gifts.map((g) => (
                <div key={g.bank} className="inv-gift inv-rv">
                  <span className="inv-bank">{g.bank}</span>
                  <strong className="inv-number">{g.number}</strong>
                  <span className="inv-dim">a.n. {g.holder}</span>
                  <CopyButton text={g.number} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Penutup */}
      <footer className="inv-close">
        <div className="inv-wrap inv-center inv-rv">
          <Rings size={40} />
          <p className="inv-lead">Terima kasih atas doa dan kehadiran Anda.</p>
          <p className="inv-sign">{INV.groom.name} <em>&amp;</em> {INV.bride.name}</p>
          <a className="inv-btn inv-btn-light" href={HOME}>Pesan undangan seperti ini</a>
          <p className="inv-credit">Contoh undangan digital oleh Boenda Ida Wedding Planner. Semua nama dan data di halaman ini hanya contoh.</p>
        </div>
      </footer>
    </div>
  );
}
