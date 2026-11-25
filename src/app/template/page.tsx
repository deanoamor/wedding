import type { Metadata } from "next";
import TemplateGallery from "@/components/TemplateGallery";
import { SITE_URL } from "@/lib/site";
import { TEMPLATES } from "@/lib/templates";
import "./template.css";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const title = "Template Undangan Digital";
const description = "Pilihan desain template undangan digital Boenda Ida.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/template/` },
  // Halaman untuk ditinjau tim, jangan masuk hasil pencarian.
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <main className="tpl">
      <div className="tpl-wrap">
        <a className="tpl-back" href={`${BASE}/`}>← Kembali ke beranda</a>
        <header className="tpl-head">
          <h1>Template undangan</h1>
          <p>{TEMPLATES.length} desain undangan digital. Tampilan di bawah adalah halaman sampul tiap template (contoh data).</p>
        </header>
        <TemplateGallery />
      </div>
    </main>
  );
}
