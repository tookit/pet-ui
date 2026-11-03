"use client";

import { useState } from "react";
import { Plus, Check, Minus, Download, ShieldCheck } from "@phosphor-icons/react";
import { useInquiry } from "@/lib/inquiry";
import type { PriceTier } from "@/lib/api";

interface BuyPanelProps {
  productId: number;
  slug: string;
  name: string;
  moq: number;
  tiers: PriceTier[];
  imageUrl?: string;
  specSheetUrl?: string | null;
  weight?: number | null;
  dimensions?: Record<string, unknown> | null;
}

function formatUSD(n: number): string {
  return `$${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function tierUnitPrice(tier: PriceTier): number {
  // pet-api serializes Decimal as a string in some responses — coerce.
  return Number(tier.unit_price) || 0;
}

function dimensionsLabel(
  dimensions?: Record<string, unknown> | null,
): string | null {
  if (!dimensions) return null;
  const d = dimensions as Record<string, unknown>;
  const parts = [d.length, d.width, d.height].filter(Boolean);
  return parts.length ? `${parts.join(" × ")} mm` : null;
}

export function BuyPanel({
  productId,
  slug,
  name,
  moq,
  tiers,
  imageUrl,
  specSheetUrl,
  weight,
  dimensions,
}: BuyPanelProps) {
  const { items, addItem, removeItem } = useInquiry();
  const isInList = items.some((i) => i.slug === slug);

  const [selectedTier, setSelectedTier] = useState(0);
  const [qty, setQty] = useState(moq > 0 ? moq : 1);

  const tier = tiers[selectedTier];
  const price = tier ? tierUnitPrice(tier) : 0;
  const total = price > 0 ? qty * price : null;

  const clampQty = (n: number) => Math.max(moq > 0 ? moq : 1, Math.floor(n));

  const handleAdd = () => {
    if (isInList) {
      removeItem(slug);
    } else {
      addItem({
        productId,
        slug,
        name,
        imageUrl,
        moq,
        quantity: qty,
      });
    }
  };

  const dims = dimensionsLabel(dimensions);

  return (
    <div className="flex flex-col gap-4">
      {/* Tier table */}
      {tiers.length > 0 && (
        <div className="border border-neutral-100 rounded-md overflow-hidden">
          <div className="flex items-center justify-between bg-neutral-50 px-4 py-2.5 border-b border-neutral-100">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
              Quantity · unit price
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
              Lead time
            </span>
          </div>
          {tiers.map((t, i) => {
            const unit = tierUnitPrice(t);
            const isOn = i === selectedTier;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTier(i)}
                className={`w-full grid grid-cols-[1.25fr_0.9fr_0.9fr] items-center gap-3 px-4 py-3 border-b border-neutral-100 last:border-b-0 text-left cursor-pointer transition-colors ${
                  isOn
                    ? "bg-primary-50"
                    : "bg-neutral-0 hover:bg-neutral-50"
                }`}
              >
                <span className="text-[13.5px] text-neutral-700">
                  {isOn && (
                    <span className="text-primary-600 font-bold mr-1.5">
                      ✓
                    </span>
                  )}
                  <strong className="font-semibold text-neutral-900 tabular-nums">
                    {t.min_quantity}+
                  </strong>{" "}
                  pcs
                  {t.label && (
                    <span className="text-xs text-neutral-400 ml-1">
                      ({t.label})
                    </span>
                  )}
                </span>
                <span
                  className={`text-[15px] font-semibold text-right tabular-nums ${
                    isOn ? "text-primary-700" : "text-neutral-900"
                  }`}
                >
                  {unit > 0 ? formatUSD(unit) : "Quoted"}
                </span>
                <span className="text-xs text-neutral-500 text-right">
                  {unit > 0 ? "FOB" : "24h"}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Qty + Add to inquiry */}
      <div className="flex gap-2.5">
        <div className="flex items-center border border-neutral-200 rounded-md overflow-hidden bg-neutral-0">
          <button
            type="button"
            aria-label="Decrease quantity"
            className="w-9 h-10 text-base text-neutral-600 cursor-pointer hover:bg-neutral-50"
            onClick={() => setQty((q) => clampQty(q - 1))}
          >
            <Minus size={14} weight="bold" className="inline" />
          </button>
          <input
            value={qty}
            onChange={(e) => {
              const n = parseInt(e.target.value.replace(/[^\d]/g, ""), 10);
              setQty(Number.isFinite(n) ? clampQty(n) : moq);
            }}
            className="w-20 h-10 border-x border-neutral-100 text-center text-sm font-semibold tabular-nums text-neutral-900 outline-none"
          />
          <button
            type="button"
            aria-label="Increase quantity"
            className="w-9 h-10 text-base text-neutral-600 cursor-pointer hover:bg-neutral-50"
            onClick={() => setQty((q) => q + 1)}
          >
            <Plus size={14} weight="bold" className="inline" />
          </button>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className={`flex-1 h-10 inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-md cursor-pointer transition-colors ${
            isInList
              ? "bg-primary-100 text-primary-700 hover:bg-primary-200"
              : "bg-primary-500 text-neutral-0 hover:bg-primary-600"
          }`}
        >
          {isInList ? (
            <>
              <Check size={16} weight="bold" /> In inquiry list
            </>
          ) : (
            <>
              <Plus size={16} weight="bold" /> Add to inquiry
            </>
          )}
        </button>
      </div>

      {/* Total */}
      <div className="flex justify-between items-baseline pt-1">
        <span className="text-[13px] text-neutral-500">
          Estimated goods value
        </span>
        <span className="flex items-baseline gap-2">
          <strong className="text-[19px] font-bold text-neutral-900 tabular-nums">
            {total != null ? formatUSD(total) : "Quoted in 24h"}
          </strong>
          <span className="text-xs text-neutral-400">FOB Shenzhen</span>
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2.5 mt-1">
        <a
          href="/contact"
          className="flex-1 h-11 inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-md bg-accent-500 text-neutral-900 hover:bg-accent-700 hover:text-neutral-0 transition-colors no-underline"
        >
          Send inquiry · 24h quote
        </a>
        {specSheetUrl ? (
          <a
            href={specSheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 px-4 inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-md bg-transparent text-primary-700 border border-primary-300 hover:bg-primary-50 transition-colors no-underline"
          >
            <Download size={16} />
            Spec sheet
          </a>
        ) : (
          <span className="h-11 px-4 inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-md bg-transparent text-neutral-300 border border-neutral-100">
            <Download size={16} />
            Spec sheet
          </span>
        )}
      </div>

      {/* Quick facts */}
      <div className="grid grid-cols-2 gap-px bg-neutral-100 border border-neutral-100 rounded-md overflow-hidden mt-1">
        <div className="bg-neutral-0 px-3.5 py-2.5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
            MOQ
          </div>
          <div className="text-[13.5px] font-medium text-neutral-900 tabular-nums mt-0.5">
            {moq} pcs
          </div>
        </div>
        <div className="bg-neutral-0 px-3.5 py-2.5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
            Weight
          </div>
          <div className="text-[13.5px] font-medium text-neutral-900 tabular-nums mt-0.5">
            {weight != null ? `${weight} kg` : "—"}
          </div>
        </div>
        <div className="bg-neutral-0 px-3.5 py-2.5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
            Dimensions
          </div>
          <div className="text-[13.5px] font-medium text-neutral-900 tabular-nums mt-0.5">
            {dims ?? "—"}
          </div>
        </div>
        <div className="bg-neutral-0 px-3.5 py-2.5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
            Port
          </div>
          <div className="text-[13.5px] font-medium text-neutral-900 mt-0.5">
            Shenzhen · FOB
          </div>
        </div>
      </div>

      {/* Assurances */}
      <div className="flex flex-wrap gap-2 mt-1">
        <span className="inline-flex items-center gap-1.5 text-xs text-neutral-600 border border-neutral-200 rounded-md px-2.5 py-1 bg-neutral-0">
          <ShieldCheck size={12} weight="bold" className="text-primary-600" />
          Sample available
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-neutral-600 border border-neutral-200 rounded-md px-2.5 py-1 bg-neutral-0">
          <ShieldCheck size={12} weight="bold" className="text-primary-600" />
          OEM logo &amp; packaging
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-neutral-600 border border-neutral-200 rounded-md px-2.5 py-1 bg-neutral-0">
          <ShieldCheck size={12} weight="bold" className="text-primary-600" />
          FOB / CIF
        </span>
      </div>
    </div>
  );
}
