'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, CalendarDays, Check, Palette, ShoppingBag, Sparkles } from 'lucide-react';
import { zodiacSigns } from '@/data/zodiac';
import { getProductBySlug, getProductsByRashi } from '@/data/products';
import { formatINR } from '@/lib/utils';
import { useStore } from '@/context/StoreContext';
import { ProductImage } from './GemVisual';
import SectionHeading from './SectionHeading';
import StarRating from './StarRating';
import ZodiacCard from './ZodiacCard';

/** Interactive zodiac selector — pick a rashi, see its recommended gemstone. */
export default function ShopByRashi() {
  const [selected, setSelected] = useState(zodiacSigns[0].slug);
  const { addToCart } = useStore();

  const sign = zodiacSigns.find((item) => item.slug === selected) ?? zodiacSigns[0];
  const stone = getProductBySlug(sign.stoneSlug);
  const alsoSuited = getProductsByRashi(sign.slug)
    .filter((product) => product.slug !== sign.stoneSlug)
    .slice(0, 3);

  return (
    <section id="rashi" className="relative overflow-hidden bg-royal-deep py-20 md:py-28">
      {/* Ambient light */}
      <div className="pointer-events-none absolute inset-0 bg-aurora opacity-70" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />

      <div className="container-x relative">
        <SectionHeading
          tone="dark"
          eyebrow="Shop by Rashi"
          title="Find the stone written in"
          accent="your stars"
          description="Select your moon sign to see the gemstone traditionally prescribed for it, along with the qualities it is worn to strengthen."
        />

        {/* Zodiac wheel */}
        <div className="grid grid-cols-3 gap-x-4 gap-y-7 sm:grid-cols-4 lg:grid-cols-6">
          {zodiacSigns.map((item) => (
            <ZodiacCard key={item.slug} sign={item} active={item.slug === selected} onSelect={setSelected} />
          ))}
        </div>

        {/* Recommendation panel */}
        <div
          key={sign.slug}
          className="mt-14 animate-fade-up overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.06] backdrop-blur-xl"
        >
          <div className="grid lg:grid-cols-[1.1fr_1fr]">
            {/* Sign details */}
            <div className="border-b border-white/10 p-8 lg:border-b-0 lg:border-r lg:p-10">
              <div className="flex items-center gap-4">
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gold-sheen text-3xl text-navy-950 shadow-glow">
                  {sign.symbol}
                </span>
                <div>
                  <h3 className="h-display text-3xl text-white">
                    {sign.name} <span className="text-white/45">({sign.english})</span>
                  </h3>
                  <p className="text-sm text-white/50">
                    {sign.dates} · Ruled by {sign.lord}
                  </p>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: Sparkles, label: 'Element', value: sign.element },
                  { icon: CalendarDays, label: 'Lucky day', value: sign.luckyDay },
                  { icon: Palette, label: 'Lucky colour', value: sign.luckyColor },
                  { icon: Sparkles, label: 'Ruling lord', value: sign.lord },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                    <item.icon className="mb-2 h-4 w-4 text-gold-300" />
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">{item.label}</p>
                    <p className="mt-0.5 text-sm font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7">
                <p className="eyebrow mb-3 text-gold-300">Worn to strengthen</p>
                <ul className="space-y-2.5">
                  {sign.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2.5 text-sm text-white/70">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {alsoSuited.length > 0 && (
                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="eyebrow mb-4 text-white/40">Also suited to {sign.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {alsoSuited.map((product) => (
                      <Link
                        key={product.slug}
                        href={`/product/${product.slug}`}
                        className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/75 transition-all hover:-translate-y-0.5 hover:border-gold-400/50 hover:text-white"
                      >
                        {product.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recommended stone */}
            {stone && (
              <div className="relative flex flex-col justify-center p-8 lg:p-10">
                <span className="badge badge-gold self-start">Recommended gemstone</span>

                <div
                  className="relative mx-auto mt-6 h-48 w-48"
                  style={{
                    filter: `drop-shadow(0 24px 45px ${stone.art.base}55)`,
                  }}
                >
                  <ProductImage art={stone.art} seed={`rashi-${stone.id}`} image={stone.images?.[0]} alt={stone.name} />
                </div>

                <div className="mt-6 text-center">
                  <h4 className="h-display text-3xl text-white">
                    {sign.luckyStone} <span className="text-gold-gradient italic">{sign.luckyStoneHindi}</span>
                  </h4>
                  <div className="mt-3 flex justify-center">
                    <StarRating rating={stone.rating} count={stone.reviewCount} size="md" />
                  </div>
                  <div className="mt-4 flex items-baseline justify-center gap-3">
                    <span className="font-display text-4xl font-bold text-white">{formatINR(stone.price)}</span>
                    <span className="text-white/40 line-through">{formatINR(stone.originalPrice)}</span>
                  </div>
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={() => addToCart(stone)} className="btn btn-md btn-gold flex-1">
                    <ShoppingBag className="h-4 w-4" /> Add to Cart
                  </button>
                  <Link href={`/product/${stone.slug}`} className="btn btn-md btn-ghost-light flex-1">
                    View details <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <Link
                  href={`/shop?rashi=${sign.slug}`}
                  className="mt-4 text-center text-sm font-semibold text-gold-300 transition-colors hover:text-gold-200"
                >
                  Browse everything for {sign.name} Rashi
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
