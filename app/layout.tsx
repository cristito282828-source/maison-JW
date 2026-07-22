import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { RecentlyViewedProvider } from '@/components/providers/RecentlyViewedProvider';
import { CartProvider } from '@/components/providers/CartProvider';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/structured-data';
import { JsonLdScript } from '@/lib/json-ld-script';

// Tipografía sans (Moderat) — 4 pesos para jerarquía: light/regular/medium/bold.
const moderat = localFont({
  variable: '--font-moderat',
  display: 'swap',
  src: [
    { path: '../public/Moderat Font/Moderat-Light.woff2', weight: '300', style: 'normal' },
    { path: '../public/Moderat Font/Moderat-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/Moderat Font/Moderat-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../public/Moderat Font/Moderat-Bold.woff2', weight: '700', style: 'normal' },
  ],
});

// Tipografía serif display (Belleza) — un solo peso, solo para titulares.
const belleza = localFont({
  variable: '--font-belleza',
  display: 'swap',
  src: [
    { path: '../public/belleza/Belleza-Regular.woff2', weight: '400', style: 'normal' },
  ],
});

export const metadata: Metadata = {
  title: {
    default: 'Maison — Joyería fina en Colombia',
    template: '%s | Maison',
  },
  description:
    'Joyería fina hecha en Colombia. Piezas atemporales en oro y plata, diseñadas para durar.',
  keywords: ['joyería', 'oro', 'plata', 'anillos', 'collares', 'aretes', 'Colombia', 'Maison'],
  authors: [{ name: 'Maison' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://example.com',
    siteName: 'Maison',
    title: 'Maison — Joyería fina en Colombia',
    description:
      'Joyería fina hecha en Colombia. Piezas atemporales en oro y plata, diseñadas para durar.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema();
  const webSiteSchema = generateWebSiteSchema();

  return (
    <html lang="es" className={`${moderat.variable} ${belleza.variable}`}>
      <head>
        {/* Structured Data global para SEO */}
        <JsonLdScript data={organizationSchema} />
        <JsonLdScript data={webSiteSchema} />
      </head>
      <body className="antialiased">
        {/* Skip Link para accesibilidad - permite saltar al contenido principal */}
        <a
          href="#main-content"
          className="skip-link"
        >
          Saltar al contenido principal
        </a>

        <CartProvider>
          <RecentlyViewedProvider>
            {children}
          </RecentlyViewedProvider>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}