import { NextResponse } from 'next/server';
import { validateTicket, type SupportTicketInput, type SupportTopic } from '@/lib/support';

/**
 * POST /api/support
 * Opens a customer support ticket.
 *
 * The prototype validates the ticket and returns a reference number. To go
 * live, forward the ticket here to your helpdesk (Freshdesk, Zoho Desk…) or
 * send it by email — the form and its responses stay the same.
 */

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const text = (key: string, max: number) => (typeof body[key] === 'string' ? (body[key] as string).trim().slice(0, max) : '');
  const ticket: SupportTicketInput = {
    name: text('name', 80),
    email: text('email', 120),
    phone: text('phone', 10),
    orderId: text('orderId', 14).toUpperCase(),
    topic: text('topic', 20) as SupportTopic,
    message: text('message', 2001),
  };

  const errors = validateTicket(ticket);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: 'Please check the highlighted fields', fieldErrors: errors }, { status: 422 });
  }

  const ticketId = `TKT-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  console.info('Support ticket', ticketId, { topic: ticket.topic, orderId: ticket.orderId || null });

  return NextResponse.json({ ticketId, respondWithinHours: 24 });
}
