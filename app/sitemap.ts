import type { MetadataRoute } from "next";
import type { PaginatedResponse, ProductListItem } from "@/lib/api";
import { SITE_URL } from "@/lib/seo";

// Regenerate hourly: catalogue changes on the minute are irrelevant to crawlers,
// but new SKUs must reach them the same day.
export const revalidate = 3600;

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8002";
const API_KEY = process.env.API_KEY ?? "";

const PAGE_SIZE = 100; // pet-api per_page cap
const MAX_PAGES = 40; // safety bound: 4,000 SKUs

// Only routes that actually exist. Sub-category pages (/aquarium/[sub], /pet/[sub])
// join this list once §4-T6 of docs/seo-geo-plan.md is implemented — listing them
// now would submit 404s.
const STATIC_ROUTES: Array<{
  path: string;
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
}> = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/aquarium", priority: 0.9, changeFrequency: "weekly" },
  { path: "/pet", priority: 0.9, changeFrequency: "weekly" },
  { path: "/oem", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
];

interface ProductPage {
  result: ProductListItem[];
  last_page: number;
}

/**
 * Fetch active product slugs, page by page.
 * Uses explicit `revalidate` (not lib/api's `cache: "no-store"`) so this route
 * stays statically regenerable instead of becoming fully dynamic.
 */
async function fetchActiveProductPages(): Promise<ProductPage | null> {
  const url = new URL(`${API_BASE}/api/v1/products`);
  url.searchParams.set("status", "active");
  url.searchParams.set("per_page", String(PAGE_SIZE));

  const pages: ProductListItem[] = [];
  let lastPage = 1;

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    url.searchParams.set("page", String(page));

    const res = await fetch(url.toString(), {
      headers: API_KEY ? { "X-API-Key": API_KEY } : {},
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;

    const body = (await res.json()) as PaginatedResponse<ProductListItem>;
    pages.push(...body.result);
    lastPage = body.last_page ?? 1;
    if (page >= lastPage) break;
  }

  return { result: pages, last_page: lastPage };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path === "/" ? "" : route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  let productPages: ProductPage | null = null;
  try {
    productPages = await fetchActiveProductPages();
  } catch {
    // Backend unreachable at build/revalidate time: ship the static shell rather
    // than failing the whole deployment. Products return on the next revalidate.
    productPages = null;
  }

  if (!productPages) return staticEntries;

  const productEntries: MetadataRoute.Sitemap = productPages.result
    .filter((product) => Boolean(product.slug))
    .map((product) => ({
      url: `${SITE_URL}/products/${product.slug}`,
      lastModified: product.created_at ? new Date(product.created_at) : now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [...staticEntries, ...productEntries];
}
