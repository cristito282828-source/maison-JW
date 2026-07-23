'use client';

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface FeaturedProduct {
  id: string;
  name: string;
  slug: string;
  price: string;
  category: string;
  categorySlug: string;
  imageSrc: string;
  description: string;
}

interface FeaturedCategory {
  name: string;
  slug: string;
}

interface FeaturedProductsProps {
  products: FeaturedProduct[];
  categories?: FeaturedCategory[];
  title?: string;
}

export default function FeaturedProducts({ products, categories = [], title = "Selección" }: FeaturedProductsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [displayProducts, setDisplayProducts] = useState<FeaturedProduct[]>(products);
  const [loadingCategory, setLoadingCategory] = useState(false);

  const fetchCategoryProducts = async (categorySlug: string) => {
    setLoadingCategory(true);
    try {
      const res = await fetch(`/api/products-by-category?category=${encodeURIComponent(categorySlug)}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch products for category ${categorySlug}`);
      }
      const data = await res.json();
      const items: FeaturedProduct[] = data.products || [];
      setDisplayProducts(items);
      setActiveIndex(0);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = 0;
      }
    } catch (error) {
      console.error('Error loading category products:', error);
      setDisplayProducts([]);
    } finally {
      setLoadingCategory(false);
    }
  };

  useEffect(() => {
    setDisplayProducts(products);
    setSelectedCategory(null);
    setActiveIndex(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [products]);

  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryProducts(selectedCategory);
    }
  }, [selectedCategory]);

  const filteredProducts = displayProducts;

  // Calcular cuántas cards se ven a la vez según el viewport
  const getVisibleCards = () => {
    if (typeof window === 'undefined') return 4;
    const width = window.innerWidth;
    if (width < 640) return 1;
    if (width < 1024) return 2;
    if (width < 1280) return 3;
    return 4;
  };

  useEffect(() => {
    const updateVisibleCards = () => {
      setVisibleCards(getVisibleCards());
    };

    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  // Detectar posición del scroll
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const cards = Array.from(container.children) as HTMLElement[];

    if (cards.length === 0) return;

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(cardCenter - containerCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    const normalizedIndex = closestIndex % filteredProducts.length;
    setActiveIndex(normalizedIndex);

    if (closestIndex >= filteredProducts.length && !container.dataset.isLooping) {
      container.dataset.isLooping = 'true';
      setTimeout(() => {
        const targetCard = cards[normalizedIndex];
        if (targetCard) {
          const scrollAmount = targetCard.getBoundingClientRect().left - containerRect.left + container.scrollLeft;
          container.style.scrollBehavior = 'auto';
          container.scrollLeft = scrollAmount;
          container.style.scrollBehavior = 'smooth';
        }
        delete container.dataset.isLooping;
      }, 100);
    }
  }, [filteredProducts.length]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Navegar a un producto específico
  const scrollToCard = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cards = Array.from(container.children) as HTMLElement[];

    if (cards[index]) {
      const card = cards[index];
      const containerRect = container.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();

      const scrollAmount = cardRect.left - containerRect.left + container.scrollLeft;

      container.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    setActiveIndex(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [selectedCategory]);

  // Calcular páginas
  const totalPages = Math.ceil(filteredProducts.length / visibleCards);
  const activePage = Math.floor(activeIndex / visibleCards);

  // Navegar a una página específica
  const scrollToPage = (pageIndex: number) => {
    const cardIndex = pageIndex * visibleCards;
    scrollToCard(Math.min(cardIndex, filteredProducts.length - 1));
  };

  // Navegación infinita
  const scrollPrev = () => {
    let newIndex = activeIndex - 1;
    if (newIndex < 0) {
      newIndex = filteredProducts.length - 1;
    }
    scrollToCard(newIndex);
  };

  const scrollNext = () => {
    let newIndex = activeIndex + 1;
    if (newIndex >= filteredProducts.length) {
      newIndex = 0;
    }
    scrollToCard(newIndex);
  };

  return (
    <section className="bg-transparent py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header: H2 Belleza + eyebrow */}
        <div className="text-center mb-10 lg:mb-14">
          <p className="font-moderat text-xs tracking-[0.25em] uppercase text-[var(--gray-600)] mb-3">
            Maison
          </p>
          <h2 className="font-belleza text-3xl md:text-4xl text-[var(--ink)] font-light tracking-wide">
            {title}
          </h2>
        </div>

        {/* Pill row de categorías (reemplaza el panel lateral cyan/red) */}
        {categories.length > 0 && (
          <div className="flex gap-6 overflow-x-auto hide-scrollbar justify-start md:justify-center mb-10 lg:mb-12">
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className={`font-moderat text-xs tracking-[0.2em] uppercase whitespace-nowrap pb-1 border-b transition-colors ${
                selectedCategory === null
                  ? 'text-[var(--ink)] border-[var(--gold)]'
                  : 'text-[var(--gray-600)] border-transparent hover:text-[var(--ink)]'
              }`}
            >
              Todas
            </button>
            {categories.slice(0, 6).map((cat) => {
              const isActive = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`font-moderat text-xs tracking-[0.2em] uppercase whitespace-nowrap pb-1 border-b transition-colors ${
                    isActive
                      ? 'text-[var(--ink)] border-[var(--gold)]'
                      : 'text-[var(--gray-600)] border-transparent hover:text-[var(--ink)]'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Slider */}
        {(!products || products.length === 0) ? (
          <div className="flex items-center justify-center min-h-[420px] bg-white border border-[var(--gray-200)] rounded-sm p-8 text-center">
            <div>
              <p className="text-[var(--ink)] text-lg font-medium mb-2">
                No hay productos destacados.
              </p>
              <p className="text-[var(--gray-600)] text-sm">
                Explorá todas nuestras colecciones desde el catálogo.
              </p>
            </div>
          </div>
        ) : (selectedCategory && !loadingCategory && filteredProducts.length === 0) ? (
          <div className="flex items-center justify-center min-h-[420px] bg-white border border-[var(--gray-200)] rounded-sm p-8 text-center">
            <div>
              <p className="text-[var(--ink)] text-lg font-medium mb-2">
                No hay productos para esta colección.
              </p>
              <p className="text-[var(--gray-600)] text-sm">
                Probá con otra colección.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="relative flex items-center">
              <button
                onClick={scrollPrev}
                className="hidden sm:flex shrink-0 w-11 h-11 items-center justify-center bg-transparent border border-[var(--gray-200)] text-[var(--ink)] transition-colors duration-300 hover:border-[var(--gold)] hover:text-[var(--gold)] mr-3 z-10"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div
                ref={scrollContainerRef}
                className="scroll-container flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory hide-scrollbar flex-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {[...filteredProducts, ...filteredProducts].map((product, index) => (
                  <div
                    key={`${product.slug}-${index}`}
                    className="snap-start shrink-0 w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] xl:w-[calc(25%-12px)]"
                  >
                    <a
                      href={`/product/${product.slug}`}
                      className="product-card group block"
                    >
                      <div className="relative aspect-[4/5] w-full overflow-hidden bg-white">
                        <Image
                          src={product.imageSrc}
                          alt={`${product.name} - ${product.category}`}
                          fill
                          className="object-cover image-hover-zoom"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      </div>
                      <div className="mt-4">
                        <h3 className="font-moderat text-sm text-[var(--ink)] text-center">
                          {product.name}
                        </h3>
                        <p className="font-moderat text-sm text-[var(--gray-600)] mt-1 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </a>
                  </div>
                ))}
              </div>

              <button
                onClick={scrollNext}
                className="hidden sm:flex shrink-0 w-11 h-11 items-center justify-center bg-transparent border border-[var(--gray-200)] text-[var(--ink)] transition-colors duration-300 hover:border-[var(--gold)] hover:text-[var(--gold)] ml-3 z-10"
                aria-label="Siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Pagination dots */}
            <div className="flex justify-center items-center gap-1 mt-8">
              {Array.from({ length: totalPages }).map((_, pageIndex) => {
                const isActive = activePage === pageIndex;
                return (
                  <button
                    key={pageIndex}
                    onClick={() => scrollToPage(pageIndex)}
                    className="flex items-center justify-center p-0 border-none bg-transparent cursor-pointer"
                    aria-label={`Ir a página ${pageIndex + 1}`}
                  >
                    <div
                      className={`h-0.5 transition-all duration-300 ${
                        isActive ? 'w-8 bg-[var(--ink)]' : 'w-4 bg-[var(--gray-400)]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Mobile swipe hint */}
            <div className="block sm:hidden text-center mt-4 text-[var(--gray-600)] text-xs animate-pulse">
              ← Desliza para ver más →
            </div>
          </div>
        )}

        {/* Fallback link si no hay categorías */}
        {categories.length === 0 && (
          <div className="text-center mt-10">
            <Link
              href="/tienda/categoria"
              className="inline-flex items-center font-moderat text-[var(--ink)] text-sm tracking-[0.2em] uppercase border-b border-[var(--ink)] pb-1 hover:text-[var(--gold)] hover:border-[var(--gold)] transition-colors"
            >
              Ver todas las colecciones
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .hide-scrollbar {
          -webkit-overflow-scrolling: touch;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .scroll-container {
            scroll-behavior: auto !important;
          }

          * {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
          }
        }

        @media (max-width: 640px) {
          .scroll-container {
            scroll-padding: 0;
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
    </section>
  );
}