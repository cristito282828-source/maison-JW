/**
 * Footer minimal luxury — estilo maisongefaell.
 *
 * Solo lo esencial:
 *   - Logo sutil (invertido para que se vea blanco sobre el fondo dark)
 *   - WhatsApp CTA centrado, look luxury (no verde comercial)
 *   - Email + Instagram como links sutiles
 *   - © + país al pie
 *
 * Sin newsletter, sin value props, sin políticas, sin masthead.
 * El navbar ya tiene el logo + menú, no se duplica.
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[var(--black)] text-white">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 pt-24 pb-12 text-center">

        {/* ============ LOGO SUTIL ============ */}
        <div className="flex justify-center mb-16">
          <div className="relative w-24 h-12 md:w-28 md:h-14 opacity-70">
            <Image
              src="/logo-maison.png"
              alt="Maison"
              width={112}
              height={56}
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        {/* ============ EYEBROW + TAGLINE ============ */}
        <p className="font-moderat text-[10px] tracking-[0.35em] uppercase text-white/50 mb-3">
          Maison
        </p>
        <p className="font-belleza text-2xl md:text-3xl font-light tracking-wide text-white/90 leading-snug mb-12">
          Joyería fina hecha en Colombia.
        </p>

        {/* ============ WHATSAPP CTA — look luxury (no verde comercial) ============ */}
        <a
          href="https://wa.me/971501701872?text=Hola%2C%20me%20interesa%20una%20pieza%20a%20medida"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-3 font-moderat text-sm tracking-[0.2em] uppercase text-white border-b border-white pb-2 hover:text-[var(--gold)] hover:border-[var(--gold)] transition-colors duration-500"
        >
          <Phone className="h-4 w-4" />
          <span>Conversemos por WhatsApp</span>
          <span
            aria-hidden="true"
            className="transition-transform duration-500 group-hover:translate-x-1"
          >
            →
          </span>
        </a>

        {/* ============ INSTAGRAM — único canal social (correo quitado) ============ */}
        <div className="flex items-center justify-center gap-3 mt-12 font-moderat text-sm">
          <a
            href="https://www.instagram.com/maisonjewelco/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-white/60 hover:text-[var(--gold)] transition-colors duration-300"
          >
            <Instagram className="h-4 w-4" />
          </a>
        </div>

        {/* ============ HAIRLINE GOLD DIVIDER ============ */}
        <div className="h-px bg-[var(--gold)]/30 my-16" />

        {/* ============ BOTTOM STRIP ============ */}
        <div className="flex flex-col gap-2 font-moderat text-[10px] tracking-[0.25em] uppercase text-white/40">
          <p>© {new Date().getFullYear()} Maison</p>
          <p>Colombia 🇨🇴</p>
        </div>
      </div>
    </footer>
  );
}