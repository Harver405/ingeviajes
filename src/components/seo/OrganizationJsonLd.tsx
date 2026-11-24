import { site } from "@/data/site";
import { siteUrl } from "@/lib/url";

export default function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: site.name,
    legalName: site.legalName,
    description: `${site.tagline}. Misiones académicas y visitas técnicas internacionales.`,
    url: siteUrl,
    logo: `${siteUrl}/brand/logo.png`,
    image: `${siteUrl}/opengraph-image`,
    telephone: site.phone.tel,
    email: site.email,
    taxID: site.nit,
    address: {
      "@type": "PostalAddress",
      ...(site.address ? { streetAddress: site.address } : {}),
      addressLocality: "Bucaramanga",
      addressRegion: "Santander",
      addressCountry: "CO",
    },
    areaServed: "CO",
    sameAs: [site.social.facebook, site.social.instagram],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}