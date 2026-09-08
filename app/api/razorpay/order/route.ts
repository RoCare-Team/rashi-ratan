import { NextResponse } from 'next/server';

/**
 * POST /api/razorpay/order
 * Creates a Razorpay order server side.
 *
 * The key secret is read here and never leaves the server. If credentials are
 * missing the route returns a simulated order so the prototype checkout still
 * completes — swap nothing but the environment variables to go live on TEST.
 */

export const runtime = 'nodejs';

interface OrderRequest {
  amount?: number; // rupees
  receipt?: string;
  notes?: Record<string, string>;
}

export async function POST(request: Request) {
  let body: OrderRequest;
  try {
    body = (await request.json()) as OrderRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const rupees = Number(body.amount);
  if (!Number.isFinite(rupees) || rupees <= 0) {
    return NextResponse.json({ error: 'A positive `amount` in rupees is required' }, { status: 400 });
  }

  const amount = Math.round(rupees * 100); // paise
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  // Razorpay caps the receipt at 40 characters.
  const receipt = (body.receipt ?? `rr_${Date.now().toString(36)}`).slice(0, 40);

  /* ------------------------------- Mock mode ------------------------------- */
  if (!keyId || !keySecret) {
    return NextResponse.json({
      orderId: `order_mock_${Date.now().toString(36)}`,
      amount,
      currency: 'INR',
      keyId: null,
      mock: true,
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
        notes: { source: 'rashi-ratan-web', ...body.notes },
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
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json({ error: 'Payment gateway unreachable' }, { status: 502 });
  }
}
