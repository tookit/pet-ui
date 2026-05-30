"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export interface InquiryItem {
  slug: string;
  name: string;
  imageUrl?: string;
  moq?: number;
  quantity: number;
  addedAt: number;
}

interface InquiryContextType {
  items: InquiryItem[];
  addItem: (item: Omit<InquiryItem, "addedAt" | "quantity">) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, qty: number) => void;
  clearAll: () => void;
  count: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const InquiryContext = createContext<InquiryContextType | null>(null);

const STORAGE_KEY = "petpallets-inquiry";

function loadFromStorage(): InquiryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<InquiryItem>[];
    // Migrate old items missing the quantity field
    return parsed.map((item) => ({
      ...item,
      quantity: item.quantity ?? item.moq ?? 1,
      addedAt: item.addedAt ?? Date.now(),
    })) as InquiryItem[];
  } catch {
    return [];
  }
}

function saveToStorage(items: InquiryItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* quota exceeded — silently degrade */
  }
}

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InquiryItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setItems(loadFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveToStorage(items);
  }, [items, hydrated]);

  const addItem = useCallback(
    (item: Omit<InquiryItem, "addedAt" | "quantity">) => {
      setItems((prev) => {
        if (prev.some((i) => i.slug === item.slug)) return prev;
        return [
          ...prev,
          { ...item, quantity: item.moq ?? 1, addedAt: Date.now() },
        ];
      });
    },
    [],
  );

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const updateQuantity = useCallback((slug: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.slug === slug ? { ...i, quantity: Math.max(1, qty) } : i,
      ),
    );
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <InquiryContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearAll,
        count: items.length,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </InquiryContext.Provider>
  );
}

export function useInquiry() {
  const ctx = useContext(InquiryContext);
  if (!ctx) throw new Error("useInquiry must be used within InquiryProvider");
  return ctx;
}
