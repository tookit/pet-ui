"use client";

import { useState } from "react";
import { Plus, Check } from "@phosphor-icons/react";
import Button from "@/components/Button";
import { useInquiry } from "@/lib/inquiry";

interface InquiryFormProps {
  slug: string;
  name: string;
  moq?: number;
}

export function InquiryForm({ slug, name, moq }: InquiryFormProps) {
  const { items, addItem, removeItem } = useInquiry();
  const isInList = items.some((i) => i.slug === slug);
  const [added, setAdded] = useState(isInList);

  const handleToggle = () => {
    if (isInList) {
      removeItem(slug);
      setAdded(false);
    } else {
      addItem({ slug, name, moq: moq ?? 1 });
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  return (
    <>
      <Button variant="accent" size="lg" href="/contact">
        Send Inquiry
      </Button>
      <Button
        variant={isInList ? "primary" : "secondary"}
        size="lg"
        onClick={handleToggle}
      >
        {isInList ? (
          <>
            <Check size={16} />
            In Inquiry List
          </>
        ) : added ? (
          <>
            <Check size={16} />
            Added
          </>
        ) : (
          <>
            <Plus size={16} />
            Add to Inquiry
          </>
        )}
      </Button>
    </>
  );
}
