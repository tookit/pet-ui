import Image from "next/image";
import {
  ArrowRight,
  CheckCircle,
  Factory,
  Globe,
  ShieldCheck,
  Truck,
} from "@phosphor-icons/react/dist/ssr";
import Button from "@/components/Button";
import HomeProductCatalog from "@/components/HomeProductCatalog";
import ProductCard from "@/components/ProductCard";
import SectionHeader from "@/components/SectionHeader";
import { fetchActiveProducts, type ProductListItem } from "@/lib/api";

const categories = [
  {
    name: "Aquariums",
    description: "Tanks and aquatic habitats",
    image: "/images/categories/aquariums.png",
    href: "/aquarium?category=aquarium",
  },
  {
    name: "Aquarium Filters",
    description: "Filtration equipment",
    image: "/images/categories/aquarium-filters.png",
    href: "/aquarium?category=aquarium-filters",
  },
  {
    name: "Aquarium Lighting",
    description: "Lighting for every setup",
    image: "/images/categories/aquarium-lighting.png",
    href: "/aquarium?category=aquarium-lighting",
  },
  {
    name: "Aquarium Plants",
    description: "Natural aquascaping",
    image: "/images/categories/aquarium-plants.png",
    href: "/aquarium?category=aquarium-plants",
  },
  {
    name: "Pet Products",
    description: "Everyday pet care",
    image: "/images/home/pet-products.png",
    href: "/pet",
  },
] as const;

const catalogCategories = [
  "aquarium",
  "aquarium-filters",
  "aquarium-decor",
  "aquarium-lighting",
];

function selectBalancedProducts(
  products: ProductListItem[],
  limit: number,
  excludedIds: Set<number> = new Set(),
): ProductListItem[] {
  const selected: ProductListItem[] = [];
  const seen = new Set(excludedIds);
  const groups = catalogCategories.map((slug) =>
    products.filter((product) =>
      product.categories.some((category) => category.slug === slug),
    ),
  );

  while (selected.length < limit) {
    let found = false;
    for (const group of groups) {
      const next = group.find((product) => !seen.has(product.id));
      if (!next) continue;
      selected.push(next);
      seen.add(next.id);
      found = true;
      if (selected.length === limit) break;
    }
    if (!found) break;
  }

  if (selected.length < limit) {
    for (const product of products) {
      if (seen.has(product.id)) continue;
      selected.push(product);
      seen.add(product.id);
      if (selected.length === limit) break;
    }
  }

  return selected;
}

function Hero({ productCount }: { productCount: number }) {
  return (
    <section className="bg-neutral-0 border-b border-neutral-100">
      <div className="container-page grid lg:grid-cols-[52%_48%] min-h-[420px]">
        <div className="relative z-10 flex flex-col justify-center py-14 lg:py-16 lg:pr-10">
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary-700 mb-4">
            B2B Wholesale Supplier
          </p>
          <h1 className="font-display text-[clamp(38px,4.2vw,58px)] font-bold text-neutral-900 tracking-[-0.025em] leading-[1.12] max-w-[620px]">
            Source aquarium &amp; pet products at scale
          </h1>
          <p className="text-base text-neutral-600 leading-relaxed mt-5 max-w-[530px]">
            Explore factory-direct products for your market. Compare specifications,
            build an inquiry list, and source from one experienced export team.
          </p>
          <div className="flex items-center gap-3 flex-wrap mt-7">
            <Button variant="primary" size="lg" href="#products">
              Browse Products <ArrowRight size={16} />
            </Button>
            <Button variant="secondary" size="lg" href="/oem">
              OEM / ODM Services
            </Button>
          </div>
          {productCount > 0 && (
            <p className="text-xs text-neutral-500 mt-7">
              {productCount} active products in the online catalog
            </p>
          )}
        </div>
        <div className="relative min-h-[270px] lg:min-h-full overflow-hidden">
          <Image
            src="/images/home/hero-aquarium.png"
            alt="Modern planted aquarium displayed in a bright interior"
            fill
            priority
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="object-cover object-[68%_center]"
          />
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const items = [
    { icon: Globe, value: "80+ countries", label: "Export experience" },
    { icon: Factory, value: "Factory direct", label: "OEM / ODM available" },
    { icon: Truck, value: "Global shipping", label: "Sea / air / rail" },
    { icon: ShieldCheck, value: "ISO 9001:2015", label: "Quality management" },
  ];

  return (
    <div className="bg-neutral-50 border-b border-neutral-100">
      <div className="container-page grid grid-cols-2 lg:grid-cols-4 gap-5 py-5">
        {items.map((item) => (
          <div key={item.value} className="flex items-center gap-2.5">
            <item.icon size={21} className="text-primary-700 shrink-0" />
            <div>
              <p className="text-[13px] font-semibold text-neutral-800">{item.value}</p>
              <p className="text-[11px] text-neutral-500">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Categories() {
  return (
    <section className="py-12 md:py-14">
      <div className="container-page">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <SectionHeader label="Shop by Category" title="Popular Categories" className="!mb-0" />
          <a href="/aquarium" className="inline-flex items-center gap-1 text-[13px] font-medium text-primary-700 no-underline hover:underline">
            Explore aquarium products <ArrowRight size={14} />
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((category) => (
            <a
              key={category.name}
              href={category.href}
              className="group min-w-0 border border-neutral-100 rounded-md bg-neutral-0 overflow-hidden no-underline hover:border-primary-300 hover:shadow-sm transition-[border-color,box-shadow] duration-normal"
            >
              <div className="relative aspect-4/3 bg-neutral-50 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-normal"
                />
              </div>
              <div className="p-3">
                <h3 className="text-[13px] font-semibold text-neutral-900 group-hover:text-primary-700">
                  {category.name}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">{category.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Showcase({ products }: { products: ProductListItem[] }) {
  if (products.length === 0) return null;

  return (
    <section className="py-12 md:py-14 bg-neutral-50">
      <div className="container-page">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <SectionHeader
            label="Selected Products"
            title="Wholesale Products to Explore"
            description="A selection from our active catalog, ready to add to your inquiry."
            className="!mb-0"
          />
          <a href="#products" className="inline-flex items-center gap-1 text-[13px] font-medium text-primary-700 no-underline hover:underline shrink-0">
            View more products <ArrowRight size={14} />
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>
      </div>
    </section>
  );
}

function Catalog({ products }: { products: ProductListItem[] }) {
  return (
    <section id="products" className="py-12 md:py-14 scroll-mt-16">
      <div className="container-page">
        <SectionHeader
          label="Wholesale Product Range"
          title="Explore Our Product Selection"
          description="Find products for your next order and add them to one inquiry."
          className="!mb-0"
        />
        {products.length > 0 && <HomeProductCatalog products={products} />}
        {products.length === 0 && (
          <div className="mt-8 bg-neutral-50 border border-neutral-100 rounded-md px-6 py-12 text-center">
            <p className="font-medium text-neutral-800">Products are temporarily unavailable.</p>
            <p className="text-sm text-neutral-500 mt-1">Browse a category or contact us with your sourcing brief.</p>
          </div>
        )}
        <div className="text-center mt-9">
          <Button variant="secondary" size="md" href="/aquarium">
            Browse the Aquarium Range <ArrowRight size={15} />
          </Button>
        </div>
      </div>
    </section>
  );
}

function ValueStrip() {
  const values = [
    { icon: Factory, title: "Factory Direct", text: "Work with the manufacturing team." },
    { icon: CheckCircle, title: "OEM / ODM", text: "Develop your own product line." },
    { icon: Truck, title: "Export Support", text: "Coordinate shipment to your market." },
    { icon: ShieldCheck, title: "Quality Process", text: "Documented production controls." },
  ];

  return (
    <section className="bg-neutral-50 border-y border-neutral-100">
      <div className="container-page grid grid-cols-2 lg:grid-cols-4 gap-6 py-9">
        {values.map((value) => (
          <div key={value.title} className="flex gap-3">
            <value.icon size={23} className="text-primary-700 shrink-0" />
            <div>
              <h3 className="text-[13px] font-semibold text-neutral-900">{value.title}</h3>
              <p className="text-xs text-neutral-500 mt-1">{value.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="bg-primary-900 py-12">
      <div className="container-page flex flex-col md:flex-row md:items-center md:justify-between gap-7">
        <div>
          <h2 className="font-display text-[clamp(26px,3vw,34px)] font-bold text-neutral-0 leading-tight">
            Ready to source for your market?
          </h2>
          <p className="text-sm text-primary-200 mt-2">
            Add products to your inquiry list and send one request to our team.
          </p>
        </div>
        <Button variant="accent" size="lg" href="/contact">
          Send an Inquiry <ArrowRight size={16} />
        </Button>
      </div>
    </section>
  );
}

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const firstPage = await fetchActiveProducts().catch(() => null);
  const secondPage = firstPage && firstPage.last_page > 1
    ? await fetchActiveProducts(2).catch(() => null)
    : null;
  const products = [...(firstPage?.result ?? []), ...(secondPage?.result ?? [])];
  const showcase = selectBalancedProducts(products, 6);
  const catalog = selectBalancedProducts(products, 12, new Set(showcase.map((product) => product.id)));

  return (
    <>
      <Hero productCount={firstPage?.total ?? 0} />
      <TrustBar />
      <Categories />
      <Showcase products={showcase} />
      <Catalog products={catalog} />
      <ValueStrip />
      <CallToAction />
    </>
  );
}
