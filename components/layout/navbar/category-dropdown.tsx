'use client';

/**
 * Mega-menu LV-inspired: al click/hover del trigger, abre un panel ancho
 * con grid de categorías + imagen editorial + footer link.
 *
 * Estructura:
 *   ┌─────────────────────────────────────────────────────────┐
 *   │ COLECCIONES                                              │
 *   │ ─────────                                               │
 *   │ [col 1]   [col 2]   [col 3]              [imagen]      │
 *   │ Anillos    Collares  Aretes                              │
 *   │ Pulseras   Dijes     Novedades                           │
 *   │                                                          │
 *   │ Ver todas las categorías →                               │
 *   └─────────────────────────────────────────────────────────┘
 */

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface Category {
  title: string;
  path: string;
}

interface CategoryDropdownProps {
  categories: Category[];
}

// Imagen editorial por defecto — el primer producto destacado del WP
// (placeholder; se actualiza cuando se hace el refactor del hero).
const EDITORIAL_IMAGE = '/logo-maison.png';

export function CategoryDropdown({ categories }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Cerrar con ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  // Distribuir categorías en columnas (max 4 por columna)
  const columns: Category[][] = [];
  const perColumn = 4;
  for (let i = 0; i < categories.length; i += perColumn) {
    columns.push(categories.slice(i, i + perColumn));
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Trigger — match con el resto del menú */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="font-moderat text-xs tracking-[0.2em] uppercase text-[var(--ink)] hover:text-[var(--gold)] transition-colors duration-300 py-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Colecciones
      </button>

      {/* Mega-menu panel — solo se monta cuando está abierto (evita hydration mismatch
          y deja el DOM limpio cuando está cerrado) */}
      {isOpen && (
        <div className="fixed left-0 right-0 top-full animate-fadeIn">
          <div className="bg-[var(--paper)] shadow-lg">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 lg:py-14">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                {/* Header del panel */}
                <div className="lg:col-span-12 mb-2">
                  <p className="font-moderat text-[10px] tracking-[0.35em] uppercase text-[var(--gray-600)]">
                    Maison · Colecciones
                  </p>
                </div>

                {/* Columnas de categorías */}
                <div className={`lg:col-span-8 grid gap-8 ${
                  columns.length === 0 ? 'grid-cols-1' :
                  columns.length === 1 ? 'grid-cols-1' :
                  columns.length === 2 ? 'grid-cols-2' :
                  columns.length === 3 ? 'grid-cols-3' : 'grid-cols-4'
                }`}>
                  {columns.length > 0 ? (
                    columns.map((col, i) => (
                      <div key={i} className="flex flex-col gap-3">
                        {col.map((cat) => (
                          <Link
                            key={cat.path}
                            href={cat.path}
                            onClick={() => setIsOpen(false)}
                            className="font-moderat text-sm text-[var(--ink)] hover:text-[var(--gold)] transition-colors duration-300"
                          >
                            {cat.title}
                          </Link>
                        ))}
                      </div>
                    ))
                  ) : (
                    <p className="font-moderat text-sm text-[var(--gray-600)]">
                      No hay colecciones disponibles.
                    </p>
                  )}

                  {/* Footer link */}
                  <div className="col-span-full pt-6 mt-4">
                    <Link
                      href="/search"
                      onClick={() => setIsOpen(false)}
                      className="group inline-flex items-center gap-3 font-moderat text-xs tracking-[0.2em] uppercase text-[var(--ink)] border-b border-[var(--ink)] pb-1 hover:text-[var(--gold)] hover:border-[var(--gold)] transition-colors"
                    >
                      Ver todas las colecciones
                      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                </div>

                {/* Imagen editorial */}
                <div className="lg:col-span-4 hidden lg:block">
                  <div className="relative aspect-[4/5] bg-[var(--gray-50)] overflow-hidden">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[var(--ink)] to-[var(--black)]">
                      <p className="font-moderat text-[10px] tracking-[0.35em] uppercase text-[var(--gold)] mb-4">
                        Nueva colección
                      </p>
                      <p className="font-belleza text-3xl text-[var(--paper)] leading-tight mb-6">
                        Piezas atemporales en oro y plata
                      </p>
                      <Link
                        href="/search"
                        onClick={() => setIsOpen(false)}
                        className="font-moderat text-xs tracking-[0.2em] uppercase text-[var(--paper)] border-b border-[var(--paper)] pb-1 hover:text-[var(--gold)] hover:border-[var(--gold)] transition-colors"
                      >
                        Explorar →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}