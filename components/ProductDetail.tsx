'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import {
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronRight,
  Gem,
  Leaf,
  Minus,
  Package,
  Plus,
  RotateCcw,
  ScrollText,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  Zap,
} from 'lucide-react';
import type { Product, Review } from '@/lib/types';
import { cn, discountPercent, formatINR, initials, originalPriceForWeight, priceForWeight } from '@/lib/utils';
import { useStore } from '@/context/StoreContext';
import GemVisual, { ProductImage } from './GemVisual';
import StarRating from './StarRating';
import WishlistButton from './WishlistButton';

interface ProductDetailProps {
  product: Product;
  reviews: Review[];
}

type ViewKind = 'gem' | 'macro' | 'certificate' | 'packaging';

const VIEWS: Array<{ kind: ViewKind; label: string }> = [
  { kind: 'gem', label: 'Gemstone' },
  { kind: 'macro', label: 'Macro view' },
  { kind: 'certificate', label: 'Certificate' },
  { kind: 'packaging', label: 'Packaging' },
];

const ASSURANCES = [
  { icon: Leaf, title: '100% Natural Product', copy: 'Mined and untreated unless disclosed' },
  { icon: ScrollText, title: 'Authenticity Certificate', copy: 'Independent lab report included' },
  { icon: Package, title: 'Secure Packaging', copy: 'Tamper proof, sealed and insured' },
  { icon: RotateCcw, title: 'Easy Returns', copy: '7 day return window' },
  { icon: Truck, title: 'Fast Delivery', copy: '2 to 4 days in metro cities' },
];

/* ------------------------- Supporting illustrations ------------------------- */

function CertificateView({ product }: { product: Product }) {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="w-full max-w-xs rotate-[-2deg] rounded-2xl border border-gold-300/60 bg-white p-6 shadow-lift">
        <div className="flex items-center justify-between border-b border-sand-200 pb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-700">Gem Report</span>
          <BadgeCheck className="h-5 w-5 text-emerald-500" />
        </div>
        <p className="mt-4 font-display text-xl font-semibold text-navy-900">{product.name}</p>
        <dl className="mt-4 space-y-2 text-[11px]">
          {[
            ['Species', product.gemType],
            ['Origin', product.origin],
            ['Treatment', 'None detected'],
            ['Report no.', `RR-${product.id.toUpperCase()}-2026`],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-3 border-b border-dashed border-sand-200 pb-1.5">
              <dt className="text-navy-900/45">{label}</dt>
              <dd className="font-semibold text-navy-900">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[10px] leading-relaxed text-navy-900/40">
          Verify this report number on the issuing laboratory website. Sample document shown for the prototype.
        </p>
      </div>
    </div>
  );
}

function PackagingView({ product }: { product: Product }) {
  return (
    <div className="flex h-full w-full items-center justify-center p-10">
      <div className="relative w-full max-w-[15rem]">
        <div className="rounded-3xl bg-royal-deep p-6 shadow-lift">
          <div className="rounded-2xl border border-gold-400/30 bg-white/5 p-5 text-center backdrop-blur">
            <Gem className="mx-auto h-7 w-7 text-gold-300" />
            <p className="mt-3 font-display text-lg font-semibold text-white">Rashi Ratan</p>
            <p className="mt-0.5 text-[9px] uppercase tracking-[0.25em] text-white/40">Sealed &amp; insured</p>
            <div className="mt-4 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />
            <p className="mt-3 text-[11px] text-white/55">{product.name}</p>
          </div>
        </div>
        <div className="absolute -bottom-3 left-1/2 h-6 w-[80%] -translate-x-1/2 rounded-full bg-navy-950/20 blur-lg" />
      </div>
    </div>
  );
}

/* --------------------------------- Accordion -------------------------------- */

function Accordion({
  sections,
}: {
  sections: Array<{ title: string; icon: React.ElementType; content: React.ReactNode }>;
}) {
  const [open, setOpen] = useState(0);
  return (
    <div className="divide-y divide-sand-200 overflow-hidden rounded-3xl border border-sand-200 bg-white shadow-soft">
      {sections.map((section, index) => {
        const isOpen = open === index;
        return (
          <div key={section.title} className={cn(isOpen && 'bg-sand-50/60')}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-sand-50"
            >
              <span
                className={cn(
                  'grid h-10 w-10 shrink-0 place-items-center rounded-2xl transition-colors',
                  isOpen ? 'bg-royal-700 text-white' : 'bg-sand-100 text-navy-900/50',
                )}
              >
                <section.icon className="h-[18px] w-[18px]" />
              </span>
              <span className="flex-1 font-display text-xl font-semibold text-navy-900">{section.title}</span>
              <ChevronDown
                className={cn('h-5 w-5 shrink-0 text-navy-900/40 transition-transform', isOpen && 'rotate-180')}
              />
            </button>
            <div
              className={cn(
                'grid overflow-hidden transition-all duration-400 ease-out',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden">
                <div className="px-6 pb-6 pl-[4.5rem] text-[15px] leading-relaxed text-navy-900/60">
                  {section.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------- Main component ------------------------------ */

export default function ProductDetail({ product, reviews }: ProductDetailProps) {
  const router = useRouter();
  const { addToCart } = useStore();
  const [weightIndex, setWeightIndex] = useState(product.defaultWeightIndex);
  const [quantity, setQuantity] = useState(1);
  const [view, setView] = useState<ViewKind>('gem');
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });
  const [pincode, setPincode] = useState('');
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const price = priceForWeight(product, weightIndex);
  const originalPrice = originalPriceForWeight(product, weightIndex);
  const discount = discountPercent(originalPrice, price);
  const weightLabel = product.category === 'rudraksha' || product.category === 'crystals' ? 'Size' : 'Weight';

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = stageRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setZoom({
      active: true,
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    });
  };

  const buyNow = () => {
    addToCart(product, weightIndex, quantity);
    router.push('/checkout');
  };

  return (
    <div className="pb-20">
      {/* ------------------------------- Breadcrumb ------------------------------- */}
      <div className="border-b border-sand-200 bg-white/60">
        <div className="container-x flex items-center gap-2 py-4 text-xs font-medium text-navy-900/45">
          <Link href="/" className="transition-colors hover:text-royal-700">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/shop" className="transition-colors hover:text-royal-700">
            Shop
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={`/shop?category=${product.category}`} className="capitalize transition-colors hover:text-royal-700">
            {product.category.replace(/-/g, ' ')}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="truncate text-navy-900">{product.name}</span>
        </div>
      </div>

      <div className="container-x pt-8 md:pt-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* --------------------------------- Gallery -------------------------------- */}
          <div className="lg:sticky lg:top-36 lg:self-start">
            <div
              ref={stageRef}
              onMouseMove={onMouseMove}
              onMouseLeave={() => setZoom((current) => ({ ...current, active: false }))}
              className="relative aspect-square overflow-hidden rounded-[2rem] border border-sand-200 shadow-soft"
              style={{
                background: `radial-gradient(110% 90% at 50% 20%, ${product.art.light}2e 0%, #ffffff 58%, ${product.art.base}1a 100%)`,
              }}
            >
              {view === 'gem' && (
                <div
                  className="h-full w-full p-12 transition-transform duration-200 ease-out"
                  style={{
                    transform: zoom.active ? 'scale(1.6)' : 'scale(1)',
                    transformOrigin: `${zoom.x}% ${zoom.y}%`,
                  }}
                >
                  <ProductImage art={product.art} seed={`pdp-${product.id}`} image={product.images?.[0]} alt={product.name} />
                </div>
              )}

              {view === 'macro' && (
                <div className="h-full w-full scale-[1.7] p-12">
                  <GemVisual art={product.art} seed={`macro-${product.id}`} sparkle={false} />
                </div>
              )}

              {view === 'certificate' && <CertificateView product={product} />}
              {view === 'packaging' && <PackagingView product={product} />}

              <div className="absolute left-5 top-5 flex flex-col gap-2">
                {discount > 0 && <span className="badge bg-rose-500 text-white shadow-soft">{discount}% off</span>}
                {product.bestseller && (
                  <span className="badge badge-gold">
                    <Sparkles className="h-3 w-3" /> Bestseller
                  </span>
                )}
              </div>

              <div className="absolute right-5 top-5">
                <WishlistButton product={product} />
              </div>

              {view === 'gem' && (
                <span className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-navy-950/70 px-4 py-1.5 text-[11px] font-semibold text-white/80 backdrop-blur">
                  Hover to zoom
                </span>
              )}
            </div>

            {/* Thumbnails */}
            <div className="mt-4 grid grid-cols-4 gap-3">
              {VIEWS.map((item) => (
                <button
                  key={item.kind}
                  type="button"
                  onClick={() => setView(item.kind)}
                  aria-label={item.label}
                  className={cn(
                    'group relative aspect-square overflow-hidden rounded-2xl border p-3 transition-all duration-300',
                    view === item.kind
                      ? 'border-royal-600 shadow-[0_0_0_2px_rgba(95,31,189,.2)]'
                      : 'border-sand-200 hover:border-royal-300',
                  )}
                  style={{ background: `linear-gradient(140deg, ${product.art.light}1f, #ffffff)` }}
                >
                  {item.kind === 'certificate' ? (
                    <ScrollText className="mx-auto h-full w-7 text-gold-600" />
                  ) : item.kind === 'packaging' ? (
                    <Package className="mx-auto h-full w-7 text-royal-600" />
                  ) : (
                    <GemVisual
                      art={product.art}
                      seed={`thumb-${item.kind}-${product.id}`}
                      sparkle={false}
                      glow={item.kind === 'gem'}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* --------------------------------- Details -------------------------------- */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge badge-royal">{product.gemType}</span>
              {product.planet && <span className="badge badge-gold">{product.planet}</span>}
              {product.inStock ? (
                <span className="badge badge-green">In stock</span>
              ) : (
                <span className="badge badge-rose">Out of stock</span>
              )}
            </div>

            <h1 className="h-display mt-4 text-4xl text-navy-900 sm:text-5xl">
              {product.name}
              {product.hindiName && <span className="text-navy-900/40"> · {product.hindiName}</span>}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <StarRating rating={product.rating} size="md" showValue />
              <a href="#reviews" className="text-sm font-medium text-royal-700 underline-offset-4 hover:underline">
                {product.reviewCount} reviews
              </a>
              <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                <BadgeCheck className="h-4 w-4" /> {product.certification}
              </span>
            </div>

            <p className="mt-5 text-base leading-relaxed text-navy-900/60">{product.shortDescription}</p>

            {/* Price */}
            <div className="mt-7 rounded-3xl border border-sand-200 bg-white p-6 shadow-soft">
              <div className="flex flex-wrap items-end gap-4">
                <span className="font-display text-5xl font-bold text-navy-900">{formatINR(price)}</span>
                <span className="pb-1.5 text-lg text-navy-900/40 line-through">{formatINR(originalPrice)}</span>
                {discount > 0 && (
                  <span className="mb-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">
                    {discount}% off
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-sm text-navy-900/45">
                Inclusive of all taxes · You save {formatINR(originalPrice - price)}
              </p>

              {/* Weight */}
              <div className="mt-6">
                <p className="field-label">Select {weightLabel}</p>
                <div className="flex flex-wrap gap-2.5">
                  {product.weightOptions.map((option, index) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => setWeightIndex(index)}
                      className={cn(
                        'rounded-2xl border px-5 py-3 text-sm font-semibold transition-all duration-300',
                        index === weightIndex
                          ? 'border-royal-600 bg-royal-700 text-white shadow-[0_10px_24px_-10px_rgba(95,31,189,.85)]'
                          : 'border-sand-300 bg-white text-navy-900/70 hover:-translate-y-0.5 hover:border-royal-300 hover:text-royal-700',
                      )}
                    >
                      <span className="block">{option.label}</span>
                      <span className={cn('mt-0.5 block text-xs', index === weightIndex ? 'text-white/60' : 'text-navy-900/40')}>
                        {formatINR(Math.round(product.price * option.multiplier))}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity + CTAs */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="flex h-14 items-center rounded-full border border-sand-300 bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    className="grid h-14 w-14 place-items-center rounded-l-full text-navy-900/60 transition-colors hover:text-royal-700"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-base font-bold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => Math.min(10, value + 1))}
                    className="grid h-14 w-14 place-items-center rounded-r-full text-navy-900/60 transition-colors hover:text-royal-700"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  disabled={!product.inStock}
                  onClick={() => addToCart(product, weightIndex, quantity)}
                  className="btn btn-lg btn-primary flex-1"
                >
                  <ShoppingBag className="h-4 w-4" /> Add to Cart
                </button>
              </div>

              <button
                type="button"
                disabled={!product.inStock}
                onClick={buyNow}
                className="btn btn-lg btn-gold mt-3 w-full"
              >
                <Zap className="h-4 w-4" /> Buy Now
              </button>

              {/* Delivery check */}
              <div className="mt-5 border-t border-sand-200 pt-5">
                <p className="field-label">Check delivery</p>
                <div className="flex gap-2.5">
                  <input
                    value={pincode}
                    onChange={(event) => {
                      setPincode(event.target.value.replace(/\D/g, '').slice(0, 6));
                      setPincodeChecked(false);
                    }}
                    inputMode="numeric"
                    placeholder="Enter 6 digit pincode"
                    aria-label="Delivery pincode"
                    className="field flex-1"
                  />
                  <button
                    type="button"
                    disabled={pincode.length !== 6}
                    onClick={() => setPincodeChecked(true)}
                    className="btn btn-md btn-outline"
                  >
                    Check
                  </button>
                </div>
                {pincodeChecked && (
                  <p className="mt-3 flex items-center gap-2 text-sm font-medium text-emerald-600">
                    <Truck className="h-4 w-4" /> Delivers to {pincode} in 3 to 5 working days, free and insured.
                  </p>
                )}
              </div>
            </div>

            {/* Assurances */}
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {ASSURANCES.map(({ icon: Icon, title, copy }) => (
                <li key={title} className="flex items-start gap-3 rounded-2xl border border-sand-200 bg-white p-4">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-royal-600" strokeWidth={1.8} />
                  <span>
                    <span className="block text-sm font-semibold text-navy-900">{title}</span>
                    <span className="mt-0.5 block text-xs text-navy-900/50">{copy}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ------------------------------- Information ------------------------------- */}
        <div className="mt-16 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Accordion
            sections={[
              {
                title: 'Product Description',
                icon: ScrollText,
                content: (
                  <>
                    <p>{product.description}</p>
                    <dl className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                      {[
                        ['Gemstone', product.gemType],
                        ['Planet', product.planet ?? '—'],
                        ['Origin', product.origin],
                        ['Certification', product.certification],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between gap-4 border-b border-dashed border-sand-200 pb-2">
                          <dt className="text-navy-900/45">{label}</dt>
                          <dd className="text-right font-semibold text-navy-900">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </>
                ),
              },
              {
                title: 'Benefits',
                icon: Sparkles,
                content: (
                  <ul className="space-y-3">
                    {product.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                ),
              },
              {
                title: 'How to Wear',
                icon: Gem,
                content: (
                  <ol className="space-y-3">
                    {product.howToWear.map((step, index) => (
                      <li key={step} className="flex items-start gap-3">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-royal-100 text-xs font-bold text-royal-800">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                ),
              },
              {
                title: 'Certification',
                icon: BadgeCheck,
                content: (
                  <p>
                    This piece ships with a {product.certification} report from an independent laboratory. The report
                    number is printed on a tamper proof seal and can be verified on the laboratory website. Breaking the
                    seal before verification voids the return window on certified stones.
                  </p>
                ),
              },
              {
                title: 'Shipping Information',
                icon: Truck,
                content: (
                  <p>
                    Dispatched within 24 hours of payment confirmation. Metro cities receive orders in 2 to 4 working
                    days and the rest of India in 4 to 7. Every parcel ships insured with live tracking sent by SMS and
                    email. Free shipping applies above ₹2,000.
                  </p>
                ),
              },
              {
                title: 'Return Policy',
                icon: RotateCcw,
                content: (
                  <p>
                    Returns accepted within 7 days of delivery on unworn products in original packaging with the
                    certificate intact. Refunds reach the original payment method within 5 to 7 working days. Made to
                    order and custom sized jewellery is exempt unless it arrives damaged.
                  </p>
                ),
              },
            ]}
          />

          {/* Trust panel */}
          <aside className="h-fit overflow-hidden rounded-3xl bg-royal-deep p-8 text-white">
            <div className="pointer-events-none absolute inset-0" />
            <ShieldCheck className="h-9 w-9 text-gold-300" />
            <h3 className="h-display mt-5 text-3xl">Buy with confidence</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Not sure this is the right stone for your chart? Send your birth details and our astrologers will confirm
              before you pay, at no cost.
            </p>
            <Link href="/astrology#finder" className="btn btn-md btn-gold mt-6 w-full">
              Get a free recommendation
            </Link>
            <ul className="mt-7 space-y-3 border-t border-white/10 pt-6 text-sm text-white/65">
              {[
                'Lab certificate with every order',
                'Free insured shipping above ₹2,000',
                '7 day easy return window',
                'Razorpay secured payments',
              ].map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                  {line}
                </li>
              ))}
            </ul>
          </aside>
        </div>

        {/* --------------------------------- Reviews --------------------------------- */}
        <section id="reviews" className="mt-16 scroll-mt-32">
          <div className="rounded-[2rem] border border-sand-200 bg-white p-8 shadow-soft sm:p-10">
            <div className="grid gap-8 md:grid-cols-[240px_1fr]">
              <div className="text-center md:text-left">
                <p className="font-display text-6xl font-bold text-navy-900">{product.rating.toFixed(1)}</p>
                <div className="mt-2 flex justify-center md:justify-start">
                  <StarRating rating={product.rating} size="lg" />
                </div>
                <p className="mt-2 text-sm text-navy-900/50">Based on {product.reviewCount} verified reviews</p>

                <div className="mt-5 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const share = star === 5 ? 78 : star === 4 ? 16 : star === 3 ? 4 : star === 2 ? 1 : 1;
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs text-navy-900/50">
                        <span className="w-3">{star}</span>
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-sand-200">
                          <span className="block h-full rounded-full bg-gold-400" style={{ width: `${share}%` }} />
                        </span>
                        <span className="w-8 text-right">{share}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="h-display text-3xl text-navy-900">What buyers say</h3>
                {reviews.length > 0 ? (
                  <ul className="mt-6 space-y-6">
                    {reviews.map((review) => (
                      <li key={review.id} className="border-b border-sand-200 pb-6 last:border-b-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <span
                            className="grid h-11 w-11 place-items-center rounded-full text-sm font-bold text-white"
                            style={{ background: `linear-gradient(135deg, ${review.avatar.from}, ${review.avatar.to})` }}
                          >
                            {initials(review.name)}
                          </span>
                          <div>
                            <p className="flex items-center gap-1.5 text-sm font-semibold text-navy-900">
                              {review.name}
                              {review.verified && <BadgeCheck className="h-4 w-4 text-emerald-500" />}
                            </p>
                            <p className="text-xs text-navy-900/45">
                              {review.location} · {review.date}
                            </p>
                          </div>
                          <div className="ml-auto">
                            <StarRating rating={review.rating} />
                          </div>
                        </div>
                        <p className="mt-3 font-display text-lg font-semibold text-navy-900">{review.title}</p>
                        <p className="mt-1 text-[15px] leading-relaxed text-navy-900/60">{review.text}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-6 text-[15px] leading-relaxed text-navy-900/55">
                    This product has {product.reviewCount} ratings from verified buyers. Written reviews for it are being
                    migrated to the new store.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
