import type { Metadata } from "next";
import { Package } from "@phosphor-icons/react/dist/ssr";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import {
  fetchCategoryBySlug,
  fetchProductsByCategory,
  fetchCategoryTree,
  type ProductListItem,
  type CategoryTree,
} from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Aquarium Supplies",
  description:
    "Wholesale aquarium supplies: filters, pumps, LED lighting, tanks, CO₂ systems. OEM available. ISO-certified factory.",
};

export default async function AquariumPage() {
  // Fetch aquarium category and its children
  const aquarium = await fetchCategoryBySlug("aquarium").catch(() => null);
  const categoryTree = await fetchCategoryTree().catch(() => [] as CategoryTree[]);

  // Get subcategories for the aquarium branch
  const aquariumNode = categoryTree.find((c) => c.slug === "aquarium");
  const subcategories: CategoryTree[] = aquariumNode?.children ?? [];

  // Fetch products for the aquarium category (or all published if category not found)
  let products: ProductListItem[] = [];
  if (aquarium) {
    const res = await fetchProductsByCategory(aquarium.id, 1, 12).catch(() => null);
    products = res?.result ?? [];
  }

  return (
    <>
      {/* Hero */}
      <section className="section-hero pt-16 pb-14 bg-linear-to-br from-primary-50 via-primary-100 to-neutral-0 text-center">
        <div className="container-page">
          <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary-600 mb-3">
            Product Directory
          </div>
          <h1 className="font-display text-[clamp(28px,4vw,44px)] font-bold text-neutral-900 leading-tight tracking-[-0.02em] mb-3">
            {aquarium?.name ?? "Aquarium Supplies"}
          </h1>
          <p className="text-base text-neutral-500 max-w-[480px] mx-auto leading-relaxed">
            {aquarium?.description ??
              "Filters, pumps, LED lighting, tanks, CO₂ systems, substrates, décor — all from our ISO-certified factory."}
          </p>
        </div>
      </section>

      <div className="container-page">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: aquarium?.name ?? "Aquarium" }]}
        />

        {/* Filter bar */}
        <div className="flex items-center gap-3 py-4 border-b border-neutral-100 mb-8 flex-wrap">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-[0.08em]">
            Filter
          </span>
          <select
            className="h-9 px-3 border border-neutral-200 rounded-md text-[13px] text-neutral-700 bg-neutral-0 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 min-w-[140px]"
            defaultValue=""
          >
            <option value="">All Categories</option>
            {subcategories.map((sc) => (
              <option key={sc.id} value={sc.slug}>
                {sc.name}
              </option>
            ))}
          </select>
          <select className="h-9 px-3 border border-neutral-200 rounded-md text-[13px] text-neutral-700 bg-neutral-0 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 min-w-[140px]">
            <option>Sort: Featured</option>
            <option>MOQ: Low to High</option>
            <option>MOQ: High to Low</option>
            <option>Newest First</option>
          </select>
          <span className="ml-auto text-[13px] text-neutral-400">
            {products.length} products
          </span>
        </div>
      </div>

      {/* Product grid */}
      <section className="section-products pb-20">
        <div className="container-page">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-neutral-400">
              <Package size={48} className="mx-auto mb-4 text-neutral-200" />
              <p className="text-[15px]">
                No products found in this category yet.
              </p>
              <p className="text-sm mt-1">
                Check back soon or{" "}
                <a href="/contact" className="text-primary-600 underline">
                  contact us
                </a>{" "}
                for sourcing inquiries.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Subcategory links */}
      {subcategories.length > 0 && (
        <section className="section-subcategories py-20 bg-neutral-50">
          <div className="container-page">
            <h2 className="font-display text-[clamp(20px,2.5vw,28px)] font-bold text-neutral-900 mb-8 tracking-[-0.02em]">
              Browse by Subcategory
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {subcategories.map((sc) => (
                <a
                  key={sc.id}
                  href={`/aquarium?category=${sc.slug}`}
                  className="bg-neutral-0 border border-neutral-100 rounded-md p-4 no-underline text-center hover:border-primary-200 hover:shadow-sm transition-[box-shadow,border-color] duration-normal"
                >
                  <div className="text-[14px] font-semibold text-neutral-800 mb-1">
                    {sc.name}
                  </div>
                  <div className="text-xs text-neutral-400">
                    {sc.children.length > 0
                      ? `${sc.children.length} subcategories`
                      : "View products"}
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
