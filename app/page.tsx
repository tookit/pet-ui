import {
  Fish,
  PawPrint,
  ShieldCheck,
  Truck,
  CheckCircle,
  Clock,
  Users,
  CaretRight,
  ArrowRight,
  Circle,
  Sparkle,
  Download,
  Globe,
  Wrench,
  Package,
  Cpu,
  Article,
  Heartbeat,
  Ruler,
  UserCircle,
} from "@phosphor-icons/react/dist/ssr";
import Button from "@/components/Button";
import SectionHeader from "@/components/SectionHeader";
import FadeIn from "@/components/FadeIn";
import {
  fetchFeaturedProducts,
  fetchCategoryTree,
  type ProductListItem,
  type CategoryTree,
} from "@/lib/api";
import ProductCard from "@/components/ProductCard";

/* ─── STATIC DATA ─── */
const trustItems = [
  { icon: ShieldCheck, value: "ISO 9001:2015", label: "Quality Management" },
  { icon: Truck, value: "Sea / Air / Rail", label: "Global Shipping" },
  { icon: CheckCircle, value: "CE · RoHS · REACH", label: "Certifications" },
  { icon: Clock, value: "30 Days", label: "Sample Lead Time" },
  { icon: Users, value: "Dedicated Rep", label: "B2B Account Manager" },
];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  aquarium: Fish,
  filtration: Fish,
  lighting: Sparkle,
  substrate: Ruler,
  decor: Article,
  pet: PawPrint,
  bedding: Heartbeat,
  toys: Package,
  grooming: Wrench,
  feeding: Article,
};

function iconForCategory(cat: CategoryTree): React.ElementType {
  const slug = cat.slug.toLowerCase();
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (slug.includes(key)) return icon;
  }
  return Package;
}

const whyItems = [
  {
    icon: ShieldCheck,
    title: "Factory Direct Pricing",
    desc: "No middlemen. Every product is made in our own certified factory, passing the full margin saving to you.",
  },
  {
    icon: CheckCircle,
    title: "Full Compliance Support",
    desc: "We prepare CE, RoHS, REACH, and country-specific documents. Never hold a shipment at customs for paperwork.",
  },
  {
    icon: Globe,
    title: "80+ Country Track Record",
    desc: "From Amazon FBA prep to container-load shipping, our logistics team has handled it before. Your market is not new to us.",
  },
  {
    icon: Wrench,
    title: "In-House R&D",
    desc: "10-person product development team. From trend scouting to tooling, we can develop new products in as little as 90 days.",
  },
  {
    icon: Package,
    title: "Digital Product Library",
    desc: "Every SKU comes with high-res images, spec PDFs, and packaging dielines — ready for your website or marketplace.",
  },
  {
    icon: UserCircle,
    title: "Dedicated Account Team",
    desc: "One point of contact from sampling through to reorder. WhatsApp, email, or video call — your timeline, your channel.",
  },
];

/* ─── HERO ─── */
function Hero() {
  return (
    <section className="section-hero relative pt-20 pb-18 bg-neutral-0 overflow-hidden">
      {/* Background glow — responsive: small on mobile, full on desktop */}
      <div
        className="absolute -top-20 -right-20 sm:-top-30 sm:-right-50 w-[400px] h-[400px] sm:w-[700px] sm:h-[700px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, var(--color-primary-50) 0%, transparent 70%)",
        }}
      />

      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — copy */}
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.08em] uppercase text-primary-700 bg-primary-100 px-2.5 py-1 rounded-sm mb-5">
              <Circle size={12} weight="fill" className="text-primary-600" />
              Factory Direct · OEM / ODM Available
            </div>

            <h1 className="font-display text-[clamp(36px,5vw,60px)] font-bold leading-[1.1] text-neutral-900 tracking-[-0.02em] mb-5">
              Where <em className="italic text-primary-700">Nature</em>
              <br />
              Meets Precision
            </h1>

            <p className="text-lg leading-relaxed text-neutral-500 mb-9 max-w-[480px]">
              B2B wholesale supplier of aquarium supplies and pet products. 15+
              years of manufacturing, 80+ countries served, ISO-certified
              production lines.
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <Button variant="primary" size="lg" href="/products">
                Browse Catalogue
              </Button>
              <Button variant="secondary" size="lg" href="/oem">
                OEM / ODM Services
              </Button>
            </div>

            {/* Stats row */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-neutral-100">
              {[
                { num: "15+", label: "Years in Business" },
                { num: "80+", label: "Countries Served" },
                { num: "2,400+", label: "Active SKUs" },
                { num: "ISO", label: "Certified Factory" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-display text-[28px] font-bold text-neutral-900 leading-none">
                    {s.num}
                  </div>
                  <div className="text-xs text-neutral-400 mt-1 uppercase tracking-[0.06em]">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — entry split cards */}
          <div className="flex flex-col gap-4">
            {[
              {
                href: "/aquarium",
                icon: Fish,
                iconBg: "bg-primary-100",
                iconColor: "text-primary-700",
                title: "Aquarium Supplies",
                desc: "Filters, lighting, substrates, decor, pumps, CO₂ systems",
              },
              {
                href: "/pet",
                icon: PawPrint,
                iconBg: "bg-accent-100",
                iconColor: "text-accent-700",
                title: "Pet Products",
                desc: "Beds, toys, grooming tools, feeders, carriers, accessories",
              },
            ].map((card) => (
              <a
                key={card.href}
                href={card.href}
                className="group relative flex items-center gap-6 bg-neutral-0 border border-neutral-100 rounded-lg p-7 no-underline transition-[box-shadow,border-color,transform] duration-normal
                  hover:shadow-md hover:border-primary-200 hover:translate-x-0.5
                  before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary-400 before:scale-y-0 before:origin-bottom before:transition-transform before:duration-normal
                  hover:before:scale-y-100"
              >
                <div
                  className={`w-14 h-14 rounded-lg flex items-center justify-center shrink-0 ${card.iconBg}`}
                >
                  <card.icon size={28} className={card.iconColor} />
                </div>
                <div className="flex-1">
                  <div className="text-[17px] font-semibold text-neutral-900 mb-1">
                    {card.title}
                  </div>
                  <div className="text-[13px] text-neutral-400 leading-relaxed">
                    {card.desc}
                  </div>
                </div>
                <CaretRight
                  size={20}
                  className="text-neutral-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-[color,transform] duration-fast"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── TRUST BAR ─── */
function TrustBar() {
  return (
    <div className="section-trust bg-neutral-50 border-y border-neutral-100 py-5">
      <div className="container-page flex items-center justify-between gap-6 flex-wrap">
        {trustItems.map((item, i) => (
          <div key={item.label} className="flex items-center gap-2.5">
            <item.icon size={20} className="text-primary-600 shrink-0" />
            <div>
              <div className="text-[15px] font-semibold text-neutral-800">
                {item.value}
              </div>
              <div className="text-[13px] text-neutral-500">{item.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── CATEGORY GRID ─── */
function CategoryCard({
  href,
  icon: Icon,
  label,
  name,
  count,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  name: string;
  count: string;
}) {
  return (
    <a
      href={href}
      className="group bg-neutral-0 border border-neutral-100 rounded-md p-5 no-underline block transition-[box-shadow,border-color] duration-normal hover:shadow-sm hover:border-primary-200"
    >
      <div className="w-full aspect-3/2 bg-neutral-50 rounded-sm mb-4 flex items-center justify-center overflow-hidden relative">
        <Icon size={48} className="text-neutral-300" />
        <span className="absolute bottom-2 left-2 text-[10px] font-semibold tracking-[0.06em] uppercase text-neutral-400">
          {label}
        </span>
      </div>
      <div className="text-[15px] font-semibold text-neutral-900 mb-1">{name}</div>
      <div className="text-xs text-neutral-400">{count}</div>
      <div className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-fast">
        View all <ArrowRight size={12} />
      </div>
    </a>
  );
}

function CategorySection({
  aquariumCategories,
}: {
  aquariumCategories: CategoryTree[];
}) {
  const displayCategories =
    aquariumCategories.length > 0
      ? aquariumCategories.slice(0, 4).map((cat) => ({
          href: `/aquarium?category=${cat.slug}`,
          icon: iconForCategory(cat),
          label: cat.slug,
          name: cat.name,
          count: `${cat.children.length} subcategories`,
        }))
      : [
          {
            href: "/aquarium",
            icon: Fish,
            label: "Filtration",
            name: "Filtration Systems",
            count: "142 products",
          },
          {
            href: "/aquarium",
            icon: Sparkle,
            label: "Lighting",
            name: "Aquarium Lighting",
            count: "89 products",
          },
          {
            href: "/aquarium",
            icon: Ruler,
            label: "Substrate",
            name: "Substrates & Gravel",
            count: "67 products",
          },
          {
            href: "/aquarium",
            icon: Article,
            label: "Decor",
            name: "Decor & Ornaments",
            count: "310 products",
          },
        ];

  return (
    <FadeIn>
      <section className="section-categories py-20">
        <div className="container-page">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-12">
            <SectionHeader label="Product Lines" title="Browse by Category" />
            <div className="flex border border-neutral-200 rounded-md overflow-hidden bg-neutral-50 self-start">
              <button className="h-9 px-4 text-[13px] font-medium text-neutral-900 bg-neutral-0 shadow-sm cursor-pointer whitespace-nowrap">
                Aquarium
              </button>
              <button className="h-9 px-4 text-[13px] font-medium text-neutral-500 bg-transparent cursor-pointer hover:bg-neutral-0 whitespace-nowrap">
                Pet
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayCategories.map((cat) => (
              <CategoryCard key={cat.name} {...cat} />
            ))}
          </div>
        </div>
      </section>
    </FadeIn>
  );
}

/* ─── FEATURED PRODUCTS ─── */
function FeaturedProducts({
  products,
}: {
  products: ProductListItem[];
}) {
  return (
    <FadeIn>
      <section className="section-featured py-20 bg-neutral-50">
        <div className="container-page">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-12">
            <SectionHeader
              label="Hot Items"
              title="Top-Selling Products"
              description="Our highest-reorder wholesale lines — spec sheets available on request."
            />
            <Button variant="secondary" size="md" href="/aquarium" className="self-start">
              View All Products
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </FadeIn>
  );
}

/* ─── OEM SECTION ─── */
function OEMSection() {
  const steps = [
    {
      title: "Brief & Feasibility",
      desc: "Share your product idea, reference samples, or spec sheet. We confirm feasibility and MOQ within 48 hours.",
    },
    {
      title: "Design & Sampling",
      desc: "Our design team produces 2D/3D renders and physical samples. Average sample lead time: 20–30 days.",
    },
    {
      title: "Tooling & Approval",
      desc: "Mold or tooling fabrication. Pre-production sample approval before mass production begins.",
    },
    {
      title: "Production & QC",
      desc: "ISO-controlled production with inline and final QC inspection. Third-party inspection welcome.",
    },
    {
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
  ];

  return (
    <FadeIn>
      <section className="section-oem py-20">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left — steps */}
            <div>
              <SectionHeader
                label="Manufacturing Services"
                title="OEM / ODM from Concept to Carton"
              />
              <p className="text-base text-neutral-500 leading-relaxed max-w-[560px] -mt-8 mb-9">
                Full-service private label manufacturing. Bring your brand, your
                specs, or just an idea — we handle tooling, production, QC, and
                export compliance.
              </p>

              <div className="flex flex-col">
                {steps.map((step, i) => (
                  <div key={step.title} className="flex gap-5 relative pb-7 last:pb-0">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 text-[13px] font-bold flex items-center justify-center">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      {i < steps.length - 1 && (
                        <div className="w-px flex-1 bg-neutral-100 mt-2" />
                      )}
                    </div>
                    <div>
                      <div className="text-[15px] font-semibold text-neutral-900 mb-1 mt-1.5">
                        {step.title}
                      </div>
                      <div className="text-[13px] text-neutral-500 leading-relaxed">
                        {step.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-9">
                <Button variant="accent" size="lg" href="/oem">
                  Explore OEM Services
                </Button>
              </div>
            </div>

            {/* Right — capabilities card */}
            <div className="bg-neutral-50 border border-neutral-100 rounded-lg p-8">
              <div className="text-[13px] font-semibold text-neutral-700 mb-4 uppercase tracking-[0.08em]">
                Manufacturing Capabilities
              </div>
              <div className="grid grid-cols-2 gap-3">
                {capabilities.map((cap) => (
                  <div
                    key={cap.title}
                    className="bg-neutral-0 border border-neutral-100 rounded-md p-4"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-md flex items-center justify-center mb-2.5 text-primary-700">
                      <cap.icon size={18} />
                    </div>
                    <div className="text-[13px] font-semibold text-neutral-800 mb-0.5">
                      {cap.title}
                    </div>
                    <div className="text-xs text-neutral-400">{cap.desc}</div>
                  </div>
                ))}
              </div>

              {/* MOQ guide */}
              <div className="mt-4 p-4 bg-primary-50 rounded-md border border-primary-200">
                <div className="text-[13px] font-semibold text-primary-800 mb-1.5">
                  Minimum Order Guide
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600">
                  <div>
                    Standard reorder:{" "}
                    <strong className="text-neutral-900">50–200 pcs</strong>
                  </div>
                  <div>
                    New OEM tooling:{" "}
                    <strong className="text-neutral-900">500+ pcs</strong>
                  </div>
                  <div>
                    Sample order:{" "}
                    <strong className="text-neutral-900">1–5 pcs</strong>
                  </div>
                  <div>
                    Container: <strong className="text-neutral-900">FCL / LCL</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}

/* ─── WHY US ─── */
function WhyUs() {
  return (
    <FadeIn>
      <section className="section-why-us py-20 bg-neutral-50">
        <div className="container-page">
          <SectionHeader
            label="Why Petpallets"
            title="Built for the Wholesale Buyer"
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-neutral-200 rounded-lg overflow-hidden">
            {whyItems.map((item) => (
              <div
                key={item.title}
                className="bg-neutral-0 p-8 border-b border-r border-neutral-200 last:border-b-0 [&:nth-child(3)]:border-r-0 md:[&:nth-child(3)]:border-r [&:nth-child(3)]:border-b lg:[&:nth-child(3)]:border-r-0"
              >
                <div className="w-10 h-10 bg-primary-100 rounded-md flex items-center justify-center text-primary-700 mb-4">
                  <item.icon size={20} />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </FadeIn>
  );
}

/* ─── CTA BAND ─── */
function CTABand() {
  return (
    <FadeIn>
      <section className="section-cta bg-primary-900 py-16">
        <div className="container-page flex flex-col md:flex-row items-center justify-between gap-12">
          <div>
            <h2 className="font-display text-[32px] font-bold text-neutral-0 leading-tight tracking-[-0.02em]">
              Ready to Source
              <br />
              <em className="italic text-primary-300">at Scale?</em>
            </h2>
            <p className="text-base text-primary-300 mt-2">
              Send your product list or sourcing brief — we&apos;ll respond with
              pricing within 24 hours.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button variant="accent" size="lg" href="/contact">
              Send an Inquiry
            </Button>
            <Button variant="outline-light" size="lg" href="#">
              <Download size={16} />
              Download Catalogue
            </Button>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}

/* ─── PAGE ─── */
/** Recursively find a category by slug anywhere in the tree. */
function findInTree(
  nodes: CategoryTree[],
  slug: string,
): CategoryTree | undefined {
  for (const node of nodes) {
    if (node.slug === slug) return node;
    const found = findInTree(node.children, slug);
    if (found) return found;
  }
  return undefined;
}

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProducts, categoryTree] = await Promise.all([
    fetchFeaturedProducts(3).catch(() => [] as ProductListItem[]),
    fetchCategoryTree().catch(() => [] as CategoryTree[]),
  ]);

  // "aquarium" is nested under "fish-aquariums" — search recursively
  const aquariumCategory = findInTree(categoryTree, "aquarium");
  const aquariumChildren = aquariumCategory?.children ?? [];

  return (
    <>
      <Hero />
      <TrustBar />
      <CategorySection aquariumCategories={aquariumChildren} />
      <FeaturedProducts products={featuredProducts} />
      <OEMSection />
      <WhyUs />
      <CTABand />
    </>
  );
}
