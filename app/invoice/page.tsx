import type { Metadata } from 'next';
import { Suspense } from 'react';
import InvoiceView from './InvoiceView';

export const metadata: Metadata = {
  title: 'Tax Invoice',
  description: 'GST tax invoice for your Agarwal Gemstone order.',
  robots: { index: false },
};

export default function InvoicePage() {
  return (
    <Suspense fallback={<div className="container-x py-20"><div className="skeleton mx-auto h-[40rem] max-w-4xl rounded-3xl" /></div>}>
      <InvoiceView />
    </Suspense>
  );
}
