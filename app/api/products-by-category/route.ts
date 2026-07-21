import { NextResponse } from 'next/server';
import { woocommerceFetch } from '@/lib/woocommerce';
import { getProductsByCategoryQuery } from '@/lib/woocommerce/queries/product';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');

    if (!category) {
      return NextResponse.json({ products: [] }, { status: 400 });
    }

    const res = await woocommerceFetch<any>({
      query: getProductsByCategoryQuery,
      variables: { category }
    });

    const products = res.body.data.products?.nodes || [];
    const adaptedProducts = products.map((product: any) => ({
      id: product.id,
      name: product.name || 'Sin nombre',
      slug: product.slug,
      price: product.price || 'Precio no disponible',
      category: category,
      categorySlug: category,
      imageSrc: product.image?.sourceUrl || product.image?.url || '/placeholder.png',
      description: product.description || ''
    }));

    return NextResponse.json({ products: adaptedProducts });
  } catch (error) {
    console.error('Error fetching category products:', error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
