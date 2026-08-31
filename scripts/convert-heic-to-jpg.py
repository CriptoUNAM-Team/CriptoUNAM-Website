#!/usr/bin/env python3
"""
Script para convertir imágenes HEIC a JPG usando pillow-heif
"""

import os
import sys
from pathlib import Path

try:
    from pillow_heif import register_heif_opener
    from PIL import Image
    register_heif_opener()
except ImportError:
    print("❌ Error: pillow-heif no está instalado")
    print("📦 Instálalo con: pip install pillow-heif")
    sys.exit(1)

def convert_heic_to_jpg(heic_path, jpg_path):
    """Convierte un archivo HEIC a JPG"""
    try:
        # Abrir imagen HEIC
        img = Image.open(heic_path)
        
        # Convertir a RGB si es necesario (HEIC puede tener modo RGBA)
        if img.mode in ('RGBA', 'LA', 'P'):
            rgb_img = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            rgb_img.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
            img = rgb_img
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Guardar como JPG con calidad 90
        img.save(jpg_path, 'JPEG', quality=90, optimize=True)
        return True
    except Exception as e:
        print(f"   Error: {str(e)}")
        return False

def main():
    images_dir = Path(__file__).resolve().parent.parent / "criptounam" / "public" / "images"
    
    if not images_dir.exists():
        print(f"❌ Error: No se encontró el directorio {images_dir}")
        sys.exit(1)
    
    print("🔄 Convirtiendo imágenes HEIC a JPG...")
    print("")
    
    converted = 0
    skipped = 0
    errors = 0
    
    # Buscar todos los archivos HEIC/HEIF
    heic_files = list(images_dir.rglob("*.HEIC")) + \
                 list(images_dir.rglob("*.heic")) + \
                 list(images_dir.rglob("*.HEIF")) + \
                 list(images_dir.rglob("*.heif"))
    
    for heic_file in heic_files:
        jpg_file = heic_file.with_suffix('.jpg')
        
        # Si ya existe el JPG, saltar
        if jpg_file.exists():
            print(f"⏭️  Ya existe: {jpg_file.name}")
            skipped += 1
            continue
        
        print(f"🔄 Convirtiendo: {heic_file.name}...", end=" ")
        
        if convert_heic_to_jpg(heic_file, jpg_file):
            print(f"✅ -> {jpg_file.name}")
            converted += 1
        else:
            print(f"❌")
            errors += 1
    
    print("")
    print("📊 Resumen:")
    print(f"   ✅ Convertidos: {converted}")
    print(f"   ⏭️  Omitidos (ya existen): {skipped}")
    print(f"   ❌ Errores: {errors}")
    print("")
    print("✨ Conversión completada!")

if __name__ == "__main__":
    main()

