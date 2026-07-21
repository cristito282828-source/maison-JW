'use client';

import Script from 'next/script';

interface JsonLdScriptProps {
  data: Record<string, unknown>;
  id?: string;
}

/**
 * Componente para insertar JSON-LD en el head
 * Es un Client Component porque usa next/script
 */
export function JsonLdScript({ data, id }: JsonLdScriptProps) {
  return (
    <Script
      id={id || `json-ld-${JSON.stringify(data).slice(0, 20)}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
