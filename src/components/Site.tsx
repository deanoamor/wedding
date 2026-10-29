"use client";

import { useMemo, useState } from "react";
import { buildVals } from "./vals";
import { Sprite, Hero, Tentang, Layanan, Paket, Lokasi, Foto, Testimoni, Cta, Footer } from "./sections";
import Effects from "./Effects";

export default function Site() {
  const [s, setS] = useState({ svc: 1, venue: 1, t: 1 });
  const v = useMemo(() => buildVals(s, (p) => setS((o) => ({ ...o, ...p }))), [s]);
  return (
    <>
      <Sprite v={v} />
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12, background: "#E6DACD" }}>
        <main style={{ display: "contents" }}>
          <Hero v={v} />
          <Tentang v={v} />
          <Layanan v={v} />
          <Paket v={v} />
          <Lokasi v={v} />
          <Foto v={v} />
          <Testimoni v={v} />
          <Cta v={v} />
        </main>
        <Footer v={v} />
      </div>
      <Effects />
    </>
  );
}
