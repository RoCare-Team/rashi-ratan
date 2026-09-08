import Link from 'next/link';
import { ArrowRight, BadgeCheck, Sparkles, Star } from 'lucide-react';
import { zodiacSigns } from '@/data/zodiac';
import GemVisual from './GemVisual';

/**
 * Ambient gemstones drifting behind the hero. The left hand pair only appears
 * from 2xl up, where the outer margin is wide enough to clear the headline.
 */
const FLOATING_GEMS = [
  { art: { cut: 'oval', light: '#8ab6ff', base: '#2b5fd9', deep: '#122a73' }, className: 'hidden 2xl:block left-[1.5%] top-[14%] h-20 w-20 animate-float', delay: '0s' },
  { art: { cut: 'pear', light: '#ffe9b0', base: '#e0a72b', deep: '#8a5c07' }, className: 'hidden lg:block right-[6%] top-[10%] h-16 w-16 animate-float-slow', delay: '1.4s' },
  { art: { cut: 'emerald', light: '#8ff0c4', base: '#12a26b', deep: '#05512f' }, className: 'hidden 2xl:block bottom-[9%] left-[1.5%] h-20 w-20 animate-float-slow', delay: '2.2s' },
  { art: { cut: 'round', light: '#ff9aa8', base: '#d61f3d', deep: '#6d0b1c' }, className: 'hidden lg:block bottom-[8%] right-[11%] h-16 w-16 animate-float', delay: '0.8s' },
  { art: { cut: 'cushion', light: '#d6b6ff', base: '#8b4cd6', deep: '#421a70' }, className: 'hidden lg:block right-[1%] top-[44%] h-14 w-14 animate-float', delay: '3s' },
] as const;

const STATS = [
  { value: '25,000+', label: 'Happy customers' },
  { value: '100%', label: 'Lab certified' },
  { value: '4.9/5', label: 'Average rating' },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-royal-deep">
      {/* Ambient layers */}
      <div className="pointer-events-none absolute inset-0 bg-aurora" />
      <div className="noise pointer-events-none absolute inset-0" />

      {/* Star field */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 40 }).map((_, index) => {
          const left = (index * 37) % 100;
          const top = (index * 61) % 100;
          const size = 1 + (index % 3) * 0.6;
          return (
            <span
              key={index}
              className="absolute animate-twinkle rounded-full bg-white"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: `${(index % 7) * 0.45}s`,
                opacity: 0.5,
              }}
            />
          );
        })}
      </div>

      {/* Floating gemstones */}
      {FLOATING_GEMS.map((gem, index) => (
        <div
          key={index}
          className={`pointer-events-none absolute opacity-70 ${gem.className}`}
          style={{ animationDelay: gem.delay }}
        >
          <GemVisual art={gem.art} seed={`hero-float-${index}`} />
        </div>
      ))}

      <div className="container-x relative grid items-center gap-14 py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:py-28">
        {/* ---------------------------------- Copy ---------------------------------- */}
        <div className="max-w-2xl animate-fade-up">
          <span className="eyebrow rounded-full border border-gold-400/30 bg-white/5 px-4 py-2 text-gold-300 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Certified Rashi Ratna since 1998
          </span>

          <h1 className="h-display mt-6 text-[2.75rem] leading-[1.04] text-white sm:text-6xl xl:text-7xl">
            Discover the Power of Your{' '}
            <span className="relative inline-block">
              <span className="text-gold-gradient italic">Perfect Gemstone</span>
              <svg
                viewBox="0 0 300 12"
                className="absolute -bottom-2 left-0 h-2.5 w-full text-gold-400/70"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M2 8 C 80 2, 220 2, 298 7" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/65">
            Explore authentic gemstones and spiritual products crafted to bring positivity, prosperity, confidence and
            balance into your life.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/shop?category=rashi-ratna" className="btn btn-lg btn-gold">
              Shop Gemstones <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/astrology#finder" className="btn btn-lg btn-ghost-light">
              <Star className="h-4 w-4" /> Find Your Lucky Stone
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl font-bold text-white">{stat.value}</p>
                <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-white/45">{stat.label}</p>
              </div>
            ))}
            <div className="flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 backdrop-blur">
              <BadgeCheck className="h-4 w-4 text-emerald-300" />
              <span className="text-xs font-semibold text-white/70">IGI &amp; GRS certified</span>
            </div>
          </div>
        </div>

        {/* --------------------------------- Visual --------------------------------- */}
        <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
          {/* Rotating zodiac ring */}
          <div className="absolute inset-0 animate-spin-slow">
            <div className="absolute inset-0 rounded-full border border-dashed border-gold-400/25" />
            {zodiacSigns.map((sign, index) => {
              const angle = (index / zodiacSigns.length) * 360;
              return (
                <span
                  key={sign.slug}
                  className="absolute left-1/2 top-1/2 text-xl text-gold-300/70"
                  style={{
                    transform: `rotate(${angle}deg) translateY(calc(-1 * clamp(8rem, 22vw, 16.5rem))) rotate(${-angle}deg) translate(-50%, -50%)`,
                  }}
                  aria-hidden="true"
                >
                  {sign.symbol}
                </span>
              );
            })}
          </div>

          <div className="absolute inset-[12%] rounded-full border border-white/10" />
          <div
            className="absolute inset-[18%] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(212,169,51,.28) 0%, rgba(114,46,224,.18) 45%, transparent 70%)' }}
          />

          {/* Centre gemstone */}
          <div className="absolute inset-[22%] animate-float">
            <GemVisual
              art={{ cut: 'oval', light: '#c8b3ff', base: '#7c4ce0', deep: '#2b0f5e' }}
              seed="hero-centre"
            />
          </div>

          {/* Orbiting accents */}
          <div className="absolute right-[8%] top-[18%] h-20 w-20 animate-float-slow" style={{ animationDelay: '1s' }}>
            <GemVisual art={{ cut: 'bead', light: '#c99a6a', base: '#8a5a2b', deep: '#3e2410' }} seed="hero-bead" />
          </div>
          <div className="absolute bottom-[14%] left-[6%] h-24 w-24 animate-float" style={{ animationDelay: '2.4s' }}>
            <GemVisual art={{ cut: 'plate', light: '#ffd9a0', base: '#c0762e', deep: '#5f3208' }} seed="hero-yantra" />
          </div>

          {/* Floating trust chip */}
          <div className="absolute bottom-[4%] right-[2%] flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 pr-4 backdrop-blur-xl">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-sheen text-navy-950">
              <BadgeCheck className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold text-white">Lab Certified</span>
              <span className="block text-[11px] text-white/50">Every single stone</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom fade into the page background */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-sand-50 to-transparent" />
    </section>
  );
}
