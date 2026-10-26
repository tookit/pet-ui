"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { ProductListItem } from "@/lib/api";

const filters = [
  { id: "all", label: "All Products" },
  { id: "aquarium", label: "Aquariums" },
  { id: "aquarium-filters", label: "Filters" },
  { id: "aquarium-decor", label: "Decor" },
] as const;

type FilterId = (typeof filters)[number]["id"];

export default function HomeProductCatalog({
  products,
}: {
  products: ProductListItem[];
}) {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const visibleProducts =
    activeFilter === "all"
      ? products
      : products.filter((product) =>
          product.categories.some((category) => category.slug === activeFilter),
        );

  return (
    <>
      <div className="flex flex-wrap gap-1 border border-neutral-200 rounded-md p-1 bg-neutral-0 w-fit mt-6 lg:mt-[-38px] lg:ml-auto" aria-label="Filter homepage products">
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            aria-pressed={activeFilter === filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`h-9 px-3 sm:px-4 rounded-sm text-[13px] font-medium cursor-pointer transition-colors duration-fast ${
              activeFilter === filter.id
                ? "bg-primary-500 text-neutral-0"
                : "text-neutral-600 hover:bg-primary-50 hover:text-primary-700"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mt-7">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} compact />
        ))}
      </div>

      {visibleProducts.length === 0 && (
        <p className="py-12 text-center text-sm text-neutral-500">
          No products in this selection yet. Choose another category above.
        </p>
      )}
    </>
  );
}
