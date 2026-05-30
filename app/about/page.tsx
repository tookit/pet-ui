import type { Metadata } from "next";
import { Buildings, Factory, Globe, UsersThree, Certificate } from "@phosphor-icons/react/dist/ssr";
import Breadcrumb from "@/components/Breadcrumb";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "ISO-certified manufacturer of aquarium and pet products since 2012. 20,000 m² facility, 60+ countries served. Factory-direct wholesale.",
};

const stats = [
  { num: "2012", label: "Established" },
  { num: "20,000 m²", label: "Facility" },
  { num: "60+", label: "Countries" },
  { num: "ISO 9001", label: "Certified" },
];

const milestones = [
  { year: "2012", text: "Founded in Shantou, Guangdong — a single injection-molding workshop producing aquarium ornaments." },
  { year: "2015", text: "Expanded to 8,000 m². Added LED lighting and pump production lines. First export to Europe." },
  { year: "2018", text: "ISO 9001 certified. Launched pet products division — beds, toys, grooming tools." },
  { year: "2021", text: "Moved to 20,000 m² integrated campus. In-house design + tooling + QC under one roof." },
  { year: "2025", text: "2,400+ active SKUs. 80+ export markets. OEM partners include top-10 pet retailers in EU and Americas." },
];

const values = [
  {
    icon: Factory,
    title: "Vertical Integration",
    desc: "From raw material compounding to finished goods QC — all under one roof. No outsourced production steps.",
  },
  {
    icon: Certificate,
    title: "Compliance First",
    desc: "CE, RoHS, REACH, and EN 71 documentation prepared proactively. Our compliance team audits every SKU before listing.",
  },
  {
    icon: Globe,
    title: "Export Expertise",
    desc: "FCL, LCL, air freight, rail to Europe. We prepare customs docs, COOs, and Form A certificates in-house.",
  },
  {
    icon: UsersThree,
    title: "Long-Term Partnership",
    desc: "We don't sell one container and disappear. Most of our distributors have been with us for 5+ years.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-hero pt-20 pb-16 text-center bg-linear-to-br from-neutral-50 to-neutral-0">
        <div className="container-page">
          <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary-600 mb-3">
            Our Story
          </div>
          <h1 className="font-display text-[clamp(32px,4vw,48px)] font-bold text-neutral-900 leading-tight tracking-[-0.02em] mb-4">
            Built for Wholesale,<br />Built to Last
          </h1>
          <p className="text-[17px] text-neutral-500 max-w-[520px] mx-auto leading-relaxed">
            Since 2012, we&apos;ve grown from a single workshop to a 20,000 m² integrated
            manufacturing campus. Every product is made here — no middlemen, no shortcuts.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="section-stats pb-20 -mt-10">
        <div className="container-page">
          <div className="grid grid-cols-2 md:grid-cols-4 border border-neutral-200 rounded-lg overflow-hidden max-w-[900px] mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="bg-neutral-0 py-7 px-6 text-center border-r border-b border-neutral-200 last:border-r-0 [&:nth-child(3)]:border-b-0 md:[&:nth-child(3)]:border-b [&:nth-child(4)]:border-b-0 [&:nth-child(3)]:border-r md:[&:nth-child(3)]:border-r [&:nth-child(4)]:border-r-0">
                <div className="font-display text-[32px] font-bold text-neutral-900 leading-none">
                  {s.num}
                </div>
                <div className="text-xs text-neutral-400 mt-1 uppercase tracking-[0.06em]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <FadeIn>
        <section className="section-timeline py-20 bg-neutral-50">
          <div className="container-page max-w-[800px]">
            <div className="text-center mb-14">
              <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary-600 mb-3">
                Timeline
              </div>
              <h2 className="font-display text-[clamp(24px,3vw,32px)] font-bold text-neutral-900 leading-tight tracking-[-0.02em]">
                Our Journey
              </h2>
            </div>

            <div className="flex flex-col">
              {milestones.map((m, i) => (
                <div key={m.year} className="flex gap-5 relative pb-7 last:pb-0">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 text-[13px] font-bold flex items-center justify-center">
                      {m.year.slice(2)}
                    </div>
                    {i < milestones.length - 1 && (
                      <div className="w-px flex-1 bg-neutral-200 mt-2" />
                    )}
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold text-neutral-900 mt-1.5 mb-1">
                      {m.year}
                    </div>
                    <div className="text-[14px] text-neutral-500 leading-relaxed">
                      {m.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Values */}
      <FadeIn>
        <section className="section-values py-20">
          <div className="container-page">
            <div className="text-center mb-14">
              <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary-600 mb-3">
                How We Work
              </div>
              <h2 className="font-display text-[clamp(24px,3vw,32px)] font-bold text-neutral-900 leading-tight tracking-[-0.02em]">
                The Petpallets Difference
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="bg-neutral-0 border border-neutral-100 rounded-md p-6"
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-md flex items-center justify-center text-primary-700 mb-4">
                    <v.icon size={20} />
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900 mb-2">
                    {v.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Factory gallery placeholder */}
      <FadeIn>
        <section className="section-facility py-20 bg-neutral-50">
          <div className="container-page">
            <div className="text-center mb-14">
              <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary-600 mb-3">
                Our Facility
              </div>
              <h2 className="font-display text-[clamp(24px,3vw,32px)] font-bold text-neutral-900 leading-tight tracking-[-0.02em]">
                Inside the Factory
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-md overflow-hidden bg-neutral-100 aspect-4/3 flex items-center justify-center"
                >
                  <Buildings size={56} className="text-neutral-300" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>
    </>
  );
}
