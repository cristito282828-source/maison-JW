import { ReadonlyURLSearchParams } from 'next/navigation';

/**
 * Decodifica HTML entities (&nbsp;, &amp;, etc.) que llegan como string
 * desde el backend de WooCommerce. React renderiza el texto literal de
 * estas entidades si no se decodifican manualmente.
 *
 * Ej: "$&nbsp;200.000" → "$ 200.000"
 */
export function formatPrice(price: string | undefined | null): string {
  if (!price) return 'Precio no disponible';
  return price
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();
}

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`;

export const getBaseUrl = () => {
  // Usar SITE_URL si está configurado
  if (process.env.SITE_URL) return process.env.SITE_URL;

  // Si estamos en Vercel y es producción, usar el dominio personalizado
  if (process.env.VERCEL_ENV === 'production') {
    return 'https://www.juanbecerra.co';
  }

  // Para preview y development en Vercel
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  // Local development
  return 'http://localhost:3000';
};

export const baseUrl = getBaseUrl();

export const validateEnvironmentVariables = () => {
  const requiredEnvironmentVariables = [
    'SHOPIFY_STORE_DOMAIN',
    'SHOPIFY_STOREFRONT_ACCESS_TOKEN'
  ];
  const missingEnvironmentVariables = [] as string[];

  requiredEnvironmentVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingEnvironmentVariables.push(envVar);
    }
  });

  if (missingEnvironmentVariables.length) {
    throw new Error(
      `The following environment variables are missing. Your site will not work without them. Read more: https://vercel.com/docs/integrations/shopify#configure-environment-variables\n\n${missingEnvironmentVariables.join(
        '\n'
      )}\n`
    );
  }

  if (
    process.env.SHOPIFY_STORE_DOMAIN?.includes('[') ||
    process.env.SHOPIFY_STORE_DOMAIN?.includes(']')
  ) {
    throw new Error(
      'Your `SHOPIFY_STORE_DOMAIN` environment variable includes brackets (ie. `[` and / or `]`). Your site will not work with them there. Please remove them.'
    );
  }
};
