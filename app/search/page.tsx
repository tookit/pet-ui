import type { Metadata } from "next";
import { MagnifyingGlass, Package } from "@phosphor-icons/react/dist/ssr";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import { fetchProductsBySearch, type ProductListItem } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search Products",
  description: "Search wholesale aquarium and pet products by name or SKU.",
  robots: { index: false },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q: qParam, page: pageParam } = await searchParams;
  const query = (qParam ?? "").trim();
  const requestedPage = Number(pageParam);
  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  let products: ProductListItem[] = [];
  let total = 0;
  let lastPage = 1;
  if (query) {
    const res = await fetchProductsBySearch(query, currentPage, 24).catch(
      () => null,
    );
    products = res?.result ?? [];
    total = res?.total ?? 0;
    lastPage = res?.last_page ?? 1;
  }

  const pageUrl = (page: number) =>
    `/search?q=${encodeURIComponent(query)}&page=${page}`;

  return (
    <>
      <section className="section-hero pt-16 pb-12 bg-linear-to-br from-primary-50 via-primary-100 to-neutral-0 text-center">
        <div className="container-page">
          <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary-600 mb-3">
            Product Search
          </div>
          <h1 className="font-display text-[clamp(28px,4vw,44px)] font-bold text-neutral-900 leading-tight tracking-[-0.02em] mb-6">
            Find products for your next order
          </h1>
          <form
            action="/search"
            className="flex items-center gap-2 max-w-xl mx-auto"
            role="search"
          >
            <div className="relative flex-1">
              <MagnifyingGlass
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search by product name or SKU"
                aria-label="Search products"
                className="w-full h-11 pl-10 pr-3 border border-neutral-200 rounded-md bg-neutral-0 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <button
              type="submit"
              className="h-11 px-5 rounded-md bg-primary-500 text-neutral-0 text-sm font-medium cursor-pointer hover:bg-primary-600 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-page">
          <Breadcrumb
            items={[{ label: "Home", href: "/" }, { label: "Search" }]}
          />

          {query && (
            <p className="text-[13px] text-neutral-500 mb-6">
              {total} {total === 1 ? "product" : "products"} found for{" "}
              <span className="font-semibold text-neutral-800">“{query}”</span>
            </p>
          )}

          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {lastPage > 1 && (
                <nav
                  aria-label="Search result pages"
                  className="flex items-center justify-center gap-4 mt-9 text-sm"
                >
                  {currentPage > 1 && (
                    <a href={pageUrl(currentPage - 1)} className="text-primary-700 hover:underline">
                      Previous
                    </a>
                  )}
                  <span className="text-neutral-500">
                    Page {currentPage} of {lastPage}
                  </span>
                  {currentPage < lastPage && (
                    <a href={pageUrl(currentPage + 1)} className="text-primary-700 hover:underline">
                      Next
                    </a>
                  )}
                </nav>
              )}
            </>
          ) : (
            <div className="text-center py-16 text-neutral-400">
              <Package size={48} className="mx-auto mb-4 text-neutral-200" />
              <p className="text-[15px]">
                {query
                  ? `No products match “${query}”.`
                  : "Enter a product name or SKU to start searching."}
              </p>
              <p className="text-sm mt-1">
                Try a different keyword, or{" "}
                <a href="/contact" className="text-primary-600 underline">
                  ask our team
                </a>{" "}
                for a sourcing quote.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
