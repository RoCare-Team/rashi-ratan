import { zodiacSigns, findLuckyStone } from '@/data/zodiac';
import { gemTypes, type GemTypeInfo } from '@/data/gemTypes';
import { FREE_DELIVERY_ABOVE, DELIVERY_CHARGE } from '@/data/coupons';
import { COD_FEE, COD_MAX_ORDER, SELLER } from './business';
import type { Zodiac } from './types';

/**
 * Rule-based astrology assistant.
 *
 * Answers the common questions instantly with no API key: rashi → stone,
 * date of birth → stone, gem facts, planets, and store policies (COD, GST,
 * tracking, returns). The /api/chat route uses it when Claude is not
 * configured, and as a fallback if the API call fails.
 *
 * Replies use the same light markdown the chat widget renders: **bold**,
 * [links](/path) and "- " bullets.
 */

const rupees = (value: number) => `₹${value.toLocaleString('en-IN')}`;

const normalise = (text: string) =>
  text
    .toLowerCase()
    .replace(/[’'`]/g, '')
    .replace(/\s+/g, ' ');

const hasWord = (text: string, word: string) => new RegExp(`\\b${word}\\b`).test(text);

const PLANETS: Array<{ keys: string[]; name: string; gem: string }> = [
  { keys: ['sun', 'surya'], name: 'Sun (Surya)', gem: 'ruby' },
  { keys: ['moon', 'chandra'], name: 'Moon (Chandra)', gem: 'pearl' },
  { keys: ['mars', 'mangal', 'manglik'], name: 'Mars (Mangal)', gem: 'red-coral' },
  { keys: ['mercury', 'budh', 'budha'], name: 'Mercury (Budh)', gem: 'emerald' },
  { keys: ['jupiter', 'guru', 'brihaspati'], name: 'Jupiter (Guru)', gem: 'yellow-sapphire' },
  { keys: ['venus', 'shukra'], name: 'Venus (Shukra)', gem: 'diamond' },
  { keys: ['saturn', 'shani', 'sade sati', 'sadesati'], name: 'Saturn (Shani)', gem: 'blue-sapphire' },
  { keys: ['rahu'], name: 'Rahu', gem: 'hessonite' },
  { keys: ['ketu'], name: 'Ketu', gem: 'cats-eye' },
];

const DISCLAIMER =
  'Gemstone guidance follows traditional Vedic belief. For strong stones, confirm with a full birth chart — our astrologers do this [free of charge](/astrology#consultation).';

function gemLink(gem: GemTypeInfo): string {
  return gem.productSlug
    ? `[${gem.shopLabel ?? `Shop ${gem.name}`}](/product/${gem.productSlug})`
    : `[Read about ${gem.name}](/gemstones#${gem.slug})`;
}

function describeGem(gem: GemTypeInfo): string {
  const lines = [
    `**${gem.name} (${gem.hindi})** is the stone of **${gem.planet}**.`,
    ...gem.benefits.map((benefit) => `- ${benefit}`),
    `Traditionally worn on the **${gem.wear.finger.toLowerCase()}** in ${gem.wear.metal.toLowerCase()}, ${gem.wear.day.toLowerCase()}.`,
    gem.rashi.length > 0 && gem.rashi[0] !== 'All signs'
      ? `Most suited to: ${gem.rashi.join(', ')}.`
      : gem.rashi[0] === 'All signs'
        ? 'Safe for every rashi.'
        : 'Worn only when the birth chart calls for it.',
    gem.substitutes ? `Gentler substitutes: ${gem.substitutes.join(', ')}.` : '',
    gemLink(gem),
  ];
  if (gem.slug === 'blue-sapphire') {
    lines.splice(1, 0, 'Neelam is the fastest acting gem, so astrologers recommend a 3 day trial before wearing it permanently.');
  }
  return lines.filter(Boolean).join('\n');
}

function describeSign(sign: Zodiac): string {
  const gem = gemTypes.find((entry) => entry.productSlug === sign.stoneSlug);
  return [
    `**${sign.name} (${sign.english}) ${sign.symbol}** is ruled by **${sign.lord}**.`,
    `Lucky gemstone: **${sign.luckyStone} (${sign.luckyStoneHindi})**`,
    ...sign.benefits.map((benefit) => `- ${benefit}`),
    `Lucky colour: ${sign.luckyColor} · Lucky day: ${sign.luckyDay}`,
    `[Shop ${sign.luckyStone}](/product/${sign.stoneSlug})${gem ? ` · [Gem guide](/gemstones#${gem.slug})` : ''}`,
    DISCLAIMER,
  ].join('\n');
}

function findSign(text: string): Zodiac | undefined {
  return zodiacSigns.find(
    (sign) => hasWord(text, sign.name.toLowerCase()) || hasWord(text, sign.english.toLowerCase()) || hasWord(text, sign.slug),
  );
}

/** Everyday spellings shoppers type that differ from the catalogue names. */
const GEM_ALIASES: Record<string, string[]> = {
  'red-coral': ['coral', 'munga'],
  'cats-eye': ['cat eye', 'lehsuniya', 'lahsuniya'],
  'blue-sapphire': ['nilam', 'neelam'],
  'yellow-sapphire': ['pukhraaj', 'pukraj'],
  hessonite: ['gomedh'],
  diamond: ['hira'],
  pearl: ['mothi'],
};

function findGem(text: string): GemTypeInfo | undefined {
  return gemTypes.find((gem) => {
    const names = [gem.name, gem.hindi, ...(GEM_ALIASES[gem.slug] ?? [])].map(normalise);
    return names.some((name) => hasWord(text, name));
  });
}

function parseDate(text: string): Date | null {
  const iso = text.match(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  const indian = text.match(/\b(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})\b/);
  if (indian) return new Date(Number(indian[3]), Number(indian[2]) - 1, Number(indian[1]));
  return null;
}

export function ruleBasedReply(message: string): string {
  const text = normalise(message);

  /* ------------------------------ Store support ------------------------------ */
  if (/\b(track|tracking|awb|where is my order|order status|not delivered|delayed)\b/.test(text)) {
    return [
      'You can follow your parcel live on the **[Track Order](/track-order)** page — enter your order ID (it starts with RR-) and the mobile number used at checkout.',
      'Orders are packed within 24 hours and delivered in 3 to 5 working days, insured and with signature on delivery.',
      `If tracking has not moved for 48 hours, [raise a support ticket](/support) or WhatsApp us on ${SELLER.phone}.`,
    ].join('\n');
  }

  if (/\b(cod|cash on delivery|pay on delivery|cash)\b/.test(text)) {
    return [
      '**Yes, Cash on Delivery is available** across India.',
      `- Available on orders up to ${rupees(COD_MAX_ORDER)}`,
      `- A small ${rupees(COD_FEE)} handling fee applies`,
      '- Pay the courier in cash or by UPI when your parcel arrives',
      'Choose **Cash on Delivery** in the payment step at [checkout](/checkout). Higher value orders can be paid securely online by UPI, card or net banking.',
    ].join('\n');
  }

  if (/\b(gst|gstin|invoice|tax|bill|cgst|sgst|igst)\b/.test(text)) {
    return [
      `All our prices are **inclusive of GST**. Every order comes with a GST tax invoice from ${SELLER.legalName} (GSTIN ${SELLER.gstin}).`,
      '- Deliveries within Rajasthan show **CGST + SGST**',
      '- Deliveries to other states show **IGST**',
      '- Gemstones and jewellery carry 3% GST; rudraksha, yantras and puja items 5%',
      'Businesses can add their **GSTIN** at checkout to claim input tax credit. You can download the invoice from your order confirmation or the [Track Order](/track-order) page.',
    ].join('\n');
  }

  if (/\b(return|refund|exchange|replace|cancel)\b/.test(text)) {
    return [
      'You can return any unworn product within **7 days of delivery** with its certificate and seal intact. We arrange a free reverse pickup.',
      'Refunds reach the original payment method in 5 to 7 working days (COD orders are refunded to your bank account or UPI).',
      '[Start a return request](/support?topic=return) · [Read the return policy](/contact#returns)',
    ].join('\n');
  }

  if (/\b(shipping|delivery charge|delivery time|how long|dispatch)\b/.test(text)) {
    return `Delivery is **free above ${rupees(FREE_DELIVERY_ABOVE)}**, otherwise ${rupees(DELIVERY_CHARGE)}. Orders are dispatched within 24 hours and arrive in 3 to 5 working days, fully insured. [Shipping policy](/contact#shipping)`;
  }

  if (/\b(payment|upi|card|razorpay|net ?banking|wallet|emi)\b/.test(text)) {
    return 'We accept **UPI, credit & debit cards, net banking and wallets** through Razorpay secure checkout, plus **Cash on Delivery** on orders up to ' + `${rupees(COD_MAX_ORDER)}. Card details never touch our servers.`;
  }

  if (/\b(human|agent|person|call|phone|whatsapp|support|complaint|help ?desk|talk to)\b/.test(text)) {
    return [
      'Happy to connect you with our team:',
      `- WhatsApp or call **${SELLER.phone}** (${SELLER.hours})`,
      `- Email **${SELLER.email}**`,
      '- Or [raise a support ticket](/support) and we reply within one working day',
    ].join('\n');
  }

  if (/\b(certificate|certified|genuine|real|fake|lab|original)\b/.test(text)) {
    return 'Every gemstone ships with an **independent lab certificate** (IGI, GRS or GII) sealed in a tamper-proof pack. You can verify the report number on the lab’s website. We sell only natural, untreated or disclosed stones. [Our certification](/about#certification)';
  }

  /* ------------------------------ Astrology ------------------------------ */
  const date = parseDate(text);
  if (date && !Number.isNaN(date.getTime())) {
    const sign = findLuckyStone(date.toISOString().slice(0, 10));
    return [
      `Based on your date of birth, your approximate rashi is **${sign.name} (${sign.english})**.`,
      describeSign(sign),
      'For an exact reading we also need your **birth time and place**, as your moon sign and ascendant decide the final stone.',
    ].join('\n\n');
  }

  const gem = findGem(text);
  const sign = findSign(text);

  if (gem && sign) {
    const suited = gem.rashi.includes(sign.english) || gem.rashi.includes('All signs');
    return suited
      ? `**Yes — ${gem.name} (${gem.hindi}) is traditionally favourable for ${sign.name} (${sign.english}).**\n\n${describeGem(gem)}`
      : `**${gem.name} is not the usual stone for ${sign.name} (${sign.english}).** The recommended stone for ${sign.english} is **${sign.luckyStone} (${sign.luckyStoneHindi})**. ${gem.name} may still suit you if ${gem.planet.split(' (')[0]} is well placed in your chart — please check with an astrologer first.\n\n${DISCLAIMER}`;
  }

  if (gem) return `${describeGem(gem)}\n\n${DISCLAIMER}`;
  if (sign) return describeSign(sign);

  const planet = PLANETS.find((entry) => entry.keys.some((key) => (key.includes(' ') ? text.includes(key) : hasWord(text, key))));
  if (planet) {
    const planetGem = gemTypes.find((entry) => entry.slug === planet.gem);
    if (planetGem) {
      const intro = /\b(dosha|dosh|sade sati|sadesati|weak|afflicted|mahadasha|dasha)\b/.test(text)
        ? `For a weak or afflicted **${planet.name}**, the traditional remedy is its gemstone — but only if ${planet.name.split(' (')[0]} is a friendly planet for your ascendant. Otherwise mantras and daan are advised instead.\n\n`
        : '';
      return `${intro}${describeGem(planetGem)}`;
    }
  }

  if (/\b(rashi|zodiac|sign|lucky stone|lucky gem|which stone|which gem|suits me|recommend)\b/.test(text)) {
    return [
      'I can suggest a stone in a few ways:',
      '- Tell me your **rashi** (e.g. "Mesh" or "Leo")',
      '- Share your **date of birth** (DD/MM/YYYY)',
      '- Or use the [Lucky Stone Finder](/astrology#finder)',
      'Here is the classic rashi guide:',
      ...zodiacSigns.map((entry) => `- ${entry.name} (${entry.english}): ${entry.luckyStone}`),
    ].join('\n');
  }

  if (/\b(types|kinds|navratna|navaratna|uparatna|semi precious|precious|crystal)\b/.test(text)) {
    return [
      'Gemstones fall into three families:',
      '- **Navratna** — the nine planetary gems (Ruby, Pearl, Coral, Emerald, Yellow Sapphire, Diamond, Blue Sapphire, Hessonite, Cat’s Eye)',
      '- **Uparatna** — gentler semi-precious substitutes like Amethyst, Topaz, Garnet and Moonstone',
      '- **Healing crystals** — quartz, tourmaline and citrine for meditation and vastu',
      '[Explore the full gemstone guide](/gemstones)',
    ].join('\n');
  }

  if (/^(hi|hello|hey|namaste|namaskar|good (morning|evening|afternoon))\b/.test(text)) {
    return 'Namaste! 🙏 I am the Rashi Ratan astrology assistant. Ask me which gemstone suits your rashi, share your date of birth, or ask about orders, COD, GST invoices and delivery.';
  }

  return [
    'I can help with:',
    '- **Gemstone advice** — tell me your rashi or date of birth',
    '- **Gem facts** — ask about any stone, e.g. "Tell me about Emerald"',
    '- **Orders** — [tracking](/track-order), Cash on Delivery, GST invoices, returns',
    `For anything else, our team is on WhatsApp at ${SELLER.phone}.`,
  ].join('\n');
}
