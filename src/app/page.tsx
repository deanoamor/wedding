import Site from "@/components/Site";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: "Boenda Ida Wedding Planner",
  description:
    "Wedding organizer di Jakarta dan sekitarnya: perencanaan menyeluruh, koordinasi hari-H, dekorasi, katering, rias, dan dokumentasi.",
  url: SITE_URL,
  image: `${SITE_URL}/og.jpg`,
  telephone: "+62 812-9306-2254",
  email: "boendaida.wedding@gmail.com",
  foundingDate: "2016",
  founder: { "@type": "Person", name: "Ida Rahmawati" },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jl. Kemang Raya No. 28B, Kemang",
    addressLocality: "Jakarta Selatan",
    postalCode: "12730",
    addressCountry: "ID",
  },
  areaServed: ["Jakarta", "Bandung", "Bogor", "Bekasi", "Tangerang", "Depok"],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:00",
    closes: "17:00",
  },
  sameAs: ["https://instagram.com/boendaida.wedding"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Paket Pernikahan",
    itemListElement: [
      { name: "Silver", price: "15000000", description: "Paket ideal untuk pernikahan sederhana namun tetap berkesan." },
      { name: "Gold", price: "28000000", description: "Paket paling populer dengan layanan lengkap untuk hari istimewamu." },
      { name: "Platinum", price: "50000000", description: "Pengalaman pernikahan mewah tanpa kompromi, all-inclusive." },
    ].map((p) => ({
      "@type": "Offer",
      name: `Paket ${p.name}`,
      description: p.description,
      price: p.price,
      priceCurrency: "IDR",
      itemOffered: { "@type": "Service", name: `Paket Pernikahan ${p.name}` },
    })),
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Site />
    </>
  );
}
