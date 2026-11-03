"use client";

import { useState } from "react";
import { Package } from "@phosphor-icons/react";
import type { ProductImage } from "@/lib/api";

interface ProductGalleryProps {
  images: ProductImage[];
  fallbackImage: string | null;
  name: string;
}

export function ProductGallery({
  images,
  fallbackImage,
  name,
}: ProductGalleryProps) {
  const [active, setActive] = useState(() => {
    const featured = images.findIndex((img) => img.featured);
    return featured >= 0 ? featured : 0;
  });

  const mainImage = images[active]?.url ?? fallbackImage;
  const count = images.length;

  return (
    <div className="flex flex-col gap-2.5 lg:sticky lg:top-22">
      <div className="w-full aspect-4/3 bg-neutral-50 rounded-md border border-neutral-100 overflow-hidden relative flex items-center justify-center">
        {mainImage ? (
          <img
            src={mainImage}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Package size={120} className="text-neutral-200" />
        )}
        {count > 0 && (
          <span className="absolute left-3.5 top-3.5 bg-neutral-0 border border-neutral-100 rounded-sm text-[11px] font-semibold uppercase tracking-[0.05em] text-neutral-600 px-2 py-1">
            {active + 1} / {count}
          </span>
        )}
      </div>
      {count > 1 && (
        <div className="flex gap-2.5 flex-wrap">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1} of ${name}`}
              aria-current={i === active ? "true" : undefined}
              className={`w-[76px] h-[76px] bg-neutral-50 rounded-sm border-2 overflow-hidden cursor-pointer transition-colors ${
                i === active
                  ? "border-primary-500"
                  : "border-neutral-100 hover:border-primary-400"
              }`}
            >
              <img
                src={img.url}
                alt={`${name} thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
