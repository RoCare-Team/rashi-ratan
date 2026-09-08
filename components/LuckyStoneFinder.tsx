'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  Calendar,
  Check,
  Clock,
  Loader2,
  MapPin,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  User,
} from 'lucide-react';
import { findLuckyStone } from '@/data/zodiac';
import { getProductBySlug } from '@/data/products';
import type { Zodiac } from '@/lib/types';
import { formatINR } from '@/lib/utils';
import { useStore } from '@/context/StoreContext';
import { ProductImage } from './GemVisual';
import StarRating from './StarRating';

interface FormState {
  name: string;
  dob: string;
  tob: string;
  place: string;
}

const EMPTY: FormState = { name: '', dob: '', tob: '', place: '' };

/**
 * DEMO ONLY — the recommendation comes from findLuckyStone() in /data/zodiac.ts,
 * which derives a sign from the date of birth. A production build would call a
 * real ephemeris service with the full birth details.
 */
export default function LuckyStoneFinder() {
  const { addToCart } = useStore();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Zodiac | null>(null);

  const stone = result ? getProductBySlug(result.stoneSlug) : undefined;

  const update = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    // Simulated calculation delay so the loading state is visible in the demo
    window.setTimeout(() => {
      setResult(findLuckyStone(form.dob));
      setLoading(false);
    }, 1100);
  };

  const reset = () => {
    setForm(EMPTY);
    setResult(null);
  };

  return (
    <section id="finder" className="section-y relative overflow-hidden">
      {/* Decorative wash */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-aurora opacity-[0.13]" />

      <div className="container-x">
        <div className="overflow-hidden rounded-[2.5rem] border border-sand-200 bg-white shadow-lift">
          <div className="grid lg:grid-cols-[1fr_1.05fr]">
            {/* ------------------------------ Form side ------------------------------ */}
            <div className="relative overflow-hidden bg-royal-deep p-8 sm:p-10 lg:p-12">
              <div className="pointer-events-none absolute inset-0 bg-aurora opacity-60" />
              <div className="noise pointer-events-none absolute inset-0" />

              <div className="relative">
                <span className="eyebrow rounded-full border border-gold-400/30 bg-white/5 px-4 py-2 text-gold-300 backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" /> Free astrology tool
                </span>

                <h2 className="h-display mt-6 text-4xl text-white sm:text-5xl">
                  Lucky Gemstone <span className="text-gold-gradient italic">Finder</span>
                </h2>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/60">
                  Share your birth details and we will suggest the gemstone traditionally prescribed for your moon sign,
                  along with what it is worn to strengthen.
                </p>

                <form onSubmit={submit} className="mt-8 space-y-4">
                  <div>
                    <label htmlFor="finder-name" className="field-label text-white/50">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                      <input
                        id="finder-name"
                        required
                        value={form.name}
                        onChange={update('name')}
                        placeholder="Your full name"
                        className="h-12 w-full rounded-2xl border border-white/15 bg-white/5 pl-11 pr-4 text-[15px] text-white placeholder:text-white/30 backdrop-blur transition-all focus:border-gold-400/60 focus:outline-none focus:ring-4 focus:ring-gold-400/10"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="finder-dob" className="field-label text-white/50">
                        Date of Birth
                      </label>
                      <div className="relative">
                        <Calendar className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                        <input
                          id="finder-dob"
                          type="date"
                          required
                          value={form.dob}
                          onChange={update('dob')}
                          className="h-12 w-full rounded-2xl border border-white/15 bg-white/5 pl-11 pr-4 text-[15px] text-white placeholder:text-white/30 backdrop-blur transition-all [color-scheme:dark] focus:border-gold-400/60 focus:outline-none focus:ring-4 focus:ring-gold-400/10"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="finder-tob" className="field-label text-white/50">
                        Time of Birth
                      </label>
                      <div className="relative">
                        <Clock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                        <input
                          id="finder-tob"
                          type="time"
                          required
                          value={form.tob}
                          onChange={update('tob')}
                          className="h-12 w-full rounded-2xl border border-white/15 bg-white/5 pl-11 pr-4 text-[15px] text-white placeholder:text-white/30 backdrop-blur transition-all [color-scheme:dark] focus:border-gold-400/60 focus:outline-none focus:ring-4 focus:ring-gold-400/10"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="finder-place" className="field-label text-white/50">
                      Place of Birth
                    </label>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                      <input
                        id="finder-place"
                        required
                        value={form.place}
                        onChange={update('place')}
                        placeholder="City, State"
                        className="h-12 w-full rounded-2xl border border-white/15 bg-white/5 pl-11 pr-4 text-[15px] text-white placeholder:text-white/30 backdrop-blur transition-all focus:border-gold-400/60 focus:outline-none focus:ring-4 focus:ring-gold-400/10"
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="btn btn-lg btn-gold w-full">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Reading your chart…
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" /> Find My Lucky Gemstone
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] leading-relaxed text-white/35">
                    Demo tool for this prototype. For a full chart reading, book a free consultation with our
                    astrologers.
                  </p>
                </form>
              </div>
            </div>

            {/* ----------------------------- Result side ----------------------------- */}
            <div className="relative flex items-center justify-center bg-sand-50 p-8 sm:p-10 lg:p-12">
              {loading && (
                <div className="flex flex-col items-center text-center">
                  <span className="relative grid h-24 w-24 place-items-center">
                    <span className="absolute inset-0 animate-spin-slow rounded-full border-2 border-dashed border-royal-300" />
                    <Sparkles className="h-9 w-9 animate-pulse text-royal-600" />
                  </span>
                  <p className="mt-6 font-display text-2xl font-semibold text-navy-900">Aligning the planets…</p>
                  <p className="mt-1 text-sm text-navy-900/50">Calculating your moon sign</p>
                </div>
              )}

              {!loading && !result && (
                <div className="max-w-sm text-center">
                  <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-white shadow-soft">
                    <Sparkles className="h-9 w-9 text-royal-500" />
                  </span>
                  <h3 className="mt-6 font-display text-3xl font-semibold text-navy-900">Your stone is waiting</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-navy-900/55">
                    Fill in your birth details and we will match you with the gemstone your chart traditionally calls
                    for, plus the benefits it is worn for.
                  </p>
                  <ul className="mx-auto mt-6 max-w-xs space-y-2.5 text-left">
                    {['Instant recommendation', 'Benefits explained simply', 'Shop the exact certified stone'].map(
                      (line) => (
                        <li key={line} className="flex items-center gap-2.5 text-sm text-navy-900/60">
                          <Check className="h-4 w-4 shrink-0 text-emerald-500" /> {line}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}

              {!loading && result && stone && (
                <div className="w-full animate-fade-up">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <span className="badge badge-royal">Your recommendation</span>
                    <button
                      type="button"
                      onClick={reset}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-900/50 transition-colors hover:text-royal-700"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Start again
                    </button>
                  </div>

                  <div className="overflow-hidden rounded-3xl border border-sand-200 bg-white shadow-soft">
                    <div
                      className="flex items-center gap-5 p-6"
                      style={{
                        background: `linear-gradient(120deg, ${stone.art.light}26, #ffffff 60%)`,
                      }}
                    >
                      <div className="h-24 w-24 shrink-0">
                        <ProductImage
                          art={stone.art}
                          seed={`finder-${stone.id}`}
                          image={stone.images?.[0]}
                          alt={stone.name}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-royal-600">
                          {result.name} Rashi · {result.english}
                        </p>
                        <h3 className="mt-1 font-display text-3xl font-semibold leading-tight text-navy-900">
                          {result.luckyStone}
                        </h3>
                        <p className="text-sm text-navy-900/50">{result.luckyStoneHindi}</p>
                        <div className="mt-2">
                          <StarRating rating={stone.rating} count={stone.reviewCount} />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-sand-200 p-6">
                      {form.name && (
                        <p className="mb-4 text-sm text-navy-900/60">
                          <span className="font-semibold text-navy-900">{form.name.split(' ')[0]}</span>, your chart
                          points to {result.luckyStone}, the gemstone of {result.lord}.
                        </p>
                      )}

                      <p className="eyebrow mb-3 text-navy-900/40">Traditionally worn for</p>
                      <ul className="space-y-2.5">
                        {result.benefits.map((benefit) => (
                          <li key={benefit} className="flex items-start gap-2.5 text-sm text-navy-900/65">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-6 flex items-end justify-between border-t border-sand-200 pt-5">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-navy-900/40">
                            Suggested price
                          </p>
                          <div className="mt-1 flex items-baseline gap-2">
                            <span className="font-display text-3xl font-bold text-navy-900">
                              {formatINR(stone.price)}
                            </span>
                            <span className="text-sm text-navy-900/40 line-through">
                              {formatINR(stone.originalPrice)}
                            </span>
                          </div>
                        </div>
                        <span className="badge badge-green">In stock</span>
                      </div>

                      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => addToCart(stone)}
                          className="btn btn-md btn-primary flex-1"
                        >
                          <ShoppingBag className="h-4 w-4" /> Shop Now
                        </button>
                        <Link href={`/product/${stone.slug}`} className="btn btn-md btn-outline flex-1">
                          View details <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
