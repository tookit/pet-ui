import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Download,
  ShieldCheck,
  ArrowRight,
  Play,
  Check,
} from "@phosphor-icons/react/dist/ssr";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import { BuyPanel } from "./BuyPanel";
import { ProductGallery } from "./ProductGallery";
import {
  fetchProductBySlug,
  fetchProductsByCategory,
  publicProps,
  publicTags,
  type ProductDetail,
  type ProductListItem,
} from "@/lib/api";

/* ─── Helpers ─── */

function formatPrice(value: number | null | undefined): string {
  if (value == null) return "—";
  return `$${Number(value).toFixed(2)}`;
}

function imageUrl(product: ProductDetail): string | null {
  const featured = product.images.find((img) => img.featured);
  if (featured) return featured.url;
  if (product.images.length > 0) return product.images[0].url;
  if (product.featured_image) return product.featured_image;
  return null;
}

function dimensionsLabel(
  dimensions: Record<string, unknown> | null,
): string | null {
  if (!dimensions) return null;
  const d = dimensions;
  const parts = [d.length, d.width, d.height].filter(Boolean);
  return parts.length ? `${parts.join(" × ")} mm` : null;
}

interface SpecRow {
  label: string;
  value: string;
}

function productSpecs(product: ProductDetail): SpecRow[] {
  const specs: SpecRow[] = [];
  const dims = dimensionsLabel(product.dimensions);
  if (dims) specs.push({ label: "Dimensions", value: dims });
  if (product.weight != null)
    specs.push({ label: "Net weight", value: `${product.weight} kg` });
  for (const prop of publicProps(product.props)) {
    if (prop.value) {
      specs.push({
        label: prop.name,
        value: prop.unit ? `${prop.value} ${prop.unit}` : prop.value,
      });
    }
  }
  return specs;
}

function packagingSpecs(product: ProductDetail): SpecRow[] {
  const specs: SpecRow[] = [];
  const dims = dimensionsLabel(product.dimensions);
  if (dims) specs.push({ label: "Carton dimensions", value: dims });
  if (product.weight != null)
    specs.push({ label: "Gross weight", value: `${product.weight} kg` });
  specs.push({ label: "Port", value: "Shenzhen · FOB" });
  specs.push({ label: "Container load", value: "On request" });
  specs.push({ label: "HS code", value: "On request" });
  return specs;
}

/* ─── Metadata ─── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) return { title: "Product Not Found" };

  const categoryName = product.categories[0]?.name ?? "";
  const desc =
    product.short_description ??
    product.description?.slice(0, 160) ??
    `Wholesale ${product.name}. MOQ ${product.moq} pcs. OEM available.`;

  return {
    title: `${product.name} — ${categoryName} Wholesale`,
    description: desc,
  };
}

/* ─── Page ─── */

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) notFound();

  const mainImage = imageUrl(product);
  const specs = productSpecs(product);
  const packaging = packagingSpecs(product);
  const certs = publicTags(product.tags);
  const videos = product.files.filter((f) => f.aggregate_type === "video");
  const downloads = product.files.filter((f) => f.aggregate_type !== "video");
  const specSheetUrl = downloads[0]?.url ?? null;

  const category = product.categories[0];
  const categoryName = category?.name ?? "Products";
  const categorySlug = category?.slug;

  // Related products from the same category
  let related: ProductListItem[] = [];
  if (category) {
    try {
      const res = await fetchProductsByCategory(category.id, 1, 6);
      related = res.result.filter((p) => p.id !== product.id).slice(0, 4);
    } catch {
      /* ignore — related section is optional */
    }
  }

  return (
    <>
      <div className="container-page">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            ...(categorySlug
              ? [{ label: categoryName, href: `/${categorySlug}` }]
              : []),
            { label: product.name },
          ]}
        />
      </div>

      {/* ─── Product top ─── */}
      <section className="pb-14">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            <ProductGallery
              images={product.images}
              fallbackImage={mainImage}
              name={product.name}
            />

            <div className="flex flex-col gap-5 lg:sticky lg:top-[88px]">
              <div>
                <div className="text-[11.5px] font-semibold uppercase tracking-[0.095em] text-primary-700 mb-2.5">
                  {categoryName}
                </div>
                <h1 className="font-display text-[clamp(26px,3vw,32px)] font-bold text-neutral-900 leading-[1.2] tracking-[-0.015em] mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3 text-[12.5px] text-neutral-500 mb-3.5">
                  <span className="font-mono text-[12px] text-neutral-600">
                    {product.sku}
                  </span>
                  {certs.length > 0 && (
                    <>
                      <span className="text-neutral-300">·</span>
                      <span className="text-primary-700 font-medium">
                        {certs.map((c) => c.name).join(" / ")}
                      </span>
                    </>
                  )}
                </div>
                {(product.short_description ?? product.description) && (
                  <p className="text-[14.5px] leading-[1.65] text-neutral-600">
                    {product.short_description ?? product.description}
                  </p>
                )}
              </div>

              <BuyPanel
                productId={product.id}
                slug={slug}
                name={product.name}
                moq={product.moq}
                tiers={product.tiers}
                imageUrl={mainImage ?? undefined}
                specSheetUrl={specSheetUrl}
                weight={product.weight}
                dimensions={product.dimensions}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 01 Specifications ─── */}
      <section className="py-14 border-t border-neutral-100">
        <div className="container-page">
          <div className="flex items-end justify-between mb-7">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.1em] text-primary-700 mb-2">
                01 · Specification
              </div>
              <h2 className="font-display text-[28px] font-bold tracking-[-0.01em] leading-[1.2]">
                Everything the buyer needs to quote
              </h2>
            </div>
            {specSheetUrl && (
              <a
                href={specSheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-primary-700 no-underline hover:text-primary-800"
              >
                Download full spec sheet
                <ArrowRight size={14} weight="bold" />
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
            <SpecCard title="Product">
              {specs.length > 0 ? (
                <SpecTable rows={specs} />
              ) : (
                <p className="text-sm text-neutral-400 px-4 py-5">
                  No specifications on file.{" "}
                  <a href="/contact" className="text-primary-600 underline">
                    Contact us
                  </a>
                  .
                </p>
              )}
            </SpecCard>

            <SpecCard title="Packaging & logistics">
              <SpecTable rows={packaging} />
            </SpecCard>

            <SpecCard title="Certification & compliance">
              {certs.length > 0 ? (
                <div>
                  {certs.map((c) => (
                    <div
                      key={c.id}
                      className="flex gap-3 px-4 py-3.5 border-b border-neutral-100 last:border-b-0"
                    >
                      <div className="w-8 h-8 shrink-0 rounded-sm bg-primary-50 flex items-center justify-center">
                        <ShieldCheck
                          size={16}
                          className="text-primary-700"
                        />
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-neutral-900">
                          {c.name}
                        </div>
                        <div className="text-[11.5px] text-neutral-500 mt-0.5">
                          Documentation on file
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-400 px-4 py-5">
                  Compliance files available on request.{" "}
                  <a href="/contact" className="text-primary-600 underline">
                    Ask us
                  </a>
                  .
                </p>
              )}
            </SpecCard>
          </div>
        </div>
      </section>

      {/* ─── 02 Volume pricing ─── */}
      <section className="py-14 bg-neutral-50 border-t border-neutral-100">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.1em] text-primary-700 mb-2">
                02 · Volume pricing
              </div>
              <h2 className="font-display text-[28px] font-bold tracking-[-0.01em] leading-[1.2] mb-3">
                Ordering by the container?
              </h2>
              <p className="text-[14.5px] text-neutral-600 leading-[1.7] mb-5 max-w-[430px]">
                Container quantities are quoted individually — mixed SKUs, custom
                packing and consolidated loading are all supported.
              </p>
              <div className="flex flex-col gap-2.5 mb-6">
                {[
                  "Mixed containers — combine any Aquarium / Pet SKUs in one 20 GP or 40 HQ.",
                  "Custom carton printing — start at 500 pcs per SKU.",
                  "Price lock 30 days — quoted prices hold through your PO window.",
                ].map((t) => (
                  <div
                    key={t}
                    className="flex gap-2.5 items-start text-[13.5px] text-neutral-600"
                  >
                    <Check
                      size={16}
                      weight="bold"
                      className="text-primary-600 shrink-0 mt-0.5"
                    />
                    <span>
                      <strong className="font-semibold text-neutral-900">
                        {t.split(" — ")[0]}
                      </strong>
                      {t.includes(" — ") && ` — ${t.split(" — ").slice(1).join(" — ")}`}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2.5">
                <a
                  href="/contact"
                  className="h-11 px-5 inline-flex items-center justify-center text-sm font-semibold rounded-md bg-primary-500 text-neutral-0 hover:bg-primary-600 transition-colors no-underline"
                >
                  Request container quote
                </a>
                <a
                  href="/about"
                  className="h-11 px-5 inline-flex items-center justify-center text-sm font-semibold rounded-md bg-transparent text-primary-700 border border-primary-300 hover:bg-primary-50 transition-colors no-underline"
                >
                  Book a factory tour
                </a>
              </div>
            </div>

            <div>
              {product.tiers.length > 0 ? (
                <div className="bg-neutral-0 border border-neutral-100 rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-100">
                        <th className="text-left text-[11px] font-semibold uppercase tracking-[0.07em] text-neutral-500 px-4 py-3">
                          Quantity
                        </th>
                        <th className="text-right text-[11px] font-semibold uppercase tracking-[0.07em] text-neutral-500 px-4 py-3">
                          Unit price
                        </th>
                        <th className="text-right text-[11px] font-semibold uppercase tracking-[0.07em] text-neutral-500 px-4 py-3">
                          Tier
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.tiers.map((tier, i) => (
                        <tr
                          key={tier.id}
                          className={`border-b border-neutral-100 last:border-b-0 ${
                            i === 0 ? "bg-primary-50" : "bg-neutral-0"
                          }`}
                        >
                          <td className="px-4 py-3 text-[13.5px] text-neutral-700 tabular-nums">
                            {tier.min_quantity}+ pcs
                          </td>
                          <td className="px-4 py-3 text-[13.5px] font-semibold text-neutral-900 text-right tabular-nums">
                            {formatPrice(Number(tier.unit_price))}
                          </td>
                          <td className="px-4 py-3 text-[12px] text-neutral-500 text-right">
                            {tier.label ?? (i === 0 ? "Entry" : `Tier ${i + 1}`)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : product.min_price != null ? (
                <div className="bg-neutral-0 border border-neutral-100 rounded-md p-8 text-center">
                  <div className="text-[26px] font-bold text-neutral-900 tabular-nums">
                    From {formatPrice(product.min_price)}
                  </div>
                  <div className="text-sm text-neutral-400 mt-1">
                    per unit · FOB Shenzhen
                  </div>
                  <a
                    href="/contact"
                    className="mt-5 inline-flex h-10 px-5 items-center justify-center text-sm font-semibold rounded-md bg-primary-500 text-neutral-0 no-underline hover:bg-primary-600"
                  >
                    Request full price list
                  </a>
                </div>
              ) : (
                <div className="bg-neutral-0 border border-neutral-100 rounded-md p-8 text-center">
                  <p className="text-sm text-neutral-500">
                    Pricing on request — quoted within 24 hours.
                  </p>
                  <a
                    href="/contact"
                    className="mt-4 inline-flex h-10 px-5 items-center justify-center text-sm font-semibold rounded-md bg-primary-500 text-neutral-0 no-underline hover:bg-primary-600"
                  >
                    Request quote
                  </a>
                </div>
              )}
              <div className="flex justify-between mt-2.5 text-xs text-neutral-500">
                <span>FOB Shenzhen · USD</span>
                <span>Prices exclude freight &amp; duty</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 03 Customisation ─── */}
      <section className="py-14 border-t border-neutral-100">
        <div className="container-page">
          <div className="flex items-end justify-between mb-7">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.1em] text-primary-700 mb-2">
                03 · Customisation
              </div>
              <h2 className="font-display text-[28px] font-bold tracking-[-0.01em] leading-[1.2]">
                Make it your SKU
              </h2>
            </div>
            <a
              href="/oem"
              className="hidden sm:inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-primary-700 no-underline hover:text-primary-800"
            >
              OEM / ODM details
              <ArrowRight size={14} weight="bold" />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                no: "01",
                nm: "Logo & colour",
                d: "Laser logo on glass edge, custom silicone trim colour. MOQ 500 pcs.",
              },
              {
                no: "02",
                nm: "Packaging",
                d: "Printed carton, barcode, insert card, retail-ready sleeve. MOQ 500 pcs.",
              },
              {
                no: "03",
                nm: "New mould",
                d: "Custom dimensions or lid tooling. 5-day DFM review, 25-day T1 sample.",
              },
            ].map((c) => (
              <div
                key={c.no}
                className="border border-neutral-100 rounded-md p-5 bg-neutral-0"
              >
                <div className="font-mono text-[11.5px] text-primary-600 mb-2">
                  {c.no}
                </div>
                <div className="text-[15px] font-semibold mb-1">{c.nm}</div>
                <div className="text-[12.5px] text-neutral-500 leading-[1.6]">
                  {c.d}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 04 Related ─── */}
      {related.length > 0 && (
        <section className="py-14 bg-neutral-50 border-t border-neutral-100">
          <div className="container-page">
            <div className="flex items-end justify-between mb-7">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.1em] text-primary-700 mb-2">
                  04 · Also in {categoryName}
                </div>
                <h2 className="font-display text-[28px] font-bold tracking-[-0.01em] leading-[1.2]">
                  Buyers also quote
                </h2>
              </div>
              {categorySlug && (
                <a
                  href={`/${categorySlug}`}
                  className="hidden sm:inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-primary-700 no-underline hover:text-primary-800"
                >
                  All {categoryName.toLowerCase()}
                  <ArrowRight size={14} weight="bold" />
                </a>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Videos ─── */}
      {videos.length > 0 && (
        <section className="py-14 border-t border-neutral-100">
          <div className="container-page">
            <div className="mb-6">
              <div className="text-xs font-semibold uppercase tracking-[0.1em] text-primary-700 mb-2">
                In the factory
              </div>
              <h2 className="font-display text-[24px] font-bold tracking-[-0.01em]">
                Product video
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map((file) => (
                <figure key={file.id} className="m-0">
                  <video
                    controls
                    playsInline
                    preload="metadata"
                    src={file.url}
                    className="w-full aspect-video bg-neutral-900 rounded-md"
                  >
                    Your browser cannot play this video.
                  </video>
                  <figcaption className="flex items-center gap-2 text-sm text-neutral-500 mt-2">
                    <Play size={14} className="text-primary-600 shrink-0" />
                    {file.filename}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Downloads ─── */}
      {downloads.length > 0 && (
        <section className="py-14 bg-neutral-50 border-t border-neutral-100">
          <div className="container-page">
            <div className="mb-6">
              <div className="text-xs font-semibold uppercase tracking-[0.1em] text-primary-700 mb-2">
                Documents
              </div>
              <h2 className="font-display text-[24px] font-bold tracking-[-0.01em]">
                Downloads
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {downloads.map((file) => (
                <a
                  key={file.id}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-neutral-0 border border-neutral-100 rounded-md px-4 py-3 no-underline hover:border-primary-200 hover:shadow-sm transition-[box-shadow,border-color] duration-normal"
                >
                  <Download
                    size={20}
                    className="text-primary-600 shrink-0"
                  />
                  <div>
                    <div className="text-sm font-medium text-neutral-900">
                      {file.filename}
                    </div>
                    <div className="text-xs text-neutral-400">
                      {(file.size / 1024).toFixed(1)} KB · {file.aggregate_type}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

/* ─── Small presentational helpers ─── */

function SpecCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-neutral-0 border border-neutral-100 rounded-md overflow-hidden">
      <div className="px-4 py-3.5 border-b border-neutral-100 text-[12px] font-semibold uppercase tracking-[0.07em] text-neutral-500">
        {title}
      </div>
      {children}
    </div>
  );
}

function SpecTable({ rows }: { rows: SpecRow[] }) {
  return (
    <table className="w-full">
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={row.label}
            className={`border-b border-neutral-100 last:border-b-0 ${
              i % 2 === 1 ? "bg-neutral-50/60" : "bg-neutral-0"
            }`}
          >
            <td className="py-2.5 px-4 text-[13px] text-neutral-500 w-[44%]">
              {row.label}
            </td>
            <td className="py-2.5 px-4 text-[13px] font-medium text-neutral-900 tabular-nums">
              {row.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
