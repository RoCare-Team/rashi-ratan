import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetail from '@/components/ProductDetail';
import ProductGrid from '@/components/ProductGrid';
import SectionHeading from '@/components/SectionHeading';
import { getAllProducts, getProductBySlug, getRelatedProducts } from '@/data/products';
import { getReviewsForProduct } from '@/data/reviews';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-render every product page from the hardcoded catalogue. */
export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: 'Product not found' };

  return {
    title: `${product.name}${product.hindiName ? ` (${product.hindiName})` : ''}`,
    description: product.shortDescription,
    openGraph: { title: product.name, description: product.shortDescription },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 4);
  const reviews = getReviewsForProduct(product.slug);

  return (
    <>
      <ProductDetail product={product} reviews={reviews} />

      {related.length > 0 && (
        <section className="border-t border-sand-200 bg-white/60 py-16 md:py-20">
          <div className="container-x">
            <SectionHeading
              align="left"
              eyebrow="You may also like"
              title="Pairs well with"
              accent={product.hindiName ?? product.name}
              link={{ href: `/shop?category=${product.category}`, label: 'View category' }}
            />
            <ProductGrid products={related} columns={4} />
          </div>
        </section>
      )}
    </>
  );
}
