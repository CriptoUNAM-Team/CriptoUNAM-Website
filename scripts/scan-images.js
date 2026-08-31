// Script para escanear las imágenes reales y generar el mapeo correcto
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../criptounam/public/images');
const months = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

const monthImages = {};

months.forEach(month => {
  const monthDir = path.join(imagesDir, `${month}_CRIPTOUNAM`);
  if (fs.existsSync(monthDir)) {
    const files = fs.readdirSync(monthDir);
    // Filtrar solo imágenes compatibles (JPG, PNG, etc.)
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });
    monthImages[month] = imageFiles.sort();
    console.log(`${month}: ${imageFiles.length} imágenes encontradas`);
  }
});

console.log('\nMapeo generado:');
console.log(JSON.stringify(monthImages, null, 2));

