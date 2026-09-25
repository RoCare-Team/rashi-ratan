import { NextResponse } from 'next/server';
import { parseQuoteInput, quoteOrder } from '@/lib/pricing';
import { cleanCustomer, validateCustomer } from '@/lib/validation';
import { invoiceNumberFor, makeOrderId } from '@/lib/utils';

/**
 * POST /api/orders/cod
 * Places a Cash on Delivery order.
 *
 * Re-prices the cart on the server, enforces the COD limit and validates the
 * delivery details. A production build would persist the order and notify the
 * warehouse here; the prototype returns the confirmed order to the browser.
 */

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const input = parseQuoteInput(body);
  if (!input) {
    return NextResponse.json({ error: 'A non-empty `lines` array is required' }, { status: 400 });
  }

  const customer = cleanCustomer((body as { customer?: unknown }).customer);
  const fieldErrors = validateCustomer(customer);
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json({ error: 'Please check your delivery details', fieldErrors }, { status: 422 });
  }

  const quote = quoteOrder({ ...input, buyerState: customer.state, paymentMethod: 'cod' });
  if (quote.errors.length > 0) {
    return NextResponse.json({ error: quote.errors[0] }, { status: 422 });
  }

  const orderId = makeOrderId();
  const placedAt = new Date();

  return NextResponse.json({
    orderId,
    invoiceNumber: invoiceNumberFor(orderId, placedAt),
    placedAt: placedAt.toISOString(),
    customer,
    quote,
  });
}
