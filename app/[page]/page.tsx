import { notFound } from 'next/navigation';

// WooCommerce no maneja páginas de contenido via GraphQL
// Redirigir a 404 - las páginas WordPress se manejan vía WP REST API
export default function Page() {
  return notFound();
}
