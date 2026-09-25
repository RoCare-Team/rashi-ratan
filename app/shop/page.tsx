import { Suspense } from 'react';
import type { Metadata } from 'next';
import ShopView from './ShopView';

export const metadata: Metadata = {
  title: 'Shop Certified Gemstones, Rudraksha & Yantras',
  description:
    'Browse the full Agarwal Gemstone collection. Filter certified gemstones by category, price, gemstone type, rashi and rating.',
};

function ShopFallback() {
  return (
    <div className="container-x py-24">
      <div className="skeleton h-12 w-64 rounded-full" />
      <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="skeleton aspect-[3/4] rounded-3xl" />
        ))}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopFallback />}>
      <ShopView />
    </Suspense>
  );
}
