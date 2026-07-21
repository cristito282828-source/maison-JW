import { Suspense } from 'react';
import { getProducts } from 'lib/woocommerce';
import { ProductGridSkeleton } from '@/components/ui/skeleton';
import { WooNavbar } from '@/components/layout/navbar/woo-navbar';
import FooterCustom from '@/components/custom/FooterCustom';
import { formatPrice } from '@/lib/utils';

export const metadata = {
  title: 'Tienda',
}

// Revalidar cada 60 segundos para mantener productos actualizados
export const revalidate = 60;

async function AllProductsGrid({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { q: searchValue } = searchParams as { [key: string]: string };

  const products = await getProducts({ query: searchValue });

  return products.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
      {products.map((product: any) => (
        <a
          key={product.id}
          href={`/product/${product.slug}`}
          className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
            {product.image?.sourceUrl ? (
              <img
                src={product.image.sourceUrl}
                alt={product.name || 'Producto'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Sin imagen
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-moderat text-sm font-medium text-gray-900 mb-1 group-hover:text-green-700 transition-colors">
              {product.name}
            </h3>
            {product.price && (
              <p className="text-sm font-semibold text-gray-900">
                {formatPrice(product.price)}
              </p>
            )}
          </div>
        </a>
      ))}
    </div>
  ) : (
    <div className="text-center py-8 col-span-full">
      <p className="text-lg text-gray-900 mb-2">
        No se encontraron productos para <span className="font-bold">&quot;{searchValue}&quot;</span>.
      </p>
      <p className="text-sm text-gray-600">
        Intenta buscar con otras palabras o navega por nuestras categorías.
      </p>
    </div>
  );
}

export default async function AllProductsPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = (await props.searchParams) || {};
  return (
    <>
      <WooNavbar />
      <main className="min-h-screen bg-gray-50 pt-24">
        <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="font-belleza text-3xl font-light tracking-wide mb-8 text-gray-900">Todos los productos</h1>
          <Suspense fallback={<ProductGridSkeleton count={12} />}>
            <AllProductsGrid searchParams={searchParams} />
          </Suspense>
        </div>
      </main>
      <FooterCustom />
    </>
  );
}