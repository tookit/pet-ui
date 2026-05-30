"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  X,
  Trash,
  Minus,
  Plus,
  Package,
  PaperPlaneTilt,
  CheckCircle,
  WarningCircle,
} from "@phosphor-icons/react";
import { useInquiry } from "@/lib/inquiry";
import { submitInquiry } from "@/lib/api";

type SubmitStatus = "idle" | "loading" | "success" | "error";

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
  const formRef = useRef<HTMLFormElement>(null);

  // ─── Form state ───
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  // ─── Reset form when drawer opens/closes ───
  useEffect(() => {
    if (!isDrawerOpen) {
      setStatus("idle");
      setStatusMessage("");
    }
  }, [isDrawerOpen]);

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

  // ─── Submit ───
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (items.length === 0) return;
    if (status === "loading") return;

    setStatus("loading");
    setStatusMessage("");

    const result = await submitInquiry({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company: company.trim(),
      notes: notes.trim() || undefined,
      items: items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
      })),
    });

    if (result.success) {
      setStatus("success");
      setStatusMessage("Quote request submitted! We'll get back to you within 24 hours.");
      setName(""); setEmail(""); setCompany(""); setPhone(""); setNotes("");
      // Clear items after a brief delay so user sees the success state
      setTimeout(() => {
        clearAll();
        closeDrawer();
        setStatus("idle");
        setStatusMessage("");
      }, 2000);
    } else {
      setStatus("error");
      setStatusMessage(result.message);
    }
  };

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

        {/* Footer — form + actions */}
        {items.length > 0 && (
          <div className="border-t border-neutral-100 p-4 shrink-0">
            {/* Summary */}
            <div className="flex items-center justify-between text-sm mb-4">
              <span className="text-neutral-500">Total items</span>
              <span className="font-semibold text-neutral-900">
                {items.reduce((sum, i) => sum + i.quantity, 0)} pcs
              </span>
            </div>

            {/* Inquiry form */}
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="drawer-name" className="text-[11px] font-medium text-neutral-600">
                    Full Name *
                  </label>
                  <input
                    id="drawer-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-9 px-2.5 border border-neutral-200 rounded-md text-[13px] text-neutral-700 bg-neutral-0 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-shadow"
                    placeholder="John Smith"
                    disabled={status === "loading" || status === "success"}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="drawer-email" className="text-[11px] font-medium text-neutral-600">
                    Email *
                  </label>
                  <input
                    id="drawer-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-9 px-2.5 border border-neutral-200 rounded-md text-[13px] text-neutral-700 bg-neutral-0 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-shadow"
                    placeholder="john@company.com"
                    disabled={status === "loading" || status === "success"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="drawer-company" className="text-[11px] font-medium text-neutral-600">
                    Company *
                  </label>
                  <input
                    id="drawer-company"
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="h-9 px-2.5 border border-neutral-200 rounded-md text-[13px] text-neutral-700 bg-neutral-0 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-shadow"
                    placeholder="Your Company Ltd."
                    disabled={status === "loading" || status === "success"}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="drawer-phone" className="text-[11px] font-medium text-neutral-600">
                    Phone / WhatsApp
                  </label>
                  <input
                    id="drawer-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-9 px-2.5 border border-neutral-200 rounded-md text-[13px] text-neutral-700 bg-neutral-0 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-shadow"
                    placeholder="+1 555 000 0000"
                    disabled={status === "loading" || status === "success"}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="drawer-notes" className="text-[11px] font-medium text-neutral-600">
                  Notes
                </label>
                <textarea
                  id="drawer-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="px-2.5 py-1.5 border border-neutral-200 rounded-md text-[13px] text-neutral-700 bg-neutral-0 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-shadow resize-y"
                  placeholder="Any special requirements..."
                  disabled={status === "loading" || status === "success"}
                />
              </div>

              {/* Status feedback */}
              {statusMessage && (
                <div
                  className={`flex items-center gap-2 text-[13px] p-2.5 rounded-md ${
                    status === "success"
                      ? "bg-green-50 text-green-800"
                      : status === "error"
                        ? "bg-red-50 text-red-700"
                        : ""
                  }`}
                >
                  {status === "success" ? (
                    <CheckCircle size={16} weight="fill" />
                  ) : status === "error" ? (
                    <WarningCircle size={16} weight="fill" />
                  ) : null}
                  {statusMessage}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="flex items-center justify-center gap-2 w-full h-11 bg-accent-500 text-neutral-900 text-sm font-semibold rounded-md no-underline hover:bg-accent-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-neutral-900/30 border-t-neutral-900 rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : status === "success" ? (
                  <>
                    <CheckCircle size={16} weight="fill" />
                    Submitted!
                  </>
                ) : (
                  <>
                    <PaperPlaneTilt size={16} weight="bold" />
                    Submit Quote Request
                  </>
                )}
              </button>
            </form>

            {/* Clear all */}
            <button
              className="w-full text-xs text-neutral-400 hover:text-red-500 transition-colors cursor-pointer bg-transparent border-none mt-3"
              onClick={clearAll}
              disabled={status === "loading"}
            >
              Clear all items
            </button>
          </div>
        )}
      </div>
    </>
  );
}
