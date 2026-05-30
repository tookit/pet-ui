import type { Metadata } from "next";
import {
  Envelope,
  Phone,
  WhatsappLogo,
  MapPin,
  Clock,
  Paperclip,
} from "@phosphor-icons/react/dist/ssr";
import Button from "@/components/Button";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Petpallets. Send a sourcing inquiry, request samples, or ask about OEM services. We respond within 24 hours.",
};

const contactDetails = [
  {
    icon: Envelope,
    label: "Email",
    value: "sales@petpallets.com",
    href: "mailto:sales@petpallets.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+86 754 8888 6666",
    href: "tel:+8675488886666",
  },
  {
    icon: WhatsappLogo,
    label: "WhatsApp",
    value: "+86 138 0000 0000",
    href: "https://wa.me/8613800000000",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "No. 88, Jinsha Industrial Zone, Shantou, Guangdong 515000, China",
  },
  {
    icon: Clock,
    label: "Office Hours",
    value: "Mon–Fri 08:30–18:00 (CST / UTC+8)",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-20 pb-16 text-center bg-linear-to-br from-neutral-50 to-neutral-0">
        <div className="container-page">
          <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary-600 mb-3">
            Get in Touch
          </div>
          <h1 className="font-display text-[clamp(32px,4vw,48px)] font-bold text-neutral-900 leading-tight tracking-[-0.02em] mb-4">
            Let&apos;s Talk Business
          </h1>
          <p className="text-[17px] text-neutral-500 max-w-[520px] mx-auto leading-relaxed">
            Share your product needs or sourcing brief. We&apos;ll respond with
            pricing and feasibility within 24 hours.
          </p>
        </div>
      </section>

      {/* Form + Details */}
      <FadeIn>
        <section className="py-20">
          <div className="container-page">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Contact form */}
              <div>
                <h2 className="font-display text-[24px] font-bold text-neutral-900 mb-2 tracking-[-0.02em]">
                  Send an Inquiry
                </h2>
                <p className="text-sm text-neutral-500 mb-8">
                  All fields marked * are required.
                </p>

                <form className="flex flex-col gap-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="name"
                        className="text-[13px] font-medium text-neutral-700"
                      >
                        Full Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="h-10 px-3 border border-neutral-200 rounded-md text-sm text-neutral-700 bg-neutral-0 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-shadow"
                        placeholder="John Smith"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="company"
                        className="text-[13px] font-medium text-neutral-700"
                      >
                        Company *
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        required
                        className="h-10 px-3 border border-neutral-200 rounded-md text-sm text-neutral-700 bg-neutral-0 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-shadow"
                        placeholder="Your Company Ltd."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="email"
                        className="text-[13px] font-medium text-neutral-700"
                      >
                        Email *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="h-10 px-3 border border-neutral-200 rounded-md text-sm text-neutral-700 bg-neutral-0 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-shadow"
                        placeholder="john@company.com"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="phone"
                        className="text-[13px] font-medium text-neutral-700"
                      >
                        Phone / WhatsApp
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="h-10 px-3 border border-neutral-200 rounded-md text-sm text-neutral-700 bg-neutral-0 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-shadow"
                        placeholder="+1 555 000 0000"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="interest"
                      className="text-[13px] font-medium text-neutral-700"
                    >
                      Product Interest
                    </label>
                    <select
                      id="interest"
                      name="interest"
                      className="h-10 px-3 border border-neutral-200 rounded-md text-sm text-neutral-700 bg-neutral-0 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-shadow"
                    >
                      <option value="">Select a category</option>
                      <option value="aquarium">Aquarium Supplies</option>
                      <option value="pet">Pet Products</option>
                      <option value="oem">OEM / ODM Service</option>
                      <option value="other">Other / Multiple</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="message"
                      className="text-[13px] font-medium text-neutral-700"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      className="px-3 py-2.5 border border-neutral-200 rounded-md text-sm text-neutral-700 bg-neutral-0 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-shadow resize-y"
                      placeholder="Describe what you're looking for — product types, estimated quantities, target market..."
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button type="submit" variant="accent" size="lg">
                      Send Inquiry
                    </Button>
                    <span className="flex items-center gap-1.5 text-xs text-neutral-400 cursor-pointer hover:text-primary-600 transition-colors">
                      <Paperclip size={14} />
                      Attach a file
                    </span>
                  </div>
                </form>
              </div>

              {/* Contact details */}
              <div>
                <h2 className="font-display text-[24px] font-bold text-neutral-900 mb-8 tracking-[-0.02em]">
                  Contact Details
                </h2>

                <div className="flex flex-col gap-6">
                  {contactDetails.map((detail) => {
                    const Icon = detail.icon;
                    return (
                      <div key={detail.label} className="flex gap-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-md flex items-center justify-center text-primary-700 shrink-0">
                          <Icon size={20} />
                        </div>
                        <div>
                          <div className="text-[11px] font-semibold tracking-[0.06em] uppercase text-neutral-400 mb-1">
                            {detail.label}
                          </div>
                          {"href" in detail && detail.href ? (
                            <a
                              href={detail.href}
                              className="text-[15px] font-medium text-neutral-900 no-underline hover:text-primary-600 transition-colors"
                            >
                              {detail.value}
                            </a>
                          ) : (
                            <div className="text-[15px] text-neutral-700">
                              {detail.value}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Map placeholder */}
                <div className="mt-10 bg-neutral-100 rounded-lg aspect-16/9 flex items-center justify-center border border-neutral-200">
                  <div className="text-center text-neutral-400">
                    <MapPin size={32} className="mx-auto mb-2" />
                    <div className="text-sm">Shantou, Guangdong, China</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>
    </>
  );
}
