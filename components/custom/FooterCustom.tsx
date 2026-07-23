'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { newsletterSchema } from '@/lib/validations/forms';
import { toast } from 'sonner';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = newsletterSchema.safeParse({ email });

    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || 'Error de validación';
      toast.error(errorMessage);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('¡Gracias por suscribirte!');
      setEmail('');
    }, 1200);
  };

  return (
    <footer className="bg-[var(--black)] text-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pt-20 pb-10">

        {/* ============ MASTHEAD — logo sutil + wordmark + eyebrow ============ */}
        <div className="text-center mb-16 md:mb-20">
          <div className="flex flex-col items-center gap-5">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Image
                src="/logo-maison.png"
                alt="Maison"
                width={80}
                height={80}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <p className="font-moderat text-[10px] tracking-[0.35em] uppercase text-white/50 mb-3">
                Maison · Joyería fina
              </p>
              <h2 className="font-belleza text-4xl md:text-5xl font-light tracking-wide text-white">
                Maison
              </h2>
            </div>
          </div>
        </div>

        {/* ============ HAIRLINE GOLD DIVIDER ============ */}
        <div className="h-px bg-[var(--gold)]/30 mb-12 md:mb-16" />

        {/* ============ GRID 2 COLUMN: MENÚ + CONTACTO ============ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 mb-16 md:mb-20">

          {/* Menú + Políticas combinados */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-moderat text-[10px] tracking-[0.3em] uppercase text-white/50 mb-6">
                Menú
              </h4>
              <ul className="space-y-3 font-moderat text-sm">
                <li>
                  <Link
                    href="/search"
                    className="text-white/80 hover:text-[var(--gold)] transition-colors duration-300 inline-block relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-[var(--gold)] after:transition-all hover:after:w-full"
                  >
                    Catálogo
                  </Link>
                </li>
                <li>
                  <Link
                    href="/politica-envios"
                    className="text-white/80 hover:text-[var(--gold)] transition-colors duration-300 inline-block relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-[var(--gold)] after:transition-all hover:after:w-full"
                  >
                    Envíos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/politica-reembolso"
                    className="text-white/80 hover:text-[var(--gold)] transition-colors duration-300 inline-block relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-[var(--gold)] after:transition-all hover:after:w-full"
                  >
                    Reembolso
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terminos-y-condiciones"
                    className="text-white/80 hover:text-[var(--gold)] transition-colors duration-300 inline-block relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-[var(--gold)] after:transition-all hover:after:w-full"
                  >
                    Términos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/politica-proteccion-datos"
                    className="text-white/80 hover:text-[var(--gold)] transition-colors duration-300 inline-block relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-[var(--gold)] after:transition-all hover:after:w-full"
                  >
                    Privacidad
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-moderat text-[10px] tracking-[0.3em] uppercase text-white/50 mb-6">
                Contacto
              </h4>
              <ul className="space-y-3 font-moderat text-sm">
                <li>
                  <a
                    href="https://wa.me/573232182386?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-[var(--gold)] transition-colors duration-300 inline-block relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-[var(--gold)] after:transition-all hover:after:w-full"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:shoescompany0101@gmail.com"
                    className="text-white/80 hover:text-[var(--gold)] transition-colors duration-300 inline-block relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-[var(--gold)] after:transition-all hover:after:w-full"
                  >
                    Correo
                  </a>
                </li>
                <li className="flex items-center gap-3 pt-1">
                  <a
                    href="https://www.instagram.com/store777"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="text-white/60 hover:text-[var(--gold)] transition-colors duration-300"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.facebook.com/store777"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="text-white/60 hover:text-[var(--gold)] transition-colors duration-300"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                </li>
              </ul>
              <p className="font-moderat text-xs text-white/50 mt-6 leading-relaxed">
                +57 323 218 2386<br />
                shoescompany0101@gmail.com
              </p>
            </div>
          </div>

          {/* WhatsApp CTA — brand-standard green, refinado */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="font-moderat text-[10px] tracking-[0.3em] uppercase text-white/50 mb-6">
                Atención personalizada
              </p>
              <p className="font-belleza text-2xl md:text-3xl font-light text-white leading-snug mb-8">
                ¿Buscás algo especial? Conversemos sobre una pieza a medida.
              </p>
              <a
                href="https://wa.me/573232182386?text=Hola%2C%20me%20interesa%20una%20pieza%20a%20medida"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-5 py-3 bg-[#25D366] hover:bg-[#1ebe5b] transition-colors font-moderat font-medium"
              >
                <Phone className="h-4 w-4 text-white" />
                <span className="text-white text-sm tracking-wider">Escribinos por WhatsApp</span>
              </a>
            </div>

            {/* Value props — bullets luxury */}
            <ul className="font-moderat text-xs text-white/60 mt-12 space-y-2">
              <li className="flex items-center gap-3">
                <span className="w-1 h-1 bg-[var(--gold)] rounded-full" />
                Envíos insured a toda Colombia
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1 h-1 bg-[var(--gold)] rounded-full" />
                Hecho a mano en oro y plata
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1 h-1 bg-[var(--gold)] rounded-full" />
                Asesoría personal sin costo
              </li>
            </ul>
          </div>
        </div>

        {/* ============ NEWSLETTER — banda horizontal con underline-only input ============ */}
        <div className="border-t border-white/10 pt-12 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-5">
              <p className="font-moderat text-[10px] tracking-[0.3em] uppercase text-white/50 mb-3">
                Newsletter
              </p>
              <h3 className="font-belleza text-2xl md:text-3xl font-light text-white leading-snug">
                Recibí novedades y lanzamientos antes que nadie.
              </h3>
            </div>
            <form
              onSubmit={handleNewsletterSubmit}
              className="md:col-span-7 flex items-center gap-4 border-b border-white/30 pb-2 focus-within:border-[var(--gold)] transition-colors"
            >
              <Mail className="h-4 w-4 text-white/50 flex-shrink-0" />
              <input
                type="email"
                placeholder="Su e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="flex-1 bg-transparent text-white placeholder:text-white/40 font-moderat text-sm focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                aria-label="Suscribir"
                className="font-moderat text-sm tracking-[0.2em] uppercase text-white hover:text-[var(--gold)] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '...' : 'Suscribir →'}
              </button>
            </form>
          </div>
        </div>

        {/* ============ BOTTOM STRIP ============ */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 font-moderat text-xs text-white/40">
          <p>© {new Date().getFullYear()} Maison · Todos los derechos reservados</p>
          <p>Colombia 🇨🇴</p>
        </div>
      </div>
    </footer>
  );
}