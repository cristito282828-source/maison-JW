// Script temporal para debug: lee el CSS bundle y busca si tiene los nuevos colores
const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, '.next', 'static', 'css');
if (!fs.existsSync(cssDir)) {
  console.log('No CSS dir found at', cssDir);
  process.exit(1);
}

const files = fs.readdirSync(cssDir);
let found = false;
for (const file of files) {
  if (!file.endsWith('.css')) continue;
  const content = fs.readFileSync(path.join(cssDir, file), 'utf8');
  if (content.includes('#0A0A0A') || content.includes('logo-cyan')) {
    console.log(`✅ FOUND new colors in ${file}`);
    found = true;
    break;
  }
}
if (!found) {
  console.log('❌ NEW COLORS NOT FOUND in any CSS bundle. Build cache is stale.');
}
