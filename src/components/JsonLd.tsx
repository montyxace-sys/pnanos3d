import type { SiteData } from "@/lib/data";
import { siteUrl } from "@/app/sitemap";

/**
 * Datos estructurados del negocio (schema.org).
 * Solo refleja los datos de contacto de `src/content/site.json`: sin cifras,
 * valoraciones, horarios ni antigüedad que no estén verificados.
 */
export default function JsonLd({ site }: { site: SiteData }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.siteName,
    description: site.description,
    url: `${siteUrl}/`,
    email: site.email,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address[1] ?? site.address.join(" "),
      addressLocality: site.address[2] ?? "",
      addressCountry: "ES",
    },
    sameAs: site.social.map((item) => item.href),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
