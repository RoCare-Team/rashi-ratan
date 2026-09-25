import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CalendarClock, Check, MessageSquare, Sparkles, Star, Video } from 'lucide-react';
import LuckyStoneFinder from '@/components/LuckyStoneFinder';
import ShopByRashi from '@/components/ShopByRashi';
import SectionHeading from '@/components/SectionHeading';
import FAQ from '@/components/FAQ';
import GemVisual from '@/components/GemVisual';
import { faqs } from '@/data/reviews';

export const metadata: Metadata = {
  title: 'Astrology & Gemstone Guidance',
  description:
    'Find your lucky gemstone, explore the nine planetary stones of the navagraha, and book a free consultation with a Rashi Ratan astrologer.',
};

const NAVAGRAHA = [
  { planet: 'Sun', hindi: 'Surya', stone: 'Ruby', hindiStone: 'Manik', day: 'Sunday', metal: 'Gold', slug: 'natural-ruby-manik', art: { cut: 'oval', light: '#ff9aa8', base: '#d61f3d', deep: '#6d0b1c' } },
  { planet: 'Moon', hindi: 'Chandra', stone: 'Pearl', hindiStone: 'Moti', day: 'Monday', metal: 'Silver', slug: 'natural-pearl-moti', art: { cut: 'round', light: '#ffffff', base: '#eae4f2', deep: '#a8a0bd' } },
  { planet: 'Mars', hindi: 'Mangal', stone: 'Red Coral', hindiStone: 'Moonga', day: 'Tuesday', metal: 'Copper', slug: 'red-coral-moonga', art: { cut: 'oval', light: '#ffb0a0', base: '#e04a2f', deep: '#7c1c0e' } },
  { planet: 'Mercury', hindi: 'Budh', stone: 'Emerald', hindiStone: 'Panna', day: 'Wednesday', metal: 'Gold', slug: 'emerald-panna', art: { cut: 'emerald', light: '#8ff0c4', base: '#12a26b', deep: '#05512f' } },
  { planet: 'Jupiter', hindi: 'Guru', stone: 'Yellow Sapphire', hindiStone: 'Pukhraj', day: 'Thursday', metal: 'Gold', slug: 'yellow-sapphire-pukhraj', art: { cut: 'cushion', light: '#ffeaa0', base: '#f0b429', deep: '#9a6a05' } },
  { planet: 'Venus', hindi: 'Shukra', stone: 'White Sapphire', hindiStone: 'Safed Pukhraj', day: 'Friday', metal: 'Silver', slug: 'white-sapphire-safed-pukhraj', art: { cut: 'round', light: '#ffffff', base: '#dfe6f2', deep: '#93a3bd' } },
  { planet: 'Saturn', hindi: 'Shani', stone: 'Blue Sapphire', hindiStone: 'Neelam', day: 'Saturday', metal: 'Silver', slug: 'natural-blue-sapphire-neelam', art: { cut: 'oval', light: '#8ab6ff', base: '#2b5fd9', deep: '#122a73' } },
  { planet: 'Rahu', hindi: 'Rahu', stone: 'Hessonite', hindiStone: 'Gomed', day: 'Saturday', metal: 'Silver', slug: 'hessonite-gomed', art: { cut: 'cushion', light: '#ffce9a', base: '#c9701f', deep: '#6b3406' } },
  { planet: 'Ketu', hindi: 'Ketu', stone: 'Cats Eye', hindiStone: 'Lehsunia', day: 'Tuesday', metal: 'Silver', slug: 'cats-eye-lehsunia', art: { cut: 'round', light: '#e6e2c0', base: '#9a8f52', deep: '#494023' } },
] as const;

const CONSULT_STEPS = [
  { icon: MessageSquare, title: 'Share your details', copy: 'Name, date, exact time and place of birth. That is all our astrologer needs to cast the chart.' },
  { icon: CalendarClock, title: 'We study the chart', copy: 'Within 24 hours we review your ascendant, mahadasha and planetary strengths before suggesting anything.' },
  { icon: Video, title: 'Talk it through', copy: 'A free 15 minute call over phone or video. You will hear plainly whether a stone is needed and which one.' },
];

export default function AstrologyPage() {
  return (
    <>
      {/* ---------------------------------- Hero ---------------------------------- */}
      <section className="relative overflow-hidden bg-royal-deep py-20 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-aurora opacity-80" />
        <div className="noise pointer-events-none absolute inset-0" />

        <div className="container-x relative text-center">
          <span className="eyebrow mx-auto rounded-full border border-gold-400/30 bg-white/5 px-4 py-2 text-gold-300 backdrop-blur">
            <Star className="h-3.5 w-3.5" /> Vedic astrology, plainly explained
          </span>
          <h1 className="h-display mx-auto mt-6 max-w-4xl text-5xl leading-[1.05] text-white sm:text-6xl xl:text-7xl">
            The right stone begins with the <span className="text-gold-gradient italic">right reading</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-white/65">
            Understand which planet needs strengthening in your chart before you buy anything. Use the finder for an
            instant suggestion, or speak to an astrologer free of charge.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="#finder" className="btn btn-lg btn-gold">
              <Sparkles className="h-4 w-4" /> Find my lucky gemstone
            </Link>
            <Link href="#consultation" className="btn btn-lg btn-ghost-light">
              Book a free consultation
            </Link>
          </div>
        </div>
      </section>

      {/* -------------------------------- Navagraha -------------------------------- */}
      <section className="section-y">
        <div className="container-x">
          <SectionHeading
            eyebrow="The nine planets"
            title="Navagraha and their"
            accent="gemstones"
            description="Each graha governs a domain of life and carries a corresponding stone. Strengthening a weak planet, or pacifying a troublesome one, is the whole logic of ratna shastra."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {NAVAGRAHA.map((row) => (
              <Link
                key={row.planet}
                href={`/product/${row.slug}`}
                className="group flex items-center gap-5 rounded-3xl border border-sand-200 bg-white p-5 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-royal-200 hover:shadow-lift"
              >
                <span
                  className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  style={{ background: `linear-gradient(140deg, ${row.art.light}2e, ${row.art.base}1a)` }}
                >
                  <GemVisual art={row.art} seed={`graha-${row.planet}`} sparkle={false} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-display text-2xl font-semibold leading-tight text-navy-900">
                    {row.planet} <span className="text-navy-900/40">· {row.hindi}</span>
                  </span>
                  <span className="mt-1 block text-sm font-semibold text-royal-700">
                    {row.stone} ({row.hindiStone})
                  </span>
                  <span className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-sand-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-navy-900/55">
                      {row.day}
                    </span>
                    <span className="rounded-full bg-sand-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-navy-900/55">
                      {row.metal}
                    </span>
                  </span>
                </span>

                <ArrowRight className="h-5 w-5 shrink-0 text-navy-900/25 transition-all group-hover:translate-x-1 group-hover:text-royal-700" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------- The finder -------------------------------- */}
      <LuckyStoneFinder />

      {/* ------------------------------- Shop by rashi ------------------------------ */}
      <ShopByRashi />

      {/* ------------------------------- Consultation ------------------------------- */}
      <section id="consultation" className="section-y scroll-mt-32">
        <div className="container-x">
          <SectionHeading
            eyebrow="Free consultation"
            title="Talk to an astrologer"
            accent="before you buy"
            description="No obligation, no upselling. If your chart does not call for a gemstone, we will say so."
          />

          <div className="grid gap-5 md:grid-cols-3">
            {CONSULT_STEPS.map(({ icon: Icon, title, copy }, index) => (
              <div key={title} className="relative rounded-3xl border border-sand-200 bg-white p-8 shadow-soft">
                <span className="absolute right-7 top-6 font-display text-6xl font-bold text-sand-200">
                  {index + 1}
                </span>
                <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-royal-50 text-royal-700">
                  <Icon className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <h3 className="relative mt-5 font-display text-2xl font-semibold text-navy-900">{title}</h3>
                <p className="relative mt-2.5 text-[15px] leading-relaxed text-navy-900/60">{copy}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 overflow-hidden rounded-[2rem] bg-royal-deep p-8 sm:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <h3 className="h-display text-3xl text-white sm:text-4xl">
                  Book your <span className="text-gold-gradient italic">free 15 minute</span> reading
                </h3>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    'Chart read by a practising astrologer',
                    'Honest answer on whether you need a stone',
                    'Weight and metal guidance included',
                    'Available in Hindi and English',
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-2.5 text-sm text-white/70">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <Link href="/contact" className="btn btn-lg btn-gold w-full">
                  Request a call back <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="tel:+919996992608" className="btn btn-lg btn-ghost-light w-full">
                  Call +91 99969 92608
                </a>
                <p className="text-center text-xs text-white/40">Mon to Sat · 10:00 AM to 7:00 PM IST</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------- FAQ ----------------------------------- */}
      <section className="pb-20 md:pb-28">
        <div className="container-x">
          <SectionHeading eyebrow="Good to know" title="Astrology" accent="questions" />
          <div className="mx-auto max-w-4xl">
            <FAQ items={faqs.slice(1, 4)} />
          </div>
        </div>
      </section>
    </>
  );
}
