"use client";

import { useEffect, useRef, useState } from "react";
import { MagnifyingGlass, Package, X } from "@phosphor-icons/react";
import type { ProductListItem } from "@/lib/api";

export default function NavSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch suggestions (empty query) or search results, debounced.
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(query.trim())}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data: ProductListItem[]) => setResults(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, query ? 200 : 0);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [open, query]);

  // Focus input on open; close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onPointerDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setQuery("");
  };
  const trimmed = query.trim();

  return (
    <div ref={wrapRef} className="relative">
      <button
        aria-label="Search products"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-transparent text-neutral-600 cursor-pointer hover:text-primary-600 hover:bg-neutral-50 transition-colors"
      >
        <MagnifyingGlass size={18} weight="regular" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[360px] bg-neutral-0 border border-neutral-200 rounded-lg shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-neutral-100">
            <MagnifyingGlass size={16} className="text-neutral-400 shrink-0" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && trimmed) {
                  window.location.href = `/search?q=${encodeURIComponent(trimmed)}`;
                }
              }}
              placeholder="Search products or SKU"
              aria-label="Search products"
              className="flex-1 h-7 bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 outline-none"
            />
            <button
              onClick={close}
              aria-label="Close search"
              className="p-0.5 text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          {!trimmed && (
            <div className="px-3 pt-2.5 pb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400">
              Top rated products
            </div>
          )}

          <div className="max-h-[320px] overflow-y-auto">
            {loading && results.length === 0 ? (
              <p className="px-3 py-6 text-center text-[13px] text-neutral-400">
                Searching…
              </p>
            ) : results.length === 0 ? (
              <div className="px-3 py-6 text-center text-[13px] text-neutral-400">
                <Package size={28} className="mx-auto mb-2 text-neutral-200" />
                {trimmed ? `No products match “${trimmed}”.` : "No products yet."}
              </div>
            ) : (
              <ul className="list-none p-1.5 m-0">
                {results.map((product) => {
                  const slug = product.slug ?? `pp-${product.id}`;
                  const image =
                    product.images.find((img) => img.featured)?.url ??
                    product.images[0]?.url ??
                    product.featured_image;
                  return (
                    <li key={product.id}>
                      <a
                        href={`/products/${slug}`}
                        onClick={close}
                        className="flex items-center gap-3 p-2 rounded-md no-underline hover:bg-neutral-50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-sm bg-neutral-50 shrink-0 overflow-hidden flex items-center justify-center">
                          {image ? (
                            <img
                              src={image}
                              alt=""
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <Package size={18} className="text-neutral-300" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-medium text-neutral-800 line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-xs text-neutral-400 line-clamp-1">
                            {product.categories[0]?.name ?? "Product"} · MOQ{" "}
                            {product.moq} pcs
                          </p>
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {trimmed && (
            <a
              href={`/search?q=${encodeURIComponent(trimmed)}`}
              onClick={close}
              className="block px-3 py-2.5 border-t border-neutral-100 text-center text-[13px] font-medium text-primary-600 no-underline hover:bg-primary-50 transition-colors"
            >
              View all results for “{trimmed}”
            </a>
          )}
        </div>
      )}
    </div>
  );
}
