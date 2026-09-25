'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, FileText, Printer } from 'lucide-react';
import Logo from '@/components/Logo';
import { useStore } from '@/context/StoreContext';
import { SELLER, stateCode } from '@/lib/business';
import { amountInWords } from '@/lib/gst';
import { quoteCart } from '@/lib/pricing';
import { formatDateTime, formatINRExact, invoiceNumberFor } from '@/lib/utils';

/**
 * GST tax invoice for an order placed in this browser.
 * Laid out for A4 printing — "Print / Save as PDF" gives the customer a copy.
 */
export default function InvoiceView() {
  const params = useSearchParams();
  const { findOrder, hydrated } = useStore();
  const order = hydrated ? findOrder(params.get('id') ?? '') : undefined;

  if (!hydrated) {
    return (
      <div className="container-x py-20">
        <div className="skeleton mx-auto h-[40rem] max-w-4xl rounded-3xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-x py-24 text-center">
        <span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-royal-50 text-royal-500">
          <FileText className="h-11 w-11" />
        </span>
        <h1 className="h-display mt-8 text-4xl text-navy-900">Invoice not found</h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-navy-900/55">
          Invoices are available for orders placed from this device. For older orders, our support team can email a copy.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/track-order" className="btn btn-md btn-primary">
            Find my order
          </Link>
          <Link href="/support" className="btn btn-md btn-outline">
            Contact support
          </Link>
        </div>
      </div>
    );
  }

  // Orders placed before GST support stored no breakdown — rebuild it from the catalogue.
  const gst =
    order.gst ?? quoteCart(order.items, { couponCode: null, buyerState: order.customer.state, paymentMethod: 'online' }).gst;
  const invoiceNumber = order.invoiceNumber ?? invoiceNumberFor(order.orderId, new Date(order.placedAt));
  const intra = gst.supplyType === 'intra';
  const buyerCode = stateCode(order.customer.state);

  return (
    <div className="bg-sand-100/60 py-10 print:bg-white print:py-0">
      <div className="container-x">
        <div className="mx-auto mb-6 flex max-w-4xl flex-wrap items-center justify-between gap-3 print:hidden">
          <Link href={`/track-order?id=${encodeURIComponent(order.orderId)}`} className="btn btn-sm btn-outline">
            <ArrowLeft className="h-4 w-4" /> Back to order
          </Link>
          <button type="button" onClick={() => window.print()} className="btn btn-sm btn-primary">
            <Printer className="h-4 w-4" /> Print / Save as PDF
          </button>
        </div>

        <article className="mx-auto max-w-4xl rounded-3xl border border-sand-200 bg-white p-6 text-[13px] text-navy-900 shadow-soft sm:p-10 print:max-w-none print:rounded-none print:border-0 print:p-0 print:shadow-none">
          {/* Header */}
          <header className="flex flex-wrap items-start justify-between gap-6 border-b border-sand-200 pb-6">
            <div>
              <Logo />
              <p className="mt-3 font-semibold">{SELLER.legalName}</p>
              {SELLER.addressLines.map((line) => (
                <p key={line} className="text-navy-900/60">
                  {line}
                </p>
              ))}
              <p className="text-navy-900/60">
                GSTIN: <span className="font-mono font-semibold text-navy-900">{SELLER.gstin}</span>
              </p>
              <p className="text-navy-900/60">
                State: {SELLER.state} ({SELLER.stateCode})
              </p>
            </div>
            <div className="text-right">
              <h1 className="font-display text-3xl font-bold uppercase tracking-wide">Tax Invoice</h1>
              <p className="mt-2 text-navy-900/60">
                Invoice No: <span className="font-mono font-semibold text-navy-900">{invoiceNumber}</span>
              </p>
              <p className="text-navy-900/60">Invoice Date: {formatDateTime(order.placedAt)}</p>
              <p className="text-navy-900/60">
                Order ID: <span className="font-mono">{order.orderId}</span>
              </p>
              <p className="text-navy-900/60">
                Payment: {order.method}
                {order.paymentMethod === 'cod' ? ' (to be collected)' : ''}
              </p>
            </div>
          </header>

          {/* Parties */}
          <section className="grid gap-6 border-b border-sand-200 py-6 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-navy-900/45">Billed & shipped to</p>
              <p className="mt-1.5 font-semibold">{order.customer.businessName || order.customer.name}</p>
              {order.customer.businessName && <p className="text-navy-900/60">Attn: {order.customer.name}</p>}
              <p className="text-navy-900/60">{order.customer.address}</p>
              <p className="text-navy-900/60">
                {order.customer.city}, {order.customer.state} {order.customer.pincode}
              </p>
              <p className="text-navy-900/60">
                {order.customer.phone} · {order.customer.email}
              </p>
              {order.customer.gstin && (
                <p className="text-navy-900/60">
                  GSTIN: <span className="font-mono font-semibold text-navy-900">{order.customer.gstin}</span>
                </p>
              )}
            </div>
            <div className="sm:text-right">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-navy-900/45">Place of supply</p>
              <p className="mt-1.5 font-semibold">
                {gst.placeOfSupply}
                {buyerCode ? ` (${buyerCode})` : ''}
              </p>
              <p className="text-navy-900/60">
                {intra ? 'Intra-state supply — CGST + SGST' : 'Inter-state supply — IGST'}
              </p>
              <p className="text-navy-900/60">Reverse charge: No</p>
            </div>
          </section>

          {/* Lines */}
          <div className="-mx-2 overflow-x-auto py-6">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-sand-300 text-[11px] uppercase tracking-wider text-navy-900/50">
                  <th className="px-2 py-2 font-semibold">#</th>
                  <th className="px-2 py-2 font-semibold">Description</th>
                  <th className="px-2 py-2 font-semibold">HSN</th>
                  <th className="px-2 py-2 text-right font-semibold">Qty</th>
                  <th className="px-2 py-2 text-right font-semibold">Taxable</th>
                  {intra ? (
                    <>
                      <th className="px-2 py-2 text-right font-semibold">CGST</th>
                      <th className="px-2 py-2 text-right font-semibold">SGST</th>
                    </>
                  ) : (
                    <th className="px-2 py-2 text-right font-semibold">IGST</th>
                  )}
                  <th className="px-2 py-2 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {gst.rows.map((row, index) => (
                  <tr key={`${row.description}-${index}`} className="border-b border-sand-100 align-top">
                    <td className="px-2 py-2.5 text-navy-900/50">{index + 1}</td>
                    <td className="px-2 py-2.5 font-medium">{row.description}</td>
                    <td className="px-2 py-2.5 font-mono text-navy-900/70">{row.hsn}</td>
                    <td className="px-2 py-2.5 text-right">{row.quantity}</td>
                    <td className="px-2 py-2.5 text-right">{formatINRExact(row.taxable)}</td>
                    {intra ? (
                      <>
                        <td className="px-2 py-2.5 text-right">
                          {formatINRExact(row.cgst)}
                          <span className="block text-[10px] text-navy-900/40">@ {row.rate / 2}%</span>
                        </td>
                        <td className="px-2 py-2.5 text-right">
                          {formatINRExact(row.sgst)}
                          <span className="block text-[10px] text-navy-900/40">@ {row.rate / 2}%</span>
                        </td>
                      </>
                    ) : (
                      <td className="px-2 py-2.5 text-right">
                        {formatINRExact(row.igst)}
                        <span className="block text-[10px] text-navy-900/40">@ {row.rate}%</span>
                      </td>
                    )}
                    <td className="px-2 py-2.5 text-right font-semibold">{formatINRExact(row.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <section className="grid gap-6 border-t border-sand-200 pt-6 sm:grid-cols-[1fr_18rem]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-navy-900/45">Amount in words</p>
              <p className="mt-1.5 font-medium">{amountInWords(gst.total)}</p>
              {order.charges?.couponCode && (
                <p className="mt-3 text-navy-900/55">
                  Coupon {order.charges.couponCode} applied — discount already reflected in the line values.
                </p>
              )}
            </div>
            <dl className="space-y-1.5">
              <div className="flex justify-between">
                <dt className="text-navy-900/60">Taxable value</dt>
                <dd>{formatINRExact(gst.taxable)}</dd>
              </div>
              {intra ? (
                <>
                  <div className="flex justify-between">
                    <dt className="text-navy-900/60">CGST</dt>
                    <dd>{formatINRExact(gst.cgst)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-navy-900/60">SGST</dt>
                    <dd>{formatINRExact(gst.sgst)}</dd>
                  </div>
                </>
              ) : (
                <div className="flex justify-between">
                  <dt className="text-navy-900/60">IGST</dt>
                  <dd>{formatINRExact(gst.igst)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-sand-300 pt-2 text-base font-bold">
                <dt>Invoice total</dt>
                <dd>{formatINRExact(gst.total)}</dd>
              </div>
            </dl>
          </section>

          <footer className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-sand-200 pt-6 text-[11px] text-navy-900/50">
            <p className="max-w-md leading-relaxed">
              This is a computer generated invoice and does not require a signature. Goods once sold are subject to our
              7 day return policy. Queries: {SELLER.email} · {SELLER.phone}
            </p>
            <p className="text-right">
              For <span className="font-semibold text-navy-900">{SELLER.legalName}</span>
              <br />
              Authorised Signatory
            </p>
          </footer>
        </article>
      </div>
    </div>
  );
}
