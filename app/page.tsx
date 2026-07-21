import Image from 'next/image';
import Link from 'next/link';
import { WooNavbar } from '@/components/layout/navbar/woo-navbar';
import FooterCustom from '@/components/custom/FooterCustom';
import FeaturedProducts from '@/components/custom/FeaturedProducts';
import { getProducts, getCollections } from '@/lib/woocommerce';

// Helper: limpia el HTML que WooCommerce devuelve en price/regularPrice
function cleanHtmlPrice(raw: string | null | undefined): string {
  if (!raw) return '';
  return raw
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .trim();
}

export const revalidate = 300; // 5 minutos

export default async function HomePage() {
  // Traer productos destacados desde WooCommerce
  let featured: {
    id: string;
    name: string;
    slug: string;
    price: string;
    category: string;
    categorySlug: string;
    imageSrc: string;
    description: string;
  }[] = [];

  try {
    const products = await getProducts({});
    featured = products.map((p: any) => ({
      id: p.id,
      name: p.title || p.name,
      slug: p.handle || p.slug,
      price: cleanHtmlPrice(p.priceRange?.minVariantPrice?.amount ?? p.price) || 'Consultar precio',
      category: p.collections?.[0]?.title || p.productType || 'General',
      categorySlug: p.collections?.[0]?.handle || '',
      imageSrc: p.featuredImage?.url || p.images?.[0]?.url || '',
      description: p.description || '',
    }));
  } catch (err) {
    console.error('Error fetching featured products for home:', err);
  }

  // Traer categorías para mostrar en FeaturedProducts (pill row) + sección Colecciones
  let featuredCategories: { name: string; slug: string }[] = [];
  try {
    const collections = await getCollections();
    featuredCategories = collections
      .filter((c: any) => c.handle && c.handle !== 'uncategorized' && c.handle !== 'all')
      .slice(0, 6)
      .map((c: any) => ({
        name: c.title || c.name || c.handle,
        slug: c.handle,
      }));
  } catch (err) {
    console.error('Error fetching collections for home:', err);
  }

  const heroProduct = featured[0];

  return (
    <>
      <WooNavbar />
      <main id="main-content" className="min-h-screen bg-[var(--paper)] pt-24">

        {/* ============ HERO — split 50/50 (server component) ============ */}
        {heroProduct && (
          <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
            <div className="relative aspect-[4/5] lg:aspect-auto lg:min-h-[80vh] bg-[var(--gray-50)]">
              {heroProduct.imageSrc && (
                <Image
                  src={heroProduct.imageSrc}
                  alt={heroProduct.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 50vw"
                />
              )}
            </div>
            <div className="flex flex-col justify-center px-8 lg:px-16 py-16">
              <p className="font-moderat text-xs tracking-[0.25em] uppercase text-[var(--gray-600)] mb-6">
                Nueva colección
              </p>
              <h1 className="font-belleza text-5xl md:text-7xl font-light tracking-wide text-[var(--ink)] mb-8">
                Maison
              </h1>
              <p className="font-moderat text-base leading-relaxed text-[var(--gray-600)] max-w-md mb-10">
                Joyería fina hecha en Colombia. Piezas atemporales en oro y plata, diseñadas para durar.
              </p>
              <Link
                href="/search"
                className="group inline-flex items-center gap-3 self-start font-moderat text-sm tracking-[0.2em] uppercase text-[var(--ink)] border-b border-[var(--ink)] pb-2 hover:text-[var(--gold)] hover:border-[var(--gold)] transition-colors duration-300"
              >
                Ver colección
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </section>
        )}

        {/* ============ COLECCIONES — grid 2/3 col ============ */}
        {featuredCategories.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center mb-10 lg:mb-14">
              <p className="font-moderat text-xs tracking-[0.25em] uppercase text-[var(--gray-600)] mb-3">
                Maison
              </p>
              <h2 className="font-belleza text-3xl md:text-4xl text-[var(--ink)] font-light tracking-wide">
                Colecciones
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {featuredCategories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/search/${c.slug}`}
                  className="group border border-[var(--gray-200)] bg-white p-10 md:p-12 text-center transition-colors duration-300 hover:border-[var(--gold)]"
                >
                  <span className="font-moderat text-sm tracking-[0.2em] uppercase text-[var(--ink)] group-hover:text-[var(--gold)] transition-colors duration-300">
                    {c.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ============ FEATURED PRODUCTS — "Selección" ============ */}
        {featured.length > 0 && (
          <FeaturedProducts
            products={featured}
            categories={featuredCategories}
            title="Selección"
          />
        )}
      </main>
      <FooterCustom />
    </>
  );
}