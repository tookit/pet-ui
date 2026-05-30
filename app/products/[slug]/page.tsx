import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Package, Download, Certificate } from "@phosphor-icons/react/dist/ssr";
import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import { InquiryForm } from "./InquiryForm";
import { fetchProductBySlug, type ProductDetail } from "@/lib/api";

/* ─── Helpers ─── */

function formatPrice(cents: number | null | undefined): string {
  if (cents == null) return "—";
  return `$${Number(cents).toFixed(2)}`;
}

function imageUrl(product: ProductDetail): string | null {
  const featured = product.images.find((img) => img.featured);
  if (featured) return featured.url;
  if (product.images.length > 0) return product.images[0].url;
  if (product.featured_image) return product.featured_image;
  return null;
}

function specsFromProduct(
  product: ProductDetail,
): { label: string; value: string }[] {
  const specs: { label: string; value: string }[] = [];

  if (product.sku) specs.push({ label: "SKU", value: product.sku });
  if (product.weight != null)
    specs.push({ label: "Weight", value: `${product.weight} kg` });
  if (product.dimensions) {
    const d = product.dimensions as Record<string, unknown>;
    const parts = [d.length, d.width, d.height].filter(Boolean).join(" × ");
    if (parts) specs.push({ label: "Dimensions", value: `${parts} mm` });
  }

  // Product props from the API (attribute values)
  for (const prop of product.props) {
    if (prop.value) {
      specs.push({
        label: prop.name,
        value: prop.unit ? `${prop.value} ${prop.unit}` : prop.value,
      });
    }
  }

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

  if (!product) {
    return { title: "Product Not Found" };
  }

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

  if (!product) {
    notFound();
  }

  const mainImage = imageUrl(product);
  const specs = specsFromProduct(product);
  const categoryName =
    product.categories[0]?.name ?? "Products";
  const categorySlug = product.categories[0]?.slug;

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

      {/* Product layout */}
      <section className="pb-20">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Gallery */}
            <div className="flex flex-col gap-3">
              <div className="w-full aspect-4/3 bg-neutral-50 rounded-md flex items-center justify-center border border-neutral-100 overflow-hidden">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package size={120} className="text-neutral-200" />
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <div
                      key={img.id}
                      className={`w-20 h-15 bg-neutral-50 rounded-sm border-2 flex items-center justify-center overflow-hidden cursor-pointer transition-colors ${
                        img.featured
                          ? "border-primary-400"
                          : "border-neutral-100 hover:border-primary-400"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`${product.name} image ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="flex flex-col gap-6">
              <div>
                <div className="text-[11px] font-medium text-primary-600 uppercase tracking-[0.06em] mb-1.5">
                  {categoryName}
                </div>
                <h1 className="font-display text-[clamp(24px,3vw,32px)] font-bold text-neutral-900 leading-tight tracking-[-0.02em]">
                  {product.name}
                </h1>
              </div>

              {(product.description || product.short_description) && (
                <p className="text-[15px] text-neutral-500 leading-relaxed">
                  {product.short_description ?? product.description}
                </p>
              )}

              {/* MOQ highlight */}
              <div className="bg-primary-50 border border-primary-200 rounded-md p-4">
                <div className="text-[13px] font-semibold text-primary-800 mb-1">
                  Minimum Order Quantity
                </div>
                <div className="text-2xl font-bold text-neutral-900">
                  {product.moq}{" "}
                  <span className="text-base font-normal text-neutral-500">
                    pieces
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <InquiryForm productId={product.id} slug={slug} name={product.name} moq={product.moq} />
                <Button variant="secondary" size="lg" href="#">
                  <Download size={16} />
                  Download Spec Sheet
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specs + Pricing */}
      <section className="py-20 bg-neutral-50">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Specifications */}
            <div>
              <h2 className="font-display text-[clamp(20px,2vw,24px)] font-bold text-neutral-900 mb-6 tracking-[-0.02em]">
                Technical Specifications
              </h2>
              {specs.length > 0 ? (
                <table className="w-full text-sm">
                  <tbody>
                    {specs.map((spec, i) => (
                      <tr
                        key={spec.label}
                        className={`${
                          i % 2 === 0 ? "bg-neutral-100/50" : "bg-neutral-0"
                        }`}
                      >
                        <td className="py-2.5 px-4 font-medium text-neutral-700 w-1/3">
                          {spec.label}
                        </td>
                        <td className="py-2.5 px-4 text-neutral-500">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-neutral-400">
                  No specifications available.{" "}
                  <a href="/contact" className="text-primary-600 underline">
                    Contact us
                  </a>{" "}
                  for detailed specs.
                </p>
              )}
            </div>

            {/* Pricing tiers */}
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="font-display text-[clamp(20px,2vw,24px)] font-bold text-neutral-900 mb-6 tracking-[-0.02em]">
                  Wholesale Pricing Tiers
                </h2>
                {product.tiers.length > 0 ? (
                  <div className="border border-neutral-200 rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-neutral-900 text-neutral-0">
                          <th className="py-3 px-4 text-left font-semibold">
                            Order Quantity
                          </th>
                          <th className="py-3 px-4 text-left font-semibold">
                            Unit Price (FOB)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.tiers.map((tier, i) => (
                          <tr
                            key={tier.id}
                            className={
                              i % 2 === 0 ? "bg-neutral-50" : "bg-neutral-0"
                            }
                          >
                            <td className="py-2.5 px-4 text-neutral-700">
                              {tier.min_quantity}+ pcs
                              {tier.label && (
                                <span className="text-xs text-neutral-400 ml-1">
                                  ({tier.label})
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-4 font-semibold text-neutral-900">
                              {formatPrice(tier.unit_price)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : product.min_price != null ? (
                  <div className="bg-neutral-0 border border-neutral-100 rounded-md p-6 text-center">
                    <div className="text-2xl font-bold text-neutral-900">
                      From {formatPrice(product.min_price)}
                    </div>
                    <div className="text-sm text-neutral-400 mt-1">
                      per unit (FOB)
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-neutral-400">
                    Contact us for pricing information.
                  </p>
                )}
              </div>

              {/* Packaging (dimensions from product data) */}
              {product.dimensions && (
                <div>
                  <h2 className="font-display text-[clamp(20px,2vw,24px)] font-bold text-neutral-900 mb-6 tracking-[-0.02em]">
                    Packaging &amp; Logistics
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {product.weight != null && (
                      <div className="bg-neutral-0 border border-neutral-100 rounded-md p-3">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400 mb-1">
                          Unit Weight
                        </div>
                        <div className="text-sm font-medium text-neutral-900">
                          {product.weight} kg
                        </div>
                      </div>
                    )}
                    {product.dimensions &&
                      Object.entries(
                        product.dimensions as Record<string, unknown>,
                      ).map(([key, value]) => (
                        <div
                          key={key}
                          className="bg-neutral-0 border border-neutral-100 rounded-md p-3"
                        >
                          <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400 mb-1">
                            {key
                              .replace(/([A-Z0-9])/g, " $1")
                              .replace(/^./, (c) => c.toUpperCase())
                              .trim()}
                          </div>
                          <div className="text-sm font-medium text-neutral-900">
                            {String(value)}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications (from tags or attrs) */}
      {product.tags.length > 0 && (
        <section className="py-20">
          <div className="container-page">
            <h2 className="font-display text-[clamp(20px,2vw,24px)] font-bold text-neutral-900 mb-6 tracking-[-0.02em]">
              Certifications &amp; Tags
            </h2>
            <div className="flex gap-4 flex-wrap">
              {product.tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center gap-3 bg-neutral-0 border border-neutral-100 rounded-md px-5 py-3"
                >
                  <Certificate size={24} className="text-primary-600" />
                  <div>
                    <div className="text-sm font-semibold text-neutral-900">
                      {tag.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Files (downloadable assets) */}
      {product.files.length > 0 && (
        <section className="py-20 bg-neutral-50">
          <div className="container-page">
            <h2 className="font-display text-[clamp(20px,2vw,24px)] font-bold text-neutral-900 mb-6 tracking-[-0.02em]">
              Downloads
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {product.files.map((file) => (
                <a
                  key={file.id}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-neutral-0 border border-neutral-100 rounded-md px-4 py-3 no-underline hover:border-primary-200 hover:shadow-sm transition-[box-shadow,border-color] duration-normal"
                >
                  <Download size={20} className="text-primary-600 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-neutral-900">
                      {file.name}
                    </div>
                    <div className="text-xs text-neutral-400">
                      {(file.size / 1024).toFixed(1)} KB · {file.type}
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
