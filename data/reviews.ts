import type { FaqItem, Review } from '@/lib/types';

/** Customer testimonials. Avatars are rendered as gradient initials, no images needed. */
export const reviews: Review[] = [
  {
    id: 'r-01',
    name: 'Ananya Sharma',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    title: 'Certificate was properly provided',
    text: 'The gemstone quality was excellent and the certificate was properly provided. The Blue Sapphire had exactly the royal blue tone shown on the site. Highly recommended!',
    date: '12 August 2026',
    verified: true,
    productSlug: 'natural-blue-sapphire-neelam',
    avatar: { from: '#722ee0', to: '#d4a933' },
  },
  {
    id: 'r-02',
    name: 'Rajesh Iyer',
    location: 'Bengaluru, Karnataka',
    rating: 5,
    title: 'Genuine Pukhraj at a fair price',
    text: 'I compared three sellers before ordering. Agarwal Gemstone was the only one that shared the lab report before payment. The Pukhraj is clean, bright and exactly the carat weight promised.',
    date: '3 August 2026',
    verified: true,
    productSlug: 'yellow-sapphire-pukhraj',
    avatar: { from: '#2b5fd9', to: '#12a26b' },
  },
  {
    id: 'r-03',
    name: 'Priya Nair',
    location: 'Kochi, Kerala',
    rating: 5,
    title: 'The consultation made the difference',
    text: 'I was not sure which stone suited my chart. Their astrologer studied my details and suggested Panna instead of what I had planned to buy. Very honest guidance.',
    date: '28 July 2026',
    verified: true,
    productSlug: 'emerald-panna',
    avatar: { from: '#12a26b', to: '#d4a933' },
  },
  {
    id: 'r-04',
    name: 'Vikram Singh',
    location: 'Jaipur, Rajasthan',
    rating: 4,
    title: 'Beautiful packaging, quick delivery',
    text: 'Delivered in four days with tamper proof sealing and a velvet box. As someone from Jaipur I know stones well, and this Moonga is genuine untreated Italian coral.',
    date: '21 July 2026',
    verified: true,
    productSlug: 'red-coral-moonga',
    avatar: { from: '#e04a2f', to: '#f0b429' },
  },
  {
    id: 'r-05',
    name: 'Meera Deshpande',
    location: 'Pune, Maharashtra',
    rating: 5,
    title: 'My 5 Mukhi is perfect',
    text: 'The bead is large, deep grained and came with an X ray report. I have been wearing it for two months and it has become part of my morning routine. Ordering another as a gift.',
    date: '14 July 2026',
    verified: true,
    productSlug: '5-mukhi-rudraksha',
    avatar: { from: '#8a5a2b', to: '#c99a6a' },
  },
  {
    id: 'r-06',
    name: 'Arjun Malhotra',
    location: 'New Delhi',
    rating: 5,
    title: 'Shree Yantra arrived energised',
    text: 'The copper work is crisp and the geometry is accurate, which is rare at this price. Installation guide was genuinely useful for someone doing this for the first time.',
    date: '9 July 2026',
    verified: true,
    productSlug: 'shree-yantra-copper',
    avatar: { from: '#c0762e', to: '#722ee0' },
  },
  {
    id: 'r-07',
    name: 'Sneha Reddy',
    location: 'Hyderabad, Telangana',
    rating: 5,
    title: 'Easy return, no arguments',
    text: 'The first pearl I received was slightly off round. I raised a return and the replacement shipped the next day with no arguments. That is what earned my trust.',
    date: '2 July 2026',
    verified: true,
    productSlug: 'natural-pearl-moti',
    avatar: { from: '#a8a0bd', to: '#722ee0' },
  },
  {
    id: 'r-08',
    name: 'Karthik Menon',
    location: 'Chennai, Tamil Nadu',
    rating: 4,
    title: 'Great crystals for the office',
    text: 'Ordered the amethyst cluster and black tourmaline for my workspace. Both are raw, natural and much larger than I expected for the price.',
    date: '25 June 2026',
    verified: true,
    productSlug: 'amethyst-cluster',
    avatar: { from: '#8e52d8', to: '#333a4d' },
  },
];

export function getReviewsForProduct(slug: string): Review[] {
  return reviews.filter((review) => review.productSlug === slug);
}

export const faqs: FaqItem[] = [
  {
    question: 'Are your gemstones certified?',
    answer:
      'Yes. Every gemstone above one carat ships with a certificate from an independent laboratory such as IGI, GRS or GIA. The certificate number is printed on a tamper proof seal and can be verified directly on the laboratory website. Rudraksha beads come with an X ray report confirming the natural mukhi count.',
  },
  {
    question: 'How do I know which gemstone is right for me?',
    answer:
      'Use the Lucky Gemstone Finder on the home page for an instant suggestion based on your birth details, or browse Shop by Rashi to see the traditional stone for your moon sign. For a considered recommendation our in house astrologers offer a free fifteen minute consultation before you buy, since the right stone depends on your full chart and not the moon sign alone.',
  },
  {
    question: 'Are the products natural?',
    answer:
      'All gemstones are natural and mined, never synthetic or lab grown. Where a stone has undergone standard industry treatment such as heating, this is disclosed on the product page and on the certificate. Rudraksha beads are sourced directly from growers in Nepal and Java.',
  },
  {
    question: 'How long does delivery take?',
    answer:
      'Metro cities receive orders in two to four working days and the rest of India in four to seven. Made to order jewellery takes ten to fourteen days as each piece is crafted around your chosen stone. Every order ships insured with a tracking link sent by SMS and email.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept UPI, credit and debit cards, net banking from all major Indian banks, and popular wallets. All payments are processed through Razorpay. Cash on delivery is available on orders below fifteen thousand rupees.',
  },
  {
    question: 'Are Razorpay payments secure?',
    answer:
      'Yes. Razorpay is a PCI DSS Level 1 certified payment gateway, the highest level of certification in the industry. Card details are entered on Razorpay servers and never touch ours, and every payment is verified with a server side signature check before an order is confirmed.',
  },
  {
    question: 'Can I return a product?',
    answer:
      'Yes. You have seven days from delivery to return any unworn product in its original packaging with the certificate intact. Refunds reach the original payment method within five to seven working days. Made to order and custom sized jewellery cannot be returned unless it arrives damaged.',
  },
];
