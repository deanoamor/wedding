import type { Metadata } from "next";
import Invitation from "@/components/invitation/Invitation";
import { SITE_URL } from "@/lib/site";
import "./invitation.css";

const title = "Rizky & Putri | Contoh Undangan Digital Boenda Ida";
const description = "Contoh undangan pernikahan digital dari Boenda Ida: cover, hitung mundur, jadwal acara, RSVP, dan amplop digital.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}undangan/` },
  // Demo content with sample data, so keep it out of search results.
  robots: { index: false, follow: true },
  openGraph: { type: "website", url: `${SITE_URL}undangan/`, title, description, locale: "id_ID", images: [{ url: `${SITE_URL}og.jpg`, width: 1200, height: 630 }] },
};

export default function Page() {
  return <Invitation />;
}
