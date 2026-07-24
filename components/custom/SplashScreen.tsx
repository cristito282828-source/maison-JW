/**
 * SplashScreen — link-in-bio landing para tráfico de redes sociales.
 *
 * Se muestra cuando el visitante llega con `utm_source` apuntando a una red
 * social (Instagram, TikTok, Facebook, X/Twitter). Funciona como una "puerta"
 * de marca antes del sitio principal.
 *
 * Diseño: estilo maisongefaell — logo sutil centrado, wordmark Belleza
 * grande, tagline con tracking, botón underline luxury, fondo off-white.
 *
 * Video de fondo: video-1.mp4 con filtro gold luxury (brightness + sepia)
 * cubre toda la pantalla como background. Un overlay sutil (paper/70) sobre
 * el video garantiza legibilidad del texto blanco/oscuro encima.
 */

import Image from 'next/image';
import Link from 'next/link';
import { Instagram, MessageCircle } from 'lucide-react';

export default function SplashScreen() {
  return (
    <main
      id="main-content"
      className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
    >
      {/* ============ FONDO: VIDEO con filtro gold luxury ============ */}
      <video
        src="/videos/video-1.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="fixed inset-0 w-full h-full object-cover"
        style={{
          filter: 'brightness(1.2) saturate(1.1) sepia(0.15)',
          zIndex: 0,
        }}
      />

      {/* Overlay sutil sobre el video para legibilidad del texto */}
      <div
        aria-hidden="true"
        className="fixed inset-0"
        style={{
          backgroundColor: 'rgba(250, 250, 248, 0.72)',
          zIndex: 1,
        }}
      />

      {/* ============ CONTENIDO PRINCIPAL (encima del video + overlay) ============ */}
      <div className="relative w-full max-w-xl text-center py-12 md:py-0" style={{ zIndex: 2 }}>

        {/* Logo — invertido para que se vea oscuro sobre el fondo mixto */}
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="relative w-24 h-24 md:w-32 md:h-32">
            <Image
              src="/logo-maison.png"
              alt="Maison"
              width={128}
              height={128}
              className="h-full w-full object-contain invert"
              priority
            />
          </div>
        </div>

        {/* Eyebrow */}
        <p className="font-moderat text-[10px] md:text-xs tracking-[0.35em] uppercase text-[var(--gray-600)] mb-3 md:mb-4">
          Joyería fina · Colombia
        </p>

        {/* Wordmark */}
        <h1 className="font-belleza text-5xl md:text-7xl font-light tracking-wide text-[var(--ink)] mb-6 md:mb-7">
          Maison
        </h1>

        {/* Tagline */}
        <p className="font-moderat text-base md:text-lg text-[var(--gray-600)] leading-relaxed max-w-md mx-auto mb-10 md:mb-12">
          Piezas atemporales en oro y plata, hechas a mano en Colombia.
        </p>

        {/* CTA — underline luxury */}
        <Link
          href="/"
          className="group inline-flex items-center gap-3 font-moderat text-sm md:text-base tracking-[0.2em] uppercase text-[var(--ink)] border-b border-[var(--ink)] pb-2 hover:text-[var(--gold)] hover:border-[var(--gold)] transition-colors duration-300"
        >
          Entrar a la tienda
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>

        {/* Redes sociales — WhatsApp + Instagram (link-in-bio style) */}
        <div className="flex items-center justify-center gap-8 mt-8 md:mt-10">
          <a
            href="https://wa.me/971501701872"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="group flex flex-col items-center gap-2 text-[var(--gray-600)] hover:text-[var(--ink)] transition-colors duration-300"
          >
            <span className="flex items-center justify-center w-10 h-10 border border-[var(--gray-200)] rounded-full group-hover:border-[var(--gold)] transition-colors duration-300">
              <MessageCircle className="h-4 w-4" />
            </span>
            <span className="font-moderat text-[10px] tracking-[0.25em] uppercase">WhatsApp</span>
          </a>

          <a
            href="https://www.instagram.com/maisonjewelco/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="group flex flex-col items-center gap-2 text-[var(--gray-600)] hover:text-[var(--ink)] transition-colors duration-300"
          >
            <span className="flex items-center justify-center w-10 h-10 border border-[var(--gray-200)] rounded-full group-hover:border-[var(--gold)] transition-colors duration-300">
              <Instagram className="h-4 w-4" />
            </span>
            <span className="font-moderat text-[10px] tracking-[0.25em] uppercase">Instagram</span>
          </a>
        </div>

        {/* Footer del splash */}
        <div className="mt-8 md:mt-10">
          <p className="font-belleza text-sm md:text-base italic text-[var(--gray-400)] tracking-wide">
            Una pieza a la vez.
          </p>
        </div>
      </div>
    </main>
  );
}