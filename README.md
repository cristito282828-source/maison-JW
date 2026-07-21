# ✨ Maison — Joyería en Colombia

E-commerce de **joyería fina en Colombia** construido con Next.js 15 + WooCommerce headless. Catálogo consumido vía WPGraphQL desde un WordPress externo, presentación propia con branding Maison.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript 5.8 · Tailwind 4 · WooCommerce GraphQL · Sharp (imágenes) · Sentry

**Última revisión:** 2026-07-21

---

## 🎯 Visión general

Maison es una tienda online de joyería (anillos, collares, pulseras, aretes, etc.) dirigida al mercado colombiano. La plataforma consume el catálogo de productos desde una tienda WooCommerce externa y lo presenta con identidad de marca Maison.

**Audiencia objetivo:** clientes en Colombia, contacto principal vía WhatsApp.

---

## ✅ Funcionalidades implementadas

### Home (`/`)

- SeasonalBanner con slides promocionales.
- FeaturedProducts: carrusel de productos destacados.
- CategorySection: grid minimalista de categorías top-level.
- HeroSection + AnnouncementBar.
- Newsletter (validación con Zod).
- N8nChatWidget u otros widgets de chat (configurable).

### Catálogo y productos

- `/tienda/categoria`: grid de productos por categoría con búsqueda.
- `/product/[slug]`: detalle con galería, variations, stock indicator, add-to-cart.
- `/search`: listado completo con filtros.

### Cart y checkout

- Cart persistente en `localStorage`.
- `/cart`: página de carrito con resumen.
- `/checkout`: formulario de envío (manual, sin pasarela real — se contacta por WhatsApp).

### Auth

- `/auth/signin` (menú estilo PS2) con email + password y Google OAuth.
- `/auth/register` (link a signin vía modal).

### APIs (`app/api/`)

- `/api/graphql`: proxy CORS a WPGraphQL.
- Endpoints auxiliares: search, products-by-category, revalidate, diagnostico-carrito, test-woocommerce.

### Páginas legales

- `/politica-envios`, `/politica-reembolso`, `/politica-proteccion-datos`.
- `/terminos-del-servicio`, `/terminos-y-condiciones`.

### Observabilidad

- Sentry configurado (`sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`).

---

## 🏗️ Arquitectura

### Server vs Client Components

**Regla de oro:** Server Components (`async`) para fetch inicial, Client Components (`'use client'`) para interactividad.

Patrón crítico para evitar loops infinitos: usar **layouts de Next.js** para envolver Server Components alrededor de Client Components:

```tsx
// app/cart/layout.tsx (Server Component)
export default function CartLayout({ children }) {
  return (
    <>
      <WooNavbar /> {/* Server Component */}
      {children}    {/* Client Component */}
      <FooterCustom />
    </>
  );
}
```

Usar `React.cache` para fetches costosos:

```ts
import { cache } from 'react';
export const getCollections = cache(async () => {
  const res = await woocommerceFetch(...);
  return res.body.data.productCategories?.nodes || [];
});
```

### Proxy GraphQL

Nunca fetches directos a WordPress desde el browser (CORS). Siempre usar `/api/graphql` desde el cliente y el endpoint directo solo en server components.

### i18n

- `messages/{es,en}.json` con namespaces por feature.
- `middleware.ts` detecta locale.

---

## 🎨 Línea gráfica

(Por definir — extraer del logo de Maison. Mientras tanto, paleta neutra + acentos a definir.)

Pendiente:
- [ ] Extraer paleta de `public/logo-maison.*`.
- [ ] Definir tipografías (candidates: serif elegante + sans neutra).
- [ ] Documentar en `app/globals.css` con CSS variables.

---

## 🚀 Setup

### Requisitos

- Node 22+
- pnpm o npm
- WordPress + WooCommerce + WPGraphQL en el backend (URL en `.env`).

### Variables de entorno (`.env`)

```bash
# Identidad
COMPANY_NAME="Maison"
SITE_NAME="Maison Joyería Colombia"
NEXT_PUBLIC_SITE_NAME="Maison"
SITE_URL="https://maison.com.co"
NEXT_PUBLIC_SITE_URL="https://maison.com.co"

# WooCommerce (backend del catálogo)
NEXT_PUBLIC_WOOCOMMERCE_URL="https://dev-pinneacle.pantheonsite.io"
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY="ck_..."
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET="cs_..."

# Contacto
NEXT_PUBLIC_PHONE_NUMBER="573232182386"   # Colombia +57 323 218 2386
NEXT_PUBLIC_CONTACT_EMAIL="hola@maison.com.co"

# Sentry (opcional pero recomendado en prod)
NEXT_PUBLIC_SENTRY_DSN="..."
SENTRY_ORG="..."
SENTRY_PROJECT="maison"
SENTRY_AUTH_TOKEN="..."

# Analytics (opcional)
# NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

### Comandos

```bash
npm install
npm run dev              # localhost:3000
npm run build
npm run start
npm run lint             # ESLint
npm run lint:fix
npm run prettier         # formatea todo
npm run test:unit        # Jest (configurado pero sin tests aún)
```

---

## 📁 Estructura

```
maison/
├── app/                          # App Router de Next 15
│   ├── [page]/                   # Catch-all dinámico
│   ├── account/                  # Login / register
│   ├── api/                      # Route handlers (graphql, search, etc.)
│   ├── cart/                     # Carrito
│   ├── checkout/                 # Checkout manual
│   ├── product/[slug]/           # Detalle de producto
│   ├── search/                   # Búsqueda
│   ├── tienda/categoria/         # Catálogo por categoría
│   ├── politica-*/               # Páginas legales
│   ├── terminos-*/               # Páginas legales
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── robots.ts / sitemap.ts
├── components/
│   ├── custom/                   # Componentes específicos del sitio
│   ├── layout/                   # Navbar, Footer
│   ├── product/                  # ProductDescription, variations, etc.
│   ├── grid/, cart/, ui/, icons/, providers/
├── lib/
│   ├── woocommerce/              # Cliente GraphQL + queries + mutations
│   ├── actions/                  # Server actions
│   ├── cookies/                  # recently-viewed
│   ├── validations/              # Zod schemas
│   ├── env.ts                    # Validación de env vars
│   ├── structured-data.ts        # JSON-LD
│   ├── seo.ts
│   ├── type-guards.ts
│   └── utils.ts
├── messages/
│   ├── es.json
│   └── en.json
├── middleware.ts                 # Locale detection
├── public/                       # Assets (logo, banners, fonts)
└── scripts/                      # (vacío por ahora)
```

---

## ⚠️ Deuda técnica / pendientes

### Críticos (antes de producción)

1. **Deploy real** (Vercel recomendado). Aún local.
2. **Pasarela de pago**: Stripe / MercadoPago / Epayco. Hoy checkout es manual vía WhatsApp.
3. **Email transaccional** (Resend): confirmaciones de orden, recuperación de carrito abandonado.
4. **Auth en backend**: hoy `/account` usa NextAuth pero los productos son anónimos vía WooCommerce — falta acoplar el usuario al carrito y a las órdenes.
5. **SEO real**: sitemap.xml dinámico, robots.txt enriquecido, structured data de productos (Product, Offer, BreadcrumbList).
6. **Limpiar `.md` legacy**: este proyecto fue tienda de skate antes; los archivos `INTEGRATION.md`, `METAOBJECTS_*.md`, `SETUP_*.md`, `VISUAL_GUIDE.md` son de la versión anterior de Shopify/Skate — no aplican.
7. **Definir branding Maison**: paleta, tipografías, logo, copy. El `globals.css` actual es genérico.

### Features

8. Wishlist / favoritos.
9. Reviews de productos.
10. Filtros por precio, material (oro/plata), tipo de joya.
11. Búsqueda con autocompletado.
12. Stock por sucursal.
13. Cupones de descuento.
14. Envíos con tracking (Servientrega, Coordinadora, etc.).
15. Pagos en cuotas sin interés.

### Operacional

16. Tests automatizados (Jest configurado, 0 tests).
17. CI/CD (GitHub Actions).
18. Dashboard admin para gestión de inventario.
19. Reportes de ventas.
20. Integración contable (DIAN para Colombia).

### Bugs conocidos

- **`/tienda/categoria/[collection]/page.tsx`** solo tiene placeholder; la lógica está en `/search/[collection]/page.tsx`. Unificar.
- **FeaturedProducts**: handlers de fetch no memoizados → re-fetches innecesarios al cambiar categoría.
- **Carrito no persiste** entre devices (solo localStorage del browser).

---

## 📝 Convenciones

- **Tailwind v4**: `@import 'tailwindcss'` en `globals.css`. Algunas cosas siguen en `tailwind.config.ts`.
- **TypeScript estricto**. ESLint con config default de Next.
- **Componentes custom**: en `src/components/custom/` (feature folders).
- **i18n**: `messages/{es,en}.json` con namespaces por feature.
- **API routes**: en `src/app/api/{recurso}/route.ts` con proxy GraphQL.
- **Server Components** para datos iniciales, **Client Components** para interactividad. Layouts para separar Server de Client.

---

## 🔗 Integraciones

| Servicio | Uso | Estado |
|---|---|---|
| **WordPress + WooCommerce** (dev-pinneacle.pantheonsite.io) | Catálogo de productos | ✅ funcionando |
| **Sentry** | Error tracking | 🟡 configurado, falta DSN de prod |
| **Auth (NextAuth)** | Login email + Google | 🟡 funcional, sin acoplar a órdenes |
| **WhatsApp** | Checkout manual | 🟡 número en `.env` |
| **Analytics** | Pendiente | ❌ |

---

## 🛒 Productos

El catálogo viene del backend WooCommerce. Productos típicos de joyería:
- Anillos (compromiso, matrimonio, moda)
- Collares y cadenas
- Aretes
- Pulseras
- Dijes y charms

(No hay inventario en BD local — todo se fetchea en runtime desde WPGraphQL.)

---

## 🤝 Contacto

- **WhatsApp**: número configurado en `NEXT_PUBLIC_PHONE_NUMBER`
- **Email**: configurado en `NEXT_PUBLIC_CONTACT_EMAIL`
- **Instagram**: pendiente
- **Facebook**: pendiente

---

## 🚀 Deploy

```bash
# Vercel (recomendado)
vercel

# O conectar repo en vercel.com → New Project → detectar Next.js automáticamente.
```

Variables de entorno se configuran en Vercel dashboard (no commitear `.env`).

---

## 📂 Documentos relacionados

- `CLAUDE_INSTRUCTIONS.md` — instrucciones de arquitectura para Claude (Server vs Client, proxy GraphQL, anti-patterns). Conservar.
- `DOCUMENTACION_TECNICA.md` — revisar si tiene info actual útil o es legacy.
- `QUICK_REFERENCE.md`, `INTEGRATION.md`, `METAOBJECTS_*.md`, `SETUP_*.md`, `VISUAL_GUIDE.md`, `SHOPIFY_METAOBJECTS_TUTORIAL.md` — **legacy de cuando era tienda de skate/Shopify**. Pendiente de limpieza.