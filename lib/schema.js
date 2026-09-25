// Builds structured data from src/_data/site.json so business facts live in one place.

function postalAddress(address) {
  return {
    "@type": "PostalAddress",
    streetAddress: address.street,
    addressLocality: address.locality,
    addressRegion: address.region,
    postalCode: address.postcode,
    addressCountry: address.country,
  };
}

// First item flagged "primary": true, else the first item.
export function primary(items = []) {
  return items.find((item) => item.primary) ?? items[0];
}

export function localBusiness(site) {
  const primaryPhone = primary(site.phones);

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#business`,
    name: site.name,
    description: site.description,
    url: `${site.url}/`,
    telephone: primaryPhone.tel,
    email: site.email,
    foundingDate: String(site.founded),
    address: postalAddress(site.address),
    areaServed: { "@type": "City", name: site.areaServed },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: site.hours.days,
        opens: site.hours.opens,
        closes: site.hours.closes,
      },
    ],
    contactPoint: site.phones.map((phone) => ({
      "@type": "ContactPoint",
      name: phone.label,
      telephone: phone.tel,
      contactType: "customer service",
      areaServed: "AU-ACT",
    })),
    sameAs: site.social.map((account) => account.url),
    memberOf: site.memberships.map((name) => ({ "@type": "Organization", name })),
  };

  if (site.ogImage) {
    schema.image = `${site.url}${site.ogImage}`;
  }

  return schema;
}

// Safe to drop inside <script type="application/ld+json">.
export function toJsonLd(data) {
  return JSON.stringify(data, null, 2).replace(/</g, "\\u003c");
}
