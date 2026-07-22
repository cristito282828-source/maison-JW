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
 * Detalles: ~12 partículas doradas flotando lento en el fondo (efecto luxury
 * discreto). Las animaciones respetan `prefers-reduced-motion` para
 * accesibilidad.
 */

import Image from 'next/image';
import Link from 'next/link';

/**
 * Configuración de las partículas — posiciones y delays precomputados para
 * SSR/CSR consistentes (sin Math.random en cada render).
 */
const PARTICLES = [
  { left: '8%',  top: '12%', size: 5,  delay: 0,    duration: 11 },
  { left: '18%', top: '68%', size: 3,  delay: 2.4,  duration: 13 },
  { left: '27%', top: '24%', size: 4,  delay: 4.1,  duration: 12 },
  { left: '35%', top: '82%', size: 6,  delay: 1.2,  duration: 14 },
  { left: '46%', top: '18%', size: 3,  delay: 3.7,  duration: 11 },
  { left: '54%', top: '74%', size: 5,  delay: 0.8,  duration: 13 },
  { left: '63%', top: '30%', size: 4,  delay: 5.2,  duration: 12 },
  { left: '72%', top: '86%', size: 7,  delay: 1.9,  duration: 15 },
  { left: '81%', top: '14%', size: 3,  delay: 3.3,  duration: 11 },
  { left: '88%', top: '58%', size: 5,  delay: 4.7,  duration: 14 },
  { left: '94%', top: '38%', size: 4,  delay: 2.1,  duration: 12 },
  { left: '12%', top: '46%', size: 6,  delay: 0.5,  duration: 13 },
];

export default function SplashScreen() {
  return (
    <main
      id="main-content"
      className="relative min-h-screen bg-[var(--paper)] flex items-center justify-center px-6 overflow-hidden"
    >
      {/* ============ FONDO: partículas gold flotantes ============ */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[var(--gold)] float-particle"
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: 0.18,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* ============ CONTENIDO PRINCIPAL ============ */}
      <div className="relative w-full max-w-xl text-center">

        {/* Logo sutil */}
        <div className="flex justify-center mb-10 md:mb-14">
          <div className="relative w-14 h-14 md:w-16 md:h-16 opacity-70">
            <Image
              src="/logo-maison.jpg"
              alt="Maison"
              width={64}
              height={64}
              className="h-full w-full object-contain grayscale"
              priority
            />
          </div>
        </div>

        {/* Eyebrow */}
        <p className="font-moderat text-[10px] md:text-xs tracking-[0.35em] uppercase text-[var(--gray-600)] mb-5">
          Joyería fina · Colombia
        </p>

        {/* Wordmark */}
        <h1 className="font-belleza text-6xl md:text-8xl font-light tracking-wide text-[var(--ink)] mb-8">
          Maison
        </h1>

        {/* Tagline */}
        <p className="font-moderat text-base md:text-lg text-[var(--gray-600)] leading-relaxed max-w-md mx-auto mb-12 md:mb-16">
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

        {/* Footer del splash */}
        <div className="mt-20 md:mt-28">
          <p className="font-belleza text-sm md:text-base italic text-[var(--gray-400)] tracking-wide">
            Una pieza a la vez.
          </p>
        </div>
      </div>

      {/* Keyframes + accesibilidad (prefers-reduced-motion) */}
      <style>{`
        @keyframes float-particle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0.10;
          }
          25% {
            transform: translateY(-14px) translateX(6px);
            opacity: 0.30;
          }
          50% {
            transform: translateY(-22px) translateX(-4px);
            opacity: 0.18;
          }
          75% {
            transform: translateY(-12px) translateX(8px);
            opacity: 0.28;
          }
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0.10;
          }
        }

        .float-particle {
          animation-name: float-particle;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .float-particle {
            animation: none !important;
            opacity: 0.18;
          }
        }
      `}</style>
    </main>
  );
}