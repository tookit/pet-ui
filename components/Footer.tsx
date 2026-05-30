import { WhatsappLogo, Envelope } from "@phosphor-icons/react/dist/ssr";
import Logo from "./Logo";

const footerSections = [
  {
    heading: "Aquarium",
    links: [
      { href: "/aquarium", label: "Filtration" },
      { href: "/aquarium", label: "Lighting" },
      { href: "/aquarium", label: "Substrates" },
      { href: "/aquarium", label: "Decor" },
      { href: "/aquarium", label: "Pumps" },
      { href: "/aquarium", label: "CO₂ Systems" },
    ],
  },
  {
    heading: "Pet Products",
    links: [
      { href: "/pet", label: "Beds & Cushions" },
      { href: "/pet", label: "Toys" },
      { href: "/pet", label: "Grooming" },
      { href: "/pet", label: "Feeders" },
      { href: "/pet", label: "Carriers" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/oem", label: "OEM / ODM" },
      { href: "#", label: "Certifications" },
      { href: "/contact", label: "Contact" },
      { href: "#", label: "Download Catalogue" },
      { href: "#", label: "Terms & Conditions" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-500 pt-14 pb-8">
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
          {/* Brand column */}
          <div>
            <span className="font-display text-lg font-bold text-neutral-0">
              Pet<span className="text-primary-400">pallets</span>
            </span>
            <p className="text-sm leading-relaxed text-neutral-500 mt-4 max-w-[260px]">
              Factory-direct wholesale supplier of aquarium supplies and pet
              products. ISO-certified. 15+ years of export experience.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="https://wa.me/8613800000000"
                className="flex items-center gap-1.5 text-[13px] text-neutral-500 no-underline hover:text-neutral-0 transition-colors duration-fast"
              >
                <WhatsappLogo size={16} weight="fill" />
                WhatsApp
              </a>
              <a
                href="mailto:sales@petpallets.com"
                className="flex items-center gap-1.5 text-[13px] text-neutral-500 no-underline hover:text-neutral-0 transition-colors duration-fast"
              >
                <Envelope size={16} weight="regular" />
                Email
              </a>
            </div>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.heading}>
              <h4 className="text-xs font-semibold tracking-[0.1em] uppercase text-neutral-400 mb-4">
                {section.heading}
              </h4>
              <ul className="flex flex-col gap-2.5 list-none">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-neutral-500 no-underline hover:text-neutral-0 transition-colors duration-fast"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between pt-6 border-t border-neutral-900 text-xs text-neutral-600">
          <span>&copy; 2025 Petpallets Co., Ltd. All rights reserved.</span>
          <div className="flex gap-5">
            <span className="text-neutral-500">EN</span>
            <span>中文</span>
            <span>ES</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
