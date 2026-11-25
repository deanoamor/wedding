// Daftar template undangan digital Boenda Ida (hanya untuk ditampilkan di /template).
// Gambar: public/template-previews/{id}.webp (tangkapan layar hero, HP 390x720 @2x, dipotong atas 780x1248).
export const TEMPLATES = [
  { id: "klasik", name: "Klasik Emas", note: "Tengah-tengah, krem & emas, nuansa tradisional." },
  { id: "modern", name: "Modern Minimal", note: "Tipografi besar, layout dua kolom, hitam-putih bersih." },
  { id: "taman", name: "Taman Hijau", note: "Frame lengkung, hijau sage & serif lembut ala taman." },
  { id: "royal", name: "Royal Maroon", note: "Marun tua dengan bingkai ganda emas, kesan mewah." },
  { id: "rustic", name: "Rustic Hangat", note: "Kertas krem, foto polaroid miring, aksen terakota." },
  { id: "malam", name: "Malam Biru", note: "Biru malam dengan kartu kaca, foto penuh di sampul." },
  { id: "pastel", name: "Pastel Lembut", note: "Gradasi pink-lavender, foto bulat, bentuk membulat." },
  { id: "majalah", name: "Majalah Editorial", note: "Sampul ala majalah, tipografi tebal, aksen merah." },
] as const;

export type TemplateItem = (typeof TEMPLATES)[number];
