"use client";

import { useEffect, useState } from "react";
import { ClipboardText } from "@phosphor-icons/react";
import Button from "./Button";
import { useInquiry } from "@/lib/inquiry";

export default function InquiryBar() {
  const [visible, setVisible] = useState(false);
  const { count, openDrawer } = useInquiry();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-neutral-0 border-t border-neutral-200 z-90 transition-transform duration-slow ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ boxShadow: "0 -4px 16px rgba(39,36,37,0.10)" }}
    >
      <div className="container-page flex flex-col sm:flex-row items-stretch sm:items-center justify-between h-auto sm:h-14 gap-2 sm:gap-4 py-2 sm:py-0">
        <p className="text-sm text-neutral-600">
          Ready to source?{" "}
          <strong className="text-neutral-900">
            Build your inquiry list and send one request.
          </strong>
        </p>
        <div className="flex items-center gap-2.5 sm:flex-row">
          <div className="relative">
            <button
              className="relative inline-flex items-center gap-1.5 h-10 px-4 text-sm font-medium bg-transparent text-primary-600 border border-primary-300 rounded-md cursor-pointer hover:bg-primary-50 transition-[background,color,border-color,box-shadow] duration-fast"
              onClick={openDrawer}
            >
              <ClipboardText weight="regular" />
              Inquiry List
            </button>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] bg-accent-500 text-neutral-900 text-[10px] font-bold rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </div>
          <button
            className="inline-flex items-center gap-1.5 h-10 px-4 text-sm font-medium bg-accent-500 text-neutral-900 rounded-md cursor-pointer hover:bg-accent-700 hover:text-neutral-0 transition-[background,color,border-color,box-shadow] duration-fast"
            onClick={openDrawer}
          >
            Send Inquiry
          </button>
        </div>
      </div>
    </div>
  );
}
