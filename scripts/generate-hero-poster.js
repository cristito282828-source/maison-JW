#!/usr/bin/env node
/**
 * Genera un poster (imagen JPG) para el hero de Maison.
 *
 * Estrategia: componente usa `<video poster="/videos/maison-hero-poster.jpg">`.
 * Si subís un .mp4 a /public/videos/maison-hero.mp4, el browser reproduce el video
 * y el poster queda como fallback. Si NO subís el .mp4, el componente muestra
 * solo el poster (degrade elegante).
 *
 * Diseño: gradient diagonal de ink (#1A1A18) → black (#0A0A0A), con la palabra
 * "Maison" en Belleza dorado. Mismo vibe que el splash pero más grande.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const VIDEOS_DIR = path.join(PUBLIC_DIR, 'videos');

// SVG del poster — wordmark Belleza dorado sobre fondo ink degradado
const svg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1A1A18"/>
      <stop offset="100%" stop-color="#0A0A0A"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#B08D57" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#B08D57" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#bg)"/>
  <rect width="1920" height="1080" fill="url(#glow)"/>
  <text
    x="960"
    y="640"
    text-anchor="middle"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="220"
    font-weight="400"
    fill="#B08D57"
    letter-spacing="-8"
  >Maison</text>
  <text
    x="960"
    y="730"
    text-anchor="middle"
    font-family="Helvetica, Arial, sans-serif"
    font-size="22"
    font-weight="300"
    fill="#FAFAF8"
    letter-spacing="12"
  >JOYERÍA FINA · COLOMBIA</text>
</svg>
`);

async function main() {
  if (!fs.existsSync(VIDEOS_DIR)) {
    fs.mkdirSync(VIDEOS_DIR, { recursive: true });
  }

  const jpg = await sharp(svg).jpeg({ quality: 85, mozjpeg: true }).toBuffer();
  fs.writeFileSync(path.join(VIDEOS_DIR, 'maison-hero-poster.jpg'), jpg);
  console.log(`✓ videos/maison-hero-poster.jpg (${(jpg.length / 1024).toFixed(1)} KB)`);

  // También un WebP por si el browser lo prefiere (más liviano)
  const webp = await sharp(svg).webp({ quality: 85 }).toBuffer();
  fs.writeFileSync(path.join(VIDEOS_DIR, 'maison-hero-poster.webp'), webp);
  console.log(`✓ videos/maison-hero-poster.webp (${(webp.length / 1024).toFixed(1)} KB)`);

  console.log('\n→ Para tener video real: subí maison-hero.mp4 a /public/videos/');
  console.log('  El componente ya detecta si existe o no.');
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
