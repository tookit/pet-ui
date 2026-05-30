"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Package,
  X,
  Plus,
  Check,
  ArrowRight,
  Eye,
} from "@phosphor-icons/react";
import type { ProductListItem, ProductDetail } from "@/lib/api";
import { useInquiry } from "@/lib/inquiry";

/* ─── Quick‑View Modal ─── */

function QuickViewModal({
  slug,
  productName,
  isOpen,
  onClose,
}: {
  slug: string;
  productName: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const fetchingRef = useRef(false);
  const { items, addItem, removeItem } = useInquiry();

  const isInList = items.some((i) => i.slug === slug);

  // Fetch product detail when modal opens.  Uses a ref guard so
  // React StrictMode double‑mount in dev doesn't cancel the fetch.
  useEffect(() => {
    if (!isOpen) {
      // Reset when closed so it re‑fetches on next open
      fetchingRef.current = false;
      setDetail(null);
      setError(false);
      return;
    }

    if (fetchingRef.current) return;
    fetchingRef.current = true;

    let cancelled = false;
    setLoading(true);
    setError(false);
    setDetail(null);

    fetch(`/api/products/${encodeURIComponent(slug)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setDetail(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, slug]);

  // Esc to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAdd = () => {
    addItem({
      productId: detail?.id ?? 0,
      slug,
      name: detail?.name ?? productName,
      imageUrl:
        detail?.images[0]?.url ?? detail?.featured_image ?? undefined,
      moq: detail?.moq ?? 1,
    });
  };

  const imageUrl =
    detail?.images.find((img) => img.featured)?.url ??
    detail?.images[0]?.url ??
    detail?.featured_image;

  const categoryName = detail?.categories[0]?.name;

  return (
    <div
      className="fixed inset-0 z-300 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${productName}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-neutral-0 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-neutral-0/90 border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:border-neutral-300 transition-colors cursor-pointer"
          onClick={onClose}
          aria-label="Close quick view"
        >
          <X size={16} weight="bold" />
        </button>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
          </div>
        )}

        {error && !detail && !loading && (
          <div className="text-center py-24 text-neutral-400">
            <Package size={48} className="mx-auto mb-3 text-neutral-200" />
            <p className="text-[15px]">Could not load product details.</p>
            <button
              className="mt-2 text-sm text-primary-600 underline cursor-pointer"
              onClick={() => {
                fetchingRef.current = false;
                setError(false);
              }}
            >
              Try again
            </button>
          </div>
        )}

        {detail && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image */}
            <div className="aspect-4/3 md:aspect-auto bg-neutral-50 rounded-l-lg overflow-hidden flex items-center justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={detail.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package size={80} className="text-neutral-200" />
              )}
            </div>

            {/* Info */}
            <div className="p-6 md:pl-0 flex flex-col gap-4">
              {categoryName && (
                <div className="text-[11px] font-medium text-primary-600 uppercase tracking-[0.06em]">
                  {categoryName}
                </div>
              )}
              <h3 className="font-display text-xl font-bold text-neutral-900 leading-tight tracking-[-0.02em]">
                {detail.name}
              </h3>

              {(detail.short_description ?? detail.description) && (
                <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3">
                  {detail.short_description ?? detail.description}
                </p>
              )}

              {/* Specs summary */}
              {detail.props.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {detail.props.slice(0, 4).map((prop, i) => (
                    <span
                      key={prop.id || i}
                      className="inline-flex text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-sm"
                    >
                      {prop.name}: {prop.value}
                      {prop.unit ? ` ${prop.unit}` : ""}
                    </span>
                  ))}
                </div>
              )}

              {/* Price tiers */}
              {detail.tiers.length > 0 && (
                <div className="bg-neutral-50 rounded-md p-3">
                  <div className="text-xs font-semibold text-neutral-500 uppercase tracking-[0.06em] mb-2">
                    Wholesale Pricing
                  </div>
                  <div className="space-y-1">
                    {detail.tiers.slice(0, 3).map((tier) => (
                      <div
                        key={tier.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-neutral-500">
                          {tier.min_quantity}+ pcs
                        </span>
                        <span className="font-semibold text-neutral-900">
                          ${Number(tier.unit_price).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MOQ */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-neutral-500">MOQ:</span>
                <span className="font-semibold text-neutral-900">
                  {detail.moq} pcs
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-neutral-100">
                {isInList ? (
                  <button
                    className="inline-flex items-center gap-1.5 h-10 px-4 text-sm font-medium bg-primary-100 text-primary-700 rounded-md cursor-pointer hover:bg-primary-200 transition-colors"
                    onClick={() => removeItem(slug)}
                  >
                    <Check size={16} />
                    In Inquiry List
                  </button>
                ) : (
                  <button
                    className="inline-flex items-center gap-1.5 h-10 px-4 text-sm font-medium bg-primary-500 text-neutral-0 rounded-md cursor-pointer hover:bg-primary-600 transition-colors"
                    onClick={handleAdd}
                  >
                    <Plus size={16} />
                    Add to Inquiry
                  </button>
                )}
                <a
                  href={`/products/${slug}`}
                  className="inline-flex items-center gap-1 h-10 px-4 text-sm font-medium text-neutral-600 border border-neutral-200 rounded-md no-underline hover:bg-neutral-50 transition-colors"
                >
                  Full Details
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Product Card ─── */

export default function ProductCard({
  product,
}: {
  product: ProductListItem;
}) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const { items, addItem, removeItem } = useInquiry();
  const slug = product.slug ?? `pp-${product.id}`;

  const imageUrl =
    product.images.find((img) => img.featured)?.url ??
    product.images[0]?.url ??
    product.featured_image;

  const categoryName = product.categories[0]?.name;
  const isInList = items.some((i) => i.slug === slug);

  const handleAddToInquiry = () => {
    if (isInList) {
      removeItem(slug);
    } else {
      addItem({
        productId: product.id,
        slug,
        name: product.name,
        imageUrl: imageUrl ?? undefined,
        moq: product.moq,
      });
    }
  };

  return (
    <>
      {/* Card */}
      <div className="group bg-neutral-0 border border-neutral-100 rounded-md overflow-hidden transition-[box-shadow,border-color] duration-normal hover:shadow-md hover:border-neutral-200">
        {/* Image — click navigates to detail page */}
        <Link
          href={`/products/${slug}`}
          className="block no-underline"
          aria-label={product.name}
        >
          <div className="w-full aspect-3/2 bg-neutral-50 flex items-center justify-center relative">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
                loading="lazy"
              />
            ) : (
              <Package size={56} className="text-neutral-200" />
            )}
          </div>
        </Link>

        <div className="p-4">
          {categoryName && (
            <div className="text-[11px] font-medium text-primary-600 uppercase tracking-[0.06em] mb-1.5">
              {categoryName}
            </div>
          )}
          <Link
            href={`/products/${slug}`}
            className="no-underline"
          >
            <h3 className="text-[15px] font-semibold text-neutral-900 mb-1 group-hover:text-primary-700 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-neutral-100 flex items-center justify-between gap-2">
          <span className="text-xs text-neutral-500 shrink-0">
            MOQ{" "}
            <strong className="text-neutral-800 font-semibold">
              {product.moq} pcs
            </strong>
          </span>
          <div className="flex items-center gap-1.5">
            {/* Quick View button */}
            <button
              className="inline-flex items-center gap-1 h-8 px-2.5 text-xs font-medium text-neutral-500 border border-neutral-200 rounded-md cursor-pointer hover:text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition-[background,color,border-color] duration-fast"
              onClick={() => setQuickViewOpen(true)}
              aria-label={`Quick view: ${product.name}`}
            >
              <Eye size={14} />
              Quick View
            </button>

            {/* Inquire / Add to list */}
            {isInList ? (
              <button
                className="inline-flex items-center gap-1 h-8 px-2.5 text-xs font-medium bg-primary-100 text-primary-700 rounded-md cursor-pointer hover:bg-primary-200 transition-colors"
                onClick={handleAddToInquiry}
              >
                <Check size={14} />
                In List
              </button>
            ) : (
              <button
                className="inline-flex items-center gap-1 h-8 px-2.5 text-xs font-medium bg-primary-500 text-neutral-0 rounded-md cursor-pointer hover:bg-primary-600 transition-colors"
                onClick={handleAddToInquiry}
              >
                <Plus size={14} />
                Inquire
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick‑view modal */}
      <QuickViewModal
        slug={slug}
        productName={product.name}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}
