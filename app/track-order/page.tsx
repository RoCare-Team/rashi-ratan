import type { Metadata } from 'next';
import { Suspense } from 'react';
import TrackOrderView from './TrackOrderView';

export const metadata: Metadata = {
  title: 'Track Your Order',
  description: 'Live delivery status, courier and AWB details for your Agarwal Gemstone order.',
};

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="container-x py-24"><div className="skeleton h-96 rounded-3xl" /></div>}>
      <TrackOrderView />
    </Suspense>
  );
}
