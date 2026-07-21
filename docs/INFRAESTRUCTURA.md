# Infraestructura y Deployment - Pinneacle Perfumería

## 📋 Índice

1. [Arquitectura de Deployment](#arquitectura-de-deployment)
2. [Diagrama de Infraestructura](#diagrama-de-infraestructura)
3. [Flujo de Deploy](#flujo-de-deploy)
4. [Ambientes](#ambientes)
5. [Monitoreo y Logging](#monitoreo-y-logging)
6. [Security](#security)
7. [Optimizaciones](#optimizaciones)

---

## Arquitectura de Deployment

### Arquitectura Serverless en Vercel

```mermaid
graph TB
    subgraph "Usuarios"
        User[👤 Usuario]
    end

    subgraph "CDN - Vercel Edge Network"
        CDN[🌐 Vercel CDN]
        Cache[💾 Edge Cache]
    end

    subgraph "Vercel Platform"
        Router[Vercel Router]
        Functions[Serverless Functions]
        Images[Image Optimization]
    end

    subgraph "External Services"
        Woo[WooCommerce API]
        DB[(Base de Datos<br/>WooCommerce)]
        WhatsApp[WhatsApp API]
    end

    subgraph "Monitoring"
        Sentry[Sentry Error<br/>Tracking]
        Analytics[Vercel Analytics]
    end

    User -->|HTTPS| CDN
    CDN --> Router
    Router --> Cache
    Router --> Functions

    Functions -->|GraphQL| Woo
    Woo --> DB

    Functions -->|Image Request| Images
    Images -->|Optimized| CDN

    Functions -->|Checkout| WhatsApp

    Functions -->|Errors| Sentry
    CDN -->|Analytics| Analytics

    style User fill:#E3F2FD
    style CDN fill:#4CAF50
    style Router fill:#2196F3
    style Functions fill:#FF9800
    style Woo fill:#00BCD4
```

---

## Diagrama de Infraestructura

### Vista Completa del Sistema

```mermaid
graph TB
    subgraph "Client Side"
        Browser[🌐 Navegador Web]
        LocalStorage[(localStorage<br/>pinneacle_cart)]
    end

    subgraph "Vercel Edge - Global Distribution"
        Edge1[Edge: Santiago]
        Edge2[Edge: Lima]
        Edge3[Edge: Bogotá]
    end

    subgraph "Vercel Platform"
        NextJs[Next.js 15 App]
        APIRoutes[API Routes]
        ISR[ISR Pages]
    end

    subgraph "Vercel Edge Functions"
        SearchFn[/api/search]
        GraphFn[/api/graphql]
    end

    subgraph "WooCommerce Backend"
        WooAPI[GraphQL API]
        WooDB[(MySQL Database)]
        WooMedia[Media Library]
    end

    subgraph "Third Party Services"
        WhatsApp[WhatsApp Business API]
        Sentry[Sentry APM]
        VercelAnal[Vercel Analytics]
    end

    Browser -->|HTTP/2| Edge1
    Browser -->|HTTP/2| Edge2
    Browser -->|HTTP/2| Edge3

    Edge1 --> NextJs
    Edge2 --> NextJs
    Edge3 --> NextJs

    NextJs --> APIRoutes
    NextJs --> ISR

    APIRoutes --> SearchFn
    APIRoutes --> GraphFn

    SearchFn --> WooAPI
    GraphFn --> WooAPI

    WooAPI --> WooDB
    WooAPI --> WooMedia

    Browser <-->|Read/Write| LocalStorage

    APIRoutes -->|Error Events| Sentry
    NextJs -->|Performance| VercelAnal

    APIRoutes -->|WhatsApp Links| WhatsApp

    style Browser fill:#1565C0,color:#fff
    style LocalStorage fill:#7B1FA2,color:#fff
    style NextJs fill:#2E7D32,color:#fff
    style WooAPI fill:#F57C00,color:#fff
    style WhatsApp fill:#25D366,color:#fff
```

---

## Flujo de Deploy

### Pipeline de CI/CD con Vercel

```mermaid
sequenceDiagram
    actor Dev as 👨‍💻 Desarrollador
    participant Git as 📦 GitHub
    participant Vercel as ⚡ Vercel
    participant Build as 🔨 Build Process
    participant Deploy as 🚀 Deploy
    participant Edge as 🌐 Edge Network

    Dev->>Git: git push main
    activate Git

    Git->>Vercel: Webhook: Push event
    activate Vercel

    Vercel->>Build: Iniciar build
    activate Build

    Build->>Build: pnpm install
    Build->>Build: pnpm build
    Build->>Build: Generar static files
    Build->>Build: Optimizar imágenes
    Build->>Build: Minificar JS/CSS

    alt Build Success
        Build-->>Vercel: Build OK
        deactivate Build

        Vercel->>Deploy: Desplegar a producción
        activate Deploy

        Deploy->>Edge: Distribuir a edges globales
        activate Edge
        Edge-->>Deploy: Confirmación
        deactivate Edge

        Deploy-->>Vercel: Deploy completado
        deactivate Deploy

        Vercel->>Git: Update deployment status
        Vercel-->>Dev: ✅ Deploy successful
        deactivate Vercel

    else Build Error
        Build-->>Vercel: ❌ Build failed
        deactivate Build

        Vercel-->>Dev: Error logs
        Vercel->>Git: Update status: failed
        deactivate Vercel
    end

    deactivate Git
```

### Proceso de Build Detallado

```mermaid
graph LR
    A[Source Code] --> B[Install Dependencies]
    B --> C[TypeScript Check]
    C --> D[Lint Code]
    D --> E[Build Next.js]
    E --> F[Generate Static Pages]
    F --> G[Optimize Images]
    G --> H[Generate API Routes]
    H --> I[Bundle Creation]
    I --> J[Upload to Vercel]
    J --> K[Distribute to Edge]

    style A fill:#E3F2FD
    style C fill:#FFF3E0
    style D fill:#FFF3E0
    style E fill:#C8E6C9
    style I fill:#B2DFDB
    style K fill:#4CAF50,color:#fff
```

---

## Ambientes

### Configuración de Ambientes

```mermaid
graph TB
    subgraph "Development"
        DevLocal[localhost:3000]
        DevEnv[.env.local]
    end

    subgraph "Preview"
        Preview[vercel.app/pr-*]
        PreviewEnv[Preview Environment]
    end

    subgraph "Production"
        Prod[pinneacleperfumeria.com]
        ProdEnv[Production Environment]
    end

    DevLocal -->|Git Push PR| Preview
    Preview -->|Merge to main| Prod

    style DevLocal fill:#E8F5E9
    style Preview fill:#FFF3E0
    style Prod fill:#FFEBEE
```

### Variables de Entorno por Ambiente

| Variable | Development | Preview | Production |
|----------|-------------|---------|------------|
| `NEXT_PUBLIC_WOOCOMMERCE_URL` | localhost | staging URL | production URL |
| `NEXT_PUBLIC_SITE_URL` | localhost:3000 | preview URL | pinneacleperfumeria.com |
| `NODE_ENV` | development | production | production |
| `SENTRY_DSN` | - | Preview DSN | Production DSN |

---

## Monitoreo y Logging

### Arquitectura de Monitoreo

```mermaid
graph LR
    subgraph "Application"
        NextJS[Next.js App]
        API[API Routes]
    end

    subgraph "Error Tracking"
        Sentry[Sentry]
        ErrorBoundary[Error Boundaries]
    end

    subgraph "Analytics"
        Vercel[Vercel Analytics]
        GA[Google Analytics]
    end

    subgraph "Performance"
        WebVitals[Web Vitals]
        Lighthouse[Lighthouse CI]
    end

    NextJS -->|Errors| Sentry
    NextJS -->|Runtime Errors| ErrorBoundary
    API -->|API Errors| Sentry

    NextJS -->|Page Views| Vercel
    NextJS -->|Events| GA

    NextJS -->|Metrics| WebVitals
    WebVitals --> Lighthouse

    style Sentry fill:#C62828,color:#fff
    style Vercel fill:#000000,color:#fff
    style GA fill:#4285F4,color:#fff
```

### Métricas Monitoreadas

#### Performance
- **FCP** (First Contentful Paint): < 1.8s
- **LCP** (Largest Contentful Paint): < 2.5s
- **CLS** (Cumulative Layout Shift): < 0.1
- **FID** (First Input Delay): < 100ms
- **TTFB** (Time to First Byte): < 600ms

#### Errors
- JavaScript errors
- API failures
- Network errors
- Resource loading errors

#### Business
- Cart conversion rate
- Search usage
- Product views
- Checkout initiation

---

## Security

### Medidas de Seguridad

```mermaid
graph TB
    subgraph "Client Side"
        CSP[Content Security Policy]
        HTTPS[HTTPS Only]
        Sanitize[Input Sanitization]
    end

    subgraph "Server Side"
        CORS[CORS Policy]
        RateLimit[Rate Limiting]
        Validation[Input Validation]
    end

    subgraph "Data Protection"
        EnvVars[Environment Variables]
        NoSecrets[No Secrets in Client]
        Encrypted[Encrypted Connections]
    end

    subgraph "API Security"
        APIKeys[API Keys]
        GraphQL[GraphQL Validation]
        QueryLimit[Query Depth Limit]
    end

    HTTPS --> Encrypted
    CSP --> Sanitize
    Sanitize --> Validation
    Validation --> GraphQL
    GraphQL --> QueryLimit
    EnvVars --> APIKeys

    style CSP fill:#4CAF50
    style HTTPS fill:#2196F3
    style EnvVars fill:#FF9800
    style APIKeys fill:#9C27B0
```

### Security Headers Implementados

```http
# Headers de Seguridad
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

## Optimizaciones

### Estrategias de Optimización

```mermaid
mindmap
    root((Optimizaciones))
        Performance
            Image Optimization
                WebP Format
                Lazy Loading
                Responsive Images
                Blur Placeholders
            Code Splitting
                Dynamic Imports
                Route-based Splitting
                Component Lazy Loading
            Caching Strategy
                ISR Pages
                Edge Caching
                API Caching
                CDN Distribution
        SEO
            Meta Tags
            Open Graph
            Structured Data
            Sitemap.xml
            Robots.txt
        UX
            Loading States
            Skeleton Screens
            Progressive Enhancement
            Optimistic UI
        Bundle Size
                Tree Shaking
                Minification
                Gzip Compression
                Brotli Compression
```

### Optimización de Imágenes

```typescript
// Configuración de imágenes en Next.js
const imageConfig = {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60, // 60 segundos
};

// Uso en componentes
<Image
  src={product.image}
  alt={product.name}
  width={400}
  height={533}
  className="object-cover"
  sizes="(max-width: 768px) 50vw, 25vw"
  priority={false}
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### Incremental Static Regeneration (ISR)

```typescript
// Páginas con ISR
export const revalidate = 3600; // 1 hora

export default async function HomePage() {
  // Se regenera cada hora
  const products = await getProducts();
  return <ProductGrid products={products} />;
}
```

---

## Costos y Recursos

### Estimación de Costos Mensuales (Vercel Pro)

| Servicio | Uso | Costo |
|----------|-----|-------|
| Hospedaje | Ilimitado | $20 USD |
| Ancho de banda | 1 TB | Incluido |
| Funciones Serverless | 100 GB-horas | Incluido |
| Edge Functions | Ilimitado | Incluido |
| Optimización imágenes | Ilimitado | Incluido |
| **Total** | | **$20 USD/mes** |

### Recursos del Plan Pro

- ✅ Ancho de banda: 1 TB/mes
- ✅ Serverless Functions: 100 GB-horas/mes
- ✅ Edge Functions: Ilimitado
- ✅ Build minutes: 6,000/minutos
- ✅ Deployments: Ilimitado
- ✅ Equipo: Ilimitado
- ✅ SSL gratuito

---

## Disaster Recovery

### Estrategia de Backup

```mermaid
graph TB
    subgraph "Primary"
        Vercel[Vercel Production]
        WooDB[(WooCommerce DB)]
    end

    subgraph "Backups"
        WooBackup[WooCommerce<br/>Daily Backups]
        GitBackups[Git<br/>Version Control]
        LocalBackups[Local<br/>Development]
    end

    subgraph "Recovery"
        Rollback[Rollback<br/>Vercel]
        Restore[Restore<br/>WooCommerce]
        Redeploy[Redeploy<br/>from Git]
    end

    Vercel -->|Daily| GitBackups
    WooDB -->|Daily| WooBackup
    WooBackup --> Restore
    GitBackups --> Redeploy
    Vercel --> Rollback

    style Vercel fill:#2196F3,color:#fff
    style WooBackup fill:#4CAF50,color:#fff
    style GitBackups fill:#FF9800,color:#fff
```

### Plan de Recuperación

1. **Código Fuente**: Git (GitHub) - Backups automáticos
2. **Base de Datos**: Backups diarios de WooCommerce
3. **Media**: CDN de WooCommerce + Backup
4. **Configuración**: Variables de entorno en Vercel
5. **Tiempo de Recuperación**: < 15 minutos
6. **Punto de Recuperación**: Último backup exitoso

---

## Recursos Adicionales

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [WooCommerce REST API](https://woocommerce.github.io/woocommerce-rest-api-docs/)
- [Web Vitals](https://web.dev/vitals/)
- [Security Headers](https://securityheaders.com/)

---

**Versión**: 1.0.0
**Última actualización**: Marzo 2026
**Autor**: Pinneacle Perfumería DevOps Team
