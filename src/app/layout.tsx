import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

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

const description =
  "Wedding organizer di Jakarta dan sekitarnya. Perencanaan pernikahan menyeluruh, koordinasi hari-H, dekorasi, katering, rias, dan dokumentasi. Paket mulai Rp 15.000.000.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Boenda Ida Wedding Organizer | Perencanaan Pernikahan di Jakarta",
    template: "%s | Boenda Ida",
  },
  description,
  applicationName: SITE_NAME,
  keywords: [
    "wedding organizer Jakarta",
    "wedding planner Jakarta",
    "paket pernikahan",
    "jasa wedding organizer",
    "Boenda Ida",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: SITE_NAME,
    title: "Boenda Ida Wedding Organizer",
    description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Pengantin berjalan di antara tamu yang menaburkan kelopak bunga" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Boenda Ida Wedding Organizer",
    description,
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#E6DACD",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
