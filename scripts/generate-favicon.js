#!/usr/bin/env node
/**
 * Genera el favicon de Maison desde una SVG con la "M" estilizada en serif.
 *
 * Produce:
 *   - app/icon.png                 (32x32, favicon general)
 *   - app/apple-icon.png           (180x180, iOS home screen)
 *   - public/favicon.ico           (multi-size ICO: 16+32+48)
 *   - public/icon-192.png          (192x192, manifest PWA)
 *   - public/icon-512.png          (512x512, manifest PWA + social share)
 *
 * Uso:  node scripts/generate-favicon.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const APP_DIR = path.join(__dirname, '..', 'app');

// SVG maestro — la "M" en estilo serif elegante sobre fondo negro ink.
// Variables de la paleta Maison (ver app/globals.css):
//   --ink:   #1A1A18   (near-black)
//   --gold:  #B08D57   (antique gold)
//   --paper: #FAFAF8   (off-white)
function buildSvg(size) {
  // Escalado pensado: la M ocupa ~58% del cuadro, centrado, con serif clásica.
  // Usamos una M estilizada en path para mantener sharp edges sin depender de
  // fuentes externas (que no garantizan mismo render en cada plataforma).
  const fontSize = Math.round(size * 0.72);
  const offsetY = Math.round(size * 0.78); // baseline ajustada para centrado óptico

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" fill="#1A1A18"/>
  <text
    x="50%"
    y="${offsetY}"
    text-anchor="middle"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="${fontSize}"
    font-weight="400"
    fill="#B08D57"
    letter-spacing="${Math.round(size * -0.02)}"
  >M</text>
</svg>`;
}

async function svgToPng(svg, size) {
  return sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
}

async function pngToIco(pngBuffers) {
  // Construimos un ICO multi-tamaño manualmente.
  // Estructura ICO:
  //   - 6 bytes header
  //   - N × 16 bytes directory entry (uno por imagen)
  //   - N × PNG data (los ICOs modernos permiten PNG embedded)
  const numImages = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = numImages * dirEntrySize;
  const totalSize = headerSize + dirSize + pngBuffers.reduce((s, b) => s + b.length, 0);

  const buf = Buffer.alloc(totalSize);
  let offset = 0;

  // Header
  buf.writeUInt16LE(0, offset); offset += 2;        // Reserved
  buf.writeUInt16LE(1, offset); offset += 2;        // Type: 1 = icon
  buf.writeUInt16LE(numImages, offset); offset += 2; // Image count

  // Sizes para el directory entry — ICO acepta 16, 32, 48
  const sizes = [16, 32, 48];

  // Directory entries
  let dataOffset = headerSize + dirSize;
  for (let i = 0; i < numImages; i++) {
    const png = pngBuffers[i];
    const s = sizes[i];
    buf.writeUInt8(s === 256 ? 0 : s, offset); offset += 1; // Width
    buf.writeUInt8(s === 256 ? 0 : s, offset); offset += 1; // Height
    buf.writeUInt8(0, offset); offset += 1;                 // Color palette
    buf.writeUInt8(0, offset); offset += 1;                 // Reserved
    buf.writeUInt16LE(1, offset); offset += 2;              // Color planes
    buf.writeUInt16LE(32, offset); offset += 2;             // Bits per pixel
    buf.writeUInt32LE(png.length, offset); offset += 4;     // Image size
    buf.writeUInt32LE(dataOffset, offset); offset += 4;     // Image offset
    dataOffset += png.length;
  }

  // PNG data
  for (const png of pngBuffers) {
    png.copy(buf, offset);
    offset += png.length;
  }

  return buf;
}

async function main() {
  console.log('🎨 Generando favicon Maison...');

  // Generar las versiones PNG en paralelo
  const sizes = {
    icon32: 32,
    apple180: 180,
    pwa192: 192,
    pwa512: 512,
    ico16: 16,
    ico32: 32,
    ico48: 48,
  };

  console.log('  • Generando SVGs por tamaño...');
  const svgs = {};
  for (const [key, size] of Object.entries(sizes)) {
    svgs[key] = buildSvg(size);
  }

  console.log('  • Renderizando PNGs con sharp...');
  const pngs = {};
  for (const [key, size] of Object.entries(sizes)) {
    pngs[key] = await svgToPng(svgs[key], size);
  }

  // Escribir archivos
  console.log('  • Escribiendo archivos...');

  // app/icon.png (32x32 — Next.js lo detecta automáticamente como favicon)
  fs.writeFileSync(path.join(APP_DIR, 'icon.png'), pngs.icon32);
  console.log(`    ✓ app/icon.png (32x32)`);

  // app/apple-icon.png (180x180 — iOS home screen)
  fs.writeFileSync(path.join(APP_DIR, 'apple-icon.png'), pngs.apple180);
  console.log(`    ✓ app/apple-icon.png (180x180)`);

  // public/favicon.ico (multi-size)
  const icoBuffer = await pngToIco([pngs.ico16, pngs.ico32, pngs.ico48]);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), icoBuffer);
  console.log(`    ✓ public/favicon.ico (16+32+48 multi-size)`);

  // public/icon-192.png y public/icon-512.png (PWA manifest — opcional pero útil)
  fs.writeFileSync(path.join(PUBLIC_DIR, 'icon-192.png'), pngs.pwa192);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'icon-512.png'), pngs.pwa512);
  console.log(`    ✓ public/icon-192.png (192x192)`);
  console.log(`    ✓ public/icon-512.png (512x512)`);

  // Limpiar favicon.jpg viejo (era el del toro)
  const oldFaviconJpg = path.join(PUBLIC_DIR, 'favicon.jpg');
  if (fs.existsSync(oldFaviconJpg)) {
    fs.unlinkSync(oldFaviconJpg);
    console.log(`    🗑  Borrado favicon.jpg viejo (era del toro)`);
  }

  console.log('\n✅ Favicon Maison listo. Refresh del browser para ver.');
}

main().catch((err) => {
  console.error('❌ Error generando favicon:', err);
  process.exit(1);
});
