/**
 * Script para diagnosticar conexión GraphQL
 * Prueba diferentes variantes de URL
 */

const endpoints = [
  'https://dev-shoes-company-777.pantheonsite.io/graphql777/',
  'https://dev-shoes-company-777.pantheonsite.io/graphql/',
  'https://dev-shoes-company-777.pantheonsite.io/graphql',
];

const query = `
  query {
    products(first: 3) {
      nodes {
        id
        slug
        name
      }
    }
  }
`;

async function testEndpoint(url) {
  try {
    console.log(`\n🔵 Probando: ${url}`);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    const data = await response.json();
    
    if (data.errors) {
      console.log(`   ❌ Errores GraphQL:`, data.errors.map(e => e.message));
    } else if (data.data) {
      const count = data.data.products?.nodes?.length || 0;
      console.log(`   ✅ Éxito! Productos encontrados: ${count}`);
      if (count > 0) {
        data.data.products.nodes.forEach(p => {
          console.log(`      - ${p.name} (${p.slug})`);
        });
      }
    } else {
      console.log(`   ⚠️ Respuesta inesperada:`, data);
    }
  } catch (error) {
    console.log(`   ❌ Error de conexión:`, error.message);
  }
}

async function main() {
  console.log('=== Diagnóstico de Endpoints GraphQL ===');
  console.log(`Pruebando ${endpoints.length} variantes de URL...\n`);
  
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
  }
}

main();
