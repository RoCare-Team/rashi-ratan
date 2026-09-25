'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Building2,
  Check,
  Lock,
  Mail,
  MapPin,
  Phone,
  Receipt,
  ShoppingBag,
  Tag,
  Truck,
  User,
} from 'lucide-react';
import GemVisual from '@/components/GemVisual';
import RazorpayCheckout, { type CheckoutCustomer } from '@/components/RazorpayCheckout';
import { useStore } from '@/context/StoreContext';
import { COD_FEE, COD_MAX_ORDER, INDIAN_STATES, SELLER, type PaymentMethod } from '@/lib/business';
import { quoteCart } from '@/lib/pricing';
import { validateCustomer, type CustomerErrors } from '@/lib/validation';
import { cn, formatINR, formatINRExact } from '@/lib/utils';

type Field = keyof CheckoutCustomer;

const EMPTY: CheckoutCustomer = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  gstin: '',
  businessName: '',
};

export default function CheckoutView() {
  const { items, itemCount, coupon, hydrated } = useStore();
  const [customer, setCustomer] = useState<CheckoutCustomer>(EMPTY);
  const [errors, setErrors] = useState<CustomerErrors>({});
  const [wantsGstInvoice, setWantsGstInvoice] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online');

  // Price the online option first: it tells us whether COD is allowed for this cart.
  const onlineQuote = useMemo(
    () => quoteCart(items, { couponCode: coupon?.code ?? null, buyerState: customer.state, paymentMethod: 'online' }),
    [items, coupon, customer.state],
  );
  const codAllowed = onlineQuote.codAllowed;
  const activeMethod: PaymentMethod = paymentMethod === 'cod' && codAllowed ? 'cod' : 'online';
  const quote = useMemo(
    () =>
      activeMethod === 'online'
        ? onlineQuote
        : quoteCart(items, { couponCode: coupon?.code ?? null, buyerState: customer.state, paymentMethod: 'cod' }),
    [activeMethod, onlineQuote, items, coupon, customer.state],
  );
  const { subtotal, discount, delivery, codFee, total, gst } = quote;

  const update = (field: Field) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value = event.target.value;
    if (field === 'pincode' || field === 'phone') value = value.replace(/\D/g, '');
    if (field === 'gstin') value = value.toUpperCase().replace(/[^0-9A-Z]/g, '');
    setCustomer((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const payload: CheckoutCustomer = wantsGstInvoice
    ? customer
    : { ...customer, gstin: undefined, businessName: undefined };

  const validate = () => {
    const next = validateCustomer(payload);
    setErrors(next);
    if (Object.keys(next).length > 0) {
      document.getElementById('checkout-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return false;
    }
    return true;
  };

  if (!hydrated) {
    return (
      <div className="container-x py-20">
        <div className="skeleton h-10 w-56 rounded-full" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div className="skeleton h-[32rem] rounded-3xl" />
          <div className="skeleton h-96 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-x py-24 text-center">
        <span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-royal-50 text-royal-500">
          <ShoppingBag className="h-11 w-11" />
        </span>
        <h1 className="h-display mt-8 text-4xl text-navy-900">Nothing to check out</h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-navy-900/55">
          Add a gemstone or a spiritual product to your cart and it will appear here.
        </p>
        <Link href="/shop" className="btn btn-lg btn-primary mt-8">
          Browse the collection <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const inputClass = (field: Field) =>
    cn('field', errors[field] && 'border-rose-400 focus:border-rose-400 focus:ring-rose-500/10');

  return (
    <div className="container-x py-12 md:py-16">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-xs font-medium text-navy-900/45" aria-label="Breadcrumb">
          <Link href="/cart" className="transition-colors hover:text-royal-700">
            Cart
          </Link>
          <span>›</span>
          <span className="text-navy-900">Checkout</span>
          <span>›</span>
          <span>Payment</span>
        </nav>
        <h1 className="h-display mt-3 text-4xl text-navy-900 sm:text-5xl">Checkout</h1>
        <p className="mt-2 text-[15px] text-navy-900/55">
          Complete your details and pay securely. Every order ships insured with a certificate.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-10">
        {/* --------------------------------- Forms --------------------------------- */}
        <div id="checkout-form" className="space-y-6 scroll-mt-32">
          {/* Customer information */}
          <section className="rounded-3xl border border-sand-200 bg-white p-6 shadow-soft sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-royal-700 text-sm font-bold text-white">
                1
              </span>
              <h2 className="font-display text-2xl font-semibold text-navy-900">Customer Information</h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="field-label">
                  Full Name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-900/30" />
                  <input
                    id="name"
                    value={customer.name}
                    onChange={update('name')}
                    placeholder="Ananya Sharma"
                    autoComplete="name"
                    className={cn(inputClass('name'), 'pl-11')}
                  />
                </div>
                {errors.name && <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="field-label">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-900/30" />
                  <input
                    id="email"
                    type="email"
                    value={customer.email}
                    onChange={update('email')}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={cn(inputClass('email'), 'pl-11')}
                  />
                </div>
                {errors.email && <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="field-label">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-900/30" />
                  <input
                    id="phone"
                    inputMode="numeric"
                    value={customer.phone}
                    onChange={update('phone')}
                    maxLength={10}
                    placeholder="9876543210"
                    autoComplete="tel"
                    className={cn(inputClass('phone'), 'pl-11')}
                  />
                </div>
                {errors.phone && <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.phone}</p>}
              </div>
            </div>
          </section>

          {/* Delivery address */}
          <section className="rounded-3xl border border-sand-200 bg-white p-6 shadow-soft sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-royal-700 text-sm font-bold text-white">
                2
              </span>
              <h2 className="font-display text-2xl font-semibold text-navy-900">Delivery Address</h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="address" className="field-label">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-900/30" />
                  <input
                    id="address"
                    value={customer.address}
                    onChange={update('address')}
                    placeholder="Flat, building, street, area"
                    autoComplete="street-address"
                    className={cn(inputClass('address'), 'pl-11')}
                  />
                </div>
                {errors.address && <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.address}</p>}
              </div>

              <div>
                <label htmlFor="city" className="field-label">
                  City
                </label>
                <input
                  id="city"
                  value={customer.city}
                  onChange={update('city')}
                  placeholder="Mumbai"
                  autoComplete="address-level2"
                  className={inputClass('city')}
                />
                {errors.city && <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.city}</p>}
              </div>

              <div>
                <label htmlFor="state" className="field-label">
                  State
                </label>
                <select
                  id="state"
                  value={customer.state}
                  onChange={update('state')}
                  className={cn(inputClass('state'), 'cursor-pointer')}
                >
                  <option value="">Select a state</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state.code} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </select>
                {errors.state && <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.state}</p>}
              </div>

              <div>
                <label htmlFor="pincode" className="field-label">
                  Pincode
                </label>
                <input
                  id="pincode"
                  inputMode="numeric"
                  maxLength={6}
                  value={customer.pincode}
                  onChange={update('pincode')}
                  placeholder="400001"
                  autoComplete="postal-code"
                  className={inputClass('pincode')}
                />
                {errors.pincode && <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.pincode}</p>}
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-sand-200 bg-sand-50 p-4">
              <Truck className="mt-0.5 h-5 w-5 shrink-0 text-royal-600" />
              <p className="text-sm leading-relaxed text-navy-900/60">
                <span className="font-semibold text-navy-900">Insured delivery in 3 to 5 working days.</span> A tracking
                link is sent by SMS and email as soon as your parcel is dispatched.
              </p>
            </div>

            {/* GST invoice for businesses */}
            <div className="mt-6 rounded-2xl border border-sand-200 p-4 sm:p-5">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={wantsGstInvoice}
                  onChange={(event) => {
                    setWantsGstInvoice(event.target.checked);
                    setErrors((current) => ({ ...current, gstin: undefined, businessName: undefined }));
                  }}
                  className="mt-1 h-4 w-4 accent-royal-700"
                />
                <span>
                  <span className="flex items-center gap-2 text-sm font-semibold text-navy-900">
                    <Building2 className="h-4 w-4 text-royal-600" /> I need a GST invoice for my business
                  </span>
                  <span className="mt-0.5 block text-xs text-navy-900/50">
                    Add your GSTIN to claim input tax credit. Every order gets a tax invoice either way.
                  </span>
                </span>
              </label>

              {wantsGstInvoice && (
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="gstin" className="field-label">
                      GSTIN
                    </label>
                    <input
                      id="gstin"
                      value={customer.gstin ?? ''}
                      onChange={update('gstin')}
                      maxLength={15}
                      placeholder="27ABCDE1234F1Z5"
                      className={cn(inputClass('gstin'), 'font-mono uppercase tracking-wider')}
                    />
                    {errors.gstin && <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.gstin}</p>}
                  </div>
                  <div>
                    <label htmlFor="businessName" className="field-label">
                      Registered business name
                    </label>
                    <input
                      id="businessName"
                      value={customer.businessName ?? ''}
                      onChange={update('businessName')}
                      placeholder="Sharma Traders"
                      autoComplete="organization"
                      className={inputClass('businessName')}
                    />
                    {errors.businessName && (
                      <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.businessName}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-3xl border border-sand-200 bg-white p-6 shadow-soft sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-royal-700 text-sm font-bold text-white">
                3
              </span>
              <h2 className="font-display text-2xl font-semibold text-navy-900">Payment</h2>
            </div>

            <div className="grid gap-3" role="radiogroup" aria-label="Payment method">
              {(
                [
                  {
                    value: 'online' as const,
                    icon: Lock,
                    title: 'Pay Online',
                    detail: 'UPI, Credit & Debit Cards, Net Banking, Wallets via Razorpay',
                    tag: 'Fastest dispatch',
                    available: true,
                  },
                  {
                    value: 'cod' as const,
                    icon: Banknote,
                    title: 'Cash on Delivery',
                    detail: codAllowed
                      ? `Pay in cash or UPI when the parcel arrives · ${formatINR(COD_FEE)} handling fee`
                      : `Available on orders up to ${formatINR(COD_MAX_ORDER)}. Please pay online for this order.`,
                    tag: `+ ${formatINR(COD_FEE)}`,
                    available: codAllowed,
                  },
                ]
              ).map((option) => {
                const selected = activeMethod === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={!option.available}
                    onClick={() => setPaymentMethod(option.value)}
                    className={cn(
                      'flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all sm:p-5',
                      selected
                        ? 'border-royal-500 bg-royal-50/70 ring-4 ring-royal-500/10'
                        : 'border-sand-200 bg-white hover:border-royal-300',
                      !option.available && 'cursor-not-allowed opacity-60 hover:border-sand-200',
                    )}
                  >
                    <span
                      className={cn(
                        'grid h-5 w-5 shrink-0 place-items-center rounded-full border-2',
                        selected ? 'border-royal-700 bg-royal-700 text-white' : 'border-sand-300',
                      )}
                    >
                      {selected && <Check className="h-3 w-3" strokeWidth={3} />}
                    </span>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-royal-700 shadow-soft">
                      <option.icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-navy-900">{option.title}</span>
                      <span className="block text-xs leading-relaxed text-navy-900/55">{option.detail}</span>
                    </span>
                    <span className="hidden shrink-0 rounded-full bg-sand-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-navy-900/55 sm:inline">
                      {option.tag}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6">
              <RazorpayCheckout quote={quote} customer={payload} paymentMethod={activeMethod} onValidate={validate} />
            </div>
          </section>
        </div>

        {/* ----------------------------- Order summary ----------------------------- */}
        <aside className="lg:sticky lg:top-36 lg:h-fit">
          <div className="overflow-hidden rounded-3xl border border-sand-200 bg-white shadow-soft">
            <div className="border-b border-sand-200 px-6 py-5">
              <h2 className="font-display text-2xl font-semibold text-navy-900">Order Summary</h2>
              <p className="text-xs text-navy-900/50">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </p>
            </div>

            <ul className="max-h-80 divide-y divide-sand-100 overflow-y-auto px-6">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4 py-4">
                  <span
                    className="relative grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-sand-200"
                    style={{ background: `linear-gradient(140deg, ${item.art.light}22, #ffffff 60%)` }}
                  >
                    <GemVisual art={item.art} seed={`co-${item.key}`} sparkle={false} />
                    <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-[20px] place-items-center rounded-full bg-navy-900 px-1 text-[10px] font-bold text-white">
                      {item.quantity}
                    </span>
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-navy-900">{item.name}</span>
                    <span className="block text-xs text-navy-900/45">{item.weight}</span>
                  </span>

                  <span className="shrink-0 text-sm font-bold text-navy-900">
                    {formatINR(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="space-y-3 border-t border-sand-200 px-6 py-5 text-[15px]">
              <div className="flex justify-between">
                <span className="text-navy-900/55">Subtotal</span>
                <span className="font-semibold text-navy-900">{formatINR(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" /> Discount {coupon ? `(${coupon.code})` : ''}
                  </span>
                  <span className="font-semibold">− {formatINR(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-navy-900/55">Delivery charges</span>
                <span className={delivery === 0 ? 'font-semibold text-emerald-600' : 'font-semibold text-navy-900'}>
                  {delivery === 0 ? 'FREE' : formatINR(delivery)}
                </span>
              </div>

              {codFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-navy-900/55">COD handling fee</span>
                  <span className="font-semibold text-navy-900">{formatINR(codFee)}</span>
                </div>
              )}
            </div>

            {/* GST breakup — prices are tax inclusive, this shows what is inside them */}
            <div className="border-t border-dashed border-sand-200 px-6 py-4 text-[13px]">
              <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-navy-900/45">
                <Receipt className="h-3.5 w-3.5" /> GST included in total
              </p>
              <div className="space-y-1.5">
                <div className="flex justify-between text-navy-900/55">
                  <span>Taxable value</span>
                  <span>{formatINRExact(gst.taxable)}</span>
                </div>
                {!customer.state ? (
                  <p className="text-xs text-navy-900/45">Select your state to see the CGST / SGST or IGST split.</p>
                ) : gst.supplyType === 'intra' ? (
                  <>
                    <div className="flex justify-between text-navy-900/55">
                      <span>CGST</span>
                      <span>{formatINRExact(gst.cgst)}</span>
                    </div>
                    <div className="flex justify-between text-navy-900/55">
                      <span>SGST ({SELLER.state})</span>
                      <span>{formatINRExact(gst.sgst)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-navy-900/55">
                    <span>IGST (delivery to {customer.state})</span>
                    <span>{formatINRExact(gst.igst)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-navy-900/75">
                  <span>Total GST</span>
                  <span>{formatINRExact(gst.totalTax)}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-sand-200 bg-sand-50 px-6 py-5">
              <div className="flex items-end justify-between">
                <span>
                  <span className="block font-semibold text-navy-900">Total</span>
                  <span className="block text-[11px] text-navy-900/45">Inclusive of all taxes</span>
                </span>
                <span className="font-display text-4xl font-bold text-navy-900">{formatINR(total)}</span>
              </div>

              <ul className="mt-5 space-y-2.5 border-t border-sand-200 pt-5 text-xs text-navy-900/55">
                {[
                  'Lab certificate included with every stone',
                  'Free insured shipping above ₹2,000',
                  '7 day easy return window',
                  'GST tax invoice with every order',
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link
            href="/cart"
            className="mt-4 block text-center text-sm font-semibold text-royal-700 transition-colors hover:text-royal-900"
          >
            Edit your cart
          </Link>
        </aside>
      </div>
    </div>
  );
}
