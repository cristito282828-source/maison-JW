import Image from 'next/image';
import Link from 'next/link';
import { WooNavbar } from '@/components/layout/navbar/woo-navbar';
import FooterCustom from '@/components/custom/FooterCustom';
import VideoSlider from '@/components/custom/VideoSlider';
import FeaturedProducts from '@/components/custom/FeaturedProducts';
import SplashScreen from '@/components/custom/SplashScreen';
import HeaderBanner from '@/components/custom/HeaderBanner';
import { getProducts, getCollections } from '@/lib/woocommerce';

/**
 * Fuentes de tráfico de redes sociales que disparan el splash.
 * El link `maison.com.co?utm_source=ig` (Instagram) llega a esta vista.
 */
const SOCIAL_UTM_SOURCES = new Set([
  'ig',
  'instagram',
  'tiktok',
  'facebook',
  'fb',
  'x',
  'twitter',
  'threads',
  'youtube',
  'yt',
  'pinterest',
  'pin',
]);

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

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Detectar si el tráfico viene de redes sociales (utm_source).
  // Si sí → splash screen de marca antes del sitio principal.
  const params = await searchParams;
  const utmSource = typeof params.utm_source === 'string' ? params.utm_source.toLowerCase() : '';
  if (utmSource && SOCIAL_UTM_SOURCES.has(utmSource)) {
    return <SplashScreen />;
  }

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

  // Traer categorías para mostrar en el pill row del FeaturedProducts
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
      <main id="main-content" className="min-h-screen bg-transparent">

        {/* ============ VIDEO SLIDER — primer componente, full-width pegado al navbar ============ */}
        <VideoSlider
          videos={[
            { src: '/videos/video-1.mp4' },
            { src: '/videos/video-2.mp4' },
          ]}
        />

        {/* ============ HERO — split 50/50 (server component) ============ */}
        <div className="pt-[112px]">
        {heroProduct && (
          <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
            <div className="relative aspect-[4/5] lg:aspect-auto lg:min-h-[80vh] bg-transparent">
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
        </div>

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