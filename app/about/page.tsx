import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Gem,
  Globe2,
  HeartHandshake,
  Microscope,
  Quote,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import GemVisual from '@/components/GemVisual';
import SectionHeading from '@/components/SectionHeading';
import TestimonialCard from '@/components/TestimonialCard';
import { reviews } from '@/data/reviews';

export const metadata: Metadata = {
  title: 'Our Story',
  description:
    'Three generations of gemmologists in Johari Bazaar, Jaipur. Learn how Rashi Ratan sources, tests and certifies every gemstone it sells.',
};

const STATS = [
  { icon: Users, value: '25,000+', label: 'Customers served' },
  { icon: Gem, value: '18,400', label: 'Stones certified' },
  { icon: Globe2, value: '11', label: 'Sourcing countries' },
  { icon: Award, value: '27 yrs', label: 'In the trade' },
];

const TIMELINE = [
  {
    year: '1998',
    title: 'A counter in Johari Bazaar',
    copy: 'Shri Mohan Lal Soni opens a single gemstone counter in Jaipur, selling to families who came on the recommendation of their astrologers.',
  },
  {
    year: '2006',
    title: 'Our own testing bench',
    copy: 'A refractometer, a spectroscope and a stubborn rule: nothing leaves the counter described as natural until it has been tested.',
  },
  {
    year: '2014',
    title: 'Direct sourcing',
    copy: 'We begin buying at the source in Ratnapura, Kagem and Nepal, cutting out the layers that inflate prices without adding assurance.',
  },
  {
    year: '2026',
    title: 'Rashi Ratan online',
    copy: 'The same bench, the same standard, now shipping certified stones and energised yantras across India with astrological guidance included.',
  },
];

const PILLARS = [
  {
    icon: Microscope,
    title: 'Authenticity',
    copy: 'Every stone is examined on our own bench and then sent to an independent laboratory. If a stone is heated, filled or glass composite, the listing says so in plain words.',
  },
  {
    icon: BadgeCheck,
    title: 'Certified Products',
    copy: 'IGI, GRS and GIA reports accompany our gemstones. Rudraksha beads carry an X ray report showing the natural mukhi count and a single intact chamber.',
  },
  {
    icon: HeartHandshake,
    title: 'Expert Guidance',
    copy: 'Our astrologers read your chart before recommending anything, and will tell you when no stone is needed. Advice first, sale second.',
  },
  {
    icon: ShieldCheck,
    title: 'Customer Trust',
    copy: 'Insured shipping, seven day returns and a support team that answers within one working day. Most of our growth still comes from referrals.',
  },
];

const GEMS = [
  { cut: 'oval', light: '#8ab6ff', base: '#2b5fd9', deep: '#122a73' },
  { cut: 'emerald', light: '#8ff0c4', base: '#12a26b', deep: '#05512f' },
  { cut: 'cushion', light: '#ffeaa0', base: '#f0b429', deep: '#9a6a05' },
  { cut: 'pear', light: '#d6b6ff', base: '#8b4cd6', deep: '#421a70' },
] as const;

export default function AboutPage() {
  return (
    <>
      {/* ---------------------------------- Hero ---------------------------------- */}
      <section className="relative overflow-hidden bg-royal-deep py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-aurora opacity-80" />
        <div className="noise pointer-events-none absolute inset-0" />

        <div className="container-x relative grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <span className="eyebrow rounded-full border border-gold-400/30 bg-white/5 px-4 py-2 text-gold-300 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Since 1998 · Jaipur
            </span>
            <h1 className="h-display mt-6 text-5xl leading-[1.05] text-white sm:text-6xl xl:text-7xl">
              Gemstones sold the way our <span className="text-gold-gradient italic">grandfather sold them</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/65">
              Honestly, with the report in your hand and nothing hidden behind a velvet cloth. Three generations later,
              that is still the whole business.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="btn btn-lg btn-gold">
                Explore the collection <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="btn btn-lg btn-ghost-light">
                Visit our store
              </Link>
            </div>
          </div>

          <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-5">
            {GEMS.map((art, index) => (
              <div
                key={index}
                className="aspect-square rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl"
                style={{ animation: `float ${6 + index}s ease-in-out ${index * 0.4}s infinite` }}
              >
                <GemVisual art={art} seed={`about-gem-${index}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------- Stats ---------------------------------- */}
      <section className="relative z-10 -mt-12">
        <div className="container-x">
          <div className="grid grid-cols-2 gap-4 rounded-[2rem] border border-sand-200 bg-white/90 p-6 shadow-lift backdrop-blur-xl lg:grid-cols-4">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 p-3 text-center">
                <Icon className="h-6 w-6 text-royal-600" strokeWidth={1.7} />
                <p className="font-display text-4xl font-bold text-navy-900">{value}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-navy-900/45">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------- Our story -------------------------------- */}
      <section className="section-y">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our story"
            title="A family bench in"
            accent="Johari Bazaar"
            description="Rashi Ratan grew out of a single gemstone counter in Jaipur, where trust was built one customer at a time and a wrong stone could end a reputation."
          />

          <ol className="relative mx-auto max-w-3xl">
            <span className="absolute bottom-6 left-[27px] top-6 w-px bg-sand-300 sm:left-1/2" aria-hidden="true" />
            {TIMELINE.map((entry, index) => (
              <li key={entry.year} className="relative flex gap-6 pb-10 last:pb-0 sm:gap-0">
                <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-royal-deep font-display text-sm font-bold text-gold-300 shadow-soft sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                  {entry.year}
                </span>
                <div
                  className={`rounded-3xl border border-sand-200 bg-white p-6 shadow-soft sm:w-[calc(50%-3rem)] ${
                    index % 2 === 0 ? 'sm:mr-auto sm:text-right' : 'sm:ml-auto'
                  }`}
                >
                  <h3 className="font-display text-2xl font-semibold text-navy-900">{entry.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-navy-900/60">{entry.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* --------------------------------- Pillars --------------------------------- */}
      <section id="certification" className="section-y scroll-mt-32 bg-white/60">
        <div className="container-x">
          <SectionHeading
            eyebrow="What we stand for"
            title="Four things we never"
            accent="compromise on"
            description="These are the standards that decide what we buy, what we reject, and what we tell you before you pay."
          />

          <div className="grid gap-5 md:grid-cols-2">
            {PILLARS.map(({ icon: Icon, title, copy }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-3xl border border-sand-200 bg-white p-8 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift"
              >
                <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-royal-100/50 transition-transform duration-500 group-hover:scale-150" />
                <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-royal-deep text-gold-300">
                  <Icon className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <h3 className="relative mt-6 font-display text-3xl font-semibold text-navy-900">{title}</h3>
                <p className="relative mt-3 text-[15px] leading-relaxed text-navy-900/60">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------- Founder note ------------------------------- */}
      <section className="section-y">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-navy-950 p-10 text-center sm:p-16">
            <div className="pointer-events-none absolute inset-0 bg-aurora opacity-50" />
            <div className="noise pointer-events-none absolute inset-0" />
            <Quote className="relative mx-auto h-10 w-10 text-gold-400/50" />
            <blockquote className="relative mx-auto mt-6 max-w-3xl font-display text-3xl leading-snug text-white sm:text-4xl">
              A gemstone is worn against the skin for years. If I would not put it on my own daughter, it does not leave
              this counter.
            </blockquote>
            <p className="relative mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300">
              Mohan Lal Soni · Founder
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------- Testimonials ------------------------------- */}
      <section className="relative overflow-hidden bg-royal-deep py-20 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-aurora opacity-60" />
        <div className="container-x relative">
          <SectionHeading
            tone="dark"
            eyebrow="Customer trust"
            title="Why people keep"
            accent="coming back"
            description="Verified reviews from buyers across India."
          />
          <div className="stagger grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {reviews.slice(0, 3).map((review) => (
              <TestimonialCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------- CTA ----------------------------------- */}
      <section className="section-y">
        <div className="container-x text-center">
          <h2 className="h-display mx-auto max-w-2xl text-4xl text-navy-900 sm:text-5xl">
            Come see the stones, or let them <span className="text-royal-gradient italic">come to you</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-navy-900/55">
            Our Jaipur counter is open six days a week, and everything on it is available online with the same
            certificate and the same guidance.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/shop" className="btn btn-lg btn-primary">
              Shop certified gemstones <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/astrology#finder" className="btn btn-lg btn-outline">
              Get a free recommendation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
