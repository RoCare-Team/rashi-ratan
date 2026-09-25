import { NextResponse } from 'next/server';
import { parseQuoteInput, quoteOrder } from '@/lib/pricing';
import { makeOrderId } from '@/lib/utils';

/**
 * POST /api/razorpay/order
 * Creates a Razorpay order server side.
 *
 * The amount is never taken from the browser: the route re-prices the cart
 * from the catalogue (coupon, delivery and GST included) and charges that.
 *
 * The key secret is read here and never leaves the server. If credentials are
 * missing the route returns a simulated order so the prototype checkout still
 * completes — swap nothing but the environment variables to go live on TEST.
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

  const quote = quoteOrder({ ...input, paymentMethod: 'online' });
  if (quote.errors.length > 0 || quote.total <= 0) {
    return NextResponse.json({ error: quote.errors[0] ?? 'Nothing to charge' }, { status: 422 });
  }

  const rawNotes = (body as { notes?: unknown }).notes;
  const notes: Record<string, string> = {};
  if (rawNotes && typeof rawNotes === 'object') {
    for (const [key, value] of Object.entries(rawNotes).slice(0, 10)) {
      if (typeof value === 'string') notes[key.slice(0, 40)] = value.slice(0, 200);
    }
  }

  const storeOrderId = makeOrderId();
  const amount = Math.round(quote.total * 100); // paise
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  // Razorpay caps the receipt at 40 characters.
  const receipt = storeOrderId.slice(0, 40);

  /* ------------------------------- Mock mode ------------------------------- */
  if (!keyId || !keySecret) {
    return NextResponse.json({
      orderId: `order_mock_${Date.now().toString(36)}`,
      amount,
      currency: 'INR',
      keyId: null,
      mock: true,
      storeOrderId,
    });
  }

  /* ------------------------------ Razorpay API ------------------------------ */
  try {
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt,
        notes: { ...notes, source: 'rashi-ratan-web', store_order_id: storeOrderId, gst: String(quote.gst.totalTax) },
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('Razorpay order creation failed:', response.status, detail);

      // Surface Razorpay's own reason (bad key, amount below minimum, ...) so
      // configuration mistakes are obvious instead of silent.
      let reason = 'Could not create the payment order';
      try {
        const parsed = JSON.parse(detail) as { error?: { description?: string } };
        if (parsed.error?.description) reason = parsed.error.description;
      } catch {
        /* non JSON error body — keep the generic message */
      }
      return NextResponse.json({ error: reason }, { status: 502 });
    }

    const order = (await response.json()) as { id: string; amount: number; currency: string };

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      mock: false,
      storeOrderId,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json({ error: 'Payment gateway unreachable' }, { status: 502 });
  }
}
