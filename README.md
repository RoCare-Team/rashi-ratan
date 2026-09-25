# Agarwal Gemstone — Premium Gemstone & Astrology Storefront

A frontend prototype for **Agarwal Gemstone**, an Indian ecommerce brand selling certified gemstones,
rashi ratna, navratna, rudraksha, crystals, yantras and spiritual products.

**No database. No backend services.** Every product, category, review, zodiac sign and coupon lives in
a typed file under `/data`, and all shopping state lives in React context mirrored to `localStorage`.
The UI is built so a real backend can be dropped in later without touching a single component.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm start   # production build
```

Node 18.18+ is required (developed on Node 22).

---

## Tech stack

| Layer      | Choice                                        |
| ---------- | --------------------------------------------- |
| Framework  | Next.js 15 (App Router) + React 19            |
| Language   | TypeScript (strict)                           |
| Styling    | Tailwind CSS 3.4 with a custom design system   |
| Icons      | lucide-react                                  |
| State      | React Context (`context/StoreContext.tsx`)     |
| Payments   | Razorpay Checkout structure, TEST mode ready   |
| Data       | Hardcoded TypeScript files in `/data`          |

---

## Project structure

```
app/
  layout.tsx                 Root layout — fonts, StoreProvider, Navbar, Footer, CartDrawer, Toaster
  page.tsx                   Home — hero, trust bar, categories, featured, rashi, finder, reviews, FAQ
  shop/                      Listing page with sidebar filters, sorting and search (ShopView.tsx)
  product/[slug]/            Product detail — prerendered for all 35 products
  cart/                      Full cart page with coupons and order summary
  checkout/                  Two column checkout + Razorpay payment step
  order-success/             Confirmation screen with confetti, timeline and order summary
  wishlist/                  Saved products
  gemstones/                 Types of gemstones guide — Navratna, Uparatna, healing crystals
  support/                   Customer support centre — ticket form, WhatsApp, call, FAQ
  track-order/               Delivery tracking by order ID + mobile number
  invoice/                   Printable GST tax invoice (?id=RR-XXXXXXXX)
  astrology/                 Navagraha table, lucky stone finder, shop by rashi, consultation
  about/  contact/  account/ Brand story, contact + policies, demo account dashboard
  api/razorpay/order/        POST — creates a Razorpay order server side (secret never leaves server)
  api/razorpay/verify/       POST — HMAC signature verification of the payment callback
  api/orders/cod/            POST — places a Cash on Delivery order (server re-prices, enforces COD limit)
  api/chat/                  POST — astrology chatbot, streams Claude replies (rule-based fallback)
  api/support/               POST — opens a support ticket

components/
  Navbar · Footer · Hero · TrustBar · CategoryCard · ProductCard · ProductGrid
  ProductDetail · QuickViewModal · ProductFilters · SearchBar · CartDrawer
  WishlistButton · RazorpayCheckout · ZodiacCard · ShopByRashi · LuckyStoneFinder
  TestimonialCard · FAQ · StarRating · SectionHeading · Logo · Toaster · GemVisual

data/
  products.ts    35 products across 8 categories + query helpers
  categories.ts  8 categories with live product counts
  zodiac.ts      12 rashis with recommendations + the demo "find my stone" logic
  reviews.ts     Customer testimonials and the FAQ list
  coupons.ts     Demo coupon codes and delivery charge rules

context/StoreContext.tsx   Cart, wishlist, coupon, last order and toast state
lib/types.ts               Shared domain types
lib/utils.ts               INR formatting, discounts, weight pricing, order ids
lib/razorpay.ts            Checkout script loader and payment types
lib/business.ts            Seller identity (Agarwal Gemstone, GSTIN), COD rules, Indian states
lib/pricing.ts             quoteOrder() — server-trusted pricing: coupon, delivery, COD fee, GST
lib/gst.ts                 GST rates/HSN per category, CGST+SGST vs IGST split, amount in words
lib/tracking.ts            Delivery status model (swap for a courier API)
lib/astroBot.ts            Rule-based astrology assistant (no API key needed)
lib/astroPrompt.ts         Claude system prompt built from the catalogue and policies
data/gemTypes.ts           22 gem types for the guide page
```

---

## Product artwork without images

The prototype ships **no image files**. `components/GemVisual.tsx` renders each product as a faceted
SVG gemstone from three colours plus a cut (`oval`, `round`, `emerald`, `pear`, `cushion`, `bead`,
`plate`, `raw`) declared on the product's `art` field. Everything loads instantly and stays crisp at
any size.

To switch to real photography, add an `images` array to a product in `data/products.ts`:

```ts
images: ['https://cdn.example.com/blue-sapphire.jpg'],
```

`ProductImage` (exported from the same file) prefers the photograph and falls back to the SVG, so
you can migrate one product at a time.

---

## Working features

- Type-ahead **search** with product previews (navbar, mobile sheet and shop header)
- **Filtering** by category, price, gemstone type, rashi, rating and availability
- **Sorting** by popularity, price, newest and rating
- **Add to cart** with per-weight pricing, quantity control and a slide-out cart drawer
- **Wishlist** with a persistent counter in the navbar
- **Quick view** modal from every product card
- **Coupon codes** — `RASHI10`, `GEMSTONE20`, `NAVRATRI15` — with minimum spend and caps
- Free delivery above ₹2,000, otherwise ₹149, with a progress meter in the cart
- **Lucky Gemstone Finder** — birth details in, a recommendation card out
- **Shop by Rashi** — interactive zodiac wheel with per-sign recommendations
- **Checkout** with field validation, then Razorpay payment
- **Order success** page with confetti, order id, delivery estimate and a status timeline
- Toast notifications, loading skeletons and reduced-motion support throughout
- Fully responsive: 2 products per row on mobile, 3 on tablet, 4 on desktop

Cart, wishlist, coupon and the last order survive a page refresh via `localStorage`.

---

## Razorpay payments

The complete integration structure is in place and runs in **TEST mode**.

### Environment

Copy `.env.example` to `.env.local`:

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_test_secret_here
```

- `NEXT_PUBLIC_RAZORPAY_KEY_ID` is the only value ever sent to the browser.
- `RAZORPAY_KEY_SECRET` is read **only** inside the route handlers under `app/api/razorpay/`.
  It is never imported into a client component and never reaches the bundle.

### Flow

1. `RazorpayCheckout` POSTs the amount to `/api/razorpay/order`.
2. The route creates the order against the Razorpay API using Basic auth with the secret.
3. Razorpay Checkout opens with the returned `order_id` and the public key.
4. On success the callback is POSTed to `/api/razorpay/verify`, which recomputes the
   `HMAC-SHA256(order_id|payment_id, key_secret)` signature and compares it in constant time.
5. Verified → the order is stored and the user lands on `/order-success`.
   Failed or dismissed → an error toast, with the cart left intact.

### Mock mode

**With no keys configured the app automatically simulates a successful payment** so the demo flow
works end to end. Add TEST keys and the exact same code path talks to the real gateway — nothing
else changes.

Supported methods once keys are added: UPI, credit and debit cards, net banking and wallets.

---

## Connecting a real backend later

Components never import `products.ts` directly for data — they call the helper functions at the
bottom of each data file (`getAllProducts`, `getProductBySlug`, `getFeaturedProducts`,
`searchProducts`, `getCategoriesWithCounts`, …). Replace those function bodies with `fetch` calls
and the UI keeps working.

The same applies to state: swap the `localStorage` effects in `context/StoreContext.tsx` for API
calls and every component keeps its current interface.

Also worth moving server side when a backend exists: coupon validation, stock checks, order
persistence in `/api/razorpay/verify`, and the astrology calculation in `findLuckyStone()`
(currently a deterministic demo derived from the date of birth).

---

## Notes

This is a prototype. The contact form, newsletter box and account area confirm locally without
sending anything, orders are generated in the browser, and astrological guidance is presented as
traditional belief rather than professional advice.
#   r a s h i - r a t a n 
 
 

---

## E-store features

### Payments: Razorpay + Cash on Delivery

Checkout offers **Pay Online** (Razorpay) or **Cash on Delivery**. COD adds a ₹49 handling fee and is
limited to orders up to ₹25,000 (`COD_FEE`, `COD_MAX_ORDER` in `lib/business.ts`).

The server never trusts an amount sent by the browser. Both `/api/razorpay/order` and `/api/orders/cod`
receive only the cart lines, coupon and delivery state, and re-price everything with `quoteOrder()`.

### GST

All prices are GST-inclusive. `lib/gst.ts` back-calculates the taxable value per line and splits tax as
**CGST + SGST** when delivering inside Rajasthan (the seller's state) or **IGST** for any other state.
Shipping and COD fees are taxed at the principal item's rate. Business buyers can enter a GSTIN at
checkout. Every order gets a printable tax invoice at `/invoice?id=…` issued by **Agarwal Gemstone**.

> Before going live: set the real GSTIN and address in `lib/business.ts`, and have your CA confirm the
> HSN codes and rates in `GST_RULES` (defaults: gems & jewellery 3%, rudraksha / yantras / puja items 5%).

### Delivery tracking

`/track-order` looks up an order by ID + mobile number and shows courier, AWB and a status timeline.
Orders are kept in this browser (last 20). Status is simulated from the order time in
`lib/tracking.ts` — replace `getTracking()` with your courier aggregator's tracking API (Shiprocket,
Delhivery…) keyed on the AWB number.

### Astrology chatbot

A floating **Ask Astrologer** widget on every page. Set `ANTHROPIC_API_KEY` to answer with Claude
(`claude-opus-5`, streamed, with the catalogue, rashi table, gem guide and store policies in a cached
system prompt). Without a key — or if the API fails — the rule-based assistant in `lib/astroBot.ts`
answers rashi, date-of-birth, gemstone, COD, GST, tracking and returns questions instantly. The route
is rate limited per IP (in memory; use Redis when running several instances).

### Customer support

`/support` has quick links, a ticket form (`/api/support` returns a reference number — forward it to
your helpdesk or email there), WhatsApp / call / email, and a support FAQ. The chatbot hands off to
WhatsApp and the support page.
