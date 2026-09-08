import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';
import GemVisual from '@/components/GemVisual';

export default function NotFound() {
  return (
    <div className="relative overflow-hidden bg-royal-deep py-28 text-center">
      <div className="pointer-events-none absolute inset-0 bg-aurora opacity-70" />
      <div className="noise pointer-events-none absolute inset-0" />

      <div className="container-x relative">
        <div className="mx-auto h-32 w-32 animate-float">
          <GemVisual art={{ cut: 'pear', light: '#d6b6ff', base: '#8b4cd6', deep: '#421a70' }} seed="notfound" />
        </div>

        <p className="eyebrow mt-8 justify-center text-gold-300">
          <Compass className="h-4 w-4" /> Error 404
        </p>
        <h1 className="h-display mt-4 text-5xl text-white sm:text-6xl">
          This page is not in our <span className="text-gold-gradient italic">chart</span>
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-white/60">
          The link may have moved or never existed. Head back to the collection and pick up where you left off.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn btn-lg btn-gold">
            Back to home <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/shop" className="btn btn-lg btn-ghost-light">
            Browse all products
          </Link>
        </div>
      </div>
    </div>
  );
}
