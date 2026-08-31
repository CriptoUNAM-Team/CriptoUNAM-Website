#!/bin/bash

# Script para convertir HEIC a JPG en lotes pequeños

cd "$(dirname "$0")"

echo "🔄 Convirtiendo imágenes HEIC a JPG (en lotes)..."
echo ""

# Convertir solo 10 archivos a la vez para evitar problemas de espacio
python3 << 'PYTHON_SCRIPT'
import os
from pathlib import Path
from pillow_heif import register_heif_opener
from PIL import Image

register_heif_opener()

images_dir = Path("../criptounam/public/images")
converted = 0
errors = 0
batch_size = 10
processed = 0

heic_files = list(images_dir.rglob("*.HEIC")) + \
             list(images_dir.rglob("*.heic")) + \
             list(images_dir.rglob("*.HEIF")) + \
             list(images_dir.rglob("*.heif"))

for heic_file in heic_files:
    if processed >= batch_size:
        print(f"\n⏸️  Procesados {batch_size} archivos. Ejecuta el script de nuevo para continuar.")
        break
    
    jpg_file = heic_file.with_suffix('.jpg')
    
    if jpg_file.exists():
        continue
    
    print(f"🔄 {heic_file.name}...", end=" ")
    
    try:
        img = Image.open(heic_file)
        if img.mode in ('RGBA', 'LA', 'P'):
            rgb_img = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            rgb_img.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
            img = rgb_img
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        img.save(jpg_file, 'JPEG', quality=90, optimize=True)
        print("✅")
        converted += 1
        processed += 1
    except Exception as e:
        print(f"❌ {str(e)[:50]}")
        errors += 1
        processed += 1

print(f"\n📊 Convertidos: {converted}, Errores: {errors}")
PYTHON_SCRIPT

