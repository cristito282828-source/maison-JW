'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProductVariations } from './ProductVariations';
import { Minus, Plus, Truck, RefreshCcw, Shield, Package } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { formatPrice } from '@/lib/utils';
import type { WooProductAttribute, WooProductVariation } from '@/lib/woocommerce/types';

type ProductAttribute = WooProductAttribute;

type ProductVariation = WooProductVariation & {
  databaseId?: number;
  attributes: {
    nodes: WooProductAttribute[];
  };
};

interface WooProduct {
  id: string;
  databaseId?: number;
  name: string;
  slug: string;
  __typename?: string;
  price?: string;
  regularPrice?: string;
  salePrice?: string;
  stockStatus?: string;
  shortDescription?: string;
  description?: string;
  attributes?: {
    nodes: ProductAttribute[];
  };
  image?: {
    sourceUrl?: string;
    url?: string;
  };
  variations?: {
    nodes: ProductVariation[];
  };
}

interface ProductDescriptionWooProps {
  product: WooProduct;
}

interface AccordionItemProps {
  title: string;
  icon: React.ReactNode;
  content: string | React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

function AccordionItem({ title, icon, content, isOpen, onClick }: AccordionItemProps) {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-4 text-left transition-colors hover:text-[#101828] group"
      >
        <div className="flex items-center gap-3">
          <div className="text-gray-500 group-hover:text-[#101828] transition-colors">
            {icon}
          </div>
          <span className="font-moderat text-sm uppercase tracking-wider font-medium text-gray-900 group-hover:text-[#101828] transition-colors">
            {title}
          </span>
        </div>
        <span className={`text-gray-400 text-2xl font-light transition-all duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
          +
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="text-gray-600 leading-relaxed text-sm animate-fadeIn">
          {typeof content === 'string' ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            content
          )}
        </div>
      </div>
    </div>
  );
}

export function ProductDescriptionWoo({ product }: ProductDescriptionWooProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Determinar si es un producto variable
  const isVariable = product.__typename === 'VariableProduct';
  const variations = isVariable ? product.variations?.nodes || [] : [];

  // Obtener precio y stock actual (formateado para remover HTML)
  const currentPrice = formatPrice(selectedVariation?.price || product.price);
  const currentStockStatus = selectedVariation?.stockStatus || product.stockStatus;
  const stockQuantity = selectedVariation?.stockQuantity;

  // Calcular cantidad máxima disponible
  const MAX_QUANTITY = stockQuantity && stockQuantity > 0 ? stockQuantity : 99;

  const handleAccordionClick = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const handleVariationChange = (variation: ProductVariation | null, selectedValues?: Record<string, string>) => {
    setSelectedVariation(variation);
    if (selectedValues) {
      setSelectedAttributes(selectedValues);
    }
    setQuantity(1);
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= MAX_QUANTITY) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (isVariable && !selectedVariation) {
      alert('Por favor selecciona una variación');
      return;
    }

    const productId = selectedVariation?.databaseId || product.databaseId || product.id;

    // Preparar datos del producto para evitar fetching innecesario
    const priceStr = selectedVariation?.price || product.price;
    const regularPriceStr = selectedVariation?.regularPrice || product.regularPrice;

    const productData: any = {
      title: product.name,
      handle: product.slug,
      priceRange: {
        minVariantPrice: { amount: priceStr || '0', currencyCode: 'COP' },
        maxVariantPrice: { amount: priceStr || '0', currencyCode: 'COP' }
      },
      featuredImage: product.image ? {
        url: product.image.sourceUrl,
        altText: (product.image as any).altText || product.name,
        width: 0,
        height: 0
      } : undefined
    };

    // Datos de variación para el carrito
    // Extraer el tamaño seleccionado de selectedAttributes (que tiene el valor real)
    const selectedSize = selectedVariation?.attributes?.nodes?.find(a => a.name === 'pa_tamano')?.value;
    // Si no tiene value en atributos, buscar en selectedAttributes
    const sizeFromSelection = selectedAttributes?.['pa_tamano'] || selectedSize;

    const variationData: any = selectedVariation ? {
      id: selectedVariation.databaseId || selectedVariation.id,
      name: selectedVariation.name,
      price: priceStr,
      regularPrice: regularPriceStr,
      image: selectedVariation.image?.sourceUrl,
      imageAlt: selectedVariation.image?.altText || product.name,
      size: sizeFromSelection || null
    } : null;

    try {
      setIsAdding(true);
      const success = await addToCart(String(productId), quantity, productData, variationData);

      if (success) {
        // El carrito se abrirá automáticamente
        console.log('Producto agregado al carrito');
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      alert('Error al agregar al carrito. Por favor intenta de nuevo.');
    } finally {
      setIsAdding(false);
    }
  };

  // Envío gratis - leer desde el AnnouncementBar
  const freeShippingThreshold = 80000; // $80.000 COP

  return (
    <div className="space-y-6">
      {/* Título y Precio */}
      <div>
        <h1 className="font-belleza text-2xl lg:text-3xl font-light tracking-wide text-gray-900 mb-4">
          {product.name}
        </h1>

        <div className="flex items-baseline gap-3 mb-4">
          <p className="font-moderat text-2xl lg:text-3xl font-semibold text-gray-900">
            {currentPrice}
          </p>
          {product.salePrice && product.regularPrice && product.regularPrice !== product.salePrice && (
            <p className="text-sm text-gray-500 line-through">
              {formatPrice(product.regularPrice)}
            </p>
          )}
        </div>

        {/* Descripción corta */}
        {product.shortDescription && (
          <div
            className="text-gray-600 text-sm leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: product.shortDescription }}
          />
        )}

        {/* Stock Status */}
        <div className="flex items-center gap-2">
          {currentStockStatus === 'IN_STOCK' ? (
            <span className="inline-flex items-center gap-1 text-sm text-[#101828]">
              <span className="w-2 h-2 rounded-full bg-[#101828]"></span>
              En stock
              {stockQuantity && stockQuantity > 0 && stockQuantity <= 10 && (
                <span className="text-xs text-gray-500">
                  (¡Solo {stockQuantity} disponibles!)
                </span>
              )}
            </span>
          ) : currentStockStatus === 'OUT_OF_STOCK' ? (
            <span className="inline-flex items-center gap-1 text-sm text-red-600">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              Agotado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-sm text-yellow-600">
              <span className="w-2 h-2 rounded-full bg-yellow-600"></span>
              Bajo pedido
            </span>
          )}
        </div>
      </div>

      {/* Variaciones para productos variables */}
      {isVariable && variations.length > 0 && (
        <div className="py-4">
          <ProductVariations
            variations={variations}
            attributes={product.attributes?.nodes}
            defaultPrice={formatPrice(product.price)}
            onVariationChange={handleVariationChange}
          />
        </div>
      )}

      {/* Selector de cantidad */}
      <div className="flex items-center gap-4 py-2">
        <span className="text-sm font-medium text-gray-700">Cantidad:</span>
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            min="1"
            max={MAX_QUANTITY}
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val >= 1 && val <= MAX_QUANTITY) {
                setQuantity(val);
              }
            }}
            className="w-16 text-center border-0 focus:ring-0 text-sm"
          />
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= MAX_QUANTITY}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Atributos del producto */}
      {product.attributes && product.attributes.nodes.length > 0 && !isVariable && (
        <div className="py-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Especificaciones</h3>
          <div className="space-y-2">
            {product.attributes.nodes.map((attr, index) => (
              <div key={index} className="flex items-start justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">{attr.name}:</span>
                <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">
                  {attr.value || (attr.options?.join(', '))}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Atributos de variación seleccionada */}
      {selectedVariation && selectedVariation.attributes && selectedVariation.attributes.nodes.length > 0 && (
        <div className="py-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Especificaciones</h3>
          <div className="space-y-2">
            {selectedVariation.attributes.nodes.map((attr, index) => (
              <div key={index} className="flex items-start justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">{attr.name}:</span>
                <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">
                  {attr.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Acordeón de información */}
      <div className="space-y-1">
        {/* Descripción */}
        <AccordionItem
          title="Descripción"
          icon={<Shield className="h-5 w-5" />}
          isOpen={openAccordion === 0}
          onClick={() => handleAccordionClick(0)}
          content={
            product.description ? (
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            ) : (
              <p className="text-gray-500">Descripción no disponible</p>
            )
          }
        />

        {/* Envío y Entrega */}
        <AccordionItem
          title="Envío y Entrega"
          icon={<Truck className="h-5 w-5" />}
          isOpen={openAccordion === 1}
          onClick={() => handleAccordionClick(1)}
          content={
            <ul className="space-y-2">
              <li>• Envío gratis en compras superiores a ${freeShippingThreshold.toLocaleString('es-CO')} COP</li>
              <li>• Entrega en 3-5 días hábiles en ciudades principales</li>
              <li>• Entrega en 5-7 días hábiles en el resto del país</li>
              <li>• Seguimiento en tiempo real de tu pedido</li>
              <li>• Recibe directamente en tu domicilio</li>
            </ul>
          }
        />

        {/* Devoluciones */}
        <AccordionItem
          title="Devoluciones y Cambios"
          icon={<RefreshCcw className="h-5 w-5" />}
          isOpen={openAccordion === 2}
          onClick={() => handleAccordionClick(2)}
          content={
            <ul className="space-y-2">
              <li>• 30 días para devoluciones y cambios</li>
              <li>• Producto debe estar sin usar con etiquetas originales</li>
              <li>• Proceso de devolución gratuito</li>
              <li>• Reembolso en 5-10 días hábiles</li>
              <li>• Contáctanos para iniciar una devolución</li>
            </ul>
          }
        />

        {/* Información adicional (si hay variación seleccionada) */}
        {selectedVariation && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Variación seleccionada:</p>
            <p className="text-sm font-medium text-gray-900">{selectedVariation.name}</p>
          </div>
        )}
      </div>

      {/* Botón de compra */}
      <div className="sticky bottom-0 bg-white py-4 border-t border-gray-200">
        <button
          onClick={handleAddToCart}
          disabled={currentStockStatus === 'OUT_OF_STOCK' || isAdding}
          className={`w-full py-4 px-8 rounded-lg font-moderat text-lg tracking-wide uppercase transition-all duration-300 border-2 ${
            currentStockStatus === 'OUT_OF_STOCK' || isAdding
              ? 'bg-gray-400 text-gray-200 border-gray-400 cursor-not-allowed'
              : 'bg-[#101828] text-white border-[#101828] hover:bg-white hover:text-[#101828] shadow-md hover:shadow-xl'
          }`}
        >
          {isAdding ? 'Agregando...' : currentStockStatus === 'OUT_OF_STOCK' ? 'Agotado' : 'Agregar al Carrito'}
        </button>

        <div className="mt-4 text-center">
          <Link
            href="/search"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Continuar comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
