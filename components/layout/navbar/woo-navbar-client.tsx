'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Bars3Icon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { CategoryDropdown } from './category-dropdown';
import { CartIcon } from '@/components/cart/CartIcon';

interface Category {
  title: string;
  path: string;
}

interface WooNavbarClientProps {
  categories: Category[];
}

// Mobile Menu Button
function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open mobile menu"
      className="flex h-10 w-10 items-center justify-center text-[var(--ink)] hover:text-[var(--gold)] transition-colors md:hidden"
    >
      <Bars3Icon className="h-6 w-6" />
    </button>
  );
}

// Search Component (mantengo igual)
function WooSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setResults(data.products || []);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative w-full">
        <input
          type="text"
          name="q"
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setShowResults(true);
          }}
          className="w-full bg-transparent border-b border-[var(--gray-200)] px-1 py-2 pr-10 text-sm text-[var(--ink)] placeholder:text-[var(--gray-400)] focus:border-[var(--ink)] focus:outline-none transition-colors"
        />
        <button
          type="submit"
          className="absolute right-0 top-0 mr-1 flex h-full items-center text-[var(--gray-400)] hover:text-[var(--ink)] transition-colors"
          aria-label="Buscar"
        >
          {isLoading ? (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <MagnifyingGlassIcon className="h-4 w-4" />
          )}
        </button>
      </form>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-sm shadow-lg border border-[var(--gray-200)] max-h-96 overflow-y-auto scrollbar-none z-50">
          {results.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.handle}`}
              onClick={() => {
                setShowResults(false);
                setSearchQuery('');
              }}
              className="flex items-center gap-4 p-3 hover:bg-[var(--gray-50)] transition-colors border-b border-[var(--gray-200)] last:border-b-0"
            >
              <div className="flex-shrink-0 w-14 h-14 overflow-hidden bg-[var(--gray-50)]">
                <img
                  src={product.image}
                  alt={product.altText}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--ink)] truncate">
                  {product.title}
                </p>
                <p className="text-sm text-[var(--gray-600)]">
                  {product.priceDisplay}
                </p>
              </div>
            </Link>
          ))}
          <Link
            href={`/search?q=${encodeURIComponent(searchQuery)}`}
            onClick={() => {
              setShowResults(false);
            }}
            className="block w-full text-center py-3 text-xs tracking-[0.2em] uppercase font-medium text-[var(--ink)] hover:bg-[var(--gray-50)] transition-colors border-t border-[var(--gray-200)]"
          >
            Ver todos los resultados →
          </Link>
        </div>
      )}

      {showResults && searchQuery.length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-sm shadow-lg border border-[var(--gray-200)] p-4 z-50">
          <p className="text-sm text-[var(--gray-600)] text-center">
            No se encontraron productos para "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  );
}

// Mobile Menu (drawer lateral)
function WooMobileMenu({
  isOpen,
  onClose,
  categories,
}: {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 top-0 flex h-full w-full max-w-sm flex-col bg-[var(--paper)] shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--gray-200)]">
          <Link href="/" onClick={onClose}>
            <div className="relative w-24 h-12">
              <Image
                src="/logo-maison.png"
                alt="Maison"
                width={96}
                height={48}
                className="h-full w-full object-contain invert"
                priority
              />
            </div>
          </Link>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center text-[var(--ink)]"
            aria-label="Cerrar menú"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-none px-6 py-6">
          <nav className="flex flex-col">
            <Link
              href="/"
              onClick={onClose}
              className="border-b border-[var(--gray-200)] py-4 font-moderat text-sm tracking-[0.2em] uppercase text-[var(--ink)] hover:text-[var(--gold)] transition-colors"
            >
              Inicio
            </Link>
            <Link
              href="/search"
              onClick={onClose}
              className="border-b border-[var(--gray-200)] py-4 font-moderat text-sm tracking-[0.2em] uppercase text-[var(--ink)] hover:text-[var(--gold)] transition-colors"
            >
              Catálogo
            </Link>
            {categories.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={onClose}
                className="border-b border-[var(--gray-200)] py-4 font-moderat text-sm tracking-[0.2em] uppercase text-[var(--ink)] hover:text-[var(--gold)] transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

/**
 * Estructura LV-inspired para Maison:
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ [top utility bar — fino, oculto en scroll]                     │  ← 32px, tracking ancho
 * │ Envíos insured a Colombia · Asesoría personal                  │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ [main nav — sticky transparente → sólido en scroll]            │  ← 72px desktop / 64px mobile
 * │  [☰ mobile]            [LOGO]              [search] [cart]      │
 * │                        Productos ▾  Categorías ▾                │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * Comportamiento:
 * - Top bar desaparece al hacer scroll (sticky más limpio)
 * - Main bar: fondo transparente al top, fondo blanco + hairline border al scroll
 * - Logo: invertido (oscuro) cuando fondo claro, normal cuando scrolled
 * - Menú categorías: click abre dropdown mega-menu (LV-style)
 */

export function WooNavbarClient({ categories }: WooNavbarClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled] = useState(false); // placeholder — actualmente el header siempre es transparente

  // Si querés sumar un estado sólido al scrollear, reemplazá este placeholder
  // por el useEffect comentado abajo y volvé el nav al ternario con `isScrolled`
  // + invertir el logo cuando aplique.
  //
  // useEffect(() => {
  //   const handleScroll = () => setIsScrolled(window.scrollY > 10);
  //   window.addEventListener('scroll', handleScroll, { passive: true });
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []);

  return (
    <>
      {/* ============ TOP UTILITY BAR (full transparente, se oculta al scroll) ============ */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-transparent transition-transform duration-300 ${
          isScrolled ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between font-moderat text-[10px] tracking-[0.25em] uppercase text-white">
          <span className="hidden sm:inline">Envíos insured · Toda Colombia</span>
          <span className="sm:hidden">Maison Joyería</span>
          <span className="hidden md:inline">Asesoría personal sin costo · WhatsApp</span>
          <span className="md:hidden">Colombia 🇨🇴</span>
        </div>
      </div>

      {/* ============ MAIN NAV (sticky, siempre full transparente, top-0) ============ */}
      <nav className="fixed left-0 right-0 z-40 top-0 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 relative">

            {/* Left: Mobile menu (mobile) / Categorías menu (desktop) */}
            <div className="flex items-center">
              {/* Mobile: hamburguesa */}
              <div className="md:hidden">
                <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)} />
              </div>

              {/* Desktop: Menú categorías a la izquierda */}
              <div className="hidden md:flex items-center gap-8 lg:gap-10">
                <Link
                  href="/search"
                  className="font-moderat text-xs tracking-[0.2em] uppercase text-[var(--ink)] hover:text-[var(--gold)] transition-colors duration-300"
                >
                  Catálogo
                </Link>
                <CategoryDropdown categories={categories} />
              </div>
            </div>

            {/* Logo — centrado absoluto, 2x más grande, siempre invertido (oscuro) */}
            <Link
              href="/"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              aria-label="Maison — Inicio"
            >
              <div className="relative w-64 h-20 md:w-80 md:h-24">
                <Image
                  src="/logo-maison.png"
                  alt="Maison"
                  width={320}
                  height={96}
                  className="h-full w-full object-contain invert"
                  priority
                />
              </div>
            </Link>

            {/* Right: Search + Cart */}
            <div className="flex items-center gap-4 md:gap-6">
              <div className="hidden md:block w-48 lg:w-64">
                <WooSearch />
              </div>
              <CartIcon />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <WooMobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        categories={categories}
      />
    </>
  );
}