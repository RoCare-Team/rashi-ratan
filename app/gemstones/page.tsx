import type { Metadata } from 'next';
import Link from 'next/link';
import { BadgeCheck, Diamond, FlaskConical, Gem, Scale, ShieldCheck, Sparkles } from 'lucide-react';
import GemTypesExplorer from '@/components/GemTypesExplorer';
import SectionHeading from '@/components/SectionHeading';
import FAQ from '@/components/FAQ';
import { gemTypes } from '@/data/gemTypes';

export const metadata: Metadata = {
  title: 'Types of Gemstones — Navratna, Uparatna & Crystals',
  description:
    'A complete guide to the types of gemstones used in Vedic astrology: the nine Navratna planetary gems, semi-precious uparatna substitutes and healing crystals, with planet, rashi, hardness and how to wear each.',
};

const COMPARISON = [
  {
    icon: Diamond,
    title: 'Precious (Ratna)',
    points: [
      'Ruby, Pearl, Coral, Emerald, Yellow & Blue Sapphire, Diamond, Hessonite, Cat’s Eye',
      'Strongest planetary effect — prescribed from the birth chart',
      'Priced per carat (Ratti); weight depends on body weight',
      'Should always carry an independent lab certificate',
    ],
  },
  {
    icon: Gem,
    title: 'Semi-precious (Uparatna)',
    points: [
      'Amethyst, Topaz, Garnet, Peridot, Moonstone, Opal, Zircon',
      'Same planet, gentler and safer effect',
      'A fraction of the price — ideal first stone or trial',
      'Good choice when the main gem is too costly or too intense',
    ],
  },
  {
    icon: Sparkles,
    title: 'Healing crystals',
    points: [
      'Clear & Rose Quartz, Black Tourmaline, Citrine, Amethyst clusters',
      'Used for meditation, vastu and home energy',
      'Safe for everyone — no chart reading needed',
      'Sold by size or weight rather than carat',
    ],
  },
];

const TREATMENTS = [
  {
    icon: BadgeCheck,
    title: 'Natural & untreated',
    copy: 'Mined and only cut and polished. The only kind recommended for astrological use, and what every Agarwal Gemstone stone is.',
  },
  {
    icon: FlaskConical,
    title: 'Heated or treated',
    copy: 'Natural stones improved by heat, oil, glass filling or dye. Legal when disclosed, but lower value and traditionally weaker for remedies.',
  },
  {
    icon: Scale,
    title: 'Synthetic or imitation',
    copy: 'Made in a lab or from glass. They look identical to the eye, which is why a lab report from IGI, GRS, GIA or GII matters.',
  },
];

const GUIDE_FAQS = [
  {
    question: 'How many types of gemstones are there?',
    answer:
      'Gemmologists recognise over 200 gem varieties. Vedic astrology works mainly with the nine Navratna planetary gems, around 84 uparatna (semi-precious) stones, and a family of healing crystals. This guide covers the ones most often prescribed in India.',
  },
  {
    question: 'Which gemstone should I wear?',
    answer:
      'Your gemstone depends on your birth chart — mainly your ascendant (lagna), moon sign and current mahadasha — not only your sun sign. Use the Lucky Stone Finder for a quick suggestion, ask our astrology assistant, or book a free consultation before buying a strong stone like Blue Sapphire.',
  },
  {
    question: 'Are semi-precious stones effective?',
    answer:
      'Traditionally yes, at a gentler strength. Uparatna stones are a good way to begin, and many astrologers suggest them when the primary gem is costly or when a softer effect is wanted.',
  },
  {
    question: 'What weight should my gemstone be?',
    answer:
      'A common rule is 1 carat per 10–12 kg of body weight for the primary gem, with a minimum of 3 carats for sapphires and emerald. Your astrologer may adjust this to your chart.',
  },
  {
    question: 'How do I know a gemstone is genuine?',
    answer:
      'Ask for a report from an independent laboratory and check the report number on the lab’s website. Every Agarwal Gemstone gemstone ships with a tamper-proof lab certificate.',
  },
];

export default function GemstonesPage() {
  return (
    <>
      {/* ---------------------------------- Hero ---------------------------------- */}
      <section className="relative overflow-hidden bg-royal-deep py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-aurora opacity-80" />
        <div className="noise pointer-events-none absolute inset-0" />
        <div className="container-x relative text-center">
          <span className="eyebrow mx-auto rounded-full border border-gold-400/30 bg-white/5 px-4 py-2 text-gold-300 backdrop-blur">
            <Gem className="h-3.5 w-3.5" /> {gemTypes.length} gemstones explained
          </span>
          <h1 className="h-display mx-auto mt-6 max-w-4xl text-5xl leading-[1.05] text-white sm:text-6xl">
            Types of <span className="text-gold-gradient italic">gemstones</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/65">
            From the nine Navratna planetary gems to gentle uparatna substitutes and healing crystals. Learn what each
            stone does, which planet it serves, and how it is traditionally worn.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="#navratna" className="btn btn-lg btn-gold">
              Explore the Navratna
            </Link>
            <Link href="/astrology#finder" className="btn btn-lg btn-ghost-light">
              Find my lucky stone
            </Link>
          </div>
        </div>
      </section>

      {/* -------------------------------- Explorer -------------------------------- */}
      <section className="section-y">
        <div className="container-x">
          <GemTypesExplorer />
        </div>
      </section>

      {/* ------------------------------- Comparison ------------------------------- */}
      <section className="section-y bg-white/60">
        <div className="container-x">
          <SectionHeading
            eyebrow="Know the difference"
            title="Precious, semi-precious or"
            accent="crystal?"
            description="Three families of stones, three different jobs. Here is how they compare."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {COMPARISON.map(({ icon: Icon, title, points }) => (
              <div key={title} className="rounded-3xl border border-sand-200 bg-white p-7 shadow-soft">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-royal-50 text-royal-700">
                  <Icon className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <h3 className="mt-5 font-display text-2xl font-semibold text-navy-900">{title}</h3>
                <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-navy-900/65">
                  {points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {TREATMENTS.map(({ icon: Icon, title, copy }) => (
              <div key={title} className="flex gap-4 rounded-3xl border border-sand-200 bg-sand-50 p-6">
                <Icon className="mt-1 h-6 w-6 shrink-0 text-royal-600" />
                <div>
                  <h3 className="font-semibold text-navy-900">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-navy-900/60">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------- FAQ ----------------------------------- */}
      <section className="section-y">
        <div className="container-x">
          <SectionHeading eyebrow="Gemstone questions" title="Before you" accent="buy" />
          <div className="mx-auto max-w-4xl">
            <FAQ items={GUIDE_FAQS} />
          </div>

          <div className="mx-auto mt-14 flex max-w-4xl flex-col items-center gap-5 rounded-3xl bg-royal-deep p-8 text-center text-white sm:p-10">
            <ShieldCheck className="h-10 w-10 text-gold-300" />
            <h2 className="h-display text-3xl">Not sure which stone is yours?</h2>
            <p className="max-w-xl text-sm leading-relaxed text-white/60">
              Chat with our astrology assistant any time using the button in the corner, or get a free 15 minute
              consultation with a Agarwal Gemstone astrologer.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/astrology#consultation" className="btn btn-md btn-gold">
                Book free consultation
              </Link>
              <Link href="/shop" className="btn btn-md btn-ghost-light">
                Shop certified gemstones
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
