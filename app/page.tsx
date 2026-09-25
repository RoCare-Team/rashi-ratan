import Link from 'next/link';
import { ArrowRight, BadgeCheck, Gem, HeartHandshake, MessageCircleQuestion, Microscope, Truck } from 'lucide-react';
import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import SectionHeading from '@/components/SectionHeading';
import CategoryCard from '@/components/CategoryCard';
import ProductGrid from '@/components/ProductGrid';
import ShopByRashi from '@/components/ShopByRashi';
import LuckyStoneFinder from '@/components/LuckyStoneFinder';
import TestimonialCard from '@/components/TestimonialCard';
import FAQ from '@/components/FAQ';
import { getCategoriesWithCounts } from '@/data/categories';
import { getBestsellers, getFeaturedProducts } from '@/data/products';
import { faqs, reviews } from '@/data/reviews';

const PROMISES = [
  {
    icon: Microscope,
    title: 'Tested before it ships',
    copy: 'Every stone passes through an independent laboratory. The report number is printed on a tamper proof seal you can verify yourself.',
  },
  {
    icon: HeartHandshake,
    title: 'Advice before a sale',
    copy: 'Our astrologers will tell you when you do not need a stone. Honest guidance has kept families with us for three generations.',
  },
  {
    icon: Truck,
    title: 'Insured to your door',
    copy: 'Discreet, insured shipping across India with live tracking, and a seven day return window on everything you buy.',
  },
];

export default function HomePage() {
  const categories = getCategoriesWithCounts();
  const featured = getFeaturedProducts();
  const bestsellers = getBestsellers(4);

  return (
    <>
      <Hero />
      <TrustBar />

      {/* ------------------------------- Categories ------------------------------- */}
      <section className="section-y">
        <div className="container-x">
          <SectionHeading
            eyebrow="Shop by category"
            title="Everything for your"
            accent="practice"
            description="From certified planetary gemstones to energised yantras, each collection is curated by our in house gemmologists and astrologers."
            link={{ href: '/shop', label: 'View all products' }}
            align="left"
          />

          <div className="stagger grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------- Featured gemstones ---------------------------- */}
      <section className="relative section-y">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white via-sand-100/70 to-white" />
        <div className="container-x">
          <SectionHeading
            eyebrow="Handpicked this month"
            title="Featured"
            accent="Gemstones"
            description="Certified, unheated and hand selected for colour saturation. Each stone ships with its laboratory report and a free wearing guide."
            link={{ href: '/shop', label: 'Explore the collection' }}
            align="left"
          />

          <ProductGrid products={featured} columns={4} />
        </div>
      </section>

      {/* ------------------------------ Shop by rashi ------------------------------ */}
      <ShopByRashi />

      {/* ------------------------------ Lucky finder ------------------------------ */}
      <LuckyStoneFinder />

      {/* -------------------------------- Promises -------------------------------- */}
      <section className="section-y">
        <div className="container-x">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Why Agarwal Gemstone"
                title="Three generations of"
                accent="honest gemmology"
                description="We began as a family counter in Johari Bazaar, Jaipur in 1998. The scale has changed, the standard has not: no treated stone leaves our workshop described as natural."
                className="mb-8"
              />
              <Link href="/about" className="btn btn-md btn-primary">
                Read our story <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4">
              {PROMISES.map(({ icon: Icon, title, copy }) => (
                <div
                  key={title}
                  className="group flex gap-5 rounded-3xl border border-sand-200 bg-white p-6 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-royal-50 text-royal-700 transition-colors duration-300 group-hover:bg-royal-deep group-hover:text-gold-300">
                    <Icon className="h-[22px] w-[22px]" strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-navy-900">{title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-navy-900/55">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------- Bestsellers ------------------------------- */}
      <section className="pb-4">
        <div className="container-x">
          <SectionHeading
            align="left"
            eyebrow="Loved by our customers"
            title="This week's"
            accent="bestsellers"
            link={{ href: '/shop?sort=popular', label: 'See what is trending' }}
          />
          <ProductGrid products={bestsellers} columns={4} />
        </div>
      </section>

      {/* ------------------------------ Testimonials ------------------------------ */}
      <section className="relative mt-20 overflow-hidden bg-navy-950 py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-aurora opacity-60" />
        <div className="noise pointer-events-none absolute inset-0" />

        <div className="container-x relative">
          <SectionHeading
            tone="dark"
            eyebrow="Customer stories"
            title="Trusted by families"
            accent="across India"
            description="Over 25,000 orders delivered, and a 4.9 average rating from verified buyers."
          />

          <div className="stagger grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {reviews.slice(0, 4).map((review) => (
              <TestimonialCard key={review.id} review={review} />
            ))}
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {reviews.slice(4, 8).map((review) => (
              <TestimonialCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------- FAQ ----------------------------------- */}
      <section id="faq" className="section-y">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <SectionHeading
                align="left"
                eyebrow="Questions"
                title="Everything you"
                accent="asked us"
                description="Cannot find your answer? Our team replies to every message within one working day."
                className="mb-6"
              />
              <Link href="/contact" className="btn btn-md btn-outline">
                <MessageCircleQuestion className="h-4 w-4" /> Talk to an expert
              </Link>

              <div className="mt-8 flex items-center gap-4 rounded-3xl border border-sand-200 bg-white p-5 shadow-soft">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold-100 text-gold-700">
                  <BadgeCheck className="h-6 w-6" />
                </span>
                <p className="text-sm leading-relaxed text-navy-900/60">
                  <span className="font-semibold text-navy-900">Certificate with every stone.</span> Verify the report
                  number on the laboratory website before you wear it.
                </p>
              </div>
            </div>

            <FAQ items={faqs} />
          </div>
        </div>
      </section>

      {/* ------------------------------- Closing CTA ------------------------------- */}
      <section className="pb-20 md:pb-28">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-royal-deep px-8 py-16 text-center sm:px-16">
            <div className="pointer-events-none absolute inset-0 bg-aurora opacity-70" />
            <div className="noise pointer-events-none absolute inset-0" />

            <div className="relative mx-auto max-w-2xl">
              <span className="eyebrow rounded-full border border-gold-400/30 bg-white/5 px-4 py-2 text-gold-300 backdrop-blur">
                <Gem className="h-3.5 w-3.5" /> Free 15 minute consultation
              </span>
              <h2 className="h-display mt-6 text-4xl text-white sm:text-5xl">
                Not sure which stone is <span className="text-gold-gradient italic">meant for you?</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-white/60">
                Send us your birth details and one of our astrologers will study your chart and recommend the right
                gemstone, or tell you honestly if you do not need one.
              </p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/astrology#finder" className="btn btn-lg btn-gold">
                  Book a free consultation <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/shop" className="btn btn-lg btn-ghost-light">
                  Browse all products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
