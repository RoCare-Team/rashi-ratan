import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, Headphones, Mail, MapPin, MessageSquare, Package, Phone, RotateCcw, Truck } from 'lucide-react';
import ContactForm from './ContactForm';
import FAQ from '@/components/FAQ';
import SectionHeading from '@/components/SectionHeading';
import { faqs } from '@/data/reviews';
import { COD_FEE, COD_MAX_ORDER, SELLER, whatsappLink } from '@/lib/business';

export const metadata: Metadata = {
  title: 'Contact & Policies',
  description:
    'Reach the Rashi Ratan team in Jaipur, track an order, or read our shipping, return, privacy and terms policies.',
};

const CHANNELS = [
  {
    icon: Phone,
    title: 'Call us',
    lines: ['+91 99969 92608', 'Mon – Sat, 10 AM – 7 PM IST'],
    href: 'tel:+919996992608',
    action: 'Call now',
  },
  {
    icon: Mail,
    title: 'Email us',
    lines: ['care@rashiratan.com', 'Replies within one working day'],
    href: 'mailto:care@rashiratan.com',
    action: 'Write to us',
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp',
    lines: ['+91 99969 92608', 'Fastest for order updates'],
    href: whatsappLink('Hi Rashi Ratan, I have a question'),
    action: 'Start a chat',
  },
  {
    icon: MapPin,
    title: 'Visit the store',
    lines: ['4th Floor, Gem Plaza, Johari Bazaar', 'Jaipur, Rajasthan 302003'],
    href: 'https://www.google.com/maps/search/?api=1&query=Johari+Bazaar+Jaipur',
    action: 'Get directions',
  },
];

const POLICIES = [
  {
    id: 'shipping',
    icon: Truck,
    title: 'Shipping Policy',
    body: `Orders are dispatched within 24 hours of payment confirmation. Metro cities receive delivery in 2 to 4 working days and the rest of India in 4 to 7. Shipping is free above ₹2,000, otherwise ₹149 is added at checkout. Cash on Delivery is available on orders up to ₹${COD_MAX_ORDER.toLocaleString('en-IN')} for a ₹${COD_FEE} handling fee. Every parcel travels insured with live tracking sent by SMS and email. Made to order jewellery takes 10 to 14 days as each piece is crafted around your chosen stone.`,
  },
  {
    id: 'returns',
    icon: RotateCcw,
    title: 'Return Policy',
    body: 'You have 7 days from delivery to return any unworn product in its original packaging with the certificate and tamper proof seal intact. Raise the request from your account or by email and we arrange a reverse pickup at no cost. Refunds reach the original payment method within 5 to 7 working days. Made to order and custom sized jewellery cannot be returned unless it arrives damaged or incorrect.',
  },
  {
    id: 'track',
    icon: Package,
    title: 'Track Your Order',
    body: 'A tracking link is sent by SMS and email the moment your parcel leaves our workshop. You can also follow every order live on the Track Order page using your order ID and mobile number. If tracking has not updated for 48 hours, message us on WhatsApp with your order ID and we will chase the courier for you.',
  },
  {
    id: 'privacy',
    icon: Headphones,
    title: 'Privacy Policy',
    body: 'We collect only what is needed to fulfil your order and give astrological guidance: your name, contact details, delivery address and, where you share them, your birth details. Payment information is handled entirely by Razorpay and never stored on our servers. We do not sell or rent your data. Birth details are used solely for your consultation and are deleted on request.',
  },
  {
    id: 'terms',
    icon: Clock,
    title: 'Terms & Conditions',
    body: `Prices include GST and are subject to change without notice. Every order is billed by ${SELLER.legalName} (GSTIN ${SELLER.gstin}) with a GST tax invoice — CGST and SGST for deliveries within ${SELLER.state}, IGST for other states. Gemstone colour may vary slightly between screens and natural light. Astrological guidance is offered in the spirit of traditional belief and is not a substitute for professional medical, legal or financial advice. Orders may be cancelled before dispatch for a full refund. This site is a prototype demonstration and no live payments are processed.`,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* ---------------------------------- Hero ---------------------------------- */}
      <section className="relative overflow-hidden bg-royal-deep py-16 md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-aurora opacity-75" />
        <div className="noise pointer-events-none absolute inset-0" />
        <div className="container-x relative">
          <span className="eyebrow rounded-full border border-gold-400/30 bg-white/5 px-4 py-2 text-gold-300 backdrop-blur">
            <Headphones className="h-3.5 w-3.5" /> We reply within one working day
          </span>
          <h1 className="h-display mt-6 max-w-3xl text-5xl leading-[1.05] text-white sm:text-6xl">
            Talk to our team in <span className="text-gold-gradient italic">Jaipur</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/65">
            Questions about a stone, an order, or your chart? Our team answers every message personally. For order
            issues, the <Link href="/support" className="font-semibold text-gold-300 underline underline-offset-4">support centre</Link> is fastest.
          </p>
        </div>
      </section>

      {/* -------------------------------- Channels -------------------------------- */}
      <section className="relative z-10 -mt-10">
        <div className="container-x">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CHANNELS.map(({ icon: Icon, title, lines, href, action }) => (
              <a
                key={title}
                href={href}
                {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group rounded-3xl border border-sand-200 bg-white p-6 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-royal-50 text-royal-700 transition-colors duration-300 group-hover:bg-royal-deep group-hover:text-gold-300">
                  <Icon className="h-[22px] w-[22px]" strokeWidth={1.8} />
                </span>
                <h2 className="mt-5 font-display text-2xl font-semibold text-navy-900">{title}</h2>
                {lines.map((line, index) => (
                  <p key={line} className={index === 0 ? 'mt-2 text-sm font-semibold text-navy-900' : 'mt-1 text-xs text-navy-900/50'}>
                    {line}
                  </p>
                ))}
                <span className="mt-4 inline-block text-sm font-semibold text-royal-700 transition-colors group-hover:text-royal-900">
                  {action} →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------- Form + store card ---------------------------- */}
      <section className="section-y">
        <div className="container-x grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <ContactForm />

          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-sand-200 bg-white shadow-soft">
              {/* Stylised map panel */}
              <div className="relative h-56 overflow-hidden bg-royal-deep">
                <div className="pointer-events-none absolute inset-0 bg-aurora opacity-70" />
                <svg viewBox="0 0 400 220" className="absolute inset-0 h-full w-full opacity-30" aria-hidden="true">
                  {Array.from({ length: 9 }).map((_, index) => (
                    <line
                      key={`h-${index}`}
                      x1="0"
                      y1={index * 26}
                      x2="400"
                      y2={index * 26}
                      stroke="#f8e9b6"
                      strokeWidth="0.6"
                    />
                  ))}
                  {Array.from({ length: 14 }).map((_, index) => (
                    <line
                      key={`v-${index}`}
                      x1={index * 30}
                      y1="0"
                      x2={index * 30}
                      y2="220"
                      stroke="#f8e9b6"
                      strokeWidth="0.6"
                    />
                  ))}
                  <path d="M0 130 L120 130 L120 60 L400 60" stroke="#d4a933" strokeWidth="3" fill="none" />
                </svg>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="relative mx-auto grid h-12 w-12 place-items-center rounded-full bg-gold-sheen text-navy-950">
                    <MapPin className="h-6 w-6" />
                    <span className="absolute inset-0 animate-ring-pulse rounded-full border-2 border-gold-300" />
                  </span>
                  <p className="mt-3 font-display text-xl font-semibold text-white">Gem Plaza, Johari Bazaar</p>
                  <p className="text-xs text-white/50">Jaipur, Rajasthan</p>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-display text-2xl font-semibold text-navy-900">Our Jaipur counter</h3>
                <address className="mt-3 not-italic text-[15px] leading-relaxed text-navy-900/60">
                  4th Floor, Gem Plaza
                  <br />
                  Johari Bazaar, Jaipur
                  <br />
                  Rajasthan 302003, India
                </address>
                <div className="mt-5 flex items-center gap-2.5 rounded-2xl bg-sand-50 p-4 text-sm text-navy-900/60">
                  <Clock className="h-4 w-4 shrink-0 text-royal-600" />
                  Open Monday to Saturday, 10:00 AM – 7:00 PM IST
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-royal-deep p-7 text-white">
              <h3 className="h-display text-2xl">Need a stone urgently?</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Same day dispatch is available on in stock certified gemstones if you order before 2 PM IST.
              </p>
              <Link href="/shop" className="btn btn-md btn-gold mt-5 w-full">
                Shop in stock gemstones
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------- Policies -------------------------------- */}
      <section className="section-y bg-white/60">
        <div className="container-x">
          <SectionHeading
            eyebrow="The fine print"
            title="Policies, in plain"
            accent="language"
            description="No hidden clauses. Here is exactly how shipping, returns, privacy and terms work."
          />

          <div className="mx-auto max-w-4xl space-y-5">
            {POLICIES.map(({ id, icon: Icon, title, body }) => (
              <div
                key={id}
                id={id}
                className="scroll-mt-32 rounded-3xl border border-sand-200 bg-white p-7 shadow-soft sm:p-8"
              >
                <div className="flex items-center gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-royal-50 text-royal-700">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <h3 className="font-display text-2xl font-semibold text-navy-900">{title}</h3>
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-navy-900/60">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------- FAQ ----------------------------------- */}
      <section className="pb-20 md:pb-28">
        <div className="container-x">
          <SectionHeading eyebrow="Quick answers" title="Frequently asked" accent="questions" />
          <div className="mx-auto max-w-4xl">
            <FAQ items={faqs} defaultOpen={-1} />
          </div>
        </div>
      </section>
    </>
  );
}
