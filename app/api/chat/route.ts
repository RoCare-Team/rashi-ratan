import Anthropic from '@anthropic-ai/sdk';
import { ASTRO_SYSTEM_PROMPT } from '@/lib/astroPrompt';
import { ruleBasedReply } from '@/lib/astroBot';

/**
 * POST /api/chat
 * The astrology chatbot. Streams plain text back to the widget.
 *
 * With ANTHROPIC_API_KEY set, replies come from Claude with the store's
 * catalogue and policies in the system prompt. Without a key — or if the API
 * call fails before any text is sent — the rule-based assistant answers
 * instead, so the widget always works. The `X-Chat-Mode` header tells the
 * widget which one replied.
 */

export const runtime = 'nodejs';

const MODEL = 'claude-opus-5';
const MAX_MESSAGES = 16;
const MAX_CHARS = 1500;

/* ------------------------- Per-IP rate limit (in memory) ------------------------ */
// Enough to stop casual abuse of a public endpoint on a single server. Use a
// shared store (Redis, Upstash) when running several instances.
const WINDOW_MS = 5 * 60_000;
const MAX_REQUESTS = 20;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_REQUESTS;
}

/* ------------------------------------ Input ------------------------------------ */
function parseMessages(body: unknown): Anthropic.Beta.BetaMessageParam[] | null {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const messages: Anthropic.Beta.BetaMessageParam[] = [];
  for (const entry of raw.slice(-MAX_MESSAGES)) {
    const { role, content } = (entry ?? {}) as { role?: unknown; content?: unknown };
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string' || !content.trim()) return null;
    messages.push({ role, content: content.slice(0, MAX_CHARS) });
  }

  // The conversation must open with the shopper and end with their question.
  while (messages.length > 0 && messages[0].role !== 'user') messages.shift();
  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') return null;
  return messages;
}

function textResponse(text: string, mode: 'ai' | 'offline', status = 200) {
  return new Response(text, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'X-Chat-Mode': mode },
  });
}

const REFUSAL_TEXT =
  'I am not able to help with that here. For anything about gemstones, astrology or your order, just ask — or reach our team at /support.';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return textResponse('Invalid request.', 'offline', 400);
  }

  const messages = parseMessages(body);
  if (!messages) return textResponse('Please type a question.', 'offline', 400);

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (rateLimited(ip)) {
    return textResponse('You are sending messages quickly — please wait a minute and try again.', 'offline', 429);
  }

  const question = messages[messages.length - 1].content as string;

  if (!process.env.ANTHROPIC_API_KEY) {
    return textResponse(ruleBasedReply(question), 'offline');
  }

  const client = new Anthropic();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let sent = false;
      const write = (text: string) => {
        sent = true;
        try {
          controller.enqueue(encoder.encode(text));
        } catch {
          /* the browser already disconnected */
        }
      };

      try {
        const reply = client.beta.messages.stream(
          {
            model: MODEL,
            max_tokens: 4096,
            // Re-runs the request on Anthropic's recommended fallback model if a safety classifier declines it.
            betas: ['server-side-fallback-2026-07-01'],
            fallbacks: 'default',
            thinking: { type: 'adaptive' },
            // Short conversational answers — low effort keeps replies fast and inexpensive.
            output_config: { effort: 'low' },
            system: [{ type: 'text', text: ASTRO_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
            messages,
          },
          { signal: request.signal },
        );

        for await (const event of reply) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            write(event.delta.text);
          }
        }

        const final = await reply.finalMessage();
        if (final.stop_reason === 'refusal') {
          write(sent ? `\n\n${REFUSAL_TEXT}` : REFUSAL_TEXT);
        } else if (final.stop_reason === 'max_tokens') {
          write('…');
        } else if (!sent) {
          write(ruleBasedReply(question));
        }
      } catch (error) {
        if (error instanceof Anthropic.APIUserAbortError) {
          // The shopper closed the chat mid-reply — nothing to send.
        } else if (error instanceof Anthropic.AuthenticationError) {
          console.error('Chat: invalid ANTHROPIC_API_KEY');
        } else if (error instanceof Anthropic.RateLimitError) {
          console.warn('Chat: Anthropic rate limit reached');
        } else if (error instanceof Anthropic.APIError) {
          console.error(`Chat: Anthropic API error ${error.status}`, error.message);
        } else {
          console.error('Chat: unexpected error', error);
        }

        if (!(error instanceof Anthropic.APIUserAbortError)) {
          // Mid-reply failures get a short note; failures before any text get the offline answer.
          write(sent ? '\n\n(Connection interrupted — please ask again.)' : ruleBasedReply(question));
        }
      } finally {
        try {
          controller.close();
        } catch {
          /* already closed by a disconnect */
        }
      }
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'X-Chat-Mode': 'ai' },
  });
}
