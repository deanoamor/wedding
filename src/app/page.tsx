import Site from "@/components/Site";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

// Only facts already on the page; add telephone/address/openingHours once real data exists.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}#business`,
  name: SITE_NAME,
  alternateName: "Boenda Ida",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}og.jpg`,
  foundingDate: "2014",
  areaServed: [{ "@type": "City", name: "Jakarta" }, { "@type": "Country", name: "Indonesia" }],
  knowsLanguage: "id",
  makesOffer: ["Perencanaan pernikahan", "Menu katering pernikahan", "Pilihan gedung pernikahan", "Koordinasi hari-H"].map((n) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: n },
  })),
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Site />
    </>
  );
}
