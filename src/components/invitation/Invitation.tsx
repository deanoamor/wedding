"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
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
  <svg className="inv-rings" width={size} height={size * 0.65} viewBox="0 0 34 22" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <circle cx="11" cy="11" r="9" pathLength={1} />
    <circle cx="23" cy="11" r="9" pathLength={1} />
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

/** Slow falling petals over the cover. Pauses when the cover is off screen or the tab is hidden. */
function Petals() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const fit = () => {
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const N = w < 600 ? 16 : 28;
    const ps = Array.from({ length: N }, () => ({ x: rnd(0, w), y: rnd(-h, h), r: rnd(5, 11), vy: rnd(14, 30), sw: rnd(10, 30), ph: rnd(0, 6.28), rot: rnd(0, 6.28), vr: rnd(-0.8, 0.8), a: rnd(0.35, 0.75), tone: Math.random() < 0.6 }));
    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      raf = requestAnimationFrame(frame);
      if (window.scrollY > h * 1.05 || document.hidden) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.y += p.vy * dt;
        p.ph += dt * 0.9;
        p.rot += p.vr * dt;
        if (p.y > h + 20) {
          p.y = -20;
          p.x = rnd(0, w);
        }
        const x = p.x + Math.sin(p.ph) * p.sw;
        ctx.save();
        ctx.translate(x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.a;
        ctx.fillStyle = p.tone ? "#EBC4C4" : "#FBF7F2";
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", fit);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
    };
  }, []);
  return <canvas ref={ref} className="inv-petals" aria-hidden="true" />;
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

  // Motion: Lenis smooth scroll, cover parallax, image parallax, progress bar and staggered reveals.
  // Everything is skipped under prefers-reduced-motion, and content stays visible without JS.
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true });
    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    });

    const bg = el.querySelector<HTMLElement>(".inv-cover-bg");
    const body = el.querySelector<HTMLElement>(".inv-cover-body");
    const bar = el.querySelector<HTMLElement>(".inv-progress");
    const pars = Array.from(el.querySelectorAll<HTMLElement>(".inv-par"));
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

    const update = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? clamp(y / max, 0, 1) : 0})`;
      if (y < vh * 1.3) {
        if (bg) bg.style.transform = `translate3d(0,${Math.min(y * 0.2, vh * 0.12)}px,0) scale(${1.04 + (y / vh) * 0.06})`;
        if (body) {
          body.style.transform = `translate3d(0,${y * 0.14}px,0)`;
          body.style.opacity = String(clamp(1 - y / (vh * 0.75), 0, 1));
        }
      }
      for (const f of pars) {
        const r = f.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) continue;
        const img = f.firstElementChild as HTMLElement | null;
        if (!img) continue;
        const p = clamp((r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2), -1, 1);
        img.style.transform = `translate3d(0,${(-p * r.height * 0.07).toFixed(1)}px,0)`;
      }
    };
    lenis.on("scroll", update);
    window.addEventListener("resize", update);
    update();

    // Reveals, staggered by position among siblings.
    el.setAttribute("data-rv", "");
    el.querySelectorAll<HTMLElement>(".inv-rv").forEach((n) => {
      const sibs = Array.from(n.parentElement?.children ?? []).filter((c) => c.classList.contains("inv-rv"));
      n.style.transitionDelay = `${Math.min(sibs.indexOf(n), 5) * 110}ms`;
    });
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
    );
    el.querySelectorAll(".inv-rv").forEach((n) => io.observe(n));

    // Smooth in-page anchors.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
      const id = a?.getAttribute("href");
      const target = id && id.length > 1 ? document.querySelector<HTMLElement>(id) : null;
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { duration: 1.6 });
      }
    };
    el.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      lenis.destroy();
      window.removeEventListener("resize", update);
      el.removeEventListener("click", onClick);
      el.removeAttribute("data-rv");
    };
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
      <div className="inv-progress" aria-hidden="true" />
      {/* Sampul */}
      <header className="inv-cover" id="sampul">
        <img className="inv-cover-bg" src={img("galeri3")} width={600} height={900} alt="" fetchPriority="high" />
        <div className="inv-cover-shade" aria-hidden="true" />
        <Petals />
        <a className="inv-back" href={HOME}>
          <span aria-hidden="true">←</span> Contoh undangan oleh Boenda Ida
        </a>
        <div className="inv-cover-body">
          <div className="inv-cv" style={{ ["--d" as string]: "0.1s" }}>
            <Rings size={44} />
          </div>
          <p className="inv-eyebrow inv-cv" style={{ ["--d" as string]: "0.3s" }}>Undangan Pernikahan</p>
          <h1 className="inv-names">
            <span className="inv-mask"><span style={{ ["--d" as string]: "0.45s" }}>{INV.groom.name}</span></span>
            <em className="inv-cv" style={{ ["--d" as string]: "0.8s" }}>&amp;</em>
            <span className="inv-mask"><span style={{ ["--d" as string]: "0.65s" }}>{INV.bride.name}</span></span>
          </h1>
          <p className="inv-date inv-cv" style={{ ["--d" as string]: "1s" }}>{INV.dateLabel}</p>
          <div className="inv-guest inv-cv" style={{ ["--d" as string]: "1.2s" }}>
            <span>Kepada Yth.</span>
            <strong>{guest || "Bapak/Ibu/Saudara/i"}</strong>
            <small>Tambahkan <code>?to=Nama Tamu</code> di alamat untuk menyapa tamu.</small>
          </div>
          <a className="inv-btn inv-btn-light inv-cv" style={{ ["--d" as string]: "1.4s" }} href="#sambutan">
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
            <figure className="inv-arch inv-par inv-rv">
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
                <div key={label} className="inv-rv">
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
                <figure key={g.n} className="inv-par inv-rv" style={{ aspectRatio: `${g.w} / ${g.h}` }}>
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
              <ul data-lenis-prevent>
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
