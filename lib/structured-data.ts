/**
 * Structured Data (JSON-LD) para SEO
 * Implementa schema.org para mejorar la visibilidad en Google
 */

interface ProductSchemaProps {
  name: string;
  description: string;
  image: string;
  price: string;
  priceCurrency: string;
  availability: 'https://schema.org/InStock' | 'https://schema.org/OutOfStock' | 'https://schema.org/PreOrder';
  brand?: string;
  sku?: string;
  url: string;
}

/**
 * Genera JSON-LD para un producto individual
 */
export function generateProductSchema(product: ProductSchemaProps) {
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    url: product.url,
    brand: product.brand || {
      '@type': 'Brand',
      name: 'Lorem Ipsum Store',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.priceCurrency,
      availability: product.availability,
      url: product.url,
      seller: {
        '@type': 'Organization',
        name: 'Lorem Ipsum Store',
        url: 'https://example.com',
      },
    },
  };

  return schema;
}

/**
 * Genera JSON-LD para la organización
 */
export function generateOrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Lorem Ipsum Store',
    url: 'https://example.com',
    logo: 'https://example.com/logo.png',
    description: 'Tienda online genérica de ejemplo',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-800-000-0000',
      contactType: 'customer service',
      availableLanguage: 'Spanish',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
      addressLocality: 'Example City',
    },
    sameAs: [
      'https://www.instagram.com/example-store',
      'https://www.facebook.com/example-store',
    ],
  };

  return schema;
}

/**
 * Genera JSON-LD para breadcrumbs
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return schema;
}

/**
 * Genera JSON-LD para el sitio web
 */
export function generateWebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Lorem Ipsum Store',
    url: 'https://example.com',
    description: 'Tienda online genérica de ejemplo',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://example.com/search?q={search_term_string}',
      },
      'query-input': {
        '@type': 'PropertyValueSpecification',
        valueRequired: true,
        valueName: 'search_term_string',
      },
    },
  };

  return schema;
}
