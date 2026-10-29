# Boenda Ida Wedding Organizer (Next.js)

    npm install
    npm run dev      # http://localhost:3000
    npm run build && npm start

- Next.js App Router + React 19 + TypeScript, font lokal via next/font.
- `src/components/sections.tsx` = markup tiap section.
- `src/components/vals.ts` = state akordeon layanan, pilihan gedung, testimoni.
- `src/components/Effects.tsx` = panel menumpuk, geser horizontal Foto, Lenis smooth scroll.
- `src/app/globals.css` = seluruh CSS (responsif). Foto ada di `public/`.
- Semua data masih dummy: ganti dengan data dan foto klien asli sebelum rilis.

## SEO
- Set `NEXT_PUBLIC_SITE_URL` ke domain asli (default `https://boendaida.id` hanya placeholder). Dipakai untuk canonical, Open Graph, sitemap, robots, dan JSON-LD.
- Struktur: satu `h1`, `h2` per section, `h3` untuk layanan, paket, dan gedung; `main`, `header`, `footer`, `nav`, `figure/figcaption`, `blockquote`.
- Metadata, Open Graph (`public/og.jpg`), Twitter card, `robots.txt`, `sitemap.xml`, ikon, dan JSON-LD (ProfessionalService + paket) ada di `src/app/`.
- Ganti alamat, telepon, jam, dan harga di `src/app/page.tsx` bila data asli berubah.

## GitHub Pages
- Workflow `.github/workflows/pages.yml` membangun static export (`output: "export"`) dan deploy ke GitHub Pages.
- Di pengaturan repo, set Pages > Source ke **GitHub Actions**.
- `NEXT_PUBLIC_BASE_PATH` dan `NEXT_PUBLIC_SITE_URL` diisi otomatis oleh workflow; untuk domain sendiri, hapus base path dan isi `NEXT_PUBLIC_SITE_URL` dengan domain asli.
- Foto di `public/` berformat WebP (`og.jpg` tetap JPEG untuk pratinjau sosial). Alamat gambar diberi awalan `NEXT_PUBLIC_BASE_PATH` di `sections.tsx`.
