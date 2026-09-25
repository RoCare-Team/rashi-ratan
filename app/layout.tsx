import type { Metadata, Viewport } from 'next';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import Toaster from '@/components/Toaster';
import AstroChat from '@/components/AstroChat';

export const metadata: Metadata = {
  title: {
    default: 'Rashi Ratan — Certified Gemstones, Rudraksha & Spiritual Products',
    template: '%s · Rashi Ratan',
  },
  description:
    'Shop certified natural gemstones, rashi ratna, navratna, rudraksha, crystals and yantras. Lab tested, energised and shipped insured across India with free expert astrology guidance.',
  keywords: [
    'rashi ratna',
    'gemstones',
    'blue sapphire',
    'yellow sapphire',
    'rudraksha',
    'navratna',
    'yantra',
    'crystals',
    'astrology',
  ],
  openGraph: {
    title: 'Rashi Ratan — Certified Gemstones & Spiritual Products',
    description:
      'Authentic gemstones and spiritual products crafted to bring positivity, prosperity, confidence and balance into your life.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#250a4f',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StoreProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
          <AstroChat />
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
