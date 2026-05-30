"use client";

import { useEffect, useRef } from "react";
import {
  X,
  Trash,
  Minus,
  Plus,
  Package,
  PaperPlaneTilt,
} from "@phosphor-icons/react";
import { useInquiry } from "@/lib/inquiry";

export default function QuoteDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearAll,
    count,
    isDrawerOpen,
    closeDrawer,
  } = useInquiry();
  const panelRef = useRef<HTMLDivElement>(null);

  // Esc to close
  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isDrawerOpen, closeDrawer]);

  // Lock body scroll when open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-200 bg-neutral-950/50 transition-opacity duration-normal ${
          isDrawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
      />

      {/* Drawer panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 bottom-0 z-210 w-full sm:w-96 bg-neutral-0 shadow-xl flex flex-col transition-transform duration-normal ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-neutral-100 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">
              Quote Request
            </h2>
            <p className="text-xs text-neutral-400">
              {count} {count === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
            onClick={closeDrawer}
            aria-label="Close drawer"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Item list */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <Package size={48} className="text-neutral-200 mb-4" />
              <p className="text-[15px] font-medium text-neutral-600 mb-1">
                Your inquiry list is empty
              </p>
              <p className="text-sm text-neutral-400">
                Browse products and add items to request a wholesale quote.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {items.map((item) => (
                <li key={item.slug} className="p-4 flex gap-3">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 bg-neutral-50 rounded-md border border-neutral-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <Package size={24} className="text-neutral-300" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <a
                      href={`/products/${item.slug}`}
                      className="text-sm font-medium text-neutral-900 no-underline hover:text-primary-600 transition-colors line-clamp-2"
                      onClick={closeDrawer}
                    >
                      {item.name}
                    </a>

                    <div className="flex items-center gap-3 mt-2">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-neutral-200 rounded-md h-8">
                        <button
                          className="w-7 h-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-colors cursor-pointer rounded-l-md"
                          onClick={() =>
                            updateQuantity(item.slug, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} weight="bold" />
                        </button>
                        <input
                          type="number"
                          className="w-12 h-full text-center text-xs font-medium text-neutral-900 border-x border-neutral-200 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          value={item.quantity}
                          min={1}
                          onChange={(e) => {
                            const v = parseInt(e.target.value, 10);
                            if (!isNaN(v)) updateQuantity(item.slug, v);
                          }}
                        />
                        <button
                          className="w-7 h-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-colors cursor-pointer rounded-r-md"
                          onClick={() =>
                            updateQuantity(item.slug, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} weight="bold" />
                        </button>
                      </div>

                      {/* MOQ hint */}
                      {item.moq && item.moq > 0 && (
                        <span className="text-[11px] text-neutral-400">
                          MOQ {item.moq}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    className="p-1 text-neutral-300 hover:text-red-500 transition-colors cursor-pointer shrink-0 self-start"
                    onClick={() => removeItem(item.slug)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-neutral-100 p-4 space-y-3 shrink-0">
            {/* Summary */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">Total items</span>
              <span className="font-semibold text-neutral-900">
                {items.reduce((sum, i) => sum + i.quantity, 0)} pcs
              </span>
            </div>

            {/* Actions */}
            <a
              href="/contact"
              className="flex items-center justify-center gap-2 w-full h-11 bg-accent-500 text-neutral-900 text-sm font-semibold rounded-md no-underline hover:bg-accent-600 transition-colors"
              onClick={closeDrawer}
            >
              <PaperPlaneTilt size={16} weight="bold" />
              Submit Quote Request
            </a>

            <button
              className="w-full text-xs text-neutral-400 hover:text-red-500 transition-colors cursor-pointer bg-transparent border-none"
              onClick={clearAll}
            >
              Clear all items
            </button>
          </div>
        )}
      </div>
    </>
  );
}
