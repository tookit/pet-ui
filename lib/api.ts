// ─── API client for pet-api backend ───

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8002";
const API_KEY = process.env.API_KEY ?? "";

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { params, ...init } = options;

  const url = new URL(`${API_BASE}/api/v1${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };

  if (API_KEY) {
    headers["X-API-Key"] = API_KEY;
  }

  const res = await fetch(url.toString(), {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API error ${res.status}: ${body || res.statusText}`);
  }

  return res.json() as Promise<T>;
}

// ─── Types matching pet-api Pydantic response schemas ───

// Pagination (app/schemas/pagination.py)
export interface PaginatedResponse<T> {
  result: T[];
  total: number;
  page: number;
  per_page: number;
  last_page: number;
  from: number | null;
  to: number | null;
}

// Product images (app/schemas/product.py — ProductImageResponse)
export interface ProductImage {
  id: number;
  url: string;
  featured: boolean;
}

// Product files (ProductFileResponse)
export interface ProductFile {
  id: number;
  name: string;
  type: string;
  size: number;
  url: string;
}

// Product category junction (ProductCategoryResponse)
export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

// Product tag junction (ProductTagResponse)
export interface ProductTag {
  id: number;
  name: string;
}

// Product property (ProductPropResponse — API returns attribute_id, not id)
export interface ProductProp {
  id?: number;
  attribute_id?: number;
  name: string;
  value: string | null;
  unit: string | null;
}

// Price (PriceResponse)
export interface ProductPrice {
  id: number;
  product_id: number;
  variant_id: number | null;
  base_price: number;
  compare_at_price: number | null;
  cost_price: number | null;
  currency: string;
  effective_from: string | null;
  effective_to: string | null;
  created_at: string | null;
}

// Price tier (PriceTierResponse)
export interface PriceTier {
  id: number;
  product_id: number;
  min_quantity: number;
  unit_price: number;
  currency: string;
  label: string | null;
  display_order: number;
  created_at: string | null;
  updated_at: string | null;
}

// Variant (VariantResponse)
export interface ProductVariant {
  id: number;
  product_id: number;
  sku: string;
  name: string | null;
  attributes: Record<string, unknown>[];
  description: string | null;
  barcode: string | null;
  weight: number | null;
  dimensions: Record<string, unknown> | null;
  is_default: boolean;
  status: string;
  prices: ProductPrice[];
  created_at: string | null;
  updated_at: string | null;
}

// Product list item (ProductListResponse — lightweight, no variants/prices/tiers)
export interface ProductListItem {
  id: number;
  sku: string;
  slug: string | null;
  name: string;
  short_description: string | null;
  status: string;
  type: string;
  is_featured: boolean;
  attrs: Record<string, unknown>[] | null;
  default_attrs: Record<string, unknown>[] | null;
  featured_image: string | null;
  images: ProductImage[];
  files: ProductFile[];
  props: ProductProp[];
  tags: ProductTag[];
  categories: ProductCategory[];
  min_price: number | null;
  moq: number;
  created_at: string | null;
}

// Full product detail (ProductResponse)
export interface ProductDetail extends ProductListItem {
  description: string | null;
  weight: number | null;
  dimensions: Record<string, unknown> | null;
  variants: ProductVariant[];
  prices: ProductPrice[];
  tiers: PriceTier[];
  updated_at: string | null;
}

// Category (CategoryResponse)
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parent_id: number | null;
  display_order: number;
  is_active: boolean;
  image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Category tree node (CategoryTreeResponse)
export interface CategoryTree extends Category {
  children: CategoryTree[];
}

// ─── Data-fetching helpers ───

/** Fetch the full category tree (active only). */
export async function fetchCategoryTree(): Promise<CategoryTree[]> {
  return apiFetch<CategoryTree[]>("/categories/tree");
}

/** Fetch a single category by slug. Returns null on 404. */
export async function fetchCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  try {
    return await apiFetch<Category>(`/categories/slug/${slug}`);
  } catch {
    return null;
  }
}

/** Fetch featured products. */
export async function fetchFeaturedProducts(
  limit = 6,
): Promise<ProductListItem[]> {
  const res = await apiFetch<PaginatedResponse<ProductListItem>>(
    `/products?is_featured=true&status=active&per_page=${limit}&sort_by=created_at&sort_order=desc`,
  );
  return res.result;
}

/** Fetch products by category ID. */
export async function fetchProductsByCategory(
  categoryId: number,
  page = 1,
  perPage = 12,
): Promise<PaginatedResponse<ProductListItem>> {
  return apiFetch<PaginatedResponse<ProductListItem>>(
    `/products?category_id=${categoryId}&status=active&page=${page}&per_page=${perPage}&sort_by=created_at&sort_order=desc`,
  );
}

/** Fetch a product by slug with full detail. Returns null on 404. */
export async function fetchProductBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  try {
    return await apiFetch<ProductDetail>(`/products/slug/${slug}`);
  } catch {
    return null;
  }
}

// ─── Inquiry / Quote submission ───

export interface InquirySubmitPayload {
  name: string;
  email: string;
  phone: string;
  company: string;
  notes?: string;
  items: { product_id: number; quantity: number }[];
}

export async function submitInquiry(
  payload: InquirySubmitPayload,
): Promise<{ success: boolean; message: string }> {
  try {
    await apiFetch("/quotes", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return { success: true, message: "Quote request submitted successfully." };
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : "Submission failed. Please try again.";
    // Check for rate limit
    if (msg.includes("429")) {
      return {
        success: false,
        message: "Too many requests. Please wait a moment and try again.",
      };
    }
    return { success: false, message: msg };
  }
}

/** Fetch all published product slugs (for generateStaticParams). */
export async function fetchAllProductSlugs(): Promise<string[]> {
  try {
    // Fetch a large page to get all slugs
    const res = await apiFetch<PaginatedResponse<{ slug: string | null }>>(
      "/products?status=active&per_page=100&sort_by=created_at&sort_order=desc",
    );
    return res.result.map((p) => p.slug).filter(Boolean) as string[];
  } catch {
    return [];
  }
}
