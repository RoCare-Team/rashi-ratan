import { BadgeCheck, Headphones, Leaf, RotateCcw, ShieldCheck } from 'lucide-react';

const TRUST_POINTS = [
  { icon: Leaf, title: '100% Natural', copy: 'Mined, never synthetic' },
  { icon: BadgeCheck, title: 'Certified Gemstones', copy: 'IGI, GRS & GIA reports' },
  { icon: ShieldCheck, title: 'Secure Payments', copy: 'Razorpay protected' },
  { icon: RotateCcw, title: 'Easy Returns', copy: '7 day no-questions policy' },
  { icon: Headphones, title: 'Expert Guidance', copy: 'Free astrologer consult' },
];

/** Sits directly under the hero, overlapping it slightly. */
export default function TrustBar() {
  return (
    <section className="relative z-10 -mt-10 md:-mt-14">
      <div className="container-x">
        <div className="grid grid-cols-2 gap-3 rounded-[2rem] border border-sand-200 bg-white/90 p-4 shadow-lift backdrop-blur-xl sm:gap-4 sm:p-5 lg:grid-cols-5">
          {TRUST_POINTS.map(({ icon: Icon, title, copy }) => (
            <div
              key={title}
              className="group flex items-center gap-3.5 rounded-2xl p-3 transition-colors duration-300 hover:bg-sand-50"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-royal-50 text-royal-700 transition-all duration-300 group-hover:bg-royal-deep group-hover:text-gold-300">
                <Icon className="h-[22px] w-[22px]" strokeWidth={1.8} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold leading-tight text-navy-900">{title}</span>
                <span className="mt-0.5 block truncate text-xs text-navy-900/50">{copy}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
