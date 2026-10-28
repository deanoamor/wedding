import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_ORIGIN, SITE_TITLE, SITE_URL } from "@/lib/site";

const sans = localFont({
  src: "./fonts/BricolageGrotesque.woff2",
  variable: "--font-sans",
  weight: "200 800",
  display: "swap",
});
const serif = localFont({
  src: [
    { path: "./fonts/InstrumentSerif-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/InstrumentSerif-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
});

const ogImage = { url: `${SITE_URL}og.jpg`, width: 1200, height: 630, alt: "Pengantin berjalan di antara tamu yang menaburkan kelopak bunga" };

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: ["wedding organizer Jakarta", "perencanaan pernikahan", "gedung pernikahan Jakarta", "paket pernikahan", "Boenda Ida"],
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "id_ID",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [ogImage],
  },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION, images: [ogImage.url] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#E6DACD" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
