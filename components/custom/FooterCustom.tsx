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

    // Validación con Zod
    const result = newsletterSchema.safeParse({ email });

    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || 'Error de validación';
      toast.error(errorMessage);
      return;
    }

    setIsSubmitting(true);

    // TODO: Integrar con servicio de email marketing
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('¡Gracias por suscribirte!');
      setEmail('');
    }, 1200);
  };

  return (
    <footer className="bg-[var(--black)] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-16 h-16 flex-none">
                <Image
                  src="/logo-maison.jpg"
                  alt="Maison"
                  width={64}
                  height={64}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="font-belleza text-3xl tracking-wide text-white">
                Maison
              </div>
            </div>
            <p className="text-white/70 mb-6 leading-relaxed font-moderat text-sm">
              Joyería fina hecha en Colombia. Piezas atemporales en oro y plata.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/store777"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-[var(--gold)] transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/store777"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-[var(--gold)] transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Menú Inferior */}
          <div>
            <h4 className="font-moderat text-xs tracking-[0.25em] uppercase mb-6 text-white">Menú</h4>
            <ul className="space-y-3">
              <li><Link href="/search" className="text-white/60 hover:text-[var(--gold)] transition-colors duration-200">Búsqueda</Link></li>
              <li><Link href="/terminos-del-servicio" className="text-white/60 hover:text-[var(--gold)] transition-colors duration-200">Términos del servicio</Link></li>
              <li><Link href="/search" className="text-white/60 hover:text-[var(--gold)] transition-colors duration-200">Catálogo</Link></li>
            </ul>
          </div>

          {/* Nuestras Políticas */}
          <div>
            <h4 className="font-moderat text-xs tracking-[0.25em] uppercase mb-6 text-white">Políticas</h4>
            <ul className="space-y-3">
              <li><Link href="/politica-proteccion-datos" className="text-white/60 hover:text-[var(--gold)] transition-colors duration-200">Protección de datos</Link></li>
              <li><Link href="/politica-reembolso" className="text-white/60 hover:text-[var(--gold)] transition-colors duration-200">Reembolso</Link></li>
              <li><Link href="/politica-envios" className="text-white/60 hover:text-[var(--gold)] transition-colors duration-200">Envíos</Link></li>
              <li><Link href="/terminos-y-condiciones" className="text-white/60 hover:text-[var(--gold)] transition-colors duration-200">Términos y Condiciones</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-moderat text-xs tracking-[0.25em] uppercase mb-6 text-white">Contacto</h4>
            <p className="text-white/60 mb-6 font-moderat text-sm">
              ¿Consultas? Escribinos por WhatsApp y te respondemos a la brevedad.
            </p>

            {/* WhatsApp CTA — brand-standard green se mantiene */}
            <a
              href="https://wa.me/573232182386?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 bg-[#25D366] hover:bg-[#1ebe5b] transition-colors mb-6"
            >
              <Phone className="h-5 w-5 text-white" />
              <span className="font-bold text-white font-moderat">+57 323 218 2386</span>
            </a>

            <form onSubmit={handleNewsletterSubmit} className="mb-6">
              <p className="text-white/60 text-sm mb-2 font-moderat">Suscribite al newsletter:</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Su e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-[var(--ink)] text-white font-moderat focus:outline-none focus:ring-2 focus:ring-[var(--gold)] disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[var(--gold)] text-white font-bold font-moderat hover:bg-[#8f6f42] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '...' : 'Suscribir'}
                </button>
              </div>
            </form>

            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-white/60 flex-shrink-0" />
              <a
                href="mailto:shoescompany0101@gmail.com"
                className="text-white/60 hover:text-[var(--gold)] transition-colors duration-200"
              >
                shoescompany0101@gmail.com
              </a>
            </div>
          </div>
        </div>

        <hr className="border-white/10 mb-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <p className="text-white/40 text-sm font-moderat">
              © {new Date().getFullYear()} Maison. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6">
              <span className="text-white/40 text-sm font-moderat">Colombia 🇨🇴</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}