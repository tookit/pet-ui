import type { Metadata } from "next";
import {
  ClipboardText,
  ArrowRight,
  Cpu,
  Package,
  Article,
  Factory,
} from "@phosphor-icons/react/dist/ssr";
import Button from "@/components/Button";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "OEM / ODM Services",
  description:
    "Full-service private label manufacturing for aquarium and pet products. From concept to carton — tooling, production, QC, export.",
};

const steps = [
  {
    num: "01",
    title: "Brief & Feasibility",
    desc: "Share your product idea, reference samples, or spec sheet. We confirm feasibility and MOQ within 48 hours.",
  },
  {
    num: "02",
    title: "Design & Sampling",
    desc: "Our design team produces 2D/3D renders and physical samples. Average sample lead time: 20–30 days.",
  },
  {
    num: "03",
    title: "Tooling & Approval",
    desc: "Mold or tooling fabrication. Pre-production sample approval before mass production begins.",
  },
  {
    num: "04",
    title: "Production & QC",
    desc: "ISO-controlled production with inline and final QC inspection. Third-party inspection welcome.",
  },
  {
    num: "05",
    title: "Packaging & Export",
    desc: "Custom packaging design, compliance documentation, FCL/LCL booking to your port.",
  },
];

const capabilities = [
  {
    icon: Cpu,
    title: "Plastics",
    desc: "ABS, PP, TPE, PC, Nylon — injection & blow molding",
  },
  {
    icon: Cpu,
    title: "Electronics",
    desc: "LED drivers, pumps, controllers — CE/RoHS certified",
  },
  {
    icon: Package,
    title: "Packaging",
    desc: "Color box, FSC paper, retail-ready blister",
  },
  {
    icon: Article,
    title: "Textiles",
    desc: "Plush, Oxford cloth, mesh — cut & sew in-house",
  },
  {
    icon: Factory,
    title: "Metal & Hardware",
    desc: "Stainless steel, aluminum — laser cutting, welding, powder coating",
  },
  {
    icon: ClipboardText,
    title: "Printing & Branding",
    desc: "Silk screen, pad printing, laser engraving, IML — your logo on any material",
  },
];

const caseStudies = [
  {
    title: "EU Aquarium Brand — Private Label LED Bar",
    before: "Sourcing from multiple factories — inconsistent quality and delayed shipments.",
    after: "Single-source OEM partner. Custom spectrum, custom packaging. 15,000 units shipped in 12 months with zero QC rejections.",
  },
  {
    title: "US Pet Retailer — Orthopedic Dog Bed Line",
    before: "Buying branded products at 45% margin. Wanted private label at 65% margin.",
    after: "Developed 5-bed collection with custom fabrics, embroidery, and retail-ready color boxes. FBA-ready packaging. Reorder cycle: 6 weeks.",
  },
  {
    title: "AU Distributor — Aquarium Decor Range",
    before: "Limited to what factories stocked. No exclusivity on designs.",
    after: "Co-developed 20 exclusive ornament designs. Open mold ownership. 3-month development from sketch to first shipment.",
  },
];

export default function OEMPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-hero pt-20 pb-16 text-center bg-linear-to-br from-primary-50 to-neutral-0">
        <div className="container-page">
          <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary-600 mb-3">
            Manufacturing Services
          </div>
          <h1 className="font-display text-[clamp(32px,4vw,48px)] font-bold text-neutral-900 leading-tight tracking-[-0.02em] mb-4">
            From Concept<br />to Carton
          </h1>
          <p className="text-[17px] text-neutral-500 max-w-[520px] mx-auto leading-relaxed">
            Full-service OEM and ODM manufacturing. Bring your brand, your specs,
            or just an idea — we handle the rest.
          </p>
        </div>
      </section>

      {/* Process steps */}
      <FadeIn>
        <section className="section-process py-20">
          <div className="container-page max-w-[800px]">
            <div className="text-center mb-14">
              <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary-600 mb-3">
                The Process
              </div>
              <h2 className="font-display text-[clamp(24px,3vw,32px)] font-bold text-neutral-900 leading-tight tracking-[-0.02em]">
                How We Build Your Product
              </h2>
            </div>

            <div className="flex flex-col">
              {steps.map((step, i) => (
                <div key={step.num} className="flex gap-5 relative pb-8 last:pb-0">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 text-[14px] font-bold flex items-center justify-center">
                      {step.num}
                    </div>
                    {i < steps.length - 1 && (
                      <div className="w-px flex-1 bg-neutral-100 mt-2" />
                    )}
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-neutral-900 mt-2 mb-1.5">
                      {step.title}
                    </div>
                    <div className="text-[14px] text-neutral-500 leading-relaxed">
                      {step.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Button variant="accent" size="lg" href="/contact">
                Start Your Project
              </Button>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Capabilities */}
      <FadeIn>
        <section className="section-capabilities py-20 bg-neutral-50">
          <div className="container-page">
            <div className="text-center mb-14">
              <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary-600 mb-3">
                Capabilities
              </div>
              <h2 className="font-display text-[clamp(24px,3vw,32px)] font-bold text-neutral-900 leading-tight tracking-[-0.02em]">
                What We Can Make
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[900px] mx-auto">
              {capabilities.map((cap) => (
                <div
                  key={cap.title}
                  className="bg-neutral-0 border border-neutral-100 rounded-md p-5 flex gap-4"
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-md flex items-center justify-center text-primary-700 shrink-0">
                    <cap.icon size={20} />
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold text-neutral-800 mb-1">
                      {cap.title}
                    </div>
                    <div className="text-xs text-neutral-400 leading-relaxed">
                      {cap.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* MOQ guide */}
            <div className="mt-8 p-6 bg-primary-50 rounded-lg border border-primary-200 max-w-[500px] mx-auto">
              <div className="text-sm font-semibold text-primary-800 mb-2">
                Minimum Order Guide
              </div>
              <div className="grid grid-cols-2 gap-2 text-[13px] text-neutral-600">
                <div>Standard reorder: <strong className="text-neutral-900">50–200 pcs</strong></div>
                <div>New OEM tooling: <strong className="text-neutral-900">500+ pcs</strong></div>
                <div>Sample order: <strong className="text-neutral-900">1–5 pcs</strong></div>
                <div>Container: <strong className="text-neutral-900">FCL / LCL</strong></div>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Case studies */}
      <FadeIn>
        <section className="section-case-studies py-20">
          <div className="container-page max-w-[900px]">
            <div className="text-center mb-14">
              <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary-600 mb-3">
                Case Studies
              </div>
              <h2 className="font-display text-[clamp(24px,3vw,32px)] font-bold text-neutral-900 leading-tight tracking-[-0.02em]">
                Trusted by Distributors Worldwide
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {caseStudies.map((cs) => (
                <div
                  key={cs.title}
                  className="bg-neutral-0 border border-neutral-100 rounded-lg p-6"
                >
                  <h3 className="text-base font-semibold text-neutral-900 mb-4">
                    {cs.title}
                  </h3>
                  <div className="mb-3">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400 mb-1">
                      Before
                    </div>
                    <div className="text-[13px] text-neutral-500 leading-relaxed">
                      {cs.before}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-primary-600 mb-1">
                      After
                    </div>
                    <div className="text-[13px] text-neutral-500 leading-relaxed">
                      {cs.after}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>
    </>
  );
}
