import crypto from 'crypto';
import { NextResponse } from 'next/server';

/**
 * POST /api/razorpay/verify
 * Confirms that a payment callback really came from Razorpay.
 *
 * Razorpay signs `${order_id}|${payment_id}` with your key secret. Recomputing
 * that HMAC here is the only way to trust the browser callback — a production
 * build would also mark the order paid in its database at this point.
 */

export const runtime = 'nodejs';

interface VerifyRequest {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
}

export async function POST(request: Request) {
  let body: VerifyRequest;
  try {
    body = (await request.json()) as VerifyRequest;
  } catch {
    return NextResponse.json({ verified: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = body;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  /* Mock orders never carry a real signature. */
  if (orderId?.startsWith('order_mock_')) {
    return NextResponse.json({ verified: true, mock: true, orderId, paymentId });
  }

  if (!orderId || !paymentId || !signature) {
    return NextResponse.json(
      { verified: false, error: 'order_id, payment_id and signature are all required' },
      { status: 400 },
    );
  }

  if (!keySecret) {
    return NextResponse.json({ verified: false, error: 'Payment verification is not configured' }, { status: 500 });
  }

  const expected = crypto.createHmac('sha256', keySecret).update(`${orderId}|${paymentId}`).digest('hex');

  // Constant time comparison — both digests are the same length by construction.
  const verified =
    expected.length === signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected, 'utf8'), Buffer.from(signature, 'utf8'));

  if (!verified) {
    return NextResponse.json({ verified: false, error: 'Signature mismatch' }, { status: 400 });
  }

  // A real build would persist the paid order here.
  return NextResponse.json({ verified: true, mock: false, orderId, paymentId });
}
