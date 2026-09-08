import type { Category } from '@/lib/types';
import { products } from './products';

/** Storefront categories. Product counts are derived from /data/products.ts. */
export const categories: Category[] = [
  {
    slug: 'rashi-ratna',
    name: 'Rashi Ratna',
    tagline: 'Your birth chart gemstone',
    description: 'Certified planetary gemstones matched to your moon sign and ruling planet.',
    art: { cut: 'oval', light: '#8ab6ff', base: '#2b5fd9', deep: '#122a73' },
    accent: '#2b5fd9',
  },
  {
    slug: 'navratna',
    name: 'Navratna',
    tagline: 'All nine gems, one piece',
    description: 'The complete nine gem combination set in the prescribed Vedic order.',
    art: { cut: 'round', light: '#ffe6a8', base: '#c98f2c', deep: '#5f3d06' },
    accent: '#c98f2c',
  },
  {
    slug: 'precious-gemstones',
    name: 'Precious Gemstones',
    tagline: 'Rare and lab certified',
    description: 'Sapphire, emerald, ruby, topaz and opal, hand selected for colour and clarity.',
    art: { cut: 'emerald', light: '#8ff0c4', base: '#12a26b', deep: '#05512f' },
    accent: '#12a26b',
  },
  {
    slug: 'rudraksha',
    name: 'Rudraksha',
    tagline: 'Nepali and Java origin',
    description: 'X ray tested beads from one mukhi to malas, sourced directly from growers.',
    art: { cut: 'bead', light: '#c99a6a', base: '#8a5a2b', deep: '#3e2410' },
    accent: '#8a5a2b',
  },
  {
    slug: 'crystals',
    name: 'Crystals',
    tagline: 'Healing and home energy',
    description: 'Raw clusters, polished points and bracelets for clarity, calm and protection.',
    art: { cut: 'raw', light: '#dcbcff', base: '#8e52d8', deep: '#3f1a71' },
    accent: '#8e52d8',
  },
  {
    slug: 'yantras',
    name: 'Yantras',
    tagline: 'Energised sacred geometry',
    description: 'Pure copper yantras energised with Vedic mantras before dispatch.',
    art: { cut: 'plate', light: '#ffd9a0', base: '#c0762e', deep: '#5f3208' },
    accent: '#c0762e',
  },
  {
    slug: 'gemstone-jewelry',
    name: 'Gemstone Jewelry',
    tagline: 'Ready to wear remedies',
    description: 'Rings, pendants and bracelets crafted in 925 silver around certified stones.',
    art: { cut: 'pear', light: '#ffb0c8', base: '#d9457f', deep: '#6d1440' },
    accent: '#d9457f',
  },
  {
    slug: 'spiritual-products',
    name: 'Spiritual Products',
    tagline: 'For your daily practice',
    description: 'Parad, sphatik malas and pure copper puja essentials for the home altar.',
    art: { cut: 'round', light: '#eef2f7', base: '#a9b4c4', deep: '#4d5666' },
    accent: '#7c6ad0',
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getCategoryCount(slug: string): number {
  return products.filter((product) => product.category === slug).length;
}

/** Categories with their live product counts, ready for the home page grid. */
export function getCategoriesWithCounts(): Array<Category & { count: number }> {
  return categories.map((category) => ({ ...category, count: getCategoryCount(category.slug) }));
}
