import Link from 'next/link';
import { ArrowRight, Facebook, Instagram, Mail, MapPin, Phone, Send, Youtube } from 'lucide-react';
import { SELLER } from '@/lib/business';
import Logo from './Logo';

const SHOP_LINKS = [
  { label: 'Gemstones', href: '/shop?category=precious-gemstones' },
  { label: 'Rashi Ratna', href: '/shop?category=rashi-ratna' },
  { label: 'Rudraksha', href: '/shop?category=rudraksha' },
  { label: 'Crystals', href: '/shop?category=crystals' },
  { label: 'Yantras', href: '/shop?category=yantras' },
  { label: 'Gemstone Jewelry', href: '/shop?category=gemstone-jewelry' },
];

const SUPPORT_LINKS = [
  { label: 'Help & Support', href: '/support' },
  { label: 'Track Your Order', href: '/track-order' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Shipping Policy', href: '/contact#shipping' },
  { label: 'Return Policy', href: '/contact#returns' },
  { label: 'Types of Gemstones', href: '/gemstones' },
  { label: 'Certification', href: '/about#certification' },
];

const SOCIALS = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Send, href: '#', label: 'Telegram' },
];

/** Simple lettermark badges — avoids shipping third-party payment logos. */
const PAYMENTS = [
  { label: 'Razorpay', tone: 'text-[#0c2451]' },
  { label: 'UPI', tone: 'text-[#0b7b3e]' },
  { label: 'VISA', tone: 'text-[#1a1f71]' },
  { label: 'Mastercard', tone: 'text-[#c8102e]' },
  { label: 'RuPay', tone: 'text-[#0f7b3f]' },
  { label: 'Cash on Delivery', tone: 'text-navy-900' },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white print:hidden">
      <div className="pointer-events-none absolute inset-0 bg-aurora opacity-40" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />

      {/* Newsletter */}
      <div className="container-x relative border-b border-white/10 py-12">
        <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
          <div className="max-w-xl">
            <h3 className="h-display text-3xl text-white sm:text-4xl">
              Get your monthly <span className="text-gold-gradient italic">gem forecast</span>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/55">
              Planetary transits, gemstone guidance and early access to new arrivals. One email a month, no noise.
            </p>
          </div>

          <form className="flex w-full max-w-md gap-2.5" action="#" method="post">
            <input
              type="email"
              required
              placeholder="you@example.com"
              aria-label="Email address"
              className="h-12 flex-1 rounded-full border border-white/15 bg-white/5 px-5 text-[15px] text-white placeholder:text-white/35 backdrop-blur transition-all focus:border-gold-400/60 focus:outline-none focus:ring-4 focus:ring-gold-400/10"
            />
            <button type="submit" className="btn btn-md btn-gold shrink-0">
              Subscribe <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Columns */}
      <div className="container-x relative grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Logo tone="dark" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
            Rashi Ratan brings certified natural gemstones, rudraksha, crystals and yantras to your doorstep, backed by
            honest astrological guidance. Every stone is lab tested, energised and shipped insured across India.
          </p>

          <div className="mt-6 flex gap-2.5">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/5 text-white/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400/50 hover:text-gold-300"
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h4 className="eyebrow mb-5 text-gold-300">Shop</h4>
          <ul className="space-y-3">
            {SHOP_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-sm text-white/55 transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="eyebrow mb-5 text-gold-300">Customer Support</h4>
          <ul className="space-y-3">
            {SUPPORT_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-sm text-white/55 transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="eyebrow mb-5 text-gold-300">Contact</h4>
          <ul className="space-y-4 text-sm text-white/55">
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
              <a href="mailto:care@rashiratan.com" className="transition-colors hover:text-white">
                care@rashiratan.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
              <a href="tel:+919876543210" className="transition-colors hover:text-white">
                +91 98765 43210
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
              <span>
                4th Floor, Gem Plaza, Johari Bazaar
                <br />
                Jaipur, Rajasthan 302003
              </span>
            </li>
          </ul>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/45">Consultation hours</p>
            <p className="mt-1 text-sm text-white/70">Mon – Sat · 10:00 AM to 7:00 PM IST</p>
          </div>
        </div>
      </div>

      {/* Payments + legal */}
      <div className="container-x relative border-t border-white/10 py-7">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-white/40">We accept</span>
            {PAYMENTS.map((payment) => (
              <span
                key={payment.label}
                className={`rounded-lg bg-white px-3 py-1.5 text-[11px] font-extrabold tracking-tight ${payment.tone}`}
              >
                {payment.label}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/45">
            <span>
              © {new Date().getFullYear()} Rashi Ratan by {SELLER.legalName} · GSTIN {SELLER.gstin}
            </span>
            <Link href="/contact#privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/contact#terms" className="transition-colors hover:text-white">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-white/30">
          Prototype demo store. Gemstone and astrology guidance is offered as traditional belief and is not a substitute
          for professional medical, legal or financial advice.
        </p>
      </div>
    </footer>
  );
}
