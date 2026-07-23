import { Suspense, cache } from 'react';
import { WooNavbarClient } from './woo-navbar-client';

/**
 * NAVBAR COMPLETO - WooCommerce
 * Server component que carga datos y pasa al client component.
 *
 * Estructura: top utility bar (oculta en scroll) + main nav (sticky transparente
 * → sólido en scroll). Ver WooNavbarClient para detalles.
 */

// Usar cache para evitar múltiples llamadas a getCollections
const getCategories = cache(async () => {
  try {
    const { getCollections } = await import('@/lib/woocommerce');
    const collections = await getCollections();

    return (collections || [])
      .filter((collection: any) =>
        collection.handle &&
        collection.handle !== 'undefined' &&
        collection.handle !== '' &&
        collection.slug !== 'undefined'
      )
      .map((collection: any) => ({
        title: collection.name || collection.title,
        path: `/search/${collection.slug || collection.handle}`,
      }));
  } catch (error) {
    console.error('Error loading categories:', error);
    return [];
  }
});

export async function WooNavbar() {
  const categories = await getCategories();

  return (
    <Suspense fallback={<WooNavbarClient categories={[]} />}>
      <WooNavbarClient categories={categories} />
    </Suspense>
  );
}