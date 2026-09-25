import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import {
  Banknote,
  Clock,
  FileText,
  Headphones,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
  RotateCcw,
  Sparkles,
  Truck,
} from 'lucide-react';
import FAQ from '@/components/FAQ';
import OpenChatButton from '@/components/OpenChatButton';
import SectionHeading from '@/components/SectionHeading';
import SupportTicketForm from './SupportTicketForm';
import { COD_FEE, COD_MAX_ORDER, SELLER, whatsappLink } from '@/lib/business';
import { formatINR } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Help & Customer Support',
  description:
    'Track an order, get help with payments, Cash on Delivery, GST invoices, returns and refunds, or talk to the Agarwal Gemstone support team on WhatsApp, phone or email.',
};

const QUICK_HELP = [
  { icon: Truck, title: 'Track my order', copy: 'Live courier status and AWB number', href: '/track-order' },
  { icon: RotateCcw, title: 'Return or refund', copy: '7 day returns, free pickup', href: '/support?topic=return#ticket' },
  { icon: Banknote, title: 'Payment & COD', copy: 'Failed payments, COD questions', href: '/support?topic=payment#ticket' },
  { icon: FileText, title: 'GST invoice', copy: 'Download or correct an invoice', href: '/track-order' },
];

const SUPPORT_FAQS = [
  {
    question: 'Money was debited but my order did not go through. What now?',
    answer:
      'Do not worry — if a payment is not confirmed, Razorpay automatically refunds it to your account within 5 to 7 working days. If you would like us to check sooner, raise a ticket with the UPI reference or the last 4 digits of your card.',
  },
  {
    question: 'Is Cash on Delivery available?',
    answer: `Yes, on orders up to ${formatINR(COD_MAX_ORDER)} anywhere we deliver in India. A ${formatINR(COD_FEE)} handling fee is added and you can pay the courier in cash or by UPI. Higher value orders are prepaid for the safety of the stone.`,
  },
  {
    question: 'How do I get a GST invoice?',
    answer: `Every order includes a GST tax invoice from ${SELLER.legalName}. Open it from the order confirmation page, the Track Order page or your account. Businesses can add their GSTIN at checkout to claim input tax credit — if you forgot, raise a ticket before the order is delivered and we will reissue it.`,
  },
  {
    question: 'Why does my invoice show IGST instead of CGST and SGST?',
    answer: `We ship from ${SELLER.state}. Deliveries within ${SELLER.state} are intra-state supplies and show CGST + SGST; deliveries to any other state are inter-state and show IGST. The total tax is the same.`,
  },
  {
    question: 'Can I cancel or change my order?',
    answer:
      'Orders can be cancelled or edited for free until they are dispatched, usually within 24 hours. Message us on WhatsApp or raise a ticket with your order ID. Prepaid orders are refunded in full to the original payment method.',
  },
  {
    question: 'My tracking has not updated for two days.',
    answer:
      'Couriers sometimes skip scans between hubs. If nothing has moved for 48 hours, send us your order ID and we will escalate it with the courier the same day.',
  },
];

export default function SupportPage() {
  const channels = [
    {
      icon: MessageSquare,
      title: 'WhatsApp',
      line: SELLER.phone,
      detail: 'Fastest — replies in minutes',
      href: whatsappLink('Hi Agarwal Gemstone, I need help with'),
      external: true,
    },
    { icon: Phone, title: 'Call us', line: SELLER.phone, detail: SELLER.hours, href: SELLER.phoneHref, external: false },
    { icon: Mail, title: 'Email', line: SELLER.email, detail: 'Reply within one working day', href: `mailto:${SELLER.email}`, external: false },
  ];

  return (
    <>
      {/* ---------------------------------- Hero ---------------------------------- */}
      <section className="relative overflow-hidden bg-royal-deep py-16 md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-aurora opacity-75" />
        <div className="noise pointer-events-none absolute inset-0" />
        <div className="container-x relative">
          <span className="eyebrow rounded-full border border-gold-400/30 bg-white/5 px-4 py-2 text-gold-300 backdrop-blur">
            <Headphones className="h-3.5 w-3.5" /> Customer support · {SELLER.hours}
          </span>
          <h1 className="h-display mt-6 max-w-3xl text-5xl leading-[1.05] text-white sm:text-6xl">
            How can we <span className="text-gold-gradient italic">help</span> today?
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/65">
            Orders, payments, Cash on Delivery, GST invoices, returns or choosing the right stone. Get an instant answer
            or reach a real person.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <OpenChatButton className="btn btn-lg btn-gold">
              <Sparkles className="h-4 w-4" /> Chat with Astro Assistant
            </OpenChatButton>
            <a href={whatsappLink('Hi Agarwal Gemstone, I need help with')} target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-ghost-light">
              <MessageCircle className="h-4 w-4" /> WhatsApp us
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------- Quick help ------------------------------- */}
      <section className="relative z-10 -mt-10">
        <div className="container-x grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_HELP.map(({ icon: Icon, title, copy, href }) => (
            <Link
              key={title}
              href={href}
              className="group rounded-3xl border border-sand-200 bg-white p-6 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-royal-50 text-royal-700 transition-colors duration-300 group-hover:bg-royal-deep group-hover:text-gold-300">
                <Icon className="h-[22px] w-[22px]" strokeWidth={1.8} />
              </span>
              <h2 className="mt-5 font-display text-2xl font-semibold text-navy-900">{title}</h2>
              <p className="mt-1 text-sm text-navy-900/55">{copy}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ------------------------------ Ticket + channels ------------------------------ */}
      <section id="ticket" className="section-y scroll-mt-32">
        <div className="container-x grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Suspense fallback={<div className="skeleton h-[36rem] rounded-3xl" />}>
            <SupportTicketForm />
          </Suspense>

          <aside className="space-y-4">
            {channels.map(({ icon: Icon, title, line, detail, href, external }) => (
              <a
                key={title}
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="flex items-center gap-4 rounded-3xl border border-sand-200 bg-white p-5 shadow-soft transition-colors hover:border-royal-300"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-royal-50 text-royal-700">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-navy-900/45">{title}</span>
                  <span className="block font-semibold text-navy-900">{line}</span>
                  <span className="block text-xs text-navy-900/50">{detail}</span>
                </span>
              </a>
            ))}

            <div className="rounded-3xl bg-royal-deep p-7 text-white">
              <Sparkles className="h-8 w-8 text-gold-300" />
              <h3 className="h-display mt-4 text-2xl">Gemstone question?</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Our Astro Assistant answers instantly, day or night — which stone suits your rashi, how to wear it, and
                what to check before buying.
              </p>
              <OpenChatButton className="btn btn-md btn-gold mt-5 w-full" question="Which gemstone should I wear?">
                Ask the Astro Assistant
              </OpenChatButton>
            </div>

            <div className="flex items-start gap-3 rounded-3xl border border-sand-200 bg-sand-50 p-5 text-sm text-navy-900/60">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-royal-600" />
              <span>
                Support hours: {SELLER.hours}. Tickets raised outside hours are answered first thing the next working
                morning.
              </span>
            </div>
          </aside>
        </div>
      </section>

      {/* ----------------------------------- FAQ ----------------------------------- */}
      <section className="pb-20 md:pb-28">
        <div className="container-x">
          <SectionHeading eyebrow="Quick answers" title="Orders, payments &" accent="invoices" />
          <div className="mx-auto max-w-4xl">
            <FAQ items={SUPPORT_FAQS} defaultOpen={-1} />
          </div>
          <p className="mt-8 text-center text-sm text-navy-900/55">
            Looking for shipping, return or privacy policies?{' '}
            <Link href="/contact#shipping" className="font-semibold text-royal-700 hover:text-royal-900">
              Read our policies
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
