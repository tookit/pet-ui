"use client";

import { useState, useEffect, useCallback } from "react";
import { List, X, ClipboardText } from "@phosphor-icons/react";
import Logo from "./Logo";
import Button from "./Button";
import { useInquiry } from "@/lib/inquiry";

const NAV_LINKS = [
  { href: "/aquarium", label: "Aquarium" },
  { href: "/pet", label: "Pet Products" },
  { href: "/oem", label: "OEM / ODM" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count, openDrawer } = useInquiry();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile drawer on route change (via link click)
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <nav
        className={`sticky top-0 z-100 bg-neutral-0 border-b border-neutral-100 transition-shadow duration-normal ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div className="container-page flex items-center h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 no-underline shrink-0 mr-auto">
            <Logo />
            <span className="font-display text-xl font-bold text-neutral-900 tracking-[-0.3px]">
              Pet<span className="text-primary-600">pallets</span>
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8 list-none">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="relative pb-0.5 text-sm font-medium text-neutral-700 no-underline hover:text-primary-600 transition-colors duration-fast
                    after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-0.5 after:bg-primary-600 after:transition-[width] after:duration-normal
                    hover:after:w-full"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3 ml-8">
            <button
              className="relative inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium bg-transparent text-primary-600 border border-primary-300 rounded-md cursor-pointer hover:bg-primary-50 transition-[background,color,border-color,box-shadow] duration-fast"
              onClick={openDrawer}
            >
              <ClipboardText weight="regular" />
              Inquiry List
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] bg-accent-500 text-neutral-900 text-[10px] font-bold rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
            <Button variant="primary" size="sm" href="/contact">
              Get a Quote
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-neutral-700 hover:text-primary-600 transition-colors cursor-pointer"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <List size={24} weight="regular" />
          </button>
        </div>
      </nav>

      {/* Mobile slide-out drawer */}
      <div
        className={`fixed inset-0 z-200 md:hidden transition-opacity duration-normal ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-neutral-950/50"
          onClick={closeMobile}
        />

        {/* Drawer panel */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-72 bg-neutral-0 shadow-lg transition-transform duration-normal ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-neutral-100">
            <span className="font-display text-lg font-bold text-neutral-900">
              Menu
            </span>
            <button
              className="p-1 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
              onClick={closeMobile}
              aria-label="Close menu"
            >
              <X size={24} weight="regular" />
            </button>
          </div>

          <ul className="flex flex-col py-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block px-4 py-3 text-sm font-medium text-neutral-700 no-underline hover:bg-neutral-50 hover:text-primary-600 transition-colors"
                  onClick={closeMobile}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="border-t border-neutral-100 p-4 flex flex-col gap-2">
            <button
              className="relative inline-flex items-center justify-center gap-1.5 h-10 px-4 text-sm font-medium bg-transparent text-primary-600 border border-primary-300 rounded-md cursor-pointer hover:bg-primary-50 transition-[background,color,border-color,box-shadow] duration-fast"
              onClick={() => {
                closeMobile();
                openDrawer();
              }}
            >
              <ClipboardText weight="regular" />
              Inquiry List
              {count > 0 && (
                <span className="ml-1 w-[18px] h-[18px] bg-accent-500 text-neutral-900 text-[10px] font-bold rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
            <Button variant="primary" size="md" href="/contact" className="w-full justify-center">
              Get a Quote
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
