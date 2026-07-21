from pathlib import Path

files = [
    'README.md',
    'DOCUMENTACION_TECNICA.md',
    '.env.example',
    '.claude/settings.local.json',
    'app/terminos-y-condiciones/page.tsx',
    'app/terminos-del-servicio/page.tsx',
    'app/politica-reembolso/page.tsx',
    'app/politica-proteccion-datos/page.tsx',
    'app/politica-envios/page.tsx',
    'docs/README.md',
    'docs/ARQUITECTURA_CARRITO.md',
    'docs/ARQUITECTURA_SOFTWARE.md',
    'docs/INFRAESTRUCTURA.md',
    'docs/PERFORMANCE_AUDIT.md',
    'docs/DASHBOARD_AUDITORIA.md',
    'docs/GUIA_DESARROLLO.md',
    'docs/VALORACION.md',
    'docs/VALORACION_RESUMEN.md',
    'docs/REGISTRO_TRABAJO.md',
]

replacements = [
    ('Pinneacle Perfumería', 'Tienda de Ejemplo'),
    ('Pinneacle Perfumeria', 'Tienda de Ejemplo'),
    ('pinneacleperfumeria.com', 'example.com'),
    ('https://pinneacleperfumeria.com', 'https://example.com'),
    ('www.pinneacleperfumeria.com', 'example.com'),
    ('contacto@pinneacleperfumeria.com', 'support@example.com'),
    ('+56 9 4615 2919', '+56 9 0000 0000'),
    ('56946152919', '56900000000'),
    ('dev-pinneacle', 'example-store'),
    ('cristiansk8/pinneacle', 'example/example-store'),
    ('pinneacle_cart', 'example_store_cart'),
    ('pinneacle_recently_viewed', 'example_recently_viewed'),
    ('Pinneacle', 'Ejemplo'),
    ('pinneacle', 'example'),
]

for rel in files:
    path = Path(rel)
    if not path.exists():
        print('MISSING', rel)
        continue
    text = path.read_text(encoding='utf-8')
    original = text
    for old, new in replacements:
        text = text.replace(old, new)

    if rel == '.env.example':
        lines = text.splitlines()
        if 'NODE_ENV="development"' in lines or 'NODE_ENV="development"' in [l.replace('\r','') for l in lines]:
            idx = next((i for i,l in enumerate(lines) if l.strip() == 'NODE_ENV="development"'), None)
            if idx is not None:
                cleaned = lines[:idx+1]
                text = '\n'.join(cleaned) + '\n'
        # update any remaining SENTRY_PROJECT sample to generic
        text = text.replace('SENTRY_PROJECT="pinneacle-perfumeria"', 'SENTRY_PROJECT="example-store"')

    if rel == '.claude/settings.local.json':
        text = text.replace('Bash(test -f c:UsersUsuariopinneacle.env.example)', 'Bash(test -f c:UsersUserheadless-base-woo\\.env.example)')

    if text != original:
        path.write_text(text, encoding='utf-8')
        print('UPDATED', rel)
    else:
        print('UNCHANGED', rel)
