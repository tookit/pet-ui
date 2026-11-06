// ─── SEO / GEO helpers: absolute URLs + JSON-LD builders ───
//
// Server-only. Import from server components / generateMetadata / route handlers.
//
// Red lines (see AGENTS.md + docs/seo-geo-plan.md §5):
//   - SKUs are always own-brand `PP-000123`. Never emit marketplace ids.
//   - Internal sourcing props/tags must be filtered via publicProps/publicTags
//     before they reach structured data.
//   - Never emit aggregateRating / review — there is no real review data.
//   - Never emit certifications the company does not actually hold.

import {
  publicProps,
  publicTags,
  type ProductDetail,
} from "@/lib/api";

/** Canonical production origin, no trailing slash. Override via env per environment. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://petpallets.com"
).replace(/\/+$/, "");

export const SITE_NAME = "Petpallets";

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Turn a path or absolute URL into an absolute URL on the canonical origin. */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export type JsonLdObject = Record<string, unknown>;

/** JSON-LD payload for <script type="application/ld+json">. */
export function jsonLdScript(data: JsonLdObject | JsonLdObject[]) {
  return {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  };
}

// ─── Site-level entities ───

export function organizationJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    alternateName: "Petpallets",
    url: SITE_URL,
    logo: absoluteUrl("/icon.svg"),
    description:
      "ISO 9001 certified manufacturer and B2B wholesale supplier of aquarium supplies and pet products, exporting to 60+ countries since 2012.",
    foundingDate: "2012",
    address: {
      "@type": "PostalAddress",
      streetAddress: "No. 88, Jinsha Industrial Zone",
      addressLocality: "Shantou",
      addressRegion: "Guangdong",
      postalCode: "515000",
      addressCountry: "CN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "sales@petpallets.com",
        telephone: "+86-754-8888-6666",
        availableLanguage: ["en", "zh"],
        areaServed: "Worldwide",
      },
    ],
    // TODO(Q7): add verified third-party profiles (Alibaba, Made-in-China,
    // LinkedIn, trade-show directories) once confirmed. Empty sameAs is worse
    // than none, so this is intentionally omitted until then.
  };
}

export function websiteJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

// ─── Navigation-level entities ───

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(crumbs: Crumb[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function itemListJsonLd(name: string, items: Crumb[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: absoluteUrl(it.path),
    })),
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

/** Only use on pages that actually render a visible Q&A block. */
export function faqJsonLd(items: FaqItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

// ─── Product ───

function numericPrice(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : null;
}

export function productJsonLd(product: ProductDetail): JsonLdObject {
  const url = absoluteUrl(`/products/${product.slug ?? product.id}`);
  const images = product.images
    .slice()
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .map((img) => absoluteUrl(img.url));
  if (images.length === 0 && product.featured_image) {
    images.push(absoluteUrl(product.featured_image));
  }

  // Prices: base prices + quantity-tier unit prices. AggregateOffer needs a range,
  // not a single price, because the same SKU is sold at different tiers.
  const prices = [
    ...product.prices.map((p) => p.base_price),
    ...product.tiers.map((t) => t.unit_price),
  ]
    .map(numericPrice)
    .filter((n): n is number => n !== null);

  const lowPrice = prices.length > 0 ? Math.min(...prices) : numericPrice(product.min_price);
  const highPrice = prices.length > 0 ? Math.max(...prices) : null;
  const currency =
    product.prices[0]?.currency ?? product.tiers[0]?.currency ?? "USD";

  const additionalProperty: JsonLdObject[] = [
    {
      "@type": "PropertyValue",
      name: "Minimum order quantity",
      value: `${product.moq} pcs`,
    },
  ];

  for (const tier of product.tiers) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: `Unit price @ ${tier.min_quantity}+ pcs`,
      value: `${tier.currency} ${tier.unit_price.toFixed(2)}`,
    });
  }

  // publicProps() drops sourcing props (Source URL, Supplier, 1688/Amazon ids).
  for (const prop of publicProps(product.props)) {
    if (!prop.value) continue;
    additionalProperty.push({
      "@type": "PropertyValue",
      name: prop.name,
      value: prop.unit ? `${prop.value} ${prop.unit}` : prop.value,
    });
  }

  // publicTags() drops `1688-import` / `amazon-import` pseudo-tags.
  const certifications = publicTags(product.tags)
    .filter((t) => t.name.trim().length > 0)
    .map((t) => ({ "@type": "Certification", name: t.name }));

  const data: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    sku: product.sku,
    url,
    description:
      product.short_description ??
      product.description?.slice(0, 400) ??
      `Wholesale ${product.name} from Petpallets. MOQ ${product.moq} pcs. OEM/ODM available.`,
    image: images,
    brand: { "@type": "Brand", name: SITE_NAME },
    manufacturer: { "@id": ORG_ID },
    category: product.categories[0]?.name,
    additionalProperty,
  };

  if (certifications.length > 0) data.hasCertification = certifications;

  if (lowPrice !== null) {
    const offer: JsonLdObject = {
      "@type": "AggregateOffer",
      priceCurrency: currency,
      lowPrice: lowPrice.toFixed(2),
      offerCount: Math.max(1, prices.length || product.tiers.length || 1),
      availability: "https://schema.org/InStock",
      url,
      seller: { "@id": ORG_ID },
    };
    if (highPrice !== null && highPrice !== lowPrice) {
      offer.highPrice = highPrice.toFixed(2);
    }
    data.offers = offer;
  }

  return data;
}
