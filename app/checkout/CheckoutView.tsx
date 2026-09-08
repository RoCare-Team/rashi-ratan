'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, BadgeCheck, Lock, Mail, MapPin, Phone, ShoppingBag, Tag, Truck, User } from 'lucide-react';
import GemVisual from '@/components/GemVisual';
import RazorpayCheckout, { type CheckoutCustomer } from '@/components/RazorpayCheckout';
import { useStore } from '@/context/StoreContext';
import { cn, formatINR } from '@/lib/utils';

type Field = keyof CheckoutCustomer;

const EMPTY: CheckoutCustomer = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
};

const STATES = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export default function CheckoutView() {
  const { items, itemCount, subtotal, discount, delivery, total, coupon, hydrated } = useStore();
  const [customer, setCustomer] = useState<CheckoutCustomer>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  const update = (field: Field) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = field === 'pincode' || field === 'phone' ? event.target.value.replace(/\D/g, '') : event.target.value;
    setCustomer((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<Field, string>> = {};
    if (customer.name.trim().length < 3) next.name = 'Enter your full name';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(customer.email)) next.email = 'Enter a valid email address';
    if (customer.phone.length !== 10) next.phone = 'Enter a 10 digit mobile number';
    if (customer.address.trim().length < 8) next.address = 'Enter your full delivery address';
    if (!customer.city.trim()) next.city = 'Enter your city';
    if (!customer.state) next.state = 'Select your state';
    if (customer.pincode.length !== 6) next.pincode = 'Enter a 6 digit pincode';

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
                  {STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
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
          </section>

          {/* Payment */}
          <section className="rounded-3xl border border-sand-200 bg-white p-6 shadow-soft sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-royal-700 text-sm font-bold text-white">
                3
              </span>
              <h2 className="font-display text-2xl font-semibold text-navy-900">Payment</h2>
            </div>

            <div className="rounded-2xl border border-royal-200 bg-royal-50/60 p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-[#0c2451] shadow-soft">
                  <Lock className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-navy-900">Razorpay Secure Checkout</p>
                  <p className="text-xs text-navy-900/55">UPI, Credit &amp; Debit Cards, Net Banking, Wallets</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <RazorpayCheckout amount={total} customer={customer} onValidate={validate} />
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
            </div>

            <div className="border-t border-sand-200 bg-sand-50 px-6 py-5">
              <div className="flex items-end justify-between">
                <span className="font-semibold text-navy-900">Total</span>
                <span className="font-display text-4xl font-bold text-navy-900">{formatINR(total)}</span>
              </div>

              <ul className="mt-5 space-y-2.5 border-t border-sand-200 pt-5 text-xs text-navy-900/55">
                {[
                  'Lab certificate included with every stone',
                  'Free insured shipping above ₹2,000',
                  '7 day easy return window',
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
