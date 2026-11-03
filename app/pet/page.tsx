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
  title: "Pet Products",
  description:
    "Wholesale pet products: beds, toys, grooming tools, feeders, carriers, accessories. OEM available. ISO-certified.",
};

function flattenPetCategories(
  categories: CategoryTree[],
  depth = 0,
): { category: CategoryTree; depth: number }[] {
  return categories.flatMap((category) => [
    { category, depth },
    ...flattenPetCategories(category.children, depth + 1),
  ]);
}

export default async function PetPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const { category: categorySlug, page: pageParam } = await searchParams;
  const requestedPage = Number(pageParam);
  const currentPage = Number.isInteger(requestedPage) && requestedPage > 0
    ? requestedPage
    : 1;
  const categoryTree = await fetchCategoryTree().catch(() => [] as CategoryTree[]);
  const petNode = categoryTree.find((category) => category.slug === "pet-products");
  const petCategory = petNode
    ?? await fetchCategoryBySlug("pet-products").catch(() => null);
  const subcategories: CategoryTree[] = petNode?.children ?? [];
  const categoryOptions = flattenPetCategories(subcategories);
  const selectedNode = categoryOptions.find(({ category }) => category.slug === categorySlug)?.category
    ?? petNode;
  const selectedCategory = selectedNode ?? petCategory;
  const browseCategories = selectedNode?.children ?? [];

  let products: ProductListItem[] = [];
  let totalProducts = 0;
  let lastPage = 1;
  if (selectedCategory) {
    const res = await fetchProductsByCategory(selectedCategory.id, currentPage, 24).catch(() => null);
    products = res?.result ?? [];
    totalProducts = res?.total ?? 0;
    lastPage = res?.last_page ?? 1;
  }
  const categoryUrl = (page: number) =>
    `/pet?category=${selectedCategory?.slug ?? "pet-products"}&page=${page}`;

  return (
    <>
      {/* Hero */}
      <section className="section-hero pt-16 pb-14 bg-linear-to-br from-accent-100/40 to-neutral-0 text-center">
        <div className="container-page">
          <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary-600 mb-3">
            Product Directory
          </div>
          <h1 className="font-display text-[clamp(28px,4vw,44px)] font-bold text-neutral-900 leading-tight tracking-[-0.02em] mb-3">
            {selectedCategory?.name ?? "Pet Products"}
          </h1>
          <p className="text-base text-neutral-500 max-w-[480px] mx-auto leading-relaxed">
            {selectedCategory?.description ??
              `Browse ${selectedCategory?.name.toLowerCase() ?? "pet products"} for wholesale sourcing and add products to your inquiry.`}
          </p>
        </div>
      </section>

      <div className="container-page">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            ...(selectedCategory?.slug !== "pet-products"
              ? [{ label: "Pet Products", href: "/pet" }]
              : []),
            { label: selectedCategory?.name ?? "Pet Products" },
          ]}
        />

        {/* Filter bar */}
        <div className="flex items-center gap-3 py-4 border-b border-neutral-100 mb-8 flex-wrap">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-[0.08em]">
            Filter
          </span>
          <form action="/pet" className="flex items-center gap-2">
            <select
              name="category"
              className="h-9 px-3 border border-neutral-200 rounded-md text-[13px] text-neutral-700 bg-neutral-0 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 min-w-[140px]"
              defaultValue={selectedCategory?.slug ?? "pet-products"}
              aria-label="Pet category"
            >
              <option value="pet-products">All Pet Products</option>
              {categoryOptions.map(({ category, depth }) => (
                <option key={category.id} value={category.slug}>
                  {"  ".repeat(depth)}{category.name}
                </option>
              ))}
            </select>
            <button type="submit" className="h-9 px-3 rounded-md bg-primary-500 text-neutral-0 text-[13px] font-medium cursor-pointer hover:bg-primary-600">
              Apply
            </button>
          </form>
          <select className="h-9 px-3 border border-neutral-200 rounded-md text-[13px] text-neutral-700 bg-neutral-0 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 min-w-[140px]">
            <option>Sort: Featured</option>
            <option>MOQ: Low to High</option>
            <option>MOQ: High to Low</option>
            <option>Newest First</option>
          </select>
          <span className="ml-auto text-[13px] text-neutral-400">
            {totalProducts} {totalProducts === 1 ? "product" : "products"}
          </span>
        </div>
      </div>

      {/* Product grid */}
      <section className="section-products pb-20">
        <div className="container-page">
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {lastPage > 1 && (
                <nav aria-label="Product pages" className="flex items-center justify-center gap-4 mt-9 text-sm">
                  {currentPage > 1 && (
                    <a href={categoryUrl(currentPage - 1)} className="text-primary-700 hover:underline">Previous</a>
                  )}
                  <span className="text-neutral-500">Page {currentPage} of {lastPage}</span>
                  {currentPage < lastPage && (
                    <a href={categoryUrl(currentPage + 1)} className="text-primary-700 hover:underline">Next</a>
                  )}
                </nav>
              )}
            </>
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
      {browseCategories.length > 0 && (
        <section className="section-subcategories py-20 bg-neutral-50">
          <div className="container-page">
            <h2 className="font-display text-[clamp(20px,2.5vw,28px)] font-bold text-neutral-900 mb-8 tracking-[-0.02em]">
              Browse by Subcategory
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {browseCategories.map((sc) => (
                <a
                  key={sc.id}
                  href={`/pet?category=${sc.slug}`}
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
